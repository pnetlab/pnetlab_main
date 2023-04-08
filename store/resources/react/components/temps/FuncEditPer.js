import React, { Component } from 'react'

class FuncEditPer extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    
	    this.state = {
	    		columns : {},
	    		obj_groups: {},
	    }
	    this.rowData = {};
	    this.resetPermission();
	}
	
	loadRowData(){
		this.rowData = this.props.rowData;
		if(this.rowData[PER_TEMP_FUNC]){
			this.permission = JSON.parse(this.rowData[PER_TEMP_FUNC]);
		}else{
			this.resetPermission();
		}
	}
	
	resetPermission(){
		this.permission =  {
		    		table: {},
		    		column: {},
		    		obj_group: {},
	    	}
		return this.permission;
	}
	
	loadColumns(){
		axios.request ({
		    url: '/admin/customers/getColumns',
		    method: 'post',
		    data:{}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  delete(response['data'][CUS_ID]);
	    		  this.setState({
		    		  columns: response['data']
		    	  });
	    	  }else{
		    	  Swal(response['message'], response['data'], 'error');
	    	  }
	    	 
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  error_handle(error)
	      })
	}
	
	loadObjectGroup(){
		axios.request ({
			url: '/admin/cus_object_group/suggest',
			method: 'post',
			data:{}
		})
		
		.then(response => {
			response = response['data'];
			if(response['result']){
				delete(response['data'][CUS_ID]);
				this.setState({
					obj_groups: response['data']
				});
			}else{
				Swal(response['message'], response['data'], 'error');
			}
			
		})
		
		.catch(function (error) {
			console.log(error);
			error_handle(error)
		})
	}
	
	savePermission(){
		this.permission.column[CUS_ID]='Read';
		axios.request ({
		    url: '/admin/per_temp/edit',
		    method: 'post',
		    data:{
		    	data: {
		    		[DATA_KEY]: [{[PER_TEMP_ID]: this.rowData[PER_TEMP_ID]}],
		    		[DATA_EDITOR] :{[PER_TEMP_FUNC]: JSON.stringify(this.permission)},
		    	}
		    }
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  $("#edit_permission_modal"+this.id).modal('hide'); 
	    		  this.table.filter();
	    		  
	    	  }else{
		    	  Swal(response['message'], response['data'], 'error');
	    	  }
	    	 
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  error_handle(error)
	      })
	}
	
	updatePermsison(){
		
		this.forceUpdate();
		
	}
	
	
	onClickHandle(){
		$("#edit_permission_modal"+this.id).modal(); 
		this.loadRowData();
		this.loadColumns();
		this.loadObjectGroup();
		
	}
	
	updateCommonPermission(name, permission){
		if(!this.permission.table) this.permission.table={};
		this.permission.table[name] = permission;
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
		for(let colID in this.state.columns){
			if(checked){
				this.permission.column[colID] = permission;
			}else{
				delete(this.permission.column[colID]);
			}
		}
		
		this.updatePermsison();
	}
	
	updateObjGroupPermission(objID, checked){
		if(!this.permission.obj_group) this.permission.obj_group = {};
		if(checked){
			this.permission.obj_group[objID] = true;
		}else{
			delete(this.permission.obj_group[objID]);
		}
		this.updatePermsison();
	}
	
	drawColumns(){
		var columns = get(this.state.columns, {});
		var rows = [];
		for(let colID in columns){
			rows.push(
					<tr key = {colID}>
						<td style={{fontWeight:'bold'}}>{lang(colID)}</td>
						<td>
							<input 
								checked={(isset(this.permission.column) && this.permission.column[colID] == 'Read')} 
								type="checkbox" 
								onChange={(event)=>{this.updateColPermission(colID, event.target.checked, 'Read')}}>
							</input>
						</td>
						
						<td>
							<input 
							checked={(isset(this.permission.column) && this.permission.column[colID] == 'Update')} 
							type="checkbox" 
								onChange={(event)=>{this.updateColPermission(colID, event.target.checked, 'Update')}}>
							</input>
						</td>
						
						<td>
							<input 
								checked={(isset(this.permission.column) && this.permission.column[colID] == 'Write')} 
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
		
		  return(
				  <div>
				  
					 <div className="button" title="Edit permission" onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-address-card"></i>
					 </div>
					  
					<div className="modal fade" id={"edit_permission_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								<div style={{padding:15, textAlign: 'left'}}>
								
									<p><b>Edit permssion: </b>{this.rowData[PER_TEMP_NAME]}</p>
									
									<div style={{display:'flex'}}>
										<label><input 
											checked={isset(this.permission.table) && this.permission.table[CUS_PER_FULL]==true} 
											type="checkbox" 
											style={{margin: '0px 10px', cursor: 'pointer'}} 
											onChange={(event)=>{this.updateCommonPermission(CUS_PER_FULL, event.target.checked)}}/>{lang('Full permission')}
										</label>
									</div>
									
									<div style={{display:'flex'}}>
										<label><input 
											checked={isset(this.permission.table) && this.permission.table[CUS_PER_ADD]==true} 
											type="checkbox" 
											style={{margin: '0px 10px', cursor: 'pointer'}} 
											onChange={(event)=>{this.updateCommonPermission(CUS_PER_ADD, event.target.checked)}}/>{lang('Add Customers')}
										</label>
									</div>
									
									<div style={{display:'flex'}}>
										<label><input 
											checked={isset(this.permission.table) && this.permission.table[CUS_PER_DEL]==true} 
											type="checkbox" 
											style={{margin: '0px 10px', cursor: 'pointer'}} 
											onChange={(event)=>{this.updateCommonPermission(CUS_PER_DEL, event.target.checked)}}/>{lang('Delete Customers')}
										</label>
									</div>
									
									
									

									{isset(this.state.obj_groups) && count(this.state.obj_groups) > 0 ? <div>
									
										<p><strong>{lang(CUS_OBJ_GROUP)}</strong></p>
										
										<div style={{display:'flex', flexWrap:'wrap'}}>
											{Object.keys(this.state.obj_groups).map((key)=>{
													return <div key={key} style={{width: 200}}>
																<label><input 
																	checked={isset(this.permission.obj_group) && this.permission.obj_group[key]==true} 
																	type="checkbox" 
																	style={{margin: '0px 10px', cursor: 'pointer'}} 
																	onChange={(event)=>{this.updateObjGroupPermission(key, event.target.checked)}}/>{this.state.obj_groups[key]}
																</label>
															</div>
												})
											}
										
										</div>
									</div>: ''}
									
									
									<table className = "main_table table table-bordered table-striped">
										<thead>
											<tr>
												<th>Column Name</th>
												<th>Read</th>
												<th>Update</th>
												<th>Write</th>
											</tr>
											<tr>
												<td></td>
												<td>
													<input 
														type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Read')}}>
													</input>
												</td>
												<td>
													<input 
													type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Update')}}>
													</input>
												</td>
												<td>
													<input 
														type="checkbox" 
														onChange={(event)=>{this.updateAllColPermission(event.target.checked, 'Write')}}>
													</input>
												</td>
											</tr>
										</thead>
										<tbody>
											{this.drawColumns()}
										</tbody>
									</table>
								</div>
								
								<div className="modal-body"> 
									
								</div>
								
								<div  className="modal-footer"> 
								  	<button type="button" className="btn btn-primary" onClick = {() => {this.savePermission()}}>Save</button>
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
	  