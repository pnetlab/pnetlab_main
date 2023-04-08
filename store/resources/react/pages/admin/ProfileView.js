import React, { Component } from 'react'
import FormInput from '../../components/input/FormInput';

class ProfileView extends Component {

	constructor(props) {
		super(props);

		this.inputStruct = {
			[USER_USERNAME]: {
				[INPUT_NAME]: lang(USER_USERNAME),
				[INPUT_TYPE]: 'text',
				[INPUT_NULL]: false,
			},
		}

		this.inputPass = {
			old_pass: {
				[INPUT_NAME]: lang('Old Pass'),
				[INPUT_TYPE]: 'password',
				[INPUT_NULL]: false,
				[INPUT_DECORATOR_IN]: data => '',
				[INPUT_DECORATOR_OUT]: data => data,
			},
			new_pass: {
				[INPUT_NAME]: lang('New Pass'),
				[INPUT_TYPE]: 'password',
				[INPUT_NULL]: false,
				[INPUT_DECORATOR_IN]: data => '',
				[INPUT_DECORATOR_OUT]: data => data,
			},
			rep_pass: {
				[INPUT_NAME]: lang('Retype Pass'),
				[INPUT_TYPE]: 'password',
				[INPUT_NULL]: false,
				[INPUT_DECORATOR_IN]: data => '',
				[INPUT_DECORATOR_OUT]: data => data,
			},
		}

		this.state = {
			expire_time: ''
		}

	}


	render() {

		return (<div className='container'>
			<br></br>
			<div className='row'>

                <div className='col-md-6 d-flex' style={{padding:5}}>
                    <div className='box_shadow d-flex box_padding' style={{flexDirection:'column', width:'100%', background:'white'}}>
                        <h4 className='title'>{lang('Informations')}</h4>
                        <hr style={{width:'100%'}} />
                        <div style={{flexGrow:1}}>
                            <FormInput struct={this.inputStruct} ref={form => this.form = form}></FormInput>
                        </div>
							{this.state.expire_time == '' ? '' : <div className='box_line'>Expired: <b>{moment(this.state.expire_time, 'X').format('llll')}</b></div> }
                        <br />
                        <div className='box_flex' style={{ justifyContent: 'flex-end' }}>
                            <div onClick={() => { this.updateUser() }} className='button btn btn-primary'>{lang('Save')}</div>
                        </div>
                    </div>
                
                </div>

				<div className='col-md-6 d-flex' style={{padding:5}}>
                    <div className='box_shadow d-flex box_padding' style={{flexDirection:'column', width:'100%', background:'white'}}>
                        <h4 className='title'>{lang(USER_PASSWORD)}</h4>
                        <hr style={{width:'100%'}} />
                        <div style={{flexGrow:1}}>
                            <FormInput struct={this.inputPass} ref={form => this.formPass = form}></FormInput>
                        </div>
                        <br />
                        <div className='box_flex' style={{ justifyContent: 'flex-end' }}>
                            <div onClick={() => { this.changePass() }} className='button btn btn-primary'>{lang('Change')}</div>
                        </div>
                    </div>
				</div>
			</div>

			<br/>
            <style>{`
                #app {
                    background: #eee;
                }
            `}</style>
		</div>


		);
	}

	componentDidMount() {
		this.loadUser();
	}

	loadUser() {
		return axios.request({
			url: '/store/public/admin/profile/read',
			method: 'post',
		})

			.then(response => {
				App.loading(false, 'Loading...');
				response = response['data'];
				if (response['result']) {
                    var data = response['data'];
					this.form.setValue(data);
					this.formData = data;
					if(isset(data[USER_EXPIRED_TIME])){
						this.setState({expire_time: data[USER_EXPIRED_TIME]})
					}
				} else {
					return Promise.reject(response);
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false, 'Loading...');
				error_handle(error)
			})

	}




	

	async updateUser() {

		var formData = this.form.getValue();
		if (formData === null) return;
		App.loading(true, 'Loading...');
		return axios.request({
			url: '/store/public/admin/profile/update',
			method: 'post',
			data: { data: formData },
		})

			.then(response => {
				App.loading(false, 'Loading...');
				response = response['data'];
				if (response['result']) {
					Swal('Success', '', 'success');
				} else {
					return Promise.reject(response);
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false, 'Loading...');
				error_handle(error)
			})


	}

	changePass() {

		var formPass = this.formPass.getValue();
		if (formPass === null) return;
		var formData = this.form.getValue();
		if (formData === null) return;

		if (formPass.rep_pass != formPass.new_pass) {
			Swal('Error', 'Password not match', 'error');
			return;
		}

		return axios.request({
			url: '/store/public/admin/profile/update_pass',
			method: 'post',
			data: {
				old_pass: formPass.old_pass,
				new_pass: formPass.new_pass
			},
		})

			.then(response => {
				App.loading(false, 'Loading...');
				response = response['data'];
				if (response['result']) {
					Swal('Success', '', 'success');
				} else {
					return Promise.reject(response);
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false, 'Loading...');
				error_handle(error)
			})

	}

}

export default ProfileView;
