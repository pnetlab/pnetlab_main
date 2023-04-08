import React, { Component } from 'react'
import Table from '../table/Table'
import FilterBar from '../table/FilterBar'
import MainTable from '../table/MainTable'
import Pagination from '../table/Pagination'
import FuncBar from '../table/FuncBar'
import FuncRefresh from '../table/FuncRefresh'

class ChangeTelesaleModal extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['ChangeTelesaleModal'+this.props.id] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.rowData = {};
	    this.table[this.props.id] = this;
	    this.customerList = [];
	    this.selectGroup = '';
	    this.state = {
	    		groups : {}
	    }
	    
	    this.userTb = {};
	    this.userTb[STRUCT_FILTERS] = {}
	    this.userTb[STRUCT_COLUMNS] = {
			
			[AUTHEN_USERNAME]:{
				[COL_NAME]: lang(AUTHEN_USERNAME),
				[COL_SORT]:true,
			},
			
			[AUTHEN_EMAIL]:{
			 	[COL_NAME]: lang(AUTHEN_EMAIL),
			 	[COL_SORT]:true,
			},
			
			[AUTHEN_PHONE]:{
				[COL_NAME]: lang(AUTHEN_PHONE),
				[COL_SORT]:true,
			},
			
	    }
	    this.userTb[STRUCT_FILTERS] = {
    		[AUTHEN_USERNAME]:{
			 	[FILTER_NAME]: lang(AUTHEN_USERNAME),
			 	[FILTER_TYPE]:'text',
			},
			
			[AUTHEN_EMAIL]:{
			 	[FILTER_NAME]: lang(AUTHEN_EMAIL),
			 	[FILTER_TYPE]:'text',
			},
			
			[AUTHEN_PHONE]:{
				[FILTER_NAME]: lang(AUTHEN_PHONE),
				[FILTER_TYPE]:'text',
			},
			
	    }
	    
	    this.userTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : AUTHEN_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : {...this.userTb[STRUCT_COLUMNS]},
	            [DATA_KEY] : [AUTHEN_ID],
	            [DATA_SORT] : {[AUTHEN_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : true,  
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/admin/users/filter',
	    };
	}
	
	
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#edit_row_modal"+this.id).modal('hide');
		}else{
			$("#edit_row_modal"+this.id).modal();
			this.loadGroups();
		}
	}
	
	loadGroups(){
		axios.request ({
		    url: '/admin/group/getChildGroup',
		    method: 'post',
		    data:{}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.setState({
		    		  groups: response['data']
		    	  })
	    	  }
	    	 
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  error_handle(error)
	      })
	}
	
	setCustomerList(selectRow){
		this.customerList = [];
		for (let i in selectRow){
			this.customerList.push({[CUS_ID]: selectRow[i][CUS_ID]})
		}
	}
	
	onClickHandle(){
		if(this.selectGroup == 'return'){
			var telesale = null;
			var group = this.props.powerGroup[GROUP_ID];
		}else{
			var dataSelect = this.userTable[STRUCT_TABLE][DATA_SELECT_ROWS];
			if(count(dataSelect) != 1){
				Swal('Error', lang('Please select only one'), 'error');
				return;
			}
			dataSelect = dataSelect[Object.keys(dataSelect)[0]];
			
			var telesale = dataSelect[AUTHEN_ID];
			var group = this.selectGroup;
		}
		
		var dataEdit = {
				[DATA_KEY]: this.customerList,
				[DATA_EDITOR]: {
					[CUS_TELESALE] : telesale,
					[CUS_GROUP] : group,
				},
		}
		
		this.table.editRow(dataEdit, (response = null)=>{
			  if(response['result']){
				this.modal('hide');
				this.table[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
				this.table.filter();
				
	    	  }else{
	    		 Swal(response['message'], response['data'], 'error');
	    	  }
		});
		
	}
	
	render () {
			
		var groupOptions = [];
		groupOptions.push(<option value='' key={-1}>{'-- '+lang('Select group')+' --'}</option>);
		groupOptions.push(<option value='return' key={-2}>{'-- '+lang('Thu hồi')+' --'}</option>);
		for(let i in this.state.groups){
			var group = this.state.groups[i];
			groupOptions.push(<option value={group[GROUP_ID]} key={i}>{group[GROUP_NAME]}</option>)
		}
		
		var tableUser = '';
		if(this.selectGroup != ''){
			tableUser = <Table ref={table => this.userTable = table} table = {this.userTb} autoload={true}>
						  	<FilterBar></FilterBar>
						  	<FuncBar 
							  	right = {<><FuncRefresh/></>}>
						  	</FuncBar>
						  	
						  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
						  	<Pagination></Pagination>
					  	
					  	</Table>
		}
		
		  return(
				<div className="modal fade" id={"edit_row_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{lang('Select telesale')}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
							
								<select style={{padding: 5}} onChange={(event)=>{
									
									this.selectGroup = event.target.value; 
									if (this.selectGroup == 'return') return;
									if(this.userTable){
										this.userTable[STRUCT_TABLE][DATA_SPECIAL] = {[GROUP_ID]: this.selectGroup };
										this.userTable[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
										this.userTable.filter();
									}else{
										this.userTb[STRUCT_TABLE][DATA_SPECIAL] = {[GROUP_ID]: this.selectGroup };
										this.forceUpdate(); 
									}
								}}>
									{groupOptions}
								</select>
								
								{tableUser}
							
							</div>
							
							<div  className="modal-footer"> 
							  	<button type="button" className="btn btn-primary" onClick = {() => {this.onClickHandle()}}>{this.props.button}</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					        </div>

						</div>
					</div>
				</div>
		)  
	}
}
ChangeTelesaleModal.contextType = TableContext;
export default ChangeTelesaleModal
	  