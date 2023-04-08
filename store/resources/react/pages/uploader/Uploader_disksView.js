import React, { Component } from 'react'
import Table from '../../components/table/Table'
import FilterBar from '../../components/table/FilterBar'
import MainTable from '../../components/table/MainTable'
import Pagination from '../../components/table/Pagination'
import FuncBar from '../../components/table/FuncBar'

import FuncEdit from '../../components/table/FuncEdit'
import FuncAdd from '../../components/table/FuncAdd'
import FuncHideCol from '../../components/table/FuncHideCol'
import FuncDel from '../../components/table/FuncDel'
import FuncClear from '../../components/table/FuncClear'
import FuncRefresh from '../../components/table/FuncRefresh'
import FuncExport from '../../components/table/FuncExport'
import Config from '../../components/uploader/Config' 

class Uploader_disks extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.uploader_disks_struct = {};
	    this.uploader_disks_struct[STRUCT_FILTERS] = {}
	    this.uploader_disks_struct[STRUCT_COLUMNS] = {
	    		
	    				[DISK_NAME]:{
                            [COL_NAME]: lang(DISK_NAME),
                            [COL_SORT]: true,
                            
                        },
                        
                        [DISK_UPLOADER]:{
                            [COL_NAME]: lang(DISK_UPLOADER),
                            [COL_SORT]: true,
                            
                        },
                        
                        [DISK_TYPE]:{
                            [COL_NAME]: lang(DISK_TYPE),
                            [COL_SORT]: true,
                            
                        },
                        
                        [DISK_CONFIG]:{
                        	[COL_NAME]: lang(DISK_CONFIG),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN]: data => {
                            	var configs = JSON.parse(data);
                        		if(isset(configs)) {
                        			configs = Object.keys(configs).map((key)=>{return <div key={key} className="box_flex">
			                        				<div className="box_line" style={{flex:1}}>{key}</div>
			                        				<div>:&nbsp;</div>
			                        				<div title={configs[key]} className="box_line" style={{flex:2}}>{configs[key]}</div>
		                        				</div>});
                        		}else{
                        			configs = '';
                        		}
                        		return <div>{configs}</div>
                            }
                        },
                        
                        [DISK_WEIGHT]:{
                            [COL_NAME]: lang(DISK_WEIGHT),
                            [COL_SORT]: true,
                        },
                        
                        [DISK_TOTAL]:{
                            [COL_NAME]: lang(DISK_TOTAL),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN] : (data)=>{ if(isset(data)) return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')},
                            [COL_STYLE]: {whiteSpace: 'nowrap'}
                            
                        },
                        
                        [DISK_USED]:{
                            [COL_NAME]: lang(DISK_USED),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN] : (data)=>{if(isset(data)) return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')},
                            [COL_STYLE]: {whiteSpace: 'nowrap'}
                            
                        },
                        
                        [DISK_FREE]:{
                            [COL_NAME]: lang(DISK_FREE),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN] : (data)=>{ if(isset(data)) return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')},
                            [COL_STYLE]: {whiteSpace: 'nowrap'}
                            
                        },
                        
                        [DISK_ACTIVE]:{
                            [COL_NAME]: lang(DISK_ACTIVE),
                            [COL_SORT]: true,
                            
                        },
                        
                        [DISK_TARGET]:{
                            [COL_NAME]: lang(DISK_TARGET),
                            [COL_SORT]: true,
                            
                        }, 
			
			
	    }
	    this.uploader_disks_struct[STRUCT_FILTERS] = {
	    		
			    		[DISK_NAME]:{
		    			 	[FILTER_NAME]: lang(DISK_NAME),
		    			 	[FILTER_TYPE]:'text',
		    			},
		    			[DISK_UPLOADER]:{
		    			 	[FILTER_NAME]: lang(DISK_UPLOADER),
		    			 	[FILTER_TYPE]:'text',
		    			},
		    			[DISK_TYPE]:{
		    			 	[FILTER_NAME]: lang(DISK_TYPE),
		    			 	[FILTER_TYPE]:'select',
		    			},
		    			[DISK_WEIGHT]:{
		    			 	[FILTER_NAME]: lang(DISK_WEIGHT),
		    			 	[FILTER_TYPE]:'text',
		    			},
		    			[DISK_TOTAL]:{
		    			 	[FILTER_NAME]: lang(DISK_TOTAL),
		    			 	[FILTER_TYPE]:'text',
		    			},
		    			[DISK_USED]:{
		    			 	[FILTER_NAME]: lang(DISK_USED),
		    			 	[FILTER_TYPE]:'text',
		    			},
		    			[DISK_FREE]:{
		    			 	[FILTER_NAME]: lang(DISK_FREE),
		    			 	[FILTER_TYPE]:'text',
		    			},
		                     [DISK_ACTIVE]:{
		    			 	[FILTER_NAME]: lang(DISK_ACTIVE),
		    			 	[FILTER_TYPE]:'select',
		    			},
		    			[DISK_TARGET]:{
		    			 	[FILTER_NAME]: lang(DISK_TARGET),
		    			 	[FILTER_TYPE]:'select',
		    			},
			
	    }
	    
	    this.uploader_disks_struct[STRUCT_EDIT] = {
	    		
			    		[DISK_NAME]:{
		    			 	[EDIT_NAME]: lang(DISK_NAME),
		    			 	[EDIT_TYPE]:'text',
		    			},
		    			[DISK_UPLOADER]:{
		    			 	[EDIT_NAME]: lang(DISK_UPLOADER),
		    			 	[EDIT_TYPE]:'text',
		    			},
		    			[DISK_TYPE]:{
		    			 	[EDIT_NAME]: lang(DISK_TYPE),
		    			 	[EDIT_TYPE]:'select',
		    			},
		    			
		    			[DISK_WEIGHT]:{
		    			 	[EDIT_NAME]: lang(DISK_WEIGHT),
		    			 	[EDIT_TYPE]:'Number',
		    			},
		    			
		    			[DISK_ACTIVE]:{
		    			 	[EDIT_NAME]: lang(DISK_ACTIVE),
		    			 	[EDIT_TYPE]:'select',
		    			},
		    			[DISK_TARGET]:{
		    			 	[EDIT_NAME]: lang(DISK_TARGET),
		    			 	[EDIT_TYPE]:'select',
		    			},
				
		    }
	    
	    this.uploader_disks_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
	    			   <FuncEdit key={1} rowData={rowData}/> ,
	    			   <div title="Sync Files" className="button" onClick={()=>this.getFiles(rowData)} key={2}><i className="fa fa-exchange"></i></div>,
	    			   <div title="Configure" className="button" onClick={()=>{this.config.loadData(rowData); this.config.modal()}} key={3}><i className="fa fa-cog"></i></div>,
	    			   ]}
	    };
	    this.uploader_disks_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : UPLOADER_DISKS_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.permissionUploader_disks(),
	            [DATA_KEY] : [DISK_ID],
	            [DATA_SORT] : {[DISK_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : true,
	            [FLAG_SETTING_ROWS] : true,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/uploader/uploader_disks/filter',
	            [LINK_EDIT] : '/uploader/uploader_disks/edit',
	            [LINK_ADD] : '/uploader/uploader_disks/add',
	            [LINK_DELETE] : '/uploader/uploader_disks/drop',
	            [LINK_MAPPING] : '/uploader/uploader_disks/mapping',
	            
	    };
	    
	    
	}
	
	permissionUploader_disks(){
		return Object.assign(
			...Object.keys(this.uploader_disks_struct[STRUCT_COLUMNS]).map((k, i) => ({[k]: 'Read'})), 
			...Object.keys(this.uploader_disks_struct[STRUCT_EDIT]).map((k, i) => ({[k]: 'Write'})), 
		)
	}
	
	render () {
		  return(
			  <div>
				  <Table ref={table=>this.table = table} table = {this.uploader_disks_struct} autoload={true}>
				  	<FilterBar></FilterBar>
				  	<FuncBar 
					  	left = {<FuncHideCol/>}
					  	right = {<><FuncAdd/><FuncDel/><FuncClear/><FuncRefresh/><FuncExport/></>}></FuncBar>
				  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
				  	<Pagination></Pagination>
				  	<Config ref={config=>this.config=config}/>
				  </Table>
			  </div>
		  ); 
	  }
	
	
	getFiles(rowData){
		App.loading(true, 'Get Information...');
		axios.request ({
		    
			url: '/uploader/uploader_disks/getFiles',
		    method: 'post',
		    data:{
		    		[DISK_ID]: rowData[DISK_ID]
		    	}
			})
	      .then(response => {
	    	  App.loading(false);
	    	  response = response['data'];
	    	  if(response['result']){
	    		  Swal(response['message'], response['data'], 'success');
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	    	  
	      })
	      .catch((error)=>{
	    	  App.loading(false);
	    	  console.log(error);
	    	  Swal('Error', error, 'error');
	      })
	}
}

export default Uploader_disks