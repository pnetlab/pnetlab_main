import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncClear extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID];
	   
	}
	
	initial(){
	}
	
	onClickHandle(){
		this.table.clearFilter();
	}
	
	render () {
		  this.initial();
		  return(
				  <div className="table_function">
				  
					 <div className="button" title={lang("Clear filter")} onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-filter"></i>&nbsp;{lang('Clear Filter')}
					 </div>
					  
				</div>
		)  
	}
}

FuncClear.contextType = TableContext;
export default FuncClear
	  