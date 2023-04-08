import React, { Component } from 'react'

class Notice extends Component{
    constructor(props) {
        super(props);
        this.state = {
            enable : false,
            available: false,
        }
    }


    render (){
        return <div disabled={this.state.available} className='button box_flex' onClick={(event)=>{this.onClickHandle(event)}}>
           <i className={this.state.enable?"fa fa-toggle-on":"fa fa-toggle-off"} style={{color: (this.state.enable?"green":"")}}></i>
           {lang('Notification')}
        </div>
    }

    componentDidMount(){
        
        this.checkNotice()
    }

    checkAvailable(){
        var result = true;
        if (!('serviceWorker' in navigator)) {
            // Service Worker isn't supported on this browser, disable or hide UI.
            result = false;
        }
        
        if (!('PushManager' in window)) {
            // Push isn't supported on this browser, disable or hide UI.
            result = false;
        }

        this.setState({available: result});

        return result;
    
    }

    checkNotice(){
        if(!this.checkAvailable()) return;

        this.serviceWorker = navigator.serviceWorker.register('/extensions/notification/service_worker.js');
        this.oldSubscription = localStorage.getItem('pushSubscription');
        this.subscriptionCtl = localStorage.getItem('subscriptionCtl'); 

        if(!this.subscriptionCtl == 'disable') return;
        if(this.serviceWorker){
            this.serviceWorker.then(registration => {
                registration.pushManager.getSubscription().then(pushSub => {
                    if(!pushSub && !this.oldSubscription) return;
                    if(!pushSub && this.oldSubscription!=null){
                        this.deleteSubscription(this.oldSubscription);
                        return;
                    }
                    var pushSubscription = JSON.stringify(pushSub);
                    var currentSubscription = MD5(pushSubscription);
                    if(currentSubscription == this.oldSubscription){
                        this.setState({enable: true});
                    }else{
                        this.addOrUpdateSubscription(this.oldSubscription, currentSubscription, pushSubscription);
                    }
                })
            })
        }
    }


    registerServiceWorker() {
        if(!this.checkAvailable()) return;
		return navigator.serviceWorker.register('/extensions/notification/service_worker.js')
		.then((registration)=>{
			
			const subscribeOptions = {
			  userVisibleOnly: true,
			  applicationServerKey: this.urlB64ToUint8Array(
				'BAeaemC2MZdQSEZQ5Rpe-NHhY7QkWUaBO1EQGX-Z_dnreMy4n7JSV_USi8rnGt_ZTJlm_8vQI01-YS-tGkLaJvQ'
			  )
			};
			return registration.pushManager.subscribe(subscribeOptions);
			
		})
		.then((pushSub)=>{
			if(!pushSub) return;
            var pushSubscription = JSON.stringify(pushSub);
            var currentSubscription = MD5(pushSubscription);
            this.addOrUpdateSubscription(this.oldSubscription, currentSubscription, pushSubscription)
            .then(result=>{
                if(result) this.test();
            });
		})
		.catch(function(err) {
			console.error('Unable to register service worker.', err);
		});
	}


    deleteSubscription(subscription){
        App.loading(true, 'Loading...')
        return axios.request ({
		    url: '/notice/notice_web/drop',
		    method: 'post',
		    data:{
                    data: [{
                        [WEB_NOTICE_SUBMD5]: subscription
                    }]
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
	    	  if(response['result']){
                  localStorage.removeItem('pushSubscription');
                  localStorage.setItem('subscriptionCtl', 'disabled');
                  this.setState({enable: false});
              }
              return Promise.reject(response);
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(false, 'Loading...');
	    	  error_handle(error)
	      })
    }

    test(){
        App.loading(true, 'Loading...')
        return axios.request ({
		    url: '/notice/notice_web/test',
		    method: 'post',
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
	    	  if(response['result']){
              }
              return Promise.reject(response);
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(false, 'Loading...');
	    	  error_handle(error)
	      })
    }


    addOrUpdateSubscription(oldSubscription, newSubscription, pushSubscription){
        App.loading(true, 'Loading...')
        return axios.request ({
		    url: '/notice/notice_web/addOrUpdate',
		    method: 'post',
		    data:{
                    oldSubscription: oldSubscription,
                    newSubscription: newSubscription,
                    pushSubscription: pushSubscription,
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
	    	  if(response['result']){
                
                  localStorage.setItem('pushSubscription', newSubscription);
                  localStorage.setItem('subscriptionCtl', 'enabled');
                  this.oldSubscription = newSubscription;
                  this.setState({enable: true});
                  return true;
              }
              return Promise.reject(response);
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(false, 'Loading...');
              error_handle(error);
              return false;
	      })
    }


    urlB64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding)
		  .replace(/\-/g, '+')
		  .replace(/_/g, '/');
	  
		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);
	  
		for (let i = 0; i < rawData.length; ++i) {
		  outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
    }
    
    onClickHandle(){
        var newState = !this.state.enable;
        if(newState){
            this.registerServiceWorker();
        }else{
            this.deleteSubscription(this.oldSubscription);
        }
    }


     askPermission() {
		return new Promise((resolve, reject)=>{
			const permissionResult = Notification.requestPermission(function(result) {
				resolve(result);
			});
			if (permissionResult) {	
				permissionResult.then(resolve, reject);
			}
		})
		.then((permissionResult)=>{
			if (permissionResult !== 'granted') {
				throw new Error('We weren\'t granted permission.');
			}
		});
	}

	 getNotificationPermissionState() {
		if (navigator.permissions) {
		  return navigator.permissions.query({name: 'notifications'})
		  .then((result) => {
			return result.state;
		  });
		}
	  
		return new Promise((resolve) => {
			
		  resolve(Notification.permission);
		});
	}






}

export default Notice;