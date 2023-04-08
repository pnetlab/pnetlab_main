import React, { Component } from 'react'
import FormInput from '../input/FormInput'
import Style from '../common/Style'
import BtnLoad from '../button/BtnLoad'
import Input from '../input/Input'
import FormFileSuggest from '../input/FormFileSuggest';

class EditName extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_USERNAME]: {
				[INPUT_NAME]: AUTHEN_USERNAME,
				[INPUT_TYPE]: 'text',
				[INPUT_NULL]: false,
				[INPUT_DEFAULT]: this.props.value
			}
		}
	}

	userChangeName() {
		this.button.load(true);
		axios.request({
			url: '/auth/account/user_change_name',
			method: 'post',
			data: {
				[AUTHEN_USERNAME]: this.input.getValue()
			}
		})
			.then(response => {
				this.button.load(false);
				response = response['data'];
				if (response['result']) {
					Swal(response['message'], response['data'], 'success');
				} else {
					Swal(response['message'], response['data'], 'error');
				}
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	render() {
		return (
			<div style={{ marginTop: 15 }}>
				<Style id='editnamecss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
				<div><b>{lang(AUTHEN_USERNAME) + ':'}</b></div>
				<div><Input ref={input => this.input = input} className='input_tag' struct={this.struct[AUTHEN_USERNAME]}></Input></div>
				<div><BtnLoad onClick={() => { this.userChangeName() }} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
			</div>
		)
	}
}


class EditImage extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_IMG]: {
				[INPUT_NAME]: AUTHEN_IMG,
				[INPUT_TYPE]: 'image',
				[INPUT_NULL]: true,
				[INPUT_DEFAULT]: this.props.value,
				[INPUT_UPLOAD]: '/auth/profile/uploader',
			}
		}
	}

	userChangeImage() {
		this.button.load(true);
		axios.request({
			url: '/auth/profile/user_change_img',
			method: 'post',
			data: {
				[AUTHEN_IMG]: this.imgInput.getValue()
			}
		})
			.then(response => {
				this.button.load(false);
				response = response['data'];
				if (response['result']) {
					Swal(response['message'], response['data'], 'success');
				} else {
					Swal(response['message'], response['data'], 'error');
				}
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	componentDidMount(){
		if(this.props.value !=''){
			this.imgInput.setValue(this.props.value);
		}
		
	}

	render() {
		
		return (
			<div style={{ marginTop: 15 }}>
				
                        <h4 className='title'>Ảnh đại diện</h4>
                        <Input column={AUTHEN_IMG} ref={input => this.imgInput = input} struct={this.struct[AUTHEN_IMG]}><div className='button' onClick={()=>{
							this.modal.modal();
							this.modal.scand();
						}}>Browser</div></Input>
                        
						<br/>

                        <div><BtnLoad ref={button=>this.button = button} onClick={() => {
                            this.imgInput.getInput().upload().then((result)=>{
                                if(result){
                                    this.userChangeImage();
                                }
                            });
                            
                        }}className="btn btn-primary button">Save</BtnLoad></div>

                        <FormFileSuggest ref={modal=>this.modal=modal} link="/auth/profile/uploader" table={AUTHEN_TABLE} column={AUTHEN_IMG} onSelect={(file)=>{
							this.imgInput.setValue(file);
						}}></FormFileSuggest>

			</div>
		)
	}
}





class EditEmail extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_EMAIL]: {
				[INPUT_NAME]: AUTHEN_EMAIL,
				[INPUT_TYPE]: 'email',
				[INPUT_NULL]: false,
				[INPUT_DEFAULT]: this.props.value
			}
		}
	}

	userChangeEmail() {
		this.button.load(true);
		axios.request({
			url: '/auth/profile/user_change_email',
			method: 'post',
			data: {
				[AUTHEN_EMAIL]: this.input.getValue()
			}
		})
			.then(response => {
				this.button.load(false);
				response = response['data'];
				if (response['result']) {
					Swal(response['message'], response['data'], 'success');
				} else {
					Swal(response['message'], response['data'], 'error');
				}
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	render() {
		return (
			<div style={{ marginTop: 15 }}>
				<Style id='editemailcss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
				<div><b>{lang(AUTHEN_EMAIL) + ':'}</b></div>
				<div><Input ref={input => this.input = input} className='input_tag' struct={this.struct[AUTHEN_EMAIL]}></Input></div>
				<div><BtnLoad onClick={() => { this.userChangeEmail() }} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
			</div>
		)
	}
}




class EditPhone extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_PHONE]: {
				[INPUT_NAME]: AUTHEN_PHONE,
				[INPUT_TYPE]: 'text',
				[INPUT_NULL]: false,
				[INPUT_DEFAULT]: this.props.value
			}
		}
	}

	userChangePhone() {
		this.button.load(true);
		axios.request({
			url: '/auth/profile/user_change_phone',
			method: 'post',
			data: {
				[AUTHEN_PHONE]: this.input.getValue()
			}
		})
			.then(response => {
				this.button.load(false);
				response = response['data'];
				if (response['result']) {
					Swal(response['message'], response['data'], 'success');
				} else {
					Swal(response['message'], response['data'], 'error');
				}
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	render() {
		return (
			<div style={{ marginTop: 15 }}>
				<Style id='editphonecss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
				<div><b>{lang(AUTHEN_PHONE) + ':'}</b></div>
				<div><Input ref={input => this.input = input} className='input_tag' struct={this.struct[AUTHEN_PHONE]}></Input></div>
				<div><BtnLoad onClick={() => { this.userChangePhone() }} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
			</div>
		)
	}
}





class EditPass extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_PASS]: {
				[INPUT_NAME]: AUTHEN_PASS,
				[INPUT_TYPE]: 'password',
				[INPUT_NULL]: false,
				[INPUT_DECORATOR_IN]: function (data) { return ""; },
				[INPUT_DECORATOR_OUT]: function (data) { if (data != "") return btoa(data); else return "" }
			}
		}
	}

	userChangePhone() {
		this.button.load(true);

		var old_pass = this.oldpass.getValue();
		var new_pass = this.newpass.getValue();
		var rep_pass = this.reppass.getValue();

		if (new_pass != rep_pass) {
			Swal('Error', 'Password not match', 'error');
			this.button.load(false);
			return;
		}


		axios.request({
			url: '/auth/profile/user_change_pass',
			method: 'post',
			data: {
				old_pass: old_pass,
				new_pass: new_pass
			}
		})
			.then(response => {
				this.button.load(false);
				response = response['data'];
				if (response['result']) {
					Swal(response['message'], response['data'], 'success');
				} else {
					Swal(response['message'], response['data'], 'error');
				}
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	render() {
		return (
			<div style={{ marginTop: 15 }}>
				<Style id='editpasscss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
				<div><b>{lang('Change Password') + ':'}</b></div>
				<div><b>Old Pass</b></div>
				<div><Input ref={input => this.oldpass = input} className='input_tag' struct={this.struct[AUTHEN_PASS]}></Input></div>
				<div><b>New Pass</b></div>
				<div><Input ref={input => this.newpass = input} className='input_tag' struct={this.struct[AUTHEN_PASS]}></Input></div>
				<div><b>Retype</b></div>
				<div><Input ref={input => this.reppass = input} className='input_tag' struct={this.struct[AUTHEN_PASS]}></Input></div>

				<div><BtnLoad onClick={() => { this.userChangePhone() }} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
			</div>
		)
	}
}





class Profile extends Component {

	constructor(props) {
		super(props);
		this.initial();
		this.state = {
			edit: null
		}


	}

	initial() {
		this.id = get(this.props.id, '');
	}





	render() {
		this.initial();
		return (



			<>
				<style>{`
					.box_shadow {
						padding: 15px;
						margin-bottom: 15px;
						box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
						border-radius: 4px;
					}
				`}</style>
				
				<div className='box_shadow'><EditImage value={App.server["user"][AUTHEN_IMG]} /></div>
				<div className='box_shadow'><EditName value={App.server["user"][AUTHEN_USERNAME]} /></div>
				<div className='box_shadow'><EditEmail value={App.server["user"][AUTHEN_EMAIL]} /></div>
				<div className='box_shadow'><EditPhone value={App.server["user"][AUTHEN_PHONE]} /></div>
				<div className='box_shadow'><EditPass value='' /></div>
				
			</>








		)

	}
}
export default Profile