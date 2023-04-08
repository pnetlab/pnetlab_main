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
import EditRoleModal from '../../components/admin/user/EditRoleModal'

class User_roles extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.user_roles_struct = {};
	    this.user_roles_struct[STRUCT_FILTERS] = {}
	    this.user_roles_struct[STRUCT_COLUMNS] = {
	    		
	    		[USER_ROLE_NAME]:{
					[COL_NAME]: lang(USER_ROLE_NAME),
					[COL_SORT]: true,
					
				},
				
				[USER_ROLE_WORKSPACE]:{
					[COL_NAME]: lang(USER_ROLE_WORKSPACE),
					[COL_SORT]: false,
					[COL_DECORATOR_IN]:function(data){return HtmlDecode(data)},
					[COL_STYLE]: {whiteSpace: 'nowrap'}
				},
				[USER_ROLE_CPU]:{
					[COL_NAME]: lang(USER_ROLE_CPU),
					[COL_SORT]: true,
					[COL_STYLE]: {textAlign:'center'},
					[COL_DECORATOR_IN]:function(data){return <b>{data}%</b>}
				},
				[USER_ROLE_RAM]:{
					[COL_NAME]: lang(USER_ROLE_RAM),
					[COL_SORT]: true,
					[COL_STYLE]: {textAlign:'center'},
					[COL_DECORATOR_IN]:function(data){return <b>{data}%</b>}
				},
				[USER_ROLE_HDD]:{
					[COL_NAME]: lang(USER_ROLE_HDD),
					[COL_SORT]: true,
					[COL_STYLE]: {textAlign:'center'},
					[COL_DECORATOR_IN]:function(data){return <b>{data}MB</b>}
				},

				[USER_ROLE_NOTE]:{
					[COL_NAME]: lang(USER_ROLE_NOTE),
					[COL_SORT]: false,
				},
                        
			
			
	    }
	    this.user_roles_struct[STRUCT_FILTERS] = {
	    		
	    		[USER_ROLE_NAME]:{
    			 	[FILTER_NAME]: lang(USER_ROLE_NAME),
    			 	[FILTER_TYPE]:'text',
    			},
    			
			
	    }
	    
	    this.user_roles_struct[STRUCT_EDIT] = {
	    		
	    		[USER_ROLE_NAME]:{
    			 	[EDIT_NAME]: lang(USER_ROLE_NAME),
    			 	[EDIT_TYPE]:'text',
    			},
    			[USER_ROLE_WORKSPACE]:{
    			 	[EDIT_NAME]: lang(USER_ROLE_WORKSPACE),
    			 	[EDIT_TYPE]:'textarea',
    			},
    			[USER_ROLE_NOTE]:{
    			 	[EDIT_NAME]: lang(USER_ROLE_NOTE),
    			 	[EDIT_TYPE]:'textarea',
    			},
    			
				
		    }
	    
	    this.user_roles_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
						<div key={1} className="button box_flex" title="Edit Row" onClick={()=>{
							this.editRoleModal.modal()
							this.editRoleModal.setRoleID(rowData[USER_ROLE_ID])
						}} >
							<i className="fa fa-edit"></i>
						</div>
	    		]}
	    };
	    this.user_roles_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : USER_ROLES_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.permissionUser_roles(),
	            [DATA_KEY] : [USER_ROLE_ID],
	            [DATA_SORT] : {[USER_ROLE_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : true,
	            [FLAG_SETTING_ROWS] : true,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/store/public/admin/user_roles/filter',
	            [LINK_EDIT] : '/store/public/admin/user_roles/edit',
	            [LINK_ADD] : '/store/public/admin/user_roles/add',
	            [LINK_DELETE] : '/store/public/admin/user_roles/drop',
	            [LINK_UPLOAD] : '/store/public/admin/user_roles/uploader',
	            
	    };
	    
	    
	}
	
	permissionUser_roles(){
		return Object.assign(
			...Object.keys(this.user_roles_struct[STRUCT_COLUMNS]).map((k, i) => ({[k]: 'Read'})), 
			...Object.keys(this.user_roles_struct[STRUCT_EDIT]).map((k, i) => ({[k]: 'Write'})), 
		)
	}
	
	render () {
		  return(
			  <div className='box_padding'>
				  <Table table = {this.user_roles_struct} autoload={true}>
				  	<FilterBar></FilterBar>
				  	<FuncBar 
					  	left = {<FuncHideCol/>}
					  	right = {<>
						  	<div className="table_function">
								<div className="button box_flex" title="Add Row" onClick={()=>{
									this.editRoleModal.modal()
									this.editRoleModal.setRoleID(null)
								}} >
									<i className="fa fa-plus-square"></i>&nbsp;{lang('Add')}
								</div>
							</div>  
						  	<FuncDel/><FuncClear/><FuncRefresh/><FuncExport/></>}></FuncBar>
				  	<MainTable className='table table-bordered table-resizable'></MainTable>
				  	<Pagination></Pagination>
					<EditRoleModal ref={c => this.editRoleModal = c}></EditRoleModal>
				  	
				  </Table>
			  </div>
		  ); 
	  }
}

export default User_roles