import React, { Component } from 'react'
import FilterItem from './FilterItem'

class Pagination extends Component {
	
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    
	    this.table.children['Pagination'+this.props.id] = this;
	    this.id = this.props.id;
	}
	
	initial(){
		this.page = {
				[PAGE_ACTIVE]: this.table[STRUCT_TABLE][PAGE_ACTIVE],
	    		[PAGE_QUANTITY]: this.table[STRUCT_TABLE][PAGE_QUANTITY],
	    		[PAGE_TOTAL]: Math.ceil(this.table[STRUCT_TABLE][PAGE_TOTAL]/this.table[STRUCT_TABLE][PAGE_QUANTITY])
		}
	}
	
	editCurrentPage(vector, interval){
		if(vector == 'up'){
			var newValue = Number(this.page[PAGE_ACTIVE]) + Number(interval)
			if(newValue > this.page[PAGE_TOTAL]) newValue = 1;
			if(newValue < 1) newValue = this.page[PAGE_TOTAL];
			
		}
		if(vector == 'down'){
			var newValue = Number(this.page[PAGE_ACTIVE]) - Number(interval)
			if(newValue > this.page[PAGE_TOTAL]) newValue = 1;
			if(newValue < 1) newValue = this.page[PAGE_TOTAL];
		}
		this.table[STRUCT_TABLE][PAGE_ACTIVE] = newValue;
		this.table.filter();
	}
	
	editNumberPage(event){
		var value = Number(event.target.innerText); 
		if(value <= 0 || value > 1000){
			event.target.innerText = this.table[STRUCT_TABLE][PAGE_QUANTITY];
			return;
		}
		
		if(value == this.table[STRUCT_TABLE][PAGE_QUANTITY]) return;
		this.table[STRUCT_TABLE][PAGE_QUANTITY] = value;
		this.table[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
		this.table.filter();
	}
	
	editPage(event){
		var value = Number(event.target.innerText); 
		if(value <= 0 || value > this.page[PAGE_TOTAL]){
			event.target.innerText = this.table[STRUCT_TABLE][PAGE_ACTIVE];
			return;
		}
		
		if(value == this.table[STRUCT_TABLE][PAGE_ACTIVE]) return;
		this.table[STRUCT_TABLE][PAGE_ACTIVE] = value;
		this.table.filter();
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		this.initial();
		if(!this.table[STRUCT_TABLE][DATA_TABLE] || count(this.table[STRUCT_TABLE][DATA_TABLE]) == 0){ return ('')};
		
		return(
				<>
				
				<div style={{display: 'flex'}}>

					<span className="page_break" style={{margin: 'auto auto auto 0px', display:'flex', alignItems: 'center'}}> 
						<i className="fa fa-angle-double-left forward_pre" onClick={()=>this.editCurrentPage('down', 10)}></i> 
						
						<span className="step step_pre" onClick={()=>this.editCurrentPage('down', 1)}>{lang('Period')}</span>
						
						<div className="current_page" suppressContentEditableWarning={true} style={{minHeight:15, minWidth:5}}
						contentEditable={true} onBlur={(event)=>this.editPage(event)}>{this.page[PAGE_ACTIVE]}</div>
						
						&nbsp;of&nbsp;
						
						<span className="total_page">{this.page[PAGE_TOTAL]}</span>&nbsp;
						<span className="step step_next" onClick={()=>this.editCurrentPage('up', 1)}>{lang('Next')}</span>
						
						<i className="fa fa-angle-double-right forward_next" onClick={()=>this.editCurrentPage('up', 10)}></i>
						
						<div style={{fontWeight:'bold'}}>{"Total: " + this.table[STRUCT_TABLE][PAGE_TOTAL]}</div>
					</span>
				
				<span style={{margin: "auto 0px auto auto"}}> 
				    <div style={{padding:5, border:'solid thin darkgray', minHeight:15, borderRadius:4}} 
				    suppressContentEditableWarning={true} contentEditable={true} onBlur={(event)=>this.editNumberPage(event)}>{this.page[PAGE_QUANTITY]}</div>
				</span>

			</div>
					
				</>
		);
	}
}

Pagination.contextType = TableContext;

export default Pagination
	  