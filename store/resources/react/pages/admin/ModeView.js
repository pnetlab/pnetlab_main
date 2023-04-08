import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";
import ShareFolder from '../../components/admin/system/ShareFolder'
import KeepAliveCaptcha from '../../components/auth/KeepAliveCaptcha';


class ModeView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			default: '',
			online: '',
			offline: '',
			alive: '1',
			owner: '',
			offlineCaptcha: '',
			captcha: false,
		}


	}

	render() {

		return (
			<>
				<div className='box_padding container'>
					<br></br>
					<div className="box_padding box_shadow">
						<div><strong>{lang("Defaut Mode")}</strong></div>
						<hr></hr>
						<div>
							<div><label className="box_flex"><input type='radio' checked={this.state.default == 'online'} onChange={() => this.setDefault('online')} disabled={this.state.online != 1}></input>&nbsp;Online</label></div>
							<div><label className="box_flex"><input type='radio' checked={this.state.default == 'offline'} onChange={() => this.setDefault('offline')} disabled={this.state.offline != 1}></input>&nbsp;Offline</label></div>
						</div>
					</div>
					<br></br>
					<div className='row box_padding box_shadow'>
						<div className='col-md-6' style={{padding:5}}>
							<div><strong>Online Mode</strong></div>
							<hr></hr>
							<div>
								<div className='box_flex' style={{margin:'15px 0px'}}>
									<div style={{ width: 100, fontWeight:'bold' }}>{lang("Status")}</div>
									<div style={{width:30}}>:</div>
									<i style={{ color: (this.state.online == 1 ? '#4caf50' : 'red'), fontSize: 24 }} className={`button fa ${this.state.online == 1 ? 'fa-toggle-on' : 'fa-toggle-off'}`} onClick={() => { this.setOnline() }} ></i>
								</div>
								<div className='box_flex' style={{margin:'15px 0px'}}>
									<div style={{ width: 100, fontWeight: 'bold' }}>{lang("Owner")}</div>
									<div style={{width:30}}>:</div>
									<div>{this.state.owner == '' ? <b style={{color:'red'}}>Free Box</b> : <b style={{color:'green'}}>{formatName(this.state.owner)}</b>}</div>
								</div>

							</div>

						</div>
						<div className='col-md-6' style={{padding:5}}>
							<div><strong>Offline Mode</strong></div>
							<hr></hr>
							<div>
								<div className='box_flex' style={{margin:'15px 0px'}}>
									<div style={{ width: 100, fontWeight:'bold' }}>{lang("Status")}</div>
									<div style={{width:30}}>:</div>
									<i style={{ color: (this.state.offline == 1 ? '#4caf50' : 'red'), fontSize: 24 }} className={`button fa ${this.state.offline == 1 ? 'fa-toggle-on' : 'fa-toggle-off'}`} onClick={() => { this.setOffline() }} ></i>
								</div>

								<div className='box_flex' style={{margin:'15px 0px'}}>
									<div style={{ width: 100, fontWeight:'bold' }}>Captcha</div>
									<div style={{width:30}}>:</div>
									<i style={{ color: (this.state.offlineCaptcha == 1 ? '#4caf50' : 'red'), fontSize: 24 }} className={`button fa ${this.state.offlineCaptcha == 1 ? 'fa-toggle-on' : 'fa-toggle-off'}`} onClick={() => { this.setOfflineCaptcha() }} ></i>
								</div>
								
								{this.state.alive == 1 ? ''
									: <div>
										{this.state.captcha
											? <div>
												<KeepAliveCaptcha ref={c => this.captcha = c}></KeepAliveCaptcha>
												<div style={{color:'red', margin:'5px 0px'}}>Fill the captcha and click on Keep Alive again</div>
											</div>
											: ''	
										}
										<div className="button btn btn-info" onClick = {()=>this.keepAlive()}>Keep Alive</div>
									</div>
								}


							</div>
						</div>
					</div>


				</div>

			</>
		);
	}


	componentDidMount() {
		this.getModeData();
		this.getOwner();
	}

	setDefault(value) {
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/mode/setDefault',
			method: 'post',
			data: {
				'default': value,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.setState({ default: value });

			})

			.catch(error => {
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})
	}


	getModeData() {
		return axios.request({
			url: '/store/public/admin/mode/getModeData',
			method: 'post',
		})

			.then(response => {

				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}

				this.setState({
					default: get(response['data']['default'], ''),
					online: get(response['data']['online'], ''),
					offline: get(response['data']['offline'], ''),
					alive: get(response['data']['alive'], ''),
					offlineCaptcha: get(response['data']['captcha'], ''),
				});
			})

			.catch(error => {
				console.log(error);
				error_handle(error)
				return false;
			})
	}

	getOwner() {
		return axios.request({
			url: '/store/public/admin/mode/getOwner',
			method: 'post',
		})

			.then(response => {

				response = response['data'];
				if (!response['result']) {
					return false;
				}

				this.setState({
					owner: get(response['data'], ''),
				});
			})

			.catch(error => {
				console.log(error);
				return false;
			})
	}

	setOnline() {
		var newState = this.state.online == '1' ? '0' : '1';
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/mode/setOnline',
			method: 'post',
			data: {
				'online': newState,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.setState({ online: newState });
				var successLog = lang("ONLINE mode is enabled");
				if(this.state.owner == '' && newState == 1) successLog=lang("online_mode_enable_alert")
				if(newState == 0) successLog=lang("ONLINE mode is disabled");
				Swal('Success', successLog, 'success');

			})

			.catch(error => {
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})

	}


	setOffline() {
		var newState = this.state.offline == '1' ? '0' : '1';
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/mode/setOffline',
			method: 'post',
			data: {
				'offline': newState,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.setState({ offline: newState });
				Swal('Success', response['data'], 'success');
				if(newState) this.getModeData();

			})

			.catch(error => {
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})

	}


	setOfflineCaptcha() {
		var newState = this.state.offlineCaptcha == '1' ? '0' : '1';
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/mode/setOfflineCaptcha',
			method: 'post',
			data: {
				'captcha': newState,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				this.setState({ offlineCaptcha: newState });
				Swal('Success', response['data'], 'success');
				if(newState) this.getModeData();

			})

			.catch(error => {
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})

	}



	keepAlive() {
		var captcha = null;
		if(this.captcha) captcha = this.captcha.getCaptcha();
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/mode/keepAlive',
			method: 'post',
			data: {
				captcha: captcha
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					if(this.captcha) this.captcha.reloadCapt();
					if(response['data']['captcha']){
						this.setState({captcha: true});
						return;
					}else{
						error_handle(response);
					}
				}
				Swal('Success', response['data'], 'success');
				this.getModeData();
			})

			.catch(error => {
				if(this.captcha) this.captcha.reloadCapt();
				App.loading(false);
				console.log(error);
				error_handle(error)
				return false;
			})

	}








}

export default ModeView