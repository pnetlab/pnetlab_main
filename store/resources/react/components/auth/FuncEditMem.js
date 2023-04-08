import React, { Component } from 'react'
import FormInput from '../input/FormInput'

class FuncEditMem extends Component {
	
	constructor(props) {
	    super(props);
	    this.initial();
	    this.struct = {
	    	[AUTHEN_USERNAME]:{
	    		[INPUT_NAME] : AUTHEN_USERNAME,
	            [INPUT_TYPE] : 'text',
	            [INPUT_NULL] : false,
	    	},
	    	[AUTHEN_EMAIL]:{
	    		[INPUT_NAME] : AUTHEN_EMAIL,
	    		[INPUT_TYPE] : 'email',
	    		[INPUT_NULL] : false,
	    	},
	    	[AUTHEN_PHONE]:{
	    		[INPUT_NAME] : AUTHEN_PHONE,
	    		[INPUT_TYPE] : 'text',
	    		[INPUT_NULL] : false,
	    	},
	    	[AUTHEN_PASS]:{
	    		[INPUT_NAME] : AUTHEN_PASS,
	    		[INPUT_TYPE] : 'password',
	    		[INPUT_NULL] : false,
	    		[INPUT_DECORATOR_IN] : function(data){return "";},
	    		[INPUT_DECORATOR_OUT] : function(data){if(data!="")return btoa(data); else return ""}
	    	},
	    	
	    	[AUTHEN_NOTE]:{
	    		[INPUT_NAME] : AUTHEN_NOTE,
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
	
	editMember(){
		var memberData = this.form.getValue();
		memberData[AUTHEN_ID] = this.props.parent.member[AUTHEN_ID];
		axios.request ({
		    url: '/auth/account/member_edit',
		    method: 'post',
		    data:{
			    	members: memberData, 
			    	[GROUP_ID]:this.group[GROUP_ID]
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  $("#edit_member_modal"+this.id).modal('hide');
	    		  if(isset(this.props.parent)) this.props.parent.refresh();
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
		
	}
	
	componentDidMount() {
		this.form.setValue(this.props.parent.member);
	}
	
	
	render () {
		  this.initial();
		  return(
				  <div>
					 <div className="button" title={"Edit member " + this.props.parent.member[AUTHEN_USERNAME]} onClick={function(){$("#edit_member_modal"+this.id).modal()}.bind(this)}> 
					 	<i className="fa fa-pencil-square-o"></i>
					 </div>
					  
					<div className="modal fade" id={"edit_member_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Edit member " + this.props.parent.member[AUTHEN_USERNAME]}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
									 <FormInput ref={form => this.form = form} struct = {this.struct}></FormInput>
								</div> 
								
								<div  className="modal-footer"> 
								  	<button type="button" className="btn btn-primary" onClick={function(){this.editMember()}.bind(this)}>Save</button>
							        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
						        </div>
								
							</div>
						</div>
					</div>
				</div>
		)  
	}
}
export default FuncEditMem
	  