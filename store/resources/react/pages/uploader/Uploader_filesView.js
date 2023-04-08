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

class Uploader_files extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.uploader_files_struct = {};
	    this.uploader_files_struct[STRUCT_FILTERS] = {}
	    this.uploader_files_struct[STRUCT_COLUMNS] = {
	    		
	    				[FILE_UPLOADER]:{
                            [COL_NAME]: lang(FILE_UPLOADER),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_DISK]:{
                            [COL_NAME]: lang(FILE_DISK),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_TABLE]:{
                            [COL_NAME]: lang(FILE_TABLE),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_COLUMN]:{
                            [COL_NAME]: lang(FILE_COLUMN),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_UID]:{
                            [COL_NAME]: lang(FILE_UID),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_NAME]:{
                            [COL_NAME]: lang(FILE_NAME),
                            [COL_SORT]: true,
                            
                        },
                        [FILE_PATH]:{
                            [COL_NAME]: lang(FILE_PATH),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN] : (colID, rowID, table)=>{
                            	var rowData = table[rowID];
                            	return <a 
	                            		download={rowData[FILE_NAME]} 
	                            		href={'/admin/'+rowData[FILE_TABLE]+'/uploader?action=Read&file='+rowData[FILE_PATH]}>
	                            		{rowData[FILE_PATH]}
                            		  </a>
                            }
                            
                        },
                        [FILE_SIZE]:{
                            [COL_NAME]: lang(FILE_SIZE),
                            [COL_SORT]: true,
                            
                        },
                        
			
			
	    }
	    this.uploader_files_struct[STRUCT_FILTERS] = {
	    		
	    		[FILE_ID]:{
    			 	[FILTER_NAME]: lang(FILE_ID),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_UPLOADER]:{
    			 	[FILTER_NAME]: lang(FILE_UPLOADER),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_DISK]:{
    			 	[FILTER_NAME]: lang(FILE_DISK),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_TABLE]:{
    			 	[FILTER_NAME]: lang(FILE_TABLE),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_COLUMN]:{
    			 	[FILTER_NAME]: lang(FILE_COLUMN),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_UID]:{
    			 	[FILTER_NAME]: lang(FILE_UID),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_PATH]:{
    			 	[FILTER_NAME]: lang(FILE_PATH),
    			 	[FILTER_TYPE]:'text',
    			},
    			[FILE_SIZE]:{
    			 	[FILTER_NAME]: lang(FILE_SIZE),
    			 	[FILTER_TYPE]:'text',
    			},
    			
			
	    }
	    
	    this.uploader_files_struct[STRUCT_EDIT] = {
	    		
	    		[FILE_UPLOADER]:{
    			 	[EDIT_NAME]: lang(FILE_UPLOADER),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_DISK]:{
    			 	[EDIT_NAME]: lang(FILE_DISK),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_TABLE]:{
    			 	[EDIT_NAME]: lang(FILE_TABLE),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_COLUMN]:{
    			 	[EDIT_NAME]: lang(FILE_COLUMN),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_UID]:{
    			 	[EDIT_NAME]: lang(FILE_UID),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_PATH]:{
    			 	[EDIT_NAME]: lang(FILE_PATH),
    			 	[EDIT_TYPE]:'text',
    			},
    			[FILE_SIZE]:{
    			 	[EDIT_NAME]: lang(FILE_SIZE),
    			 	[EDIT_TYPE]:'Number',
    			},
    			
				
		    }
	    
	    this.uploader_files_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
	    			   <FuncEdit key={1} rowData={rowData}/>
	    		]}
	    };
	    this.uploader_files_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : UPLOADER_FILES_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.permissionUploader_files(),
	            [DATA_KEY] : [FILE_ID],
	            [DATA_SORT] : {[FILE_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : true,
	            [FLAG_SETTING_ROWS] : true,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/uploader/uploader_files/filter',
	            [LINK_EDIT] : '/uploader/uploader_files/edit',
	            [LINK_ADD] : '/uploader/uploader_files/add',
	            [LINK_DELETE] : '/uploader/uploader_files/drop',
	            [LINK_UPLOAD] : '/uploader/uploader_files/uploader',
	            
	    };
	    
	    
	}
	
	permissionUploader_files(){
		return Object.assign(
			...Object.keys(this.uploader_files_struct[STRUCT_COLUMNS]).map((k, i) => ({[k]: 'Read'})), 
			...Object.keys(this.uploader_files_struct[STRUCT_EDIT]).map((k, i) => ({[k]: 'Write'})), 
		)
	}
	
	render () {
		  return(
			  <div>
				  <Table ref={table => this.table=table} table = {this.uploader_files_struct} autoload={true}>
				  	<FilterBar></FilterBar>
				  	<FuncBar 
					  	left = {<FuncHideCol/>}
					  	right = {<><FuncAdd/><FuncDel/><FuncClear/><FuncRefresh/><FuncExport/></>}></FuncBar>
				  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
				  	<Pagination></Pagination>
				  	
				  </Table>
			  </div>
		  ); 
	  }
}

export default Uploader_files