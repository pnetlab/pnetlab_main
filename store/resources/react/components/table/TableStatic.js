import React, { Component } from 'react';
import Script from '../common/Script'
import Load from '../common/Load'
import (/* webpackMode: "eager" */ './responsive/table.scss')

class TableStatic extends Component {
	
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
            [DATA_KEY] : ['table_key'],
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
		
		if(!this.props.loadOrigin){
	    	this.loadOrigin = this.loadOrigin.bind(this);
	    }else{
	    	this.loadOrigin = this.props.loadOrigin;
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
	    
	    this.origin = [];
	    
	    
	    
	}
	
	
	setOrigin(tableData){
		this.origin = tableData.slice(0);
		this.indexOrigin();
		this.filter();
	}
	
	getOrigin(all=false){
		 var result = [];
		 for (let i in this.origin){
			 result[i] = {...this.origin[i]};
			 if(!all) delete(result[i]['table_key']);
		 }
		 return result;
	}
	
	indexOrigin(){
		for(let i in this.origin){
			this.origin[i]['table_key'] = i;
		}
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
	
	setFilter(filter){
		this[STRUCT_TABLE][DATA_FILTERS] = filter;
		this[STRUCT_TABLE][FLAG_FILTER_CHANGE] = true;
		this.filter();
	}
	//========================================
	filter(){
		
		var filterKey = {};
		
		var filterData = [];
		
		for (let i in this[STRUCT_TABLE][DATA_FILTERS]){
			var value = this[STRUCT_TABLE][DATA_FILTERS][i]
			var itemKey = [];
			for(let j in value['data']){
				if(value['data'][j][1] != ''){ 
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
		
		
		if(Object.keys(filterKey).length == 0){
			filterData = this.getOrigin(true);
		}else{
				
				filterData = this.getOrigin(true).filter((item)=>{
					var resultTotal = [];
					for (let i in filterKey){
						
						
						
						if(filterKey[i]['logic'] == 'and'){
							var result = true;
							for (let j in filterKey[i]['data']){
								if(!this.checkData(item[i], filterKey[i]['data'][j])){
									result = false;
									break;
								}
							}
							
						}else{
							var result = false;
							for (let j in filterKey[i]['data']){
								if(this.checkData(item[i], filterKey[i]['data'][j])){
									result = true;
									break;
								}
							}
						}
						
						if(this[STRUCT_TABLE][FLAG_FILTER_LOGIC] == 'and'){
							if(!result) return false;
						}else{
							if(result) return true;
						}
						
					}
					
					if(this[STRUCT_TABLE][FLAG_FILTER_LOGIC] == 'and'){
						return true;
					}else{
						return false;
					}
					
					
				});
				
		}
		
		if(Object.keys(this[STRUCT_TABLE][DATA_SORT]).length > 0){
			filterData = filterData.sort((a,b)=>{
				var result = 0;
				var sortIndex = 0;
				for (let i in this[STRUCT_TABLE][DATA_SORT]){
					if(a[i] == b[i]){
						continue;
					}else{
						if(Number(a[i]) && Number(b[i])){
							result = a[i]-b[i];
						}else{
							if(a[i]>b[i]){
								result = 1;
							}else{
								result = -1;
							}
						}
						sortIndex = i;
						break;
					}
				}
				if(this[STRUCT_TABLE][DATA_SORT][sortIndex] == 'asc'){
					return -result;
				}else{
					return result;
				}
					
			})
		}
		
		
		this[STRUCT_TABLE][PAGE_TOTAL] = filterData.length;
		var startIndex = (this[STRUCT_TABLE][PAGE_ACTIVE] - 1)*this[STRUCT_TABLE][PAGE_QUANTITY];
		this[STRUCT_TABLE][DATA_TABLE] = filterData.splice(startIndex, this[STRUCT_TABLE][PAGE_QUANTITY]);
		if(this.successFilter) this.successFilter({'result': true});
		this.reload();
	}
	
	
	checkData(data, condition){
		var logic = condition[0];
		var value = condition[1];
		if(logic == '=') return data == value;
		if(logic == '>') return data > value;
		if(logic == '>=') return data >= value;
		if(logic == '<') return data < value;
		if(logic == '<=') return data <= value;
		if(logic == 'contain'){
			if(typeof(data) != 'string') return false;
			return data.includes(value);
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
	
	addRow(rowDatas, loading=true){
		
		this.setOrigin(Object.values(rowDatas).concat(this.origin));
		if(this.successAdd) this.successAdd({'result': true});
		return Promise.resolve({'result': true});
		
	}
	
	editRow(editDatas, loading=true){
		
		var matchRow = [];
		for (let i in this.origin){
			 if(this.checkRow(this.origin[i], editDatas[DATA_KEY])){
				 matchRow.push(i);
			 }
		}
		
		for (let i in matchRow){
			for (let j in editDatas[DATA_EDITOR]){
				this.origin[matchRow[i]][j] = editDatas[DATA_EDITOR][j];
			}
		}
		if(this.successEdit) this.successEdit({'result': true});
		return Promise.resolve({result: true});
		
	}
	
	checkRow(row, conditions){
		var resultTotal = false;
		for (let i in conditions){
			var resultItem = true;
			for (let j in conditions[i]){
				if(row[j] != conditions[i][j]){
					resultItem = false;
					break;
				}
			}
			
			if(resultItem){
				resultTotal = true;
				break;
			}
		}
		return resultTotal;
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
			  title: 'Do you want to delete?',
			  text: "",
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
		 this.setOrigin(this.origin.filter((item)=>{
			 if(!this.checkRow(item, delKeys)){
				 return true;
			 }
			 return false;
		 }));
		 
		 this[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
		 if(this.successDel) this.successDel({'result': true});
		 
		 return Promise.resolve({result:true});
	}
	
	//================================
	
	readRow(dataKeys, loading=true, special={}){
		var result = this.origin.filter((item)=>{
			 if(!this.checkRow(item, delKeys)){
				 return true;
			 }
			 return false;
		 });
		 
		 return Promise.resolve({result:true, message:'Success', data: result});
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
  					this[STRUCT_EDIT][i][EDIT_OPTION] = {'':'', ...response[i]};
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
			this.loadOrigin([]);
		}
		
	}

	loadOrigin(dataKeys, loading=true, special={}){
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
				  this.setOrigin(response['data']);
				  this.filter();
				  if(this.props.onLoad) this.props.onLoad(response['data']);
		    	  
	    	  }
	    	  
	    	  return response;
	    	  
	    	  
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(true, 'Loading...');
	    	  error_handle(error)
	      })
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
export default TableStatic
	  
