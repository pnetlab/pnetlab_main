import React, { Component } from 'react';
import Script from '../common/Script'
import Load from '../common/Load'
import (/* webpackMode: "eager" */ './responsive/table.scss')

class Table extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this[STRUCT_FILTERS] = {}; 
	    this[STRUCT_COLUMNS] = {}; 
	    this[STRUCT_CELLS] = {}; 
	    this[STRUCT_ROWS] = {}; 
	    this[STRUCT_TABLE] = []; 
	    this[STRUCT_EDIT] = {}; 
	    
	    this[STRUCT_TABLE]= {
            [DATA_HIDDEN_COL] : {},
            [DATA_PERMIT_COL] : this[STRUCT_EDIT],
            [DATA_SELECT_ROWS]: {},
            [DATA_FILTERS]: {},
            [DATA_SPECIAL]: {},
            [FLAG_FILTER_LOGIC] : 'and',
            [FLAG_FILTER_CHANGE] : true,
            [FLAG_MULTI_SORT] : false,
            [FLAG_RESIZABLE] : true,
            [FLAG_SELECT_ROWS] : true,
            [FLAG_SETTING_ROWS] : true,
            [FLAG_EXPAND_ROWS] : false,
            [FLAG_ROW_INDEX] : true,
            [PAGE_ACTIVE] : 1,
            [PAGE_TOTAL] : 0,
            [PAGE_QUANTITY] : 25,
	    };
	    
	    
	    //Allow custom update function
	    
	    if(!this.props.upload){
	    	this.upload = this.uploadData.bind(this);
	    }else{
	    	this.upload = this.props.upload;
	    }
	    
	    if(!this.props.filter){
	    	this.filter = this.filter.bind(this);
	    }else{
	    	this.filter = this.props.filter;
	    }
	    
	    if(!this.props.delRow){
	    	this.delRow = this.delRow.bind(this);
	    }else{
	    	this.delRow = this.props.delRow;
	    }
	    
	    if(!this.props.addRow){
	    	this.addRow = this.addRow.bind(this);
	    }else{
	    	this.addRow = this.props.addRow;
	    }
	    
	    if(!this.props.editRow){
	    	this.editRow = this.editRow.bind(this);
	    }else{
	    	this.editRow = this.props.editRow;
	    }
	    
	    this.successEdit = this.props.successEdit;
	    this.successAdd = this.props.successAdd;
	    this.successDel = this.props.successDel;
	    this.successFilter = this.props.successFilter;
	    this.successMapping = this.props.successMapping;
	                                                                                                                                                                                                                                                                                     
	    this.table = get(this.props.table, {});
	    
	    
	    // inital hidden cols status
	    this.defaultHidenCol = {...this.table[STRUCT_TABLE][DATA_HIDDEN_COL]};
	    this.loadHidenCol();
	    this.initial();
	    this.children = {};
	    this.mapping = {};
	    this.model = this.props.model;
	}
	
	//==========common function=========================
	
	createKey(rowData){
		var key = '';
		var value = {};
		for(let i in this[STRUCT_TABLE][DATA_KEY]){
			key += rowData[this[STRUCT_TABLE][DATA_KEY][i]];
			if(!isset(rowData[this[STRUCT_TABLE][DATA_KEY][i]])) return false;
			value[this[STRUCT_TABLE][DATA_KEY][i]] = rowData[this[STRUCT_TABLE][DATA_KEY][i]];
		}
		return {key, value};
	}
	
	
	//==================================================
	
	loadHidenCol(){
		this.hiddenCol = JSON.parse(
		    		localStorage.getItem(this.table[STRUCT_TABLE][DATA_TABLE_ID]+DATA_HIDDEN_COL));
	    if(this.hiddenCol != null) {
	    	this.table[STRUCT_TABLE][DATA_HIDDEN_COL] = this.hiddenCol;
	    }else{
	    	this[STRUCT_TABLE][DATA_HIDDEN_COL] = {...this.defaultHidenCol};
	    }
	    
	}
	
	initial(){
		
		for(let i in this.table){
			this[i] = {...this[i], ...this.table[i]};
		}
		
	}
	
	setOrigin(){
		
	}
	
	setFilter(filter){
		this[STRUCT_TABLE][DATA_FILTERS] = filter;
		this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
		this.filter();
	}
	//========================================
	filter(special={}, loading=true){
		
		var filterKey = {};
		
		for (let i in this[STRUCT_TABLE][DATA_FILTERS]){
			var value = this[STRUCT_TABLE][DATA_FILTERS][i]
			var itemKey = [];
			for(let j in value['data']){
				if(value['data'][j][1] !== ''){ 
					itemKey.push(value['data'][j]);
				}
			}
			if(itemKey.length > 0){
				filterKey[i] = {
						'logic' : value['logic'],
						'data' : itemKey
				};
			}
		}
		
		var filterData ={};
		filterData[PAGE_ACTIVE] = this[STRUCT_TABLE][PAGE_ACTIVE];
	    filterData[PAGE_QUANTITY] = this[STRUCT_TABLE][PAGE_QUANTITY];
	    filterData[PAGE_TOTAL] = this[STRUCT_TABLE][PAGE_TOTAL];
	    filterData[FLAG_FILTER_CHANGE] = this[STRUCT_TABLE][FLAG_FILTER_CHANGE];
	    filterData[FLAG_FILTER_LOGIC] = this[STRUCT_TABLE][FLAG_FILTER_LOGIC];
	    filterData[DATA_SORT] = this[STRUCT_TABLE][DATA_SORT];
	    filterData[DATA_FILTERS] = filterKey;
	    
	    if(loading) App.loading(true, 'Loading...');
	    this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = false;
		return axios.request ({
		    url: this[STRUCT_TABLE][LINK_FILTER],
		    method: 'post',
		    data:{
			    	data: filterData,
			    	...this[STRUCT_TABLE][DATA_SPECIAL],
			    	...special
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
    		  this.filterSuccess(response);
	    	  if(this.successFilter) this.successFilter(response);
	    	  return response;
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(false, 'Loading...');
	    	  error_handle(error);
	      })
		
		
	}
	
	filterSuccess(response = null){
		
		if(!response) return;
		if(response['result']){
		    var data = response['data'];
		    this[STRUCT_TABLE][DATA_TABLE] = data[DATA_TABLE];
		    this[STRUCT_TABLE][PAGE_TOTAL] = data[PAGE_TOTAL];
	    	this[STRUCT_TABLE][PAGE_ACTIVE] = data[PAGE_ACTIVE];
	    	this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = false;
	    	if(response['message']['mapping']){
	    		this.setMapping(response['message']['mapping']);
	    	}
	    	this.reload();
	        
	    }else{
	    	error_handle(response);
	    }
	}
	
	clearFilter(){
		this[STRUCT_TABLE][DATA_FILTERS] = {};
		this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
		this.filter();
	}
	
	//===========================================================
		
	async uploadData(rowData){
		var result = true;
		for (let i in this[STRUCT_EDIT]){
			if(this[STRUCT_EDIT][i][EDIT_TYPE] == 'file' || this[STRUCT_EDIT][i][EDIT_TYPE] == 'image'){
				if(rowData.items[i]){
					result = result && (await rowData.items[i].getInput().upload());
				}
				
			}
		}
		return result;
	}
	
	addRow(rowDatas, loading=true, special = {}){
		if(loading) App.loading(loading, 'Adding...');
		return axios.request ({
		    url: this[STRUCT_TABLE][LINK_ADD],
		    method: 'post',
		    data:{
			    	data: rowDatas,
			    	...this[STRUCT_TABLE][DATA_SPECIAL],
			    	...special,
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Adding...');
	    	  this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
	    	  response = response['data'];
	    	  if(this.successAdd) this.successAdd(response);
	    	  return response;
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(false, 'Adding...');
	    	  error_handle(error)
	      })
		
	}
	
	editRow(editDatas, loading=true, special = {}){
		if(loading) App.loading(true, 'Editting...');
		return axios.request ({
		    url: this[STRUCT_TABLE][LINK_EDIT],
		    method: 'post',
		    data:{
			    	data: editDatas,
			    	...this[STRUCT_TABLE][DATA_SPECIAL],
			    	...special,
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Editting...');
	    	  this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
	    	  response = response['data'];
	    	  if(this.successEdit) this.successEdit(response);
	    	  return response;
	      })
	      
	      .catch(function (error) {
	    	  App.loading(false, 'Editting...');
	    	  error_handle(error)
	      })
		
	}
	
	//=========================================================
	delRow(delKeys, alert = true, special={}){
		
		if(delKeys.length == 0){
			Swal('Error', 'Select rows you want to delete', 'error');
			return Promise.reject();
		}
		
		if(alert){
			return this.deleteAlert().then(result => {
				if(result){
					return this.deleteQuery(delKeys, true, special)
				}else{
					return Promise.reject();
				}
			})
		}
		else{
			return this.deleteQuery(delKeys, false, special)
		}
		
		

	}
	
	deleteAlert(){
		return Swal({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
			  return result.value;
			})
	}
	
	deleteQuery(delKeys, loading=true, special={}){
		 if(loading) App.loading(true, 'Deleting...');
			return axios.request ({
			    url: this[STRUCT_TABLE][LINK_DELETE],
			    method: 'post',
			    data:{
				    	data: delKeys,
				    	...this[STRUCT_TABLE][DATA_SPECIAL],
				    	...special,
			    	}
				})
				
		      .then(response => {
		    	  App.loading(false, 'Deleting...');
		    	  this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
		    	  response = response['data'];
		    	  
		    	  if(response['result']){
			    	  this[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
			    	  if(this.successDel) this.successDel(response);
		    	  }
			    	  
			      return response;
		    	  
		    	  
		      })
		      
		      .catch(function (error) {
		    	  App.loading(false, 'Deleting...');
		    	  error_handle(error)
		      })
	}
	
	//================================
	
	readRow(dataKeys, loading=true, special={}){
		if(loading) App.loading(true, 'Loading...');
		return axios.request ({
		    url: this[STRUCT_TABLE][LINK_READ],
		    method: 'post',
		    data:{
			    	data: dataKeys,
			    	...this[STRUCT_TABLE][DATA_SPECIAL],
			    	...special
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
	    	  
	    	  if(response['result']){
	    		  if(response['message']['mapping']){
	    			  this.setMapping(response['message']['mapping']);
	    		  }
	    		  if(this.successRead) this.successRead(response);
		    	  
	    	  }
	    	  
	    	  return response;
	    	  
	    	  
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(true, 'Loading...');
	    	  error_handle(error)
	      })
	}
	
	reload(){
		for(let i in this.children){
			if(this.children[i]){
				if(this.children[i].reload){
					this.children[i].reload();
				}else{
					this.children[i].forceUpdate();
				}
			} 
		}
	}
	
	map(){
		
		if(this[STRUCT_TABLE][LINK_MAPPING]){
			return axios.request ({
			    url: this[STRUCT_TABLE][LINK_MAPPING],
			    method: 'post',
			    data:{
			    	...this[STRUCT_TABLE][DATA_SPECIAL],
			    }
			})
				
		      .then(response => {
		    	  
		    	  response = response['data'];
		    	  
		    	  if(response['result']){
		    		  this.setMapping(response['data']);
		    	  }
		    	  
		    	  return response;
		    	  
		    	  if(this.successMapping) this.successMapping(response);
		    	  
		      })
		      
		      .catch(function (error) {
		    	  console.log(error);
		      })
		}
	}
	
	
	setMapping(response){
	   
  	  for (let i in response){
  		  	this.mapping[i] = response[i];
  		  	
  			if(isset(this[STRUCT_COLUMNS][i])){
  				this[STRUCT_COLUMNS][i][COL_OPTION] = response[i];
  			}
  			
  			if(isset(this[STRUCT_EDIT][i])){
  				if(this[STRUCT_EDIT][i][EDIT_TYPE] == 'select'){
  					this[STRUCT_EDIT][i][EDIT_OPTION] = {'':`--Select ${lang(this[STRUCT_EDIT][i][EDIT_NAME])}--`, ...response[i]};
  				}else{
  					this[STRUCT_EDIT][i][EDIT_OPTION] = response[i];
  				}
  				
  			}
  			
  			if(isset(this[STRUCT_FILTERS][i])){
  				if(this[STRUCT_FILTERS][i][FILTER_TYPE] == 'select' || this[STRUCT_FILTERS][i][FILTER_TYPE] == 'check'){
  					this[STRUCT_FILTERS][i][FILTER_OPTION] = {'':lang('All'), ...response[i]};
  				}else{
  					this[STRUCT_FILTERS][i][FILTER_OPTION] = response[i];
  				}
  			}
  	  }
  	  
  	  this.reload();
	}
	
	componentDidMount(){
		
		if(this.props.autoload){
			this.map();
			this.filter();
		}
		
	}
	
	render () {
		
		return(
				<>
					
					<TableContext.Provider value={this}>
						<div className="table" style={this.props.style}>
							{this.props.children}
						</div>
					</TableContext.Provider> 
					
				</>
		  );
	}
}


if(!global.TableContext) global.TableContext = React.createContext();
export default Table 
	  
