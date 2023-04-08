import React, { Component } from 'react';

class Member extends Component {

    constructor(props) {
        super(props);

        this.state = {
            host: '',
            joined: [],
            user: {},
        }

        this.checkMember = this.checkMember.bind(this);
    }

    getMapUser(){
        return axios.request({
            url: '/store/public/admin/lab_sessions/mapUser',
            method: 'post',
        })
		.then(response => {
			response = response['data'];
			if (!response['result']) {
                error_handle(response);
                return false;
			} else {
                this.setState({user: response['data']});
                return true;
			}
		})
		.catch((error)=>{
			console.log(error);
            error_handle(error);
            return false;
		})
    }

    getMember(){
        return axios.request({
            url: '/store/public/admin/lab_sessions/read',
            method: 'post',
            data: {
                'lab_session': window.lab.session
            }
        })
		.then(response => {
			response = response['data'];
			if (!response['result']) {
				error_handle(response);
			} else {
				return response['data'];
			}
		})
		.catch((error)=>{
			console.log(error);
			error_handle(error);
		})
    }

    checkMember(){
        this.getMember().then(res=>{
            if(res){
                var joined = res['lab_session_joined'].split(',');
                var newMems = joined.filter(item => !this.state.joined.includes(item));
                var leaveMems = this.state.joined.filter(item => !joined.includes(item));
                var newMemsAlert = [];
                newMems.map(item => {
                    if(item == this.state.host) return '';
                    if(!this.state.user[item]) return '';
                    newMemsAlert.push(get(this.state.user[item]['username'], item));
                });

                var leaveMemsAlert = [];
                leaveMems.map(item => {
                    if(item == this.state.host) return '';
                    if(!this.state.user[item]) return '';
                    leaveMemsAlert.push(get(this.state.user[item]['username'], item));
                });

                if(newMemsAlert.length > 0){
                    showLog(`<b>${newMemsAlert.join(', ')}</b> ${lang("has joined this Lab")}`, 'success');
                }
                if(leaveMemsAlert.length > 0){
                    showLog(`<b>${leaveMemsAlert.join(', ')}</b> ${lang("has left this Lab")}`, 'warning');
                }

                this.setState({
                    host: res['lab_session_pod'],
                    joined: joined,
                })

            }
        })
    }

    componentDidMount(){
        App.onReadyRegister.push(()=>{

            this.getMapUser().then((res)=>{
                if(res) return this.getMember();
                return false;
            }).then(res => {
                if(res){
                    this.setState({
                        host: res['lab_session_pod'],
                        joined: res['lab_session_joined'].split(','),
                    })
                }
            }).then(res => {
                this.intervalId = setInterval(this.checkMember, 60000);
            })

        })
        

    }
      
    componentWillUnmount(){
        if(this.intervalId) clearInterval(this.intervalId);
    }


    render(){
        var joined = []
        this.state.joined.map(item => {
            if(item == this.state.host) return '';
            if(!this.state.user[item]) return '';
            joined.push(formatName(get(this.state.user[item]['username'], item)));
        });

        var host = '';
        var email = '';
        if(this.state.user[this.state.host]){
            host = formatName(get(this.state.user[this.state.host]['username'], this.state.host));
            email = get(this.state.user[this.state.host]['email'], '');
        }
        return <div>
            
            <div className='box_flex' style={{paddingLeft:11}}>
                <div style={{position:'relative', color:'white', textAlign:'center', marginRight: 15}} title={lang('Joined Members')}>
                    <i className="fa fa-users" aria-hidden="true" style={{fontSize: '1.2em'}}></i>
                    <div style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        padding: '0px 2px',
                        borderRadius: '5px',
                        background: 'orange',
                        border: 'solid thin white',
                        fontSize: '10px',
                    }}>{this.state.joined.length}</div>
                </div>
                <div className='lab-sidebar-title' style={{color:'white'}} title={host +', '+ joined}>
                    <b style={{color:'red'}} title={`${email}(Host)`}>{host}</b>
                    {joined.length > 0? <span>,&nbsp;{str_limit(joined.join(', '), 100)}</span>: ''}
                </div>
            </div>

            
        </div>
    }

}
export default Member;