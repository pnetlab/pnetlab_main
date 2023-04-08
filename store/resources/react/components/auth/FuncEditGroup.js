import React, { Component } from 'react'
import FormInput from '../input/FormInput'

class FuncEditGroup extends Component {
	
	constructor(props) {
	    super(props);
	    this.struct = {
	    	[GROUP_NAME]:{
	    		[INPUT_NAME] : GROUP_NAME,
	            [INPUT_TYPE] : 'text',
	            [INPUT_NULL] : false,
	    	},
	    	
	    	[GROUP_NOTE]:{
	    		[INPUT_NAME] : GROUP_NOTE,
	            [INPUT_TYPE] : 'textarea',
	            [INPUT_NULL] : false,
	    	}
	    		
	    }
	    
	    this.onclickHandle = this.onclickHandle.bind(this);
	    
	}
	
	editGroup(){
		let values = this.form.getValue();
		axios.request ({
		    url: '/auth/account/group_edit',
		    method: 'post',
		    data:{
			    	[GROUP_NAME]: values[GROUP_NAME],
			    	[GROUP_NOTE]: values[GROUP_NOTE],
			    	[GROUP_ID]: this.props.group[GROUP_ID],
		    	}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  
	    		  $("#map_modal"+this.props.id).modal('hide');
	    		  if(isset(this.props.parent)) this.props.parent.refreshParent();
	    		  
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	}
	
	onclickHandle () {
		
		axios.request ({
		    url: '/auth/account/group_read',
		    method: 'post',
		    data:{
			    	[GROUP_ID]: this.props.group[GROUP_ID],
		    	}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  response = response['data'];
	    		  if(count(response)>0){
	    			  this.form.setValue(response[0]);
		    		  $("#map_modal"+this.props.id).modal();
	    		  }else{
	    			  Swal(response['message'], 'Group not found', 'error');
	    		  }
	    		  
	    		  
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	}
	
	render () {
		  return(
				  <div>
					 <div className="button" title="Edit group information" onClick={this.onclickHandle}>
					 	<i className="fa fa-pencil-square"></i>
					 </div>
					  
					<div className="modal fade" id={"map_modal"+this.props.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Edit group "+ this.props.group[GROUP_NAME]}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
									<FormInput ref={form => this.form = form} struct = {this.struct}></FormInput>
								</div>
								
								<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={function(){this.editGroup()}.bind(this)}>Save</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
						        </div>

								
							</div>
						</div>
					</div>
				</div>
		)  
				  
	}
}
export default FuncEditGroup
	  