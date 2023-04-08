import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";
import ShareFolder from '../../components/admin/system/ShareFolder'


class SystemView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			proxy_ip: '',
			proxy_port: '',
			proxy_username: '',
			proxy_password: '',

			[CTRL_DOCKER_WIRESHARK]: '0',
			[CTRL_DEFAULT_CONSOLE]: '',
			[CTRL_DEFAULT_LANG]: '',
		}
		
		
	}

	render() {
		
		return (
			<>
				<div className='box_padding container'>

					<div className='box_shadow box_padding'>
						<strong>Controller</strong>
						<hr></hr>
						<div className='box_flex' style={{justifyContent:'space-between', flexWrap:'wrap', fontWeight:'bold', marginBottom:20}}>
							<button style={{width:150, margin:5}} className='button btn btn-primary' onClick={()=>this.stopAllNodes()}>{lang('Stop All Nodes')}</button>
							<button style={{width:150, margin:5}} className='button btn btn-primary' onClick={()=>this.fixpermission()}>{lang('Fix Permission')}</button>
							<button style={{width:150, margin:5}} className='button btn btn-danger' onClick={()=>this.reboot()}>{lang('Reboot')}</button>
							<button style={{width:150, margin:5}} className='button btn btn-danger' onClick={()=>this.shutdown()}>{lang('Shutdown')}</button>
						</div>
						<div>
							<div className='box_flex' style={{margin:'15px 0px'}}>
								<div style={{fontWeight:'bold' }}>{lang('Docker Wireshark Only')}</div>
								<div style={{width:30}}>:</div>
								<i style={{ color: (this.state[CTRL_DOCKER_WIRESHARK] == '1' ? '#4caf50' : 'red'), fontSize: 24 }} className={`button fa ${this.state[CTRL_DOCKER_WIRESHARK] == '1' ? 'fa-toggle-on' : 'fa-toggle-off'}`} onClick={() => { 
									var newState = this.state[CTRL_DOCKER_WIRESHARK] == '0' ? '1' : '0';
									this.updateData({[CTRL_DOCKER_WIRESHARK] : newState});
								}} ></i>
							</div>
						</div>

						<div>
							<div style={{margin:'15px 0px'}}>
								<div style={{fontWeight:'bold', marginBottom:10 }}>{lang('Default Console')}</div>
								<div style={{paddingLeft:15}}>
									<div><label><input type='radio' checked={this.state[CTRL_DEFAULT_CONSOLE] == ''} onChange={e => this.updateData({[CTRL_DEFAULT_CONSOLE]: ''})}></input>&nbsp; {lang('Auto')}</label></div>
									<div><label><input type='radio' checked={this.state[CTRL_DEFAULT_CONSOLE] == 'native'} onChange={e => this.updateData({[CTRL_DEFAULT_CONSOLE]: 'native'})}></input>&nbsp; {lang('Native Console')}</label></div>
									<div><label><input type='radio' checked={this.state[CTRL_DEFAULT_CONSOLE] == 'html'} onChange={e => this.updateData({[CTRL_DEFAULT_CONSOLE]: 'html'})}></input>&nbsp; {lang('HTML Console')}</label></div>
								</div>
							</div>
						</div>

						<div>
							<div style={{margin:'15px 0px'}} className="box_flex">
								<div style={{fontWeight:'bold' }}>{lang('Default Language')}</div>
								<div style={{paddingLeft:15}}>
									<select className='input' value={this.state[CTRL_DEFAULT_LANG]} onChange={(e)=>{this.updateData({[CTRL_DEFAULT_LANG]: e.target.value}).then(res => window.location.reload())}}>
										<option value=''></option>
										{get(global.LANG['packages'], []).map(item => <option key = {item} value={item}>{item}</option>)}
									</select> 
								</div>
							</div>
						</div>

						<div>
							<div style={{margin:'15px 0px'}} >
								<div style={{fontWeight:'bold' }}>{lang('Services')}</div>
								<div className='box_flex' style={{justifyContent:'space-between', flexWrap:'wrap', fontWeight:'bold', marginBottom:20}}>
									<button style={{width:200, margin:5}} className='button btn btn-primary' onClick={()=>this.restartWebService()}>{lang('Restart Web Service')}</button>
									<button style={{width:200, margin:5}} className='button btn btn-primary' onClick={()=>this.restartDbService()}>{lang('Restart Database Service')}</button>
									<button style={{width:200, margin:5}} className='button btn btn-primary' onClick={()=>this.restartHTMLConsoleService()}>{lang('Restart HTML Console')}</button>
									<button style={{width:200, margin:5}} className='button btn btn-primary' onClick={()=>this.restartDockerService()}>{lang('Restart Docker Service')}</button>
									<button style={{width:200, margin:5}} className='button btn btn-primary' onClick={()=>this.restartPnetNatService()}>{lang('Restart NAT Cloud')}</button>
								</div>
							</div>
						</div>

					</div>

					<br/>

					<ShareFolder></ShareFolder>

					<br/>
					
					<div className='box_shadow box_padding'>
						<strong>{lang('Proxy configuration')}</strong>
						<hr></hr>
						<div className='box_flex' style={{justifyContent:'space-between', flexWrap:'wrap', fontWeight:'bold'}}>
							<div className='box_flex' style={{margin:5}}>{lang('IP Address')}&nbsp;<span style={{fontWeight:'normal', color:'red'}}>(*)</span>:&nbsp;<input className='input' type='text' value={this.state.proxy_ip} onChange={e => this.setState({proxy_ip: e.target.value})}></input></div>
							<div className='box_flex' style={{margin:5}}>{lang('Port')}&nbsp;<span style={{fontWeight:'normal', color:'red'}}>(*)</span>:&nbsp;<input className='input' type='number' value={this.state.proxy_port} onChange={e => this.setState({proxy_port: e.target.value})}></input></div>
							<div className='box_flex' style={{margin:5}}>{lang('User Name')}:&nbsp;<input className='input' type='text' value={this.state.proxy_username} onChange={e => this.setState({proxy_username: e.target.value})}></input></div>
							<div className='box_flex' style={{margin:5}}>{lang('Password')}:&nbsp;<input className='input' type='password' value={this.state.proxy_password} onChange={e => this.setState({proxy_password: e.target.value})}></input></div>
						</div>
						<br></br>
						<div><div className='button btn btn-primary' onClick={()=>this.setProxyData()}>{lang('Save')}</div></div>
					</div>

					
					
				</div>

			</>
		);
	}


	componentDidMount() {
		this.getProxyData();
		this.getData();
	}

	//======================================================================================

	getData(){
		return axios.request({
			url: '/store/public/admin/system/get',
			method: 'post',
		})

			.then(response => {
				
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				
				var data = response['data'];
				this.setState({
					[CTRL_DOCKER_WIRESHARK]: get(data[CTRL_DOCKER_WIRESHARK], '0'),
					[CTRL_DEFAULT_CONSOLE]: get(data[CTRL_DEFAULT_CONSOLE], ''),
					[CTRL_DEFAULT_LANG]: get(data[CTRL_DEFAULT_LANG], ''),
				});
			})

			.catch( error =>{
				console.log(error);
				error_handle(error)
				return false;
			})
	}

	

	updateData(data){
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/system/update',
			method: 'post',
			data: data
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.getData();
			})

			.catch( error =>{
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})
	}

	//=======================================================================================
	getProxyData(){
		return axios.request({
			url: '/store/public/admin/system/getProxy',
			method: 'post',
		})

			.then(response => {
				
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				
				var data = response['data'];
				if(data == null) data = {};
				var proxy = {};
				proxy['proxy_ip'] = isset(data['proxy_ip'])? data['proxy_ip'] : '';
				proxy['proxy_port'] = isset(data['proxy_port'])? data['proxy_port'] : '';
				proxy['proxy_username'] = isset(data['proxy_username'])? data['proxy_username'] : '';
				proxy['proxy_password'] = isset(data['proxy_password'])? data['proxy_password'] : '';

				this.setState({...proxy});
			})

			.catch( error =>{
				console.log(error);
				error_handle(error)
				return false;
			})
	}

	

	setProxyData(){
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/system/setProxy',
			method: 'post',
			data: {
				'proxy_ip': this.state.proxy_ip,
				'proxy_port': this.state.proxy_port,
				'proxy_username': this.state.proxy_username,
				'proxy_password': this.state.proxy_password,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.getProxyData();
			})

			.catch( error =>{
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})
	}

	//===========================================================================================

	shutdown(){
		makeQuestion('Do you want to Shutdown?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/shutdown',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) { 
						location.reload();
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
			})
		
	}

	reboot(){
		makeQuestion('Do you want to Reboot?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/reboot',
				method: 'post',
			})

				.then(response => {
					response = response['data'];
					if (response['result']) {
						setInterval(()=>{location.reload()}, 60000);
					}else{
						App.loading(false);
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
			})
		
	}

	

	fixpermission(){
		
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/fixPermission',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Fixpermissions successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
			
		
	}

	stopAllNodes(){
		makeQuestion('Do you want to Stop all Nodes?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/stopAllNodes',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Stop all Nodes successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
		});
	
	}


	restartWebService(){
		makeQuestion('Do you want to restart Web Service?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/restartWebService',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Restart Web Service successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					window.location.reload();
					return false;
				})
		});
	
	}

	restartDbService(){
		makeQuestion('Do you want to restart Database Service?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/restartDbService',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Restart Database Service successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
		});
	
	}

	restartHTMLConsoleService(){
		makeQuestion('Do you want to restart HTML Console Service?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/restartHTMLConsoleService',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Restart HTML Console Service successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
		});
	
	}

	restartDockerService(){
		makeQuestion('Do you want to restart Docker Service?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/restartDockerService',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Restart Docker Service successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
		});
	
	}

	restartPnetNatService(){
		makeQuestion('Do you want to restart Cloud NAT Service?', 'Yes', 'No').then(res => {
			if(!res) return;
			App.loading(true);
			return axios.request({
				url: '/store/public/admin/system/restartPnetNatService',
				method: 'post',
			})

				.then(response => {
					App.loading(false);
					response = response['data'];
					if (response['result']) {
						showLog('Restart Cloud NAT Service successfully', 'success');
					}else{
						console.log(error);
						error_handle(error)
					}
				})

				.catch( error =>{
					App.loading(false);
					console.log(error);
					error_handle(error)
					return false;
				})
		});
	
	}


	

	//===========================================================================================

	

}

export default SystemView