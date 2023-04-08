import React, { Component } from 'react'
import Table from './Table'
import FilterBar from './FilterBar'
import MainTable from './MainTable'
import Pagination from './Pagination'
import FuncBar from './FuncBar'
import FuncRefresh from './FuncRefresh'

class FuncRelationModal extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.relateTable = this.props.relate_table;
	    this.mapTable = this.props.map_table;
	    this.relation = this.props.relation;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.rowData = {};
	    this.table[this.props.id] = this;
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
		
		this.map_table.readRow([{[this.relation[1]] : rowData[this.relation[0]]}]).then( response =>{
			if(response['result']){
				response = response['data'];
				var selectRow = {};
				for(let i in response){
					var {key, value} = this.relate_table.createKey({[this.relation[3]]: response[i][this.relation[2]]});
					selectRow[key] = value;
				}
				this.relate_table[STRUCT_TABLE][DATA_SELECT_ROWS] = selectRow;
				
			}
			
		}).then(()=>{
			return this.relate_table.map();
		}).then(()=>{
			return this.relate_table.filter();
		});
	}
	
	onClickHandle(){
		this.map_table.delRow([{[this.relation[1]] : this.rowData[this.relation[0]]}], false).then( response =>{
			var selectRow = this.relate_table[STRUCT_TABLE][DATA_SELECT_ROWS];
			var addDatas = [];
			for (let i in selectRow){
				addDatas.push({[this.relation[1]] : this.rowData[this.relation[0]], [this.relation[2]]: selectRow[i][this.relation[3]]});
			}
			this.map_table.addRow(addDatas).then( response =>{
				  	  if(response['result']){
						this.modal('hide');
			    	  }else{
			    		 Swal(response['message'], response['data'], 'error');
			    	  }
				  }
			)
		});
	}
	
	render () {
		  return(
				<div className="modal fade" id={"edit_row_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{lang(this.relateTable[STRUCT_TABLE][DATA_TABLE_ID])}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
							
								<Table ref={table => this.relate_table = table} table = {this.relateTable} autoload={false}>
								  	<FilterBar></FilterBar>
								  	<FuncBar 
									  	right = {<><FuncRefresh/></>}>
								  	</FuncBar>
								  	
								  	<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
								  	<Pagination></Pagination>
							  	
							  	</Table>
							  	
							  	<Table ref={table => this.map_table = table} table = {this.mapTable} autoload={false}></Table>
							
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
FuncRelationModal.contextType = TableContext;
export default FuncRelationModal
	  