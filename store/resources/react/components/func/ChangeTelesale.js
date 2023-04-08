import React, { Component } from 'react'

class ChangeTelesale extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	}
	
	initial(){
		
	}
	
	onclickHandle(){
		var selectRow = this.table[STRUCT_TABLE][DATA_SELECT_ROWS];
		if(count(selectRow) == 0){
			 Swal('Error', lang('Please select at least 1'), 'error');
			 return;
		}
		this.table[this.props.modal].modal();
		this.table[this.props.modal].setCustomerList(selectRow);
		
	}
	
	
	render () {
		  this.initial();
		  return(
				  <div className="table_function">
					 <div className="button" title={lang('Select telesale')} onClick={() => {this.onclickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-headphones"></i>&nbsp;Telesale
					 </div>
				 </div>
		)  
	}
}

ChangeTelesale.contextType = TableContext;
export default ChangeTelesale
	  