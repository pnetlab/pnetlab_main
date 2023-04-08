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

class Notice_web extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.notice_web_struct = {};
	    this.notice_web_struct[STRUCT_FILTERS] = {}
	    this.notice_web_struct[STRUCT_COLUMNS] = {
	    		
	    				
                        [WEB_NOTICE_SUBMD5]:{
                            [COL_NAME]: lang(WEB_NOTICE_SUBMD5),
                            [COL_SORT]: true,
                            
                        },
                        
                        [WEB_NOTICE_UNAME]:{
                            [COL_NAME]: lang(WEB_NOTICE_UNAME),
                            [COL_SORT]: true,
                            
                        },
                        [WEB_NOTICE_RESULT]:{
                            [COL_NAME]: lang(WEB_NOTICE_RESULT),
                            [COL_SORT]: true,
                            
                        },
                        [WEB_NOTICE_TIME]:{
                            [COL_NAME]: lang(WEB_NOTICE_TIME),
                            [COL_SORT]: true,
                            [COL_DECORATOR_IN]: function(data){ if(data == '') return data; else return moment(data, 'X').format(DATE_FORMAT)},
		        	 [COL_STYLE]: {whiteSpace: 'nowrap'}
                        },
                        
			
			
	    }
	    this.notice_web_struct[STRUCT_FILTERS] = {
	    		
	    		[WEB_NOTICE_SUBMD5]:{
    			 	[FILTER_NAME]: lang(WEB_NOTICE_SUBMD5),
    			 	[FILTER_TYPE]:'text',
    			},
    			[WEB_NOTICE_UID]:{
    			 	[FILTER_NAME]: lang(WEB_NOTICE_UID),
    			 	[FILTER_TYPE]:'text',
    			},
    			[WEB_NOTICE_UNAME]:{
    			 	[FILTER_NAME]: lang(WEB_NOTICE_UNAME),
    			 	[FILTER_TYPE]:'text',
    			},
    			[WEB_NOTICE_RESULT]:{
    			 	[FILTER_NAME]: lang(WEB_NOTICE_RESULT),
    			 	[FILTER_TYPE]:'text',
    			},
    			[WEB_NOTICE_TIME]:{
    			 	[FILTER_NAME]: lang(WEB_NOTICE_TIME),
    			 	[FILTER_TYPE]:'date',
    			},
    			
			
	    }
	    
	    this.notice_web_struct[STRUCT_EDIT] = {
	    		
	    		[WEB_NOTICE_SUBSCRIPTION]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_SUBSCRIPTION),
    			 	[EDIT_TYPE]:'textarea',
    			},
    			[WEB_NOTICE_SUBMD5]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_SUBMD5),
    			 	[EDIT_TYPE]:'text',
    			},
    			[WEB_NOTICE_UID]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_UID),
    			 	[EDIT_TYPE]:'Number',
    			},
    			[WEB_NOTICE_UNAME]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_UNAME),
    			 	[EDIT_TYPE]:'text',
    			},
    			[WEB_NOTICE_RESULT]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_RESULT),
    			 	[EDIT_TYPE]:'text',
    			},
    			[WEB_NOTICE_TIME]:{
    			 	[EDIT_NAME]: lang(WEB_NOTICE_TIME),
    			 	[EDIT_TYPE]:'date',
    			},
    			
				
		    }
	    
	    this.notice_web_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
	    			   <FuncEdit key={1} rowData={rowData}/>
	    		]}
	    };
	    this.notice_web_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : NOTICE_WEB_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.permissionNotice_web(),
	            [DATA_KEY] : [WEB_NOTICE_ID],
	            [DATA_SORT] : {[WEB_NOTICE_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : true,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/notice/notice_web/filter',
	            [LINK_EDIT] : '/notice/notice_web/edit',
	            [LINK_ADD] : '/notice/notice_web/add',
	            [LINK_DELETE] : '/notice/notice_web/drop',
	            
	    };
	    
	    
	}
	
	permissionNotice_web(){
		return Object.assign(
			...Object.keys(this.notice_web_struct[STRUCT_COLUMNS]).map((k, i) => ({[k]: 'Read'})), 
			...Object.keys(this.notice_web_struct[STRUCT_EDIT]).map((k, i) => ({[k]: 'Write'})), 
		)
	}
	
	render () {
		  return(
			  <div>
				  <Table table = {this.notice_web_struct} autoload={true}>
				  	<FilterBar></FilterBar>
				  	<FuncBar 
					  	left = {<FuncHideCol/>}
					  	right = {<><FuncClear/><FuncRefresh/><FuncExport/></>}></FuncBar>
				  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
				  	<Pagination></Pagination>
				  	
				  </Table>
			  </div>
		  ); 
	  }
}

export default Notice_web