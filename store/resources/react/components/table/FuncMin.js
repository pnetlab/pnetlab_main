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
	    
	    this.minTb = {};
	    this.minTb[STRUCT_FILTERS] = {}
	    this.minTb[STRUCT_COLUMNS] = {
			[MIN_TIME]:{
			 	[COL_NAME]:MIN_TIME,
			 	[COL_SORT]:true,
			 	[COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
			},
			[MIN_UNAME]:{
		     	[COL_NAME]:MIN_UNAME,
		     	[COL_SORT]:true,
			},
			[MIN_VALUE]:{
		     	[COL_NAME]:MIN_VALUE,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){if(data) return formatNumber(data)},
			},
			[MIN_NOTE]:{
		     	[COL_NAME]:MIN_NOTE,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){return <span dangerouslySetInnerHTML={{__html: HtmlDecode(data)}}></span>}
			},
	    }
	    this.minTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : MIN_TABLE+'Update',
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.minTb[STRUCT_COLUMNS],
	            [DATA_KEY] : [MIN_ID],
	            [DATA_SORT] : {[MIN_TIME] : 'desc'},
	            [DATA_SPECIAL]: {},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : false,
	            [LINK_FILTER] : '/admin/min/filter',
	            [LINK_ADD] : '/admin/min/add',
	    };
	   
	}
	
	initial(){
		this.struct = {};
		this.rowData = this.props.rowData;
		this.minTb[STRUCT_TABLE][DATA_SPECIAL][MIN_PID] = this.rowData[PROJECT_ID];
		try {
			this.value = JSON.parse(this.props.value);
			this.valueComp = <>{formatNumber(this.rowData[PROJECT_MONEY_REC])}</>
	    } catch(e) {
	    	this.valueComp='';
	    }
		
		
	}
	
	onUpdateHandle(){
		
		var addData = {
				[MIN_TIME]: this[MIN_TIME].getValue(),
				[MIN_NOTE]: this[MIN_NOTE].getValue(),
				[MIN_VALUE]: this[MIN_VALUE].getValue(),
		}
		
		if(addData[MIN_TIME] =='' || addData[MIN_VALUE] ==''){
			return;
		}
		
		this.minTable.addRow([addData], (response)=>{
			if(response['result']){
				 this.minTable.filter();
				 this.table.filter();
				 this[MIN_TIME].setValue('');
				 this[MIN_NOTE].setValue('');
				 this[MIN_VALUE].setValue('');
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_MIN_css">{`
				  		 
				  		 .MIN_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.MIN_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 15px;
				  	 	}
				  	 	
				  	 	.MIN_time{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.min_table td {
				  	 		border: none;
				  	 	}
				  		 
				  	 `}</Style>
				  
					 <div style={{cursor:'pointer', width:'100%', minHeight: 20}} 
					 
					 onClick={() => {
						 $("#update_project_money_in"+this.id).modal(); 
						 this.minTable.filter()}
					 }> {this.valueComp} </div>
					 
					 <div className="modal fade" id={"update_project_money_in"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{lang(PROJECT_MONEY_REC)}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial'}}>
									<div className='MIN_frame_add'>
										<div className='row' style={{padding: 0}}>
										
											<div className='col-md-4' style={{padding: 5}}><InputDate placeholder={lang(MIN_TIME)} ref={(input)=>this[MIN_TIME] = input} className="MIN_time" style={{width: '100%'}}></InputDate></div>
											<div className='col-md-4' style={{padding: 5}}><InputMoney placeholder={lang(MIN_VALUE)} ref={(input)=>this[MIN_VALUE] = input} className="MIN_time" style={{width: '100%'}}></InputMoney></div>
											<div className='col-md-4' style={{padding: 5}}>
												<BtnLoad style={{width: '100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">Update</BtnLoad>
											</div>
											
										</div>
										<div style={{padding: 5}}>
											<InputHtml placeholder={lang(MIN_NOTE)} ref={(input)=>this[MIN_NOTE] = input} className="MIN_content"></InputHtml> 
										</div>
									</div>
									<div style={{padding: 15}}>
										<Table ref={table=>this.minTable = table} table = {this.minTb}>
											  	
										  	<MainTable className='table table-striped table-resizable min_table'></MainTable>
										  	
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
	  