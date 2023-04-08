import React, { Component } from 'react'
import InputDate from '../input/InputDate' 
import InputTextarea from '../input/InputTextarea' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable'
import FuncEdit from '../table/FuncEdit'
import FuncDelRow from '../table/FuncDelRow'

class FuncStatusModal extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.props.id;
	    
	    this.table[this.id] = this;
	    
	    this.cus_update_struct = {};
	    this.cus_update_struct[STRUCT_COLUMNS] = {
	    		
	    		
                [CUS_UPDATE_UNAME]:{
                    [COL_NAME]: lang(CUS_UPDATE_UNAME),
                    [COL_SORT]: true,
                },
                [CUS_UPDATE_TIME]:{
                    [COL_NAME]: lang(CUS_UPDATE_TIME),
                    [COL_SORT]: true,
                    [COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
                    [COL_STYLE]: {whiteSpace: 'nowrap'}
                },
                [CUS_UPDATE_NOTE]:{
                    [COL_NAME]: lang(CUS_UPDATE_NOTE),
                    [COL_SORT]: false,
                    [COL_DECORATOR_IN]:function(data){return HtmlDecode(data)}
                },
			
	    }
	    
	    this.cus_update_struct[STRUCT_EDIT] = {
	    		
	    		[CUS_UPDATE_UID]:{
    			 	[EDIT_NAME]: lang(CUS_UPDATE_UID),
    			 	[EDIT_TYPE]:'Number',
    			},
    			[CUS_UPDATE_UNAME]:{
    			 	[EDIT_NAME]: lang(CUS_UPDATE_UNAME),
    			 	[EDIT_TYPE]:'text',
    			},
    			[CUS_UPDATE_TIME]:{
    			 	[EDIT_NAME]: lang(CUS_UPDATE_TIME),
    			 	[EDIT_TYPE]:'Number',
    			},
    			[CUS_UPDATE_NOTE]:{
    			 	[EDIT_NAME]: lang(CUS_UPDATE_NOTE),
    			 	[EDIT_TYPE]:'textarea',
    			},
				
		}
	    
	    this.cus_update_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
		    			   <FuncDelRow key={2} rowData={rowData}/>
	    			]}
	    };
	    this.cus_update_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : CUS_UPDATE_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : {...this.cus_update_struct[STRUCT_EDIT]},
	            [DATA_KEY] : [CUS_UPDATE_ID],
	            [DATA_SORT] : {[CUS_UPDATE_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : true,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/admin/cus_update/filter',
	            [LINK_EDIT] : '/admin/cus_update/edit',
	            [LINK_ADD] : '/admin/cus_update/add',
	            [LINK_DELETE] : '/admin/cus_update/drop',
	    };
	   
	}
	
	initial(){
		
	}
	
	onUpdateHandle(){
		
		var addData = {
				[CUS_UPDATE_TIME]: this[CUS_UPDATE_TIME].getValue(),
				[CUS_UPDATE_NOTE]: this[CUS_UPDATE_NOTE].getValue(),
		}
		
		if(addData[CUS_UPDATE_TIME] =='' || addData[CUS_UPDATE_NOTE] ==''){
			return;
		}
		
		this.cus_update_table.addRow([addData], (response)=>{
			if(response['result']){
				 this.cus_update_table.filter();
				 this.table.filter();
				 this[CUS_UPDATE_TIME].setValue('');
				 this[CUS_UPDATE_NOTE].setValue('');
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#update_project_status"+this.id).modal('hide');
		}else{
			$("#update_project_status"+this.id).modal();
		}
	}
	
	loadData(rowData){
		this.rowData = rowData;
		this.cus_update_table[STRUCT_TABLE][DATA_SPECIAL] = {[CUS_UPDATE_CID]: this.rowData[CUS_ID], [GROUP_ID]: this.table[STRUCT_TABLE][DATA_SPECIAL][GROUP_ID]};
		this.cus_update_table.filter();
		this[CUS_UPDATE_TIME].setValue(moment().format('X'));
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_status_css">{`
				  		 
				  		 .status_frame_add{
				  		 	background: white;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.status_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 10px;
				  	 	}
				  	 	
				  	 	.status_time{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.status_table td {
				  	 		border: none;
				  	 	}
				  		 
				  	 `}</Style>
				  
					
					 <div className="modal fade" id={"update_project_status"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Update Status"}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial', padding:3}}>
									<div className='status_frame_add'>
										<div className='row' style={{padding: 0}}>
										
											<div className='col-md-8' style={{padding: 5}}>
												<InputDate placeholder={lang(CUS_UPDATE_TIME)} ref={(input)=>this[CUS_UPDATE_TIME] = input} className="status_time" style={{width: '100%', border:'solid thin darkgray', borderRadius: 4}}></InputDate>
											</div>
											<div className='col-md-4' style={{padding: 5}}>
												<BtnLoad style={{width: '100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">{lang('Update')}</BtnLoad>
											</div>
											
										</div>
										<div style={{padding: 5}}>
											<InputTextarea placeholder={lang(CUS_UPDATE_NOTE)} ref={(input)=>this[CUS_UPDATE_NOTE] = input} className="status_content"></InputTextarea> 
										</div>
									</div>
									<div style={{padding: 5}}>
											<Table ref={table => this.cus_update_table = table} table = {this.cus_update_struct} autoload={false}>
										  	
										  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
										  	<Pagination></Pagination>
										  	
										  	</Table>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
		)  
	}
}

FuncStatusModal.contextType = TableContext;
export default FuncStatusModal
	  