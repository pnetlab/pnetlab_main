import React, { Component } from 'react'
import FormInput from '../input/FormInput' 

class FuncAddGroup extends Component {
	
	constructor(props) {
	    super(props);
	    this.initial();
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
	    
	}
	
	initial(){
		this.group = get(this.props.group, '');
	    this.id = get(this.props.id, '');
	}
	
	addGroup(){
		let values = this.form.getValue();
		axios.request ({
		    url: '/auth/account/group_add',
		    method: 'post',
		    data:{
			    	[GROUP_NAME]: values[GROUP_NAME],
			    	[GROUP_NOTE]: values[GROUP_NOTE],
			    	[GROUP_PARENT]: this.group[GROUP_ID],
		    	}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  
	    		  $("#map_modal"+this.id).modal('hide');
	    		  if(isset(this.props.parent)) this.props.parent.refresh();
	    		  
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
					 <div className="button" title="Add child group" onClick={function(){$("#map_modal"+this.id).modal()}.bind(this)}>
					 	<i className="fa fa-plus-square"></i>
					 </div>
					  
					<div className="modal fade" id={"map_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Add child group for "+ this.group[GROUP_NAME]}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
									<FormInput id="add_group" ref={form => this.form = form} struct = {this.struct}></FormInput>
								</div>
								
								<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={function(){this.addGroup()}.bind(this)}>Add</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
						        </div>

								
							</div>
						</div>
					</div>
				</div>
		)  
				  
	}
}
export default FuncAddGroup
	  