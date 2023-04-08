import React, { Component } from 'react'
import FormEditor from './FormEditor' 
import Input from '../input/Input' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable' 
import FuncUpdatePlan from '../table/FuncUpdatePlan' 

class FuncPlan extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    
	    this.planTb = {};
	    this.planTb[STRUCT_FILTERS] = {}
	    this.planTb[STRUCT_COLUMNS] = {
			[PROJECT_PLAN_TIME]:{
			 	[COL_NAME]: PROJECT_PLAN_TIME,
			 	[COL_SORT]: true,
			 	[COL_DECORATOR_IN]: function(data){ if(data == "") return data; else return moment(data, "X").format(DATE_FORMAT)},
			},
			
			[PROJECT_PLAN_UNAME]:{
		     	[COL_NAME]: PROJECT_PLAN_UNAME,
		     	[COL_SORT]: true,
			},
			
			[PROJECT_PLAN_VALUE]:{
		     	[COL_NAME]: PROJECT_PLAN_VALUE,
		     	[COL_SORT]: true,
		     	[COL_DECORATOR_IN]: function(colID, rowID, tbData){
		     		var rowData = tbData[rowID];
	     			if(rowData[colID] > 0){
	     				return <div style={{color:'green'}}>{formatNumber(rowData[colID])}</div>
	     			}else{
	     				return <div style={{color:'red'}}>{formatNumber(rowData[colID])}</div>
	     			}
		     	}
			},
			
			[PROJECT_PLAN_RATE]:{
		     	[COL_NAME]: lang(PROJECT_PLAN_RATE),
		     	[COL_SORT]: true,
		     	[COL_DECORATOR_IN]: (data)=>{return data+' %'},
			},
			
			[PROJECT_PLAN_PROFIT]:{
				[COL_NAME]: lang(PROJECT_PLAN_PROFIT),
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: function(colID, rowID, tbData){
					var rowData = tbData[rowID];
					if(rowData[colID] > 0){
						return <div style={{color:'green'}}>{formatNumber(rowData[colID])}</div>
					}else{
						return <div style={{color:'red'}}>{formatNumber(rowData[colID])}</div>
					}
				}
			},
			
			[PROJECT_PLAN_NOTE]:{
		     	[COL_NAME]:PROJECT_PLAN_NOTE,
		     	[COL_SORT]:true,
		     	[COL_DECORATOR_IN]: function(data){return <span dangerouslySetInnerHTML={{__html: HtmlDecode(data)}}></span>}
			},
			
			[PROJECT_PLAN_STATUS]:{
		     	[COL_NAME]: PROJECT_PLAN_STATUS,
		     	[COL_SORT]: true,
		     	[COL_DECORATOR_IN]: (colID, rowID, tbData)=>{
		     		return <FuncUpdatePlan onChange={()=>{this.table.filter()}} value={tbData[rowID][colID]} rowData={tbData[rowID]}></FuncUpdatePlan>
		     	}
			},
	    }
	    
	    
	    this.planTb[STRUCT_EDIT] = {
				[PROJECT_PLAN_TIME]:{
				 	[INPUT_NAME]: PROJECT_PLAN_TIME,
				 	[INPUT_TYPE]: 'date',
				},
				
				[PROJECT_PLAN_VALUE]:{
			     	[INPUT_NAME]: PROJECT_PLAN_VALUE,
			     	[INPUT_TYPE]: 'money',
			     	[INPUT_ONCHANGE]: ()=>{this.calculateProfitvsRate()},
				},
				
				[PROJECT_PLAN_RATE]:{
					[INPUT_NAME]: PROJECT_PLAN_RATE,
					[INPUT_TYPE]: 'float',
					[INPUT_ONCHANGE]: ()=>{this.calculateProfit()},
				},
				
				[PROJECT_PLAN_PROFIT]:{
					[INPUT_NAME]: PROJECT_PLAN_PROFIT,
					[INPUT_TYPE]: 'money',
					[INPUT_ONCHANGE]: ()=>{this.calculateRate()},
				},
				
				[PROJECT_PLAN_NOTE]:{
			     	[INPUT_NAME]:PROJECT_PLAN_NOTE,
			     	[INPUT_TYPE]: 'html',
				},
		    }
	    
	    
	    this.planTb[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : PROJECT_MONEY_PLANS+'Update',
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.planTb[STRUCT_COLUMNS],
	            [DATA_KEY] : [PROJECT_PLAN_ID],
	            [DATA_SORT] : {[PROJECT_PLAN_TIME] : 'desc'},
	            [DATA_SPECIAL]: {},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : false,
	            [LINK_FILTER] : '/admin/mplan/filter',
	            [LINK_ADD] : '/admin/mplan/add',
	    };
	   
	}
	
	/*
	 * Auto mation
	 */
	calculateProfitvsRate(){
		var value = Number(this[PROJECT_PLAN_VALUE].getValue())
		this.calculateProfit();
		if(value <= 0){
			this[PROJECT_PLAN_RATE].setValue(100);
			this[PROJECT_PLAN_PROFIT].setValue(value);
		}
	}
	calculateProfit(){
		this[PROJECT_PLAN_PROFIT].setValue(Math.ceil(Number(this[PROJECT_PLAN_VALUE].getValue())*Number(this[PROJECT_PLAN_RATE].getValue())/100));
	}
	calculateRate(){
		this[PROJECT_PLAN_RATE].setValue(Math.ceil(Number(this[PROJECT_PLAN_PROFIT].getValue())/Number(this[PROJECT_PLAN_VALUE].getValue())*1000)/10);
	}
	
	initial(){
		this.struct = {};
		this.rowData = this.props.rowData;
		this.planTb[STRUCT_TABLE][DATA_SPECIAL][PROJECT_PLAN_PID] = this.rowData[PROJECT_ID];
		
		try {
			this.value = JSON.parse(this.props.value);
			var content = '';
			if(this.props.content != false){
				content = <div className = "project_plan_text">
								<span className="project_plan_content" dangerouslySetInnerHTML={{__html: HtmlDecode(this.value[PROJECT_PLAN_NOTE])}}></span>
						  </div> 
			}
			
			if(Number(this.value[PROJECT_PLAN_VALUE])>0){
				var planValue = <span style={{color: 'green'}}>{formatNumber(this.value[PROJECT_PLAN_VALUE])}</span>
			}else{
				var planValue = <span style={{color: 'red'}}>{formatNumber(this.value[PROJECT_PLAN_VALUE])}</span>
			}
			
			this.valueComp = <>
				<Style id="project_plan_css">{`
					.project_plan_text{
						min-width: 200px;
						margin-top: 5px;
					    overflow: hidden;
						max-height: 50px;
					}
				
					.project_plan_title{
						font-weight: bold;
						padding: 5px;
						color: #5f91d1;
					}
					
					.project_plan_time{
						font-style: italic;
						font-weight: bold;
						padding-right: 15px;
						padding-left: 5px;
					    color: #5f91d1;
					}
				`}</Style>
				<div style={{whiteSpace: 'nowrap'}}>
					<i className="fa fa-calendar"></i><span className = "project_plan_title">{moment(this.value[PROJECT_PLAN_TIME], "X").format(DATE_FORMAT)}</span>
					<i className="fa fa-user"></i><span className="project_plan_title">{this.value[PROJECT_PLAN_UNAME]}</span>
				</div>
				<div style={{whiteSpace: 'nowrap', paddingTop: 5}}>
					<span className="project_plan_title">{planValue}</span>
				</div>
				
				{content}
			</>
	    } catch(e) {
	    	this.valueComp='';
	    }
		
		
	}
	
	onUpdateHandle(){
		
		var addData = {}
		
		for(let colID in this.planTb[STRUCT_EDIT]){
			addData[colID] = this[colID].getValue();
		}
		
		if(addData[PROJECT_PLAN_TIME] =='' || addData[PROJECT_PLAN_VALUE] ==''){
			return;
		}
		
		this.planTable.addRow([addData], (response)=>{
			if(response['result']){
				this.planTable.filter();
				this.table.filter();
				
				for(let colID in this.planTb[STRUCT_EDIT]){
					this[colID].setValue('');
				}
				
			}else{
				Swal(response['message'], response['data'], 'error');
			}
		})
		
	}
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_plan_css">{`
				  		 
				  		 .plan_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	
				  	 	.plan_value{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.plan_content{
				  	 		background: white;
				  	 		padding: 5px;
				  	 		border-radius: 4px;
				  	 	}
				  	 	
				  	 	.plan_table td {
				  	 		border: none;
				  	 	}
				  		 
				  	 `}</Style>
				  
					 <div style={{cursor:'pointer', width:'100%', minHeight: 20}} 
					 
					 onClick={() => {
						 $("#update_project_plan"+this.id).modal(); 
						 this.planTable.filter()}
					 }> {this.valueComp} </div>
					 
					 <div className="modal fade" id={"update_project_plan"+this.id}> 
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
		
								<div className="modal-header">
									<h4 className="modal-title">{"Update plan"}</h4>
									<button type="button" className="close" data-dismiss="modal">&times;</button>
								</div>
								
								<div className="modal-body" style={{textAlign: 'initial'}}>
									<div className='plan_frame_add'>
										<div className='row' style={{padding: 0}}>
											<div className='col-md-6'>
												<div style={{padding: 5}}>
													<Input placeholder={lang(PROJECT_PLAN_TIME)} struct={this.planTb[STRUCT_EDIT][PROJECT_PLAN_TIME]} ref={(input)=>this[PROJECT_PLAN_TIME] = input} className="plan_value"></Input>
												</div>
												<div style={{padding: 5}}>
													<Input placeholder={lang(PROJECT_PLAN_VALUE)} struct={this.planTb[STRUCT_EDIT][PROJECT_PLAN_VALUE]} ref={(input)=>this[PROJECT_PLAN_VALUE] = input} className="plan_value"></Input>
												</div>
												<div style={{padding: 5}}>
													<Input placeholder={lang(PROJECT_PLAN_RATE)} struct={this.planTb[STRUCT_EDIT][PROJECT_PLAN_RATE]} ref={(input)=>this[PROJECT_PLAN_RATE] = input} className="plan_value"></Input>
												</div>
												<div style={{padding: 5}}>
													<Input placeholder={lang(PROJECT_PLAN_PROFIT)} struct={this.planTb[STRUCT_EDIT][PROJECT_PLAN_PROFIT]} ref={(input)=>this[PROJECT_PLAN_PROFIT] = input} className="plan_value"></Input>
												</div>
											</div>
											<div className='col-md-6'>
												<div style={{padding: 5}}>
													<Input placeholder={lang(PROJECT_PLAN_NOTE)} struct={this.planTb[STRUCT_EDIT][PROJECT_PLAN_NOTE]} ref={(input)=>this[PROJECT_PLAN_NOTE] = input} className="plan_content"></Input> 
												</div>
												<div style={{padding: 5}}>
													<BtnLoad style={{ width:'100%', borderColor:'white'}} onClick={()=>this.onUpdateHandle()} className="btn btn-primary button">Update</BtnLoad>
												</div>
											</div>
										</div>
										
										
										
									</div>
									
									<div style={{padding: 15}}>
										<Table ref={table=>this.planTable = table} table = {this.planTb}>
											  	
										  	<MainTable className='table table-striped table-resizable plan_table'></MainTable>
										  	
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

FuncPlan.contextType = TableContext;
export default FuncPlan
	  