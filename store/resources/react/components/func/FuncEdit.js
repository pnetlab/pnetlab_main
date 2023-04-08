import React, { Component } from 'react'


class FuncEdit extends Component {
	
	
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
 	} 
	
	initial(){
		this.rowData = this.props.rowData;
		this.modal = this.table[this.props.id];
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
					 <div className="button btn btn-primary" style={{fontSize:14}} title="Edit Row" onClick={() => {
						 this.modal.loadData(this.rowData);
						 this.modal.modal();
					 }}>
					 	Edit
					 </div>
					  
				 </div>
		)  
	}
}

FuncEdit.contextType = TableContext;
export default FuncEdit
	  