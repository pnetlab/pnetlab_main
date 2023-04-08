import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncRefresh extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	   
	}
	
	render () {
		  return(
			 <div className="table_function">	  
				 <div className="button" title="Refresh" onClick={() => {
					 this.table[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true; 
					 this.table[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
					 this.table.filter()}} style={{display: 'flex'}}>
				 	<i className="fa fa-refresh"></i>&nbsp;Refresh
				 </div>
			 </div>
		)  
	}
}

FuncRefresh.contextType = TableContext;
export default FuncRefresh
	  