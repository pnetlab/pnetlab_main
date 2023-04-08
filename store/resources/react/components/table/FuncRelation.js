import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncRelation extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	}
	
	initial(){
		this.modal = this.table[this.props.modal];
		this.rowData = this.props.rowData;
	}
	
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
					 <div className="button" title={lang(this.props.title)} onClick={() => {
						 this.modal.loadData(this.rowData);
						 this.modal.modal();
					 }}>
					 	<i className={this.props.icon}></i>
					 </div>
					  
				 </div>
		)  
	}
}

FuncRelation.contextType = TableContext;
export default FuncRelation
	  