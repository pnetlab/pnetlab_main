import React, { Component } from 'react'
import FormEditor from '../table/FormEditor' 
import InputDate from '../input/InputDate' 
import InputTextarea from '../input/InputTextarea' 
import Table from '../table/Table'

class FuncEditModal extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FuncEditModal'+this.props.id] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.rowData = {};
	    this.table[this.props.id] = this;
	    
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
		this.struct = {};
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		
		for(let i in this.permitCol){
			if(!this.table[STRUCT_EDIT][i]) continue;
			this.struct[i] = this.table[STRUCT_EDIT][i];
			if(this.permitCol[i] == 'Read'){
				this.struct[i][EDIT_WRITABLE] = false;
			}else{
				this.struct[i][EDIT_WRITABLE] = true;
			}
		}
		
	}
	
	onClickHandle(){
		var rowData = this.form.getValue();
		console.log('agag');
		for(let i in rowData){
			
			if(this.permitCol[i] == 'Read'){
				delete(rowData[i]);
			}
		}
		
		this.table.upload(rowData, (response = null)=>{
			 if(response['result']){
				 this.onUpdateHandle(rowData)
	    	  }else{
	    		 Swal(response['message'], response['data'], 'error');
	    	  }
		});
	}
	
	editRow(rowData){
		var {key, value} = this.table.createKey(this.rowData);
		
		if(!value){
			Swal('Error', 'Can not create key', 'error');
			return;
		}
		
		var editData={
				[DATA_KEY] : [value],
				[DATA_EDITOR] : rowData
		}
		
		this.table.editRow(editData, (response = null)=>{
			  if(response['result']){
				this.modal('hide');
				this.table.filter();
	    	  }else{
	    		 Swal(response['message'], response['data'], 'error');
	    	  }
		});
	}
	
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#edit_row_modal"+this.id).modal('hide');
		}else{
			$("#edit_row_modal"+this.id).modal();
		}
	}
	
	loadData(rowData){
		this.rowData = rowData;
		this.form.setValue(this.rowData);
		if(this.cus_update_table){
			this.cus_update_table[STRUCT_TABLE][DATA_SPECIAL] = {[CUS_UPDATE_CID]: this.rowData[CUS_ID], [GROUP_ID]: this.table[STRUCT_TABLE][DATA_SPECIAL][GROUP_ID]};
			this[CUS_UPDATE_TIME].setValue(moment().format('X'));
			this[CUS_UPDATE_NOTE].setValue('');
		}
		
	}
	
	reload(){
		this.forceUpdate();
	}
	
	
	onUpdateHandle(rowData){
		
		if(this.cus_update_table){
			var addData = {
					[CUS_UPDATE_TIME]: this[CUS_UPDATE_TIME].getValue(),
					[CUS_UPDATE_NOTE]: this[CUS_UPDATE_NOTE].getValue(),
			}
			
			if(addData[CUS_UPDATE_TIME] =='' || addData[CUS_UPDATE_NOTE] ==''){
				this.editRow(rowData)
				return;
			}
			
			this.cus_update_table.addRow([addData], (response)=>{
				if(response['result']){
					 this.editRow(rowData)
					 this[CUS_UPDATE_TIME].setValue('');
					 this[CUS_UPDATE_NOTE].setValue('');
				}else{
					Swal(response['message'], response['data'], 'error');
				}
			})
		}else{
			this.editRow(rowData);
		}
		
	}
	
	render () {
		this.initial();
		return(
				<div className="modal fade" id={"edit_row_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{"Edit Row"}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
								<FormEditor ref={form => this.form = form} struct = {this.struct}></FormEditor> 
								
								{ (!isset(this.permitCol[CUS_UPDATE_NOTE]) || this.permitCol[CUS_UPDATE_NOTE]=='Read')?'':<>
								<hr/>
								<div className='status_frame_add'>
									<div className='row' style={{padding: 0}}>
									
										<div className='col-md-12' style={{padding: 5}}>
											<InputDate placeholder={lang(CUS_UPDATE_TIME)} ref={(input)=>this[CUS_UPDATE_TIME] = input} className="status_time" style={{width: '100%', border: 'solid thin darkgray'}}></InputDate>
										</div>
										
									</div>
									<div style={{padding: 5}}>
										<InputTextarea placeholder={lang(CUS_UPDATE_NOTE)} ref={(input)=>this[CUS_UPDATE_NOTE] = input} className="status_content"></InputTextarea> 
									</div>
									<Table ref={table => this.cus_update_table = table} table = {this.cus_update_struct} autoload={false}/>
								</div>
								</>
								}
								
								
							</div>
							
							
							
							<div  className="modal-footer"> 
							  	<button type="button" className="btn btn-primary" onClick = {() => {this.onClickHandle()}}>Save</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					        </div>

						</div>
					</div>
				</div>
		)  
	}
}
FuncEditModal.contextType = TableContext;
export default FuncEditModal
	  