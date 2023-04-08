import React, { Component } from 'react'
class FuncPermission extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    		permissions : JSON.parse(JSON.stringify(get(global.FUNCTIONS, {})))
	    }
	    
	    this.initial();
	    
	    
	    
	}
	
	initial(){
		this.group = get(this.props.group, '');
	    this.id = get(this.props.id, '');
	}
	
	loadInfo(){
		
			if(!this.loaded){
				axios.request ({
				    url: '/auth/account/permission_read', 
				    method: 'post',
				    data: {
				    	[global.AUTHZ_RB_GID]:this.group[global.GROUP_ID]			    
				    }})
			      .then(response => {
			    	  response = response['data'];
			    	  
			    	  if(response['result']){
			    		  let permissions = this.state.permissions;
			    		  response = response['data'];
				    	   for (let i in response){
				    		   
				    		   if(isset(permissions[response[i][global.AUTHZ_RB_FUNC]])){
				    			   permissions[response[i][global.AUTHZ_RB_FUNC]]['checked'] = true;
				    		   }
				    		   
				    	   }
				    	   
				    	   this.setState({'permissions' : permissions})
				    	   
			    	  }else{
			    		  Swal(response['message'], response['data'], 'error');
			    	  }
			      })
			      .catch(function (error) {
			    	  console.log(error);
			    	  Swal('Error', error, 'error');
			      })
			}
			
			
		}
	
		addFunc(func){
			axios.request ({
			    url: '/auth/account/permission_add',
			    method: 'post',
			    data:{
				    	[global.AUTHZ_RB_GID]: this.group[global.GROUP_ID],
				    	[global.AUTHZ_RB_FUNC]: func
			    	}
				})
		      .then(response => {
		    	  response = response['data'];
		    	  if(response['result']){
		    		  
		    	  }else{
		    		  Swal(response['message'], response['data'], 'error');
		    	  }
		      })
		      .catch(function (error) {
		    	   
		    	  Swal('Error', error, 'error');
		      })
		}
		
		delFunc(func){
			axios.request ({
			    url: '/auth/account/permission_del',
			    method: 'post',
			    data:{
		    	          [global.AUTHZ_RB_GID]: this.group[global.GROUP_ID],
		    	          [global.AUTHZ_RB_FUNC]: func
			    	}
				})
		      .then(response => {
		    	  response = response['data'];
		    	  if(response['result']){
		    		  
		    	  }else{
		    		  Swal(response['message'], response['data'], 'error');
		    	  }
		      })
		      .catch(function (error) {
		    	   
		    	  Swal('Error', error, 'error');
		      })
		}
	
	  onchangeHandle(event, func){
		  
		  if(event.target.checked){
			  this.addFunc(func);
		  }else{
			  this.delFunc(func);
		  }
		  
		  let permissions = this.state.permissions;
		  permissions[func]['checked'] = event.target.checked;
		  this.setState({'permissions':permissions});
		  
		  
	  }
	  
	  drawPermissionSelection(){
		  let permission = [];
		  for(let i in this.state.permissions){
			  
			  permission.push(
					  <div key={i}>
						  <label style={{margin: 10, whiteSpace: 'nowrap'}}>
						  
						  	<input className={"group_checkbox"+this.id} 
						  		type = "checkbox" 
						  		onChange = {function(event){this.onchangeHandle(event, i)}.bind(this)} 
						  		value = "" 
						  		checked={get(this.state.permissions[i]['checked'], false)}>
						  	</input>&nbsp;{this.state.permissions[i]['name']}
						  	
						  </label>
					  </div>
			  );
		  }
		  return permission;
	  }
	
	  render () {
		  this.initial();
		  return(<div>
					 <div className="button" title="Change Permission" onClick={function(){$("#map_modal"+this.id).modal(); this.loadInfo();}.bind(this)}>
					 	<i className="fa fa-address-card"></i>
					 </div>
					  
					<div className="modal fade" id={"map_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">Select</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
									<div id={"selection_frame"+this.id} style={{display: "block"}}>
										<div> {this.drawPermissionSelection()} </div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				  );
	  }
}
export default FuncPermission
	  