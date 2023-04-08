import React, { Component } from 'react'
import InputCheck from '../input/InputCheck'
import Input from '../input/Input'

class FuncEditPer extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.state = {
	    	permission: {
	    		table: {
	    			full: false
	    		},
	    		column: {},
	    	}, 
	    	name: ''
	    }
	    
	    this.permission = this.state.permission;
	    
	}
	
	initial(){
		this.project = this.props.project;
	}
	
	resetPermission(){
		this.permission =  {
	    		table: {
	    			full: false
	    		},
	    		column: {},
	    	}
	}
	
	onSaveHandle(){
		var selectRow = this.table[STRUCT_TABLE][DATA_SELECT_ROWS]; 
	    loading(true, 'Loading...');
		axios.request ({
		    url: this.table[STRUCT_TABLE][LINK_EDIT],
		    method: 'post',
		    data:{
			    	data: {
			    		[AUTHZ_PRO_PID]:  this.project[PROJECT_ID],
			    		[DATA_SELECT_ROWS]: selectRow,
			    		[AUTHZ_PRO_FUNC]: this.permission,
			    	}
		    	}
			})
	      .then(response => {
	    	    loading(false, 'Loading...');
	    	    response = response['data'];
	    	    if(!response) return;
		  		if(response['result']){
		  			$("#edit_permission_modal"+this.id).modal('hide'); 
		  	    	this.table.filter();
		  	    }else{
		  	    	Swal(response['message'], response['data'], 'error');
		  	    }
	      })
	      
	      .catch(function (error) {
	    	  console.log(error)
	    	  loading(false, 'Loading...');
	    	  Swal('Error', 'Unknow error', 'error');
	      })
	}
	
	loadPermission(){
		var selectRow = this.table[STRUCT_TABLE][DATA_SELECT_ROWS]; 
		if(count(selectRow) != 1){
			this.resetPermission();
  			this.updatePermsison();
			return;
		}
	    loading(true, 'Loading...');
		axios.request ({
		    url: this.table[STRUCT_TABLE][LINK_READ],
		    method: 'post',
		    data:{
			    	data: {
			    		[AUTHZ_PRO_PID]:  this.project[PROJECT_ID],
			    		[DATA_SELECT_ROWS]: selectRow,
			    	}
		    	}
			})
	      .then(response => {
	    	    loading(false, 'Loading...');
	    	    response = response['data'];
	    	    if(!response) return;
		  		if(response['result']){
		  			var permission = JSON.parse(response['data'][AUTHZ_PRO_FUNC]);
		  			if(permission){
		  				this.permission = permission;
		  				if(count(this.permission.column) == 0) this.permission.column = {};
		  				
		  			}else{
		  				this.resetPermission();
		  			}
		  			this.updatePermsison();
		  			
		  	    }else{
		  	    	Swal(response['message'], response['data'], 'error');
		  	    }
	      })
	      
	      .catch(function (error) {
	    	  console.log(error)
	    	  loading(false, 'Loading...');
	    	  Swal('Error', 'Unknow error', 'error');
	      })
	}
	
	
	loadTemp(value){
		
		if(value==''){
			this.loadPermission();
			return;
		}
		
		loading(true, 'Loading...');
		axios.request ({
			url: '/admin/temps/read',
			method: 'post',
			data:{
				data: [[[TEMP_ID, '=', value]]]
			}
		})
		.then(response => {
			loading(false, 'Loading...');
			response = response['data'];
			if(!response) return;
			if(response['result']){
				
				if(!response['data'][0]){
					return;
				}
				
				var permission = JSON.parse(response['data'][0][TEMP_PERMISSION]);
				if(permission){
					this.permission = permission;
					if(count(this.permission.column) == 0) this.permission.column = {};
					this.updatePermsison();
				}
				
				
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
		.catch(function (error) {
			console.log(error)
			loading(false, 'Loading...');
			Swal('Error', 'Unknow error', 'error');
		})
	}
	
	updatePermsison(){
		this.setState({permission: this.permission})
	}
	
	getName(){
		var selects = this.table[STRUCT_TABLE][DATA_SELECT_ROWS];
		var name = [];
		for(let i in selects){
			name.push(selects[i][AUTHZ_PRO_NAME]);
		}
		return name.join(', ');
	}
	
	onClickHandle(){
		
		var selects = this.table[STRUCT_TABLE][DATA_SELECT_ROWS];
		if(count(selects) == 0) return;
		$("#edit_permission_modal"+this.id).modal(); 
		this.setState({name: this.getName()});
		this.loadPermission();
	}
	
	updateFullPermission(event){
		this.permission.table['full'] = event.target.checked;
		this.updatePermsison();
	}
	
	updateColPermission(colID, checked, permission){
		if(checked){
			if(!this.permission.column) this.permission.column={};
			this.permission.column[colID] = permission;
		}else{
			delete(this.permission.column[colID]);
		}
		this.updatePermsison();
	}
	
	updateAllColPermission(checked, permission){
		var project = get(server['project'], []);
		for(let colID in project){
			if(checked){
				this.permission.column[colID] = permission;
			}else{
				delete(this.permission.column[colID]);
			}
		}
		
		this.updatePermsison();
	}
	
	drawProjectColumns(){
		var project = get(server['project'], []);
		var rows = [];
		for(let colID in project){
			rows.push(
					<tr key = {colID}>
						<th>{lang(project[colID])}</th>
						<td>
							<input 
								checked={(isset(this.state.permission.column) && this.state.permission.column[colID] == 'Read')} 
								type="checkbox" 
								onChange={(event)=>{this.updateColPermission(colID, event.target.checked, 'Read')}}>
							</input>
						</td>
						
						<td>
							<input 
								checked={(isset(this.state.permission.column) && this.state.permission.column[colID] == 'Update')} 
								type="checkbox" 
								onChange={(event)=>{this.updateColPermission(colID, event.target.checked, 'Update')}}>
							</input>
						</td>
						
						<td>
							<input 
								checked={(isset(this.state.permission.column) && this.state.permission.column[colID] == 'Write')} 
								type="checkbox" 
								onChange={(event)=>{this.updateColPermission(colID, event.target.checked, 'Write')}}>
							</input>
						</td>
					</tr>
			)
			
		}
		
		return rows;
	
	}
	
	render () {
		
		  this.initial();
		  return(
				  <div>
				  
					 <div className="button" title="Edit permission" onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-address-card"></i>&nbsp;Edit
					 </div>
					  
					<div className="modal fade" id={"edit_permission_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								<div style={{padding:15}}>
								
									<p><b>Edit permssion: </b>{this.state.name}</p>
									<div style={{display:'flex'}}>
									
										<label><input 
											checked={this.state.permission.table.full} 
											type="checkbox" 
											style={{margin: '0px 10px', cursor: 'pointer'}} 
											onChange={(event)=>{this.updateFullPermission(event)}}/>Full permission
										</label>
										<div style={{margin:'auto 0px auto auto', padding:10}}>
											<Input style={{padding:5}} struct={{
													[INPUT_TYPE]:'select',
													[INPUT_OPTION]: {'': 'Chọn phân quyền', ...server['temps']}, 
											}} onChange={(event, value)=>{this.loadTemp(value)}}></Input>
										</div>
										
									</div>
									<table className = "main_table table table-bordered table-striped">
										<thead>
											<tr>
												<th>Column Name</th>
												<th>Read</th>
												<th>Update</th>
												<th>Write</th>
											</tr>
											<tr>
												<th></th>
												<th>
													<input 
														type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Read')}}>
													</input>
												</th>
												
												<th>
													<input 
														type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Update')}}>
													</input>
												</th>
												
												<th>
													<input 
														type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Write')}}>
													</input>
												</th>
											</tr>
										</thead>
										<tbody>
											{this.drawProjectColumns()}
										</tbody>
									</table>
								</div>
								
								<div className="modal-body"> 
									
								</div>
								
								<div  className="modal-footer"> 
								  	<button type="button" className="btn btn-primary" onClick = {() => {this.onSaveHandle()}}>Save</button>
							        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
						        </div>

							</div>
						</div>
					</div>
				</div>
		)  
	}
}

FuncEditPer.contextType = TableContext;
export default FuncEditPer
	  