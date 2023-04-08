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
	    
	    if(!this.props.onSuccess){
	    	this.onSuccess = ()=>this.table.filter();
	    }else{
	    	this.onSuccess = this.props.onSuccess;
	    }
	   
	}
	
	componentWillUnmount(){
		this.table.children['FuncAdd'] = false;
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
				
				if(this.table[STRUCT_TABLE][DATA_ADD]){
					rowData = {...rowData, ...this.table[STRUCT_TABLE][DATA_ADD]}
				}
				this.addRow(this.form.getValue())
				
	    	  }
		});
	}
	
	addRow(rowData){
		this.table.addRow({rowData}).then(response =>{
			  if(response['result']){
				$("#add_row_modal"+this.id).modal('hide');
				this.table.filter();
	    	  }else{
	    		 error_handle(response);
	    	  }
		});
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		  this.initial();
		  var text = get(this.props.text, lang('Add'));
		  return(
				  <div className="table_function">
				  
					 <div className="button" title="Add Row" 
						onClick={()=>this.table.children['AddModal'].modal()} 
					 	style={{display: 'flex'}}>
					 	<i className="fa fa-plus-square"></i>&nbsp;{text}
					 </div>
					  
				</div>
		)  
	}
}

FuncAdd.contextType = TableContext;
export default FuncAdd
	  