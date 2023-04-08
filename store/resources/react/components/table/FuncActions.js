import React, { Component } from 'react'
import FormEditor from './FormEditor' 
import InputDate from '../input/InputDate' 
import InputHtml from '../input/InputHtml' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable'

import FuncUpdateAction from './FuncUpdateAction'

class FuncEdit extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    
	    this.actionTb = {};
	    this.actionTb[STRUCT_FILTERS] = {}
	    this.actionTb[STRUCT_COLUMNS] = {
			[ACTION_TIME]:{
			 	[COL_NAME]:ACTION_TIME,
			 	[COL_SORT]:true,
			 	[COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
			},
			[ACTION_UNAME]:{
		     	[COL_NAME]:ACTION_UNAME,
		     	[COL_SORT]:false,
			},
			[ACTION_CONTENT]:{
		     	[COL_NAME]:ACTION_CONTENT,
		     	[COL_SORT]:false,
		     	[COL_DECORATOR_IN]: function(data){return <span dangerouslySetInnerHTML={{__html: HtmlDecode(data)}}></span>}
			},
			[ACTION_STATUS]:{
		     	[COL_NAME]:ACTION_STATUS,
		     	[COL_SORT]:false,
		     	[COL_DECORATOR_IN]: (colID, rowID, tbData)=>{
		     		return <FuncUpdateAction onChange={()=>{this.table.filter()}} value={tbData[rowID][colID]} actionID={tbData[rowID][ACTION_ID]}></FuncUpdateAction>
		     	}
			},
	    }
	    this.actionTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : ACTION_TABLE+'Update',
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.actionTb[STRUCT_COLUMNS],
	            [DATA_KEY] : [ACTION_ID],
	            [DATA_SORT] : {[ACTION_TIME] : 'desc'},
	            [DATA_SPECIAL]: {},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : false,
	            [LINK_FILTER] : '/admin/actions/filter',
	            [LINK_ADD] : '/admin/actions/add',
	    };
	   
	}
	
	initial(){
		this.rowData = this.props.rowData;
		this.actionTb[STRUCT_TABLE][DATA_SPECIAL][ACTION_PID] = this.rowData[PROJECT_ID];
		try {
			
			this.value = JSON.parse(this.props.value);
			
			var content = '';
			if(this.props.content != false){
				content = <div className = "project_status_text">
							<span className="project_status_content" dangerouslySetInnerHTML={{__html: HtmlDecode(this.value[ACTION_CONTENT])}}></span>
						</div>
			}
			
			var status = '';
			if(this.props.status != false){
				status = <div style={{whiteSpace: 'nowrap', marginTop:5, fontWeight:'bold', fontStyle: 'italic'}}>
					<i className="fa fa-flag"></i><span style={{paddingLeft:10}}>{lang(PROJECT_ACTION_STATUS[this.value[ACTION_STATUS]])}</span>
				</div>
			}
			
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
			<div style={{whiteSpace: 'nowrap', paddingTop: 3}}>
				<i className="fa fa-calendar"></i><span className = "project_status_time">{moment(this.value[ACTION_TIME], "X").format('DD-MM-YYYY')}</span>
				<i className="fa fa-user"></i><span className="project_status_uname">{this.value[ACTION_UNAME]}</span>
			</div>
			
			{content}
			
			{status}
			
		</>
	    } catch(e) {
	    	console.log(e);
	    	this.valueComp='';
	    }
		
		
	}
	
	onUpdateHandle(){
		
		var addData = {
				[ACTION_TIME]: this.action_time.getValue(),
				[ACTION_CONTENT]: this.action_content.getValue(),
		}
		
		if(addData[ACTION_TIME] =='' || addData[ACTION_CONTENT] ==''){
			return;
		}
		
		this.statusTable.addRow([addData], (response)=>{
			if(response['result']){
				 this.statusTable.filter();
				 this.table.filter();
				 this.action_time.setValue('');
				 this.action_content.setValue('');
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_action_css">{`
				  		 
				  		 .action_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.action_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 15px;
				  	 	}
				  	 	
				  	 	.action_time{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.action_table td {
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
									<h4 className="modal-title">{"Next Action"}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial'}}>
									<div className='action_frame_add'>
										<div className='row' style={{padding: 0}}>
										
											<div className='col-md-8' style={{padding: 5}}><InputDate placeholder={lang(ACTION_TIME)} ref={(input)=>this.action_time = input} className="action_time" style={{width: '100%'}}></InputDate></div>
											<div className='col-md-4' style={{padding: 5}}>
												<BtnLoad style={{width: '100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">Update</BtnLoad>
											</div>
										</div>
										<div style={{padding: 5}}>
											<InputHtml placeholder={lang(ACTION_CONTENT)} ref={(input)=>this.action_content = input} className="action_content"></InputHtml> 
										</div>
									</div>
									<div style={{padding: 15}}>
										<Table ref={table=>this.statusTable = table} table = {this.actionTb}>
											  	
										  	<MainTable className='table table-striped table-resizable action_table'></MainTable>
										  	
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
	  