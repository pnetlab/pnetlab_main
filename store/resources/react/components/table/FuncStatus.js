import React, { Component } from 'react'
import FormEditor from './FormEditor' 
import InputDate from '../input/InputDate' 
import InputHtml from '../input/InputHtml' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable'

class FuncEdit extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    
	    this.statusTb = {};
	    this.statusTb[STRUCT_FILTERS] = {}
	    this.statusTb[STRUCT_COLUMNS] = {
			[STATUS_TIME]:{
			 	[COL_NAME]:STATUS_TIME,
			 	[COL_SORT]:true,
			 	[COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
			},
			[STATUS_UNAME]:{
		     	[COL_NAME]:STATUS_UNAME,
		     	[COL_SORT]:true,
			},
			[STATUS_CONTENT]:{
		     	[COL_NAME]:STATUS_CONTENT,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){return <span dangerouslySetInnerHTML={{__html: HtmlDecode(data)}}></span>}
			},
	    }
	    this.statusTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : STATUS_TABLE+'Update',
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.statusTb[STRUCT_COLUMNS],
	            [DATA_KEY] : [STATUS_ID],
	            [DATA_SORT] : {[STATUS_TIME] : 'desc'},
	            [DATA_SPECIAL]: {},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : false,
	            [LINK_FILTER] : '/admin/status/filter',
	            [LINK_ADD] : '/admin/status/add',
	    };
	   
	}
	
	initial(){
		this.struct = {};
		this.rowData = this.props.rowData;
		this.statusTb[STRUCT_TABLE][DATA_SPECIAL][STATUS_PID] = this.rowData[PROJECT_ID];
		
		try {
			this.value = JSON.parse(this.props.value);
			this.valueComp = <>
				<Style id="project_status_css">{`
					.project_status_text{
						min-width: 200px;
						margin-top: 5px;
					    overflow: hidden;
						max-height: 50px;
					}
				
					.project_status_uname{
						font-weight: bold;
						padding: 5px;
						color: #5f91d1;
					}
					
					.project_status_time{
						font-style: italic;
						font-weight: bold;
						padding-right: 15px;
						padding-left: 5px;
					    color: #5f91d1;
					}
				`}</Style>
				<div style={{whiteSpace: 'nowrap'}}>
					<i className="fa fa-calendar"></i><span className = "project_status_time">{moment(this.value[STATUS_TIME], "X").format(DATE_FORMAT)}</span>
					<i className="fa fa-user"></i><span className="project_status_uname">{this.value[STATUS_UNAME]}</span>
				</div>
				<div className = "project_status_text">
					<span className="project_status_content" dangerouslySetInnerHTML={{__html: HtmlDecode(this.value[STATUS_CONTENT])}}></span>
				</div>
				
			</>
	    } catch(e) {
	    	this.valueComp='';
	    }
		
		
	}
	
	onUpdateHandle(){
		
		var addData = {
				[STATUS_TIME]: this.status_time.getValue(),
				[STATUS_CONTENT]: this.status_content.getValue(),
		}
		
		if(addData[STATUS_TIME] =='' || addData[STATUS_CONTENT] ==''){
			return;
		}
		
		this.statusTable.addRow([addData], (response)=>{
			if(response['result']){
				 this.statusTable.filter();
				 this.table.filter();
				 this.status_time.setValue('');
				 this.status_content.setValue('');
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_status_css">{`
				  		 
				  		 .status_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.status_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 15px;
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
				  
					 <div style={{cursor:'pointer', width:'100%', minHeight: 20}} 
					 
					 onClick={() => {
						 $("#update_project_status"+this.id).modal(); 
						 this.statusTable.filter()}
					 }> {this.valueComp} </div>
					 
					 <div className="modal fade" id={"update_project_status"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Update Status"}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial'}}>
									<div className='status_frame_add'>
										<div className='row' style={{padding: 0}}>
										
											<div className='col-md-8' style={{padding: 5}}>
												<InputDate placeholder={lang(STATUS_TIME)} ref={(input)=>this.status_time = input} className="status_time" style={{width: '100%'}}></InputDate>
											</div>
											<div className='col-md-4' style={{padding: 5}}>
												<BtnLoad style={{width: '100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">Update</BtnLoad>
											</div>
											
										</div>
										<div style={{padding: 5}}>
											<InputHtml placeholder={lang(STATUS_CONTENT)} ref={(input)=>this.status_content = input} className="status_content"></InputHtml> 
										</div>
									</div>
									<div style={{padding: 15}}>
										<Table ref={table=>this.statusTable = table} table = {this.statusTb}>
											  	
										  	<MainTable className='table table-striped table-resizable status_table'></MainTable>
										  	
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

FuncEdit.contextType = TableContext;
export default FuncEdit
	  