import React, { Component } from 'react'

class FuncFreq extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	   
	}
	
	initial(){
		
	}
	
	onClickHandle(){
		
		if(count(this.props.phones) == 0) return;
		var addData = [];
		for (let i in this.props.phones){
			addData.push({[CUS_PHONE] : this.props.phones[i]});
		}
		
		this.table.addRow(addData, (response)=>{
			
			if(response['result']){
				this.table.children.MainTable.clearSelect();
				this.table.filter()
			}else{
				Swal(response['message'], response['data'], 'error');
			}
			
		});
	}
	
	render () {
		  this.initial();
		  return(
				  <div className="table_function"> 
				  
					 <div className="button" title="Làm các số hiển thị lại" onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	<i className="fa fa-arrow-up"></i>&nbsp;Nổi lại
					 </div>
					  
				</div>
		)  
	}
}

FuncFreq.contextType = TableContext;
export default FuncFreq
	  