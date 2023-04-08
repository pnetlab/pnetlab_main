import React, { Component } from 'react'
import FilterItem from './FilterItem'

class FilterBar extends Component {
	
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FilterBar'+this.props.id] = this;
	    this.id = this.props.id;
	    this.filter_item = {};
	}
	
	initial(){
		this.struct = get(this.table[STRUCT_FILTERS], []);
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		this.hideCol = this.table[STRUCT_TABLE][DATA_HIDDEN_COL];
	}
	
	drawFilterItem(){
		
		var filterItems = [];
		for(let i in this.struct){
			if(!this.permitCol[i]) continue; 
			if(this.hideCol[i] && !this.struct[i][FILTER_FIXED]) continue;
			filterItems.push(
					<FilterItem ref={input=>this.filter_item[i] = input} colID={i} onChangeBlur={()=>this.onChangeBlurHandle()} key={'filter'+i} struct = {this.struct[i]}/>
			)
		}
		return filterItems 
	}
	
	loadFilter(){
		for (let i in this.filter_item){
			if(isset(this.filter_item[i])){
				if(isset(this.table[STRUCT_TABLE][DATA_FILTERS][i])){
					this.filter_item[i].setValue(this.table[STRUCT_TABLE][DATA_FILTERS][i]);
				}else{
					this.filter_item[i].setValue(null);
				}
			}
			
		}
	}
	
	onChangeBlurHandle(){
		this.table.setFilter(this.getValue());
	}
	
	getValue(){
		var values = {};
		for (let i in this.filter_item){
			if(!this.filter_item[i]) continue;
			values[i] = this.filter_item[i].getValue();
		}
		return values;
	}
	
	componentDidUpdate(){
		this.loadFilter();
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		this.initial();
		if(Object.keys(this.struct).length == 0) return '';
		return(
				<>
					<div className="filter_bar">
						{this.drawFilterItem()}
					</div>
				</>
		);
	}
}

FilterBar.contextType = TableContext;

export default FilterBar
	  