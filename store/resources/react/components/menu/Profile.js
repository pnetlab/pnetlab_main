import React, { Component } from 'react'
import FormInput from '../input/FormInput' 
import Namecard from './Namecard'
import Style from '../common/Style'
import BtnLoad from '../button/BtnLoad'
import Input from '../input/Input'

class EditName extends Component{
	constructor(props) {
	    super(props);
	    this.struct = {
		    	[AUTHEN_USERNAME]:{
		    		[INPUT_NAME] : AUTHEN_USERNAME,
		            [INPUT_TYPE] : 'text',
		            [INPUT_NULL] : false,
		            [INPUT_DEFAULT] : this.props.value
		    	}}
	}
	
	userChangeName(){
		this.button.load(true);
		axios.request ({
		    url: '/auth/account/user_change_name',
		    method: 'post',
		    data:{
			    	[AUTHEN_USERNAME]: this.input.getValue()
		    	}
			})
	      .then(response => {
	    	  this.button.load(false);
	    	  response = response['data'];
	    	  if(response['result']){
	    		  Swal(response['message'], response['data'], 'success');
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  this.button.load(false);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render(){
		return (
				<div style={{marginTop:15}}>
					<Style id='editnamecss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
					<div><b>{lang(AUTHEN_USERNAME)+':'}</b></div>
					<div><Input ref={input => this.input = input} className = 'input_tag' struct = {this.struct[AUTHEN_USERNAME]}></Input></div>
					<div><BtnLoad onClick={()=>{this.userChangeName()}} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
				</div>
		)
	}
}





class EditEmail extends Component{
	constructor(props) {
	    super(props);
	    this.struct = {
		    	[AUTHEN_EMAIL]:{
		    		[INPUT_NAME] : AUTHEN_EMAIL,
		            [INPUT_TYPE] : 'email',
		            [INPUT_NULL] : false,
		            [INPUT_DEFAULT] : this.props.value
		    	}}
	}
	
	userChangeEmail(){
		this.button.load(true);
		axios.request ({
		    url: '/auth/account/user_change_email',
		    method: 'post',
		    data:{
			    	[AUTHEN_EMAIL]: this.input.getValue()
		    	}
			})
	      .then(response => {
	    	  this.button.load(false);
	    	  response = response['data'];
	    	  if(response['result']){
	    		  Swal(response['message'], response['data'], 'success');
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  this.button.load(false);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render(){
		return (
				<div style={{marginTop:15}}>
					<Style id='editemailcss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
					<div><b>{lang(AUTHEN_EMAIL)+':'}</b></div>
					<div><Input ref={input => this.input = input} className = 'input_tag' struct = {this.struct[AUTHEN_EMAIL]}></Input></div>
					<div><BtnLoad onClick={()=>{this.userChangeEmail()}} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
				</div>
		)
	}
}




class EditPhone extends Component{
	constructor(props) {
	    super(props);
	    this.struct = {
		    	[AUTHEN_PHONE]:{
		    		[INPUT_NAME] : AUTHEN_PHONE,
		            [INPUT_TYPE] : 'text',
		            [INPUT_NULL] : false,
		            [INPUT_DEFAULT] : this.props.value
		    	}}
	}
	
	userChangePhone(){
		this.button.load(true);
		axios.request ({
		    url: '/auth/account/user_change_phone',
		    method: 'post',
		    data:{
			    	[AUTHEN_PHONE]: this.input.getValue()
		    	}
			})
	      .then(response => {
	    	  this.button.load(false);
	    	  response = response['data'];
	    	  if(response['result']){
	    		  Swal(response['message'], response['data'], 'success');
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  this.button.load(false);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render(){
		return (
				<div style={{marginTop:15}}>
					<Style id='editphonecss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
					<div><b>{lang(AUTHEN_PHONE)+':'}</b></div>
					<div><Input ref={input => this.input = input} className = 'input_tag' struct = {this.struct[AUTHEN_PHONE]}></Input></div>
					<div><BtnLoad onClick={()=>{this.userChangePhone()}} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
				</div>
		)
	}
}





class EditPass extends Component{
	constructor(props) {
	    super(props);
	    this.struct = {
	    		[AUTHEN_PASS]:{
		    		[INPUT_NAME] : AUTHEN_PASS,
		    		[INPUT_TYPE] : 'password',
		    		[INPUT_NULL] : false,
		    		[INPUT_DECORATOR_IN] : function(data){return "";},
		    		[INPUT_DECORATOR_OUT] : function(data){if(data!="")return btoa(data); else return ""}
		    	}}
	}
	
	userChangePhone(){
		this.button.load(true);
		
		var old_pass = this.oldpass.getValue();
    	var new_pass = this.newpass.getValue();
		var rep_pass = this.reppass.getValue();
    	
		if(new_pass != rep_pass){
			Swal('Error', 'Password not match', 'error');
			this.button.load(false);
			return;
		}
		
		
		axios.request ({
		    url: '/auth/account/user_change_pass',
		    method: 'post',
		    data:{
			    	old_pass: old_pass,
			    	new_pass: new_pass
		    	}
			})
	      .then(response => {
	    	  this.button.load(false);
	    	  response = response['data'];
	    	  if(response['result']){
	    		  Swal(response['message'], response['data'], 'success');
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  this.button.load(false);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render(){
		return (
				<div style={{marginTop:15}}>
					<Style id='editpasscss'>{`
						.input_tag{
							border: none;
						    border-bottom: dashed thin darkgray;
						    padding: 5px;
						    margin: 10px 0px;
						    width: 100%;
						}
					`}</Style>
					<div><b>Old Pass</b></div>
					<div><Input ref={input => this.oldpass = input} className = 'input_tag' struct = {this.struct[AUTHEN_PASS]}></Input></div>
					<div><b>New Pass</b></div>
					<div><Input ref={input => this.newpass = input} className = 'input_tag' struct = {this.struct[AUTHEN_PASS]}></Input></div>
					<div><b>Retype</b></div>
					<div><Input ref={input => this.reppass = input} className = 'input_tag' struct = {this.struct[AUTHEN_PASS]}></Input></div>
					
					<div><BtnLoad onClick={()=>{this.userChangePhone()}} ref={button => this.button = button} className="btn btn-primary button">Save</BtnLoad></div>
				</div>
		)
	}
}





class Profile extends Component {
	
	constructor(props) {
	    super(props);
	    this.initial();
	    this.state={
	    		edit: null
	    }
	    
	    
	}
	
	initial(){
	    this.id = get(this.props.id, '');
	}
	
	show(){
		$("#profile_modal"+this.id).modal();
		if(App.Layout) App.Layout.setState({
			menu: App.Layout.loadDefault() 
		})
	}
	
	drawEditBox(){
		if(this.state.edit == AUTHEN_USERNAME){
			return (<EditName value = {server["user"][AUTHEN_USERNAME]} />);
		}else if (this.state.edit == AUTHEN_EMAIL){
			return (<EditEmail value = {server["user"][AUTHEN_EMAIL]} />);
		}else if (this.state.edit == AUTHEN_PHONE){
			return (<EditPhone value = {server["user"][AUTHEN_PHONE]} />);
		}else if (this.state.edit == AUTHEN_PASS){
			return (<EditPass value = '' />);
		}
	}
	
	render () {
		  this.initial();
		  return(
					<div className="modal fade" id={"profile_modal"+this.id} style={this.props.style}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
							
								<div className="modal-header">
									<h4 className="modal-title">Profile</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
							
								<div className="modal-body">
									
									<Namecard/>
									
									<div className = 'row'>
										<div className="col-lg-6">
											<div style={{display:'flex', alignItems: 'center'}}>
												<Style id="profiletablecss">{`
													.profile_table{
														margin: 15px 0px;
														width: 100%;
													}
													.profile_table td, .profile_table th {
														padding: 5px;
													}
													.profile_table tr {
														padding-bottom: 10px;
													}
													.profile_edit{
														color:black;
													}
													
												`}</Style>
												<table className="profile_table">
													<tbody>
													<tr>
														<th><span>{lang(AUTHEN_USERNAME)}</span></th>
														<td>:</td>
														<td>{server['user'][AUTHEN_USERNAME]}</td>
														<td><i className="fa fa-edit button" onClick={()=>{this.setState({edit: AUTHEN_USERNAME})}}></i></td>
													</tr>
													<tr>
														<th><span>{lang(AUTHEN_EMAIL)}</span></th>
														<td>:</td>
														<td>{server['user'][AUTHEN_EMAIL]}</td>
														<td><i className="fa fa-edit button" onClick={()=>{this.setState({edit: AUTHEN_EMAIL})}}></i></td>
													</tr>
													<tr>
														<th><span>{lang(AUTHEN_PHONE)}</span></th>
														<td>:</td>
														<td>{server['user'][AUTHEN_PHONE]}</td>
														<td><i className="fa fa-edit button" onClick={()=>{this.setState({edit: AUTHEN_PHONE})}}></i></td>
													</tr>
													<tr>
													<th><span>{lang(AUTHEN_PASS)}</span></th>
														<td>:</td>
														<td>********</td>
														<td><i className="fa fa-edit button" onClick={()=>{this.setState({edit: AUTHEN_PASS})}}></i></td>
													</tr>
													</tbody>
												</table>
												
											</div>
										</div>
										
										<div className="col-lg-6 profile_edit">
											{this.drawEditBox()}
										</div>
									
									</div>
								
								
								
								</div>
								
								
								
							</div>
						</div>
					</div>
		)  
				  
	}
}
export default Profile