import React, { Component } from 'react'
import FormEditor from './FormEditor' 
import InputDate from '../input/InputDate' 
import InputHtml from '../input/InputHtml' 
import InputMoney from '../input/InputMoney' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable'

class FuncMin extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.moutTb = {};
	    this.moutTb[STRUCT_FILTERS] = {}
	    this.moutTb[STRUCT_COLUMNS] = {
			[MOUT_TIME]:{
			 	[COL_NAME]:MOUT_TIME,
			 	[COL_SORT]:true,
			 	[COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
			},
			[MOUT_UNAME]:{
		     	[COL_NAME]:MOUT_UNAME,
		     	[COL_SORT]:true,
			},
			[MOUT_VALUE]:{
		     	[COL_NAME]:MOUT_VALUE,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){if(data) return formatNumber(data)},
			},
			[MOUT_NOTE]:{
		     	[COL_NAME]:MOUT_NOTE,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){return <span dangerouslySetInnerHTML={{__html: HtmlDecode(data)}}></span>}
			},
	    }
	    this.moutTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : MOUT_TABLE+'Update',
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.moutTb[STRUCT_COLUMNS],
	            [DATA_KEY] : [MOUT_ID],
	            [DATA_SORT] : {[MOUT_TIME] : 'desc'},
	            [DATA_SPECIAL]: {},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : false,
	            [LINK_FILTER] : '/admin/mout/filter',
	            [LINK_ADD] : '/admin/mout/add',
	    };
	   
	}
	
	initial(){
		this.struct = {};
		this.rowData = this.props.rowData;
		this.moutTb[STRUCT_TABLE][DATA_SPECIAL][MOUT_PID] = this.rowData[PROJECT_ID];
		
		try {
			this.value = JSON.parse(this.props.value);
			this.valueComp = <>{formatNumber(this.rowData[PROJECT_MONEY_OUT])}</>
	    } catch(e) {
	    	this.valueComp='';
	    }
		
		
	}
	
	onUpdateHandle(){
		
		var addData = {
				[MOUT_TIME]: this[MOUT_TIME].getValue(),
				[MOUT_NOTE]: this[MOUT_NOTE].getValue(),
				[MOUT_VALUE]: this[MOUT_VALUE].getValue(),
		}
		
		if(addData[MOUT_TIME] =='' || addData[MOUT_VALUE] ==''){
			return;
		}
		
		this.moutTable.addRow([addData], (response)=>{
			if(response['result']){
				 this.moutTable.filter();
				 this.table.filter();
				 this[MOUT_TIME].setValue('');
				 this[MOUT_NOTE].setValue('');
				 this[MOUT_VALUE].setValue('');
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_MOUT_css">{`
				  		 
				  		 .MOUT_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.MOUT_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 15px;
				  	 	}
				  	 	
				  	 	.MOUT_time{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.MOUT_table td {
				  	 		border: none;
				  	 	}
				  		 
				  	 `}</Style>
				  
					 <div style={{cursor:'pointer', width:'100%', minHeight: 20}} 
					 
					 onClick={() => {
						 $("#update_project_money_out"+this.id).modal(); 
						 this.moutTable.filter()}
					 }> {this.valueComp} </div>
					 
					 <div className="modal fade" id={"update_project_money_out"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{lang(PROJECT_MONEY_OUT)}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial'}}>
									<div className='MOUT_frame_add'>
										<div className='row' style={{padding: 0}}>
										
											<div className='col-md-4' style={{padding: 5}}><InputDate placeholder={lang(MOUT_TIME)} ref={(input)=>this[MOUT_TIME] = input} className="MOUT_time" style={{width: '100%'}}></InputDate></div>
											<div className='col-md-4' style={{padding: 5}}><InputMoney placeholder={lang(MOUT_VALUE)} ref={(input)=>this[MOUT_VALUE] = input} className="MOUT_time" style={{width: '100%'}}></InputMoney></div>
											<div className='col-md-4' style={{padding: 5}}>
												<BtnLoad style={{width: '100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">Update</BtnLoad>
											</div>
											
										</div>
										<div style={{padding: 5}}>
											<InputHtml placeholder={lang(MOUT_NOTE)} ref={(input)=>this[MOUT_NOTE] = input} className="MOUT_content"></InputHtml> 
										</div>
									</div>
									<div style={{padding: 15}}>
										<Table ref={table=>this.moutTable = table} table = {this.moutTb}>
											  	
										  	<MainTable className='table table-striped table-resizable MOUT_table'></MainTable>
										  	
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

FuncMin.contextType = TableContext;
export default FuncMin
	  