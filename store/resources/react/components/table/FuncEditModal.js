import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncEditModal extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['EditModal'] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.rowData = {};
	    
	    if(!this.props.upload){
	    	this.upload = this.table.upload;
	    }else{
	    	this.upload = this.props.upload;
	    }
	    
	    if(!this.props.onSuccess){
	    	this.onSuccess = ()=>this.table.filter();
	    }else{
	    	this.onSuccess = this.props.onSuccess;
	    }
	}
	
	initial(){
		this.struct = {};
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		
		for(let i in this.table[STRUCT_EDIT]){
			if(!this.permitCol[i]) continue;
			this.struct[i] = this.table[STRUCT_EDIT][i];
			if(this.permitCol[i] == 'Read'){
				this.struct[i][EDIT_WRITABLE] = false;
			}else{
				this.struct[i][EDIT_WRITABLE] = true;
			}
		}
	}
	
	onClickHandle(){
		
		this.upload(this.form).then( response =>{
			
			 if(response){
				 
				var rowData = this.form.getValue();
				
				if(rowData == null) return;
				
				for(let i in rowData){
					
					if(this.permitCol[i] == 'Read'){
						delete(rowData[i]);
					}
				}
					
				if(this.table[STRUCT_TABLE][DATA_EDITOR]){
					rowData = {...rowData, ...this.table[STRUCT_TABLE][DATA_EDITOR]}
				}
				 
				this.editRow(rowData)
				 
	    	  }
		});
	}
	
	editRow(rowData){
		
		var {key, value} = this.table.createKey(this.rowData);
		
		if(!value){
			Swal('Error', 'Can not create key', 'error');
			return;
		}
		
		var editData={
				[DATA_KEY] : [value],
				[DATA_EDITOR] : rowData
		}
		
		this.table.editRow(editData).then(response =>{
			  if(response['result']){
				this.modal('hide');
				this.onSuccess(response);
	    	  }else{
	    		 error_handle(response);
	    	  }
		});
	}
	
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#edit_row_modal"+this.id).modal('hide');
		}else{
			$("#edit_row_modal"+this.id).modal();
		}
	}
	
	loadData(rowData){
		this.rowData = rowData;
		this.form.setValue(this.rowData);
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		this.initial();
		return(
				<div className="modal fade" id={"edit_row_modal"+this.id} onClick={()=>{addClass($('body')[0], 'modal-open')}}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{"Edit Row"}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
								<FormEditor ref={form => this.form = form} struct = {this.struct}></FormEditor> 
							</div>
							
							<div  className="modal-footer"> 
							  	<button type="button" className="btn btn-primary" onClick = {() => {this.onClickHandle()}}>{lang("Save")}</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Close")}</button>
					        </div>

						</div>
					</div>
				</div>
		)  
	}
}
FuncEditModal.contextType = TableContext;
export default FuncEditModal
	  