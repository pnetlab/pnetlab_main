import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncPer extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	   
	}
	
	initial(){
		this.rowData = this.props.rowData;
	}
	
	onClickHandle(){
		
	}
	
	render () {
		  this.initial();
		  var {key, value} = this.table.createKey(this.rowData);
		  return(
				<div>
				  
					 <a href={"/admin/authz_pro/view?key="+JSON.stringify(value)}><div className="button" title="Set permission">
					 	<i className="fa fa-address-card"></i>
					 </div></a>
					  
				</div>
		)  
	}
}

FuncPer.contextType = TableContext;
export default FuncPer
	  