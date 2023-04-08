import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncDel extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	   
	}
	
	initial(){
		this.struct = {};
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		for(let i in this.permitCol){
			if(!this.table[STRUCT_EDIT][i]) continue;
			this.struct[i] = this.table[STRUCT_EDIT][i];
		}
	}
	
	onClickHandle(){
		var delKeys = [];
		var dataSelect = this.table[STRUCT_TABLE][DATA_SELECT_ROWS];
		this.table.delRow(dataSelect).then(response =>{
			if(response['result']){
				this.table.filter();
			}else{
				error_handle(response);
			}
			
		});
	}
	
	render () {
		  this.initial();
		  return(
				  <div className="table_function"> 
				  
					 <div className="button" title={lang("Delete Row selected")} onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-trash"></i>&nbsp;{lang('Delete')}
					 </div>
					  
				</div>
		)  
	}
}

FuncDel.contextType = TableContext;
export default FuncDel
	  