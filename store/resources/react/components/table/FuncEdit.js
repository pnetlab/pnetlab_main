import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncEdit extends Component {
	
	
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	   
	}
	
	initial(){
		this.rowData = this.props.rowData;
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
					 <div className="button" title="Edit Row" onClick={() => {
						 this.table.children['EditModal'].loadData(this.rowData);
						 this.table.children['EditModal'].modal();
					 }}>
					 	<i className="fa fa-edit"></i>
					 </div>
					  
				 </div>
		)  
	}
}

FuncEdit.contextType = TableContext;
export default FuncEdit
	  