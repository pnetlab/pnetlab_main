import React, { Component } from 'react'
import FormInput from '../input/FormInput' 

class FuncAddMem extends Component {
	
	constructor(props) {
	    super(props);
	    this.initial();
	    this.struct = {
	    	[AUTHEN_USERNAME]:{
	    		[INPUT_NAME] : lang(AUTHEN_USERNAME),
	            [INPUT_TYPE] : 'text',
	            [INPUT_NULL] : false,
	    	},
	    	[AUTHEN_EMAIL]:{
	    		[INPUT_NAME] : lang(AUTHEN_EMAIL),
	    		[INPUT_TYPE] : 'email',
	    		[INPUT_NULL] : false,
	    	},
	    	[AUTHEN_PHONE]:{
	    		[INPUT_NAME] : lang(AUTHEN_PHONE),
	    		[INPUT_TYPE] : 'text',
	    		[INPUT_NULL] : false,
	    	},
	    	[AUTHEN_PASS]:{
	    		[INPUT_NAME] : lang(AUTHEN_PASS),
	    		[INPUT_TYPE] : 'password',
	    		[INPUT_NULL] : false,
	    		[INPUT_DECORATOR_IN] : function(data){return "";},
	    		[INPUT_DECORATOR_OUT] : function(data){if(data!="")return btoa(data); else return ""}
	    	},
	    	
	    	[AUTHEN_NOTE]:{
	    		[INPUT_NAME] : lang(AUTHEN_NOTE),
	            [INPUT_TYPE] : 'textarea',
	            [INPUT_NULL] : false,
	            [INPUT_DECORATOR_IN] : function(data){return HtmlDecode(data);},
	    		[INPUT_DECORATOR_OUT] : function(data){return HtmlEncode(data);}
	    	}
	    		
	    }
	    
	}
	
	initial(){
		this.group = get(this.props.group, '');
	    this.id = get(this.props.id, '');
	}
	
	
	
	
	
	
	createMember(){
		var memberData = this.form.getValue();
		
		axios.request ({
		    url: '/auth/account/member_create',
		    method: 'post',
		    data:{
			    	members: memberData, 
			    	[GROUP_ID]:this.group[GROUP_ID]
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  $("#add_member_modal"+this.id).modal('hide');
	    		  if(isset(this.props.parent)) this.props.parent.refresh();
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
		
	}
	
	
	parseMember(members){
		members = members.split(/<[^>]*>/);
		members = members.filter(function(e){return e != ''});
		var listMember = [];
		
		for(let i in members){
			let memberEle = members[i].split(/[,;\-\#\$\%\^\&\(\)\{\}\[\]\|]+/).filter(function(e){return e != ''});
			listMember = listMember.concat(memberEle); 
		}
		return listMember;
	}
	
	addMember(){
		var members = this.inputByID.innerHTML;
		var listMember = this.parseMember(members);
		
		axios.request ({
		    url: '/auth/account/member_add',
		    method: 'post',
		    data:{
			    	members: listMember,
			    	[GROUP_ID]:this.group[GROUP_ID]
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  $("#add_member_modal"+this.id).modal('hide');
	    		  if(isset(this.props.parent)) this.props.parent.refresh();
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	}
	
	checkInput(){
		
		var members = this.inputByID.innerHTML;
		var listMember = this.parseMember(members);
		
		axios.request ({
		    url: '/auth/account/member_check',
		    method: 'post',
		    data:{
			    	members: listMember,
			    	[GROUP_ID]:this.group[GROUP_ID]
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  response['data'].push('<span></span>');
	    		  this.inputByID.innerHTML = response['data'];
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
					 <div className="button" title="Add member to group" onClick={function(){$("#add_member_modal"+this.id).modal()}.bind(this)}>
					 	<i className="fa fa-user-plus"></i>
					 </div>
					  
					<div className="modal fade" id={"add_member_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Add member to "+ this.group[GROUP_NAME]}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
								
									<ul className="nav nav-tabs" role="tablist">
										<li className="nav-item"><a className="nav-link active" href={"#menu1_"+this.id} role="tab" data-toggle="tab">Add by ID</a></li>
										<li className="nav-item"><a className="nav-link" href={"#menu2_"+this.id} role="tab" data-toggle="tab">Create Account</a></li>
									</ul>
				
									<div className="tab-content">
									
									  <div style={{opacity:1}} role="tabpanel" className="tab-pane fade in active" id={ "menu1_" + this.id }>
									  
									  	  <div style={{padding:15}}>
										  	  <div>{lang('Type Emails, Users name or Phones of people you want to add to group.')}</div>
											  <div contentEditable="true" 
												  ref={area => this.inputByID = area} 
											  	  style={{width:'100%', border:'solid thin darkgray', padding:5, borderRadius:5}}>
											  </div>
										  </div>
										  
										  <div  className="modal-footer"> 
										  	<button type="button" className="btn btn-default" onClick={function(){this.checkInput()}.bind(this)}>Check</button>
										  	<button type="button" className="btn btn-primary" onClick={function(){this.addMember()}.bind(this)}>Add</button>
									        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
										  </div>
									  
									  </div>
									  
									  <div style={{opacity:1}} role="tabpanel" className="tab-pane fade" id={ "menu2_" + this.id }>

									  	<FormInput ref={form => this.form = form} struct = {this.struct}></FormInput>
									  	<div  className="modal-footer"> 
										  	<button type="button" className="btn btn-primary" onClick={function(){this.createMember()}.bind(this)}>Add</button>
									        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
								        </div>
									  
									  </div> 
									  
									</div>

								</div>
								
								
							</div>
						</div>
					</div>
				</div>
		)  
	}
}
export default FuncAddMem
	  