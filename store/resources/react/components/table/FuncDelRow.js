import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncDelRow extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	   
	}
	
	initial(){
		this.rowData = this.props.rowData;
	}
	
	onClickHandle(){
		var {key, value} = this.table.createKey(this.rowData);
		
		if(!value){
			Swal('Error', 'Can not create key', 'error');
			return;
		}
		
		this.table.delRow([value]).then( response=>{
			if(response['result']){
				this.table.filter()
			}else{
				error_handle(response);
			}
			
		});
	}
	
	
	
	render () {
		  this.initial();
		  return(
				 <div className="button" title={lang("Delete Row")} onClick={() => {this.onClickHandle()}}>
				 	<i className="fa fa-trash"></i>
				 </div>
		)  
	}
}

FuncDelRow.contextType = TableContext;
export default FuncDelRow
	  