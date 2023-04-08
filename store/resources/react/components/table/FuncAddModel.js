import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncAdd extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FuncAdd'] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    
	    if(!this.props.upload){
	    	this.upload = this.table.upload;
	    }else{
	    	this.upload = this.props.upload;
	    }
	   
	}
	
	initial(){
		this.struct = {};
		console.log(this.table[STRUCT_EDIT]);
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
		
			
		this.upload(this.form, (response = null)=>{
			 if(response['result']){
				 
				var rowData = this.form.getValue();
				
				if(this.table[STRUCT_TABLE][DATA_ADD]){
					rowData = {...rowData, ...this.table[STRUCT_TABLE][DATA_ADD]}
				}
				this.addRow(this.form.getValue())
				
	    	  }else{
	    		 Swal(response['message'], response['data'], 'error');
	    	  }
		});
	}
	
	addRow(rowData){
		this.table.addRow({rowData}, (response = null)=>{
			  if(response['result']){
				$("#add_row_modal"+this.id).modal('hide');
				this.table.filter();
	    	  }else{
	    		 Swal(response['message'], response['data'], 'error');
	    	  }
		});
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		  this.initial();
		  var text = get(this.props.text, 'Add');
		  return(
				  <div className="table_function">
				  
					 <div className="button" title="Add Row" onClick={() => {$("#add_row_modal"+this.id).modal()}} style={{display: 'flex'}}>
					 	<i className="fa fa-plus-square"></i>&nbsp;{text}
					 </div>
					  
					<div className="modal fade" id={"add_row_modal"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Add Row"}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body">
									<FormEditor ref={form => this.form = form} struct = {this.struct}></FormEditor> 
								</div>
								
								<div  className="modal-footer"> 
								  	<button type="button" className="btn btn-primary" onClick = {() => {this.onClickHandle()}}>{lang("Add")}</button>
							        <button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Close")}</button>
						        </div>
							</div>
						</div>
					</div>
				</div>
		)  
	}
}

FuncAdd.contextType = TableContext;
export default FuncAdd
	  