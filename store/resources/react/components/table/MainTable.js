import React, { Component } from 'react'
import InputCheck from '../input/InputCheck'
import FuncEditModal from './FuncEditModal'
import FuncAddModal from './FuncAddModal'
import FormFileSuggest from '../input/FormFileSuggest'

class MainTable extends Component {
	
	
	constructor(props, context) {
		super(props, context)
		this.table = this.context;
		this.table.children['MainTable'+this.props.id] = this;
	    this.id = this.props.id;
	    
	    this.state = {
	    		[DATA_SORT] : this.table[STRUCT_TABLE][DATA_SORT],
	    }
	    this.selectRow = {};
	    this.headRow = {};
	    
	}
	
	initial(){
		this.columns = this.table[STRUCT_COLUMNS];
		this.cells = this.table[STRUCT_CELLS];
		this.hiddenCol = this.table[STRUCT_TABLE][DATA_HIDDEN_COL];
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		this.tableData = this.table[STRUCT_TABLE][DATA_TABLE];
		
		
		if(this.table[STRUCT_TABLE][TABLE_DECORATOR_DATA]){
			this.tableData = this.table[STRUCT_TABLE][TABLE_DECORATOR_DATA](this.tableData);
		}
		
		
		
		
		
		this.func_seting();
		this.func_index();
		this.func_select();
		
		
	}
	
	//============================================
	func_index(){
		if(!this.table[STRUCT_TABLE][FLAG_ROW_INDEX]) return;
		
		var indexCol = {index :{
			[COL_NAME] : 'STT',
			[COL_SORT] : false,
			[COL_ISFUNC] : true,
			[COL_STYLE] : {textAlign : 'center'},
			...this.columns.index
		}}
		
		this.columns={...indexCol, ...this.columns}
		
		this.permitCol['index'] = true;
		
		for (let rowID in this.tableData){
			var index = ((Number(this.table[STRUCT_TABLE][PAGE_ACTIVE]) - 1 ) * Number(this.table[STRUCT_TABLE][PAGE_QUANTITY]) + Number(rowID) + 1);
			this.tableData[rowID]['index'] = index;
		}
	}
	
	//=============================================
	
//	funcHOC(Func, rowData){
//		Func.type.prototype.setRowData(rowData);
//		
//		return <div key = {Math.random()}>{Func}</div>;
//	}
//	
//	drawRowFuncs(rowFuncs, rowData){
//		var rowFuncReturn = [];
//		for(let i in rowFuncs){
//			rowFuncReturn.push(this.funcHOC(rowFuncs[i], rowData));
//		}
//		return rowFuncReturn;
//	}
	
	func_seting(){
		if(!this.table[STRUCT_TABLE][FLAG_SETTING_ROWS]) return;
		
		var setingColumn = {

			setting: {
				[COL_NAME]: lang('Setup'),
				[COL_SORT]: false,
				[COL_ISFUNC]: true,
				[COL_STYLE]: { textAlign: 'center' },
				...this.columns.setting
		}}

		this.permitCol['setting'] = true;
		this.columns = { ...setingColumn, ...this.columns }
		
		if(this.table[STRUCT_ROWS][ROW_FUNCS]){
			for (let rowID in this.tableData){
				this.tableData[rowID]['setting'] = <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					{this.table[STRUCT_ROWS][ROW_FUNCS](this.tableData[rowID])}
				</div>
			}
		}
		
		
	}
	
	//=============================================
	
	onSelect(checked, rowID){
		var rowData = this.tableData[rowID];
		
		var {key, value} = this.table.createKey(rowData);
		
		if(checked){
			this.table[STRUCT_TABLE][DATA_SELECT_ROWS][key] = value;
		}else{
			delete this.table[STRUCT_TABLE][DATA_SELECT_ROWS][key];
		}
		
		if(this.table.props.onSelect) this.table.props.onSelect(rowData);
		
	}
	
	onMasterSelect(event){
		
		for( let i in this.selectRow){
			if(isset(this.selectRow[i])){
				this.selectRow[i].setValue(event.target.checked);
				this.onSelect(event.target.checked, this.selectRow[i].value);
			}else{
				delete(this.selectRow[i]);
			}
			
		}
		
	}
	
	loadSelect(){
		if(!this.table[STRUCT_TABLE][FLAG_SELECT_ROWS]) return;
		for (let rowID in this.tableData){
			const {key, value} = this.table.createKey(this.tableData[rowID]);
			if(this.selectRow[key]){
				this.selectRow[key].setValue(isset(this.table[STRUCT_TABLE][DATA_SELECT_ROWS][key]));
			}
		}
	}
	
	func_select(){
		if(!this.table[STRUCT_TABLE][FLAG_SELECT_ROWS]) return;
		
		var selectColumn = {select: {
			[COL_SORT]: false,
			[COL_ISFUNC]: true,
			[COL_STYLE]: { textAlign: 'center' },
			...this.columns.select,
			[COL_NAME]: <input type="checkbox" onChange={(event) => this.onMasterSelect(event)} />,
		}}

		this.permitCol['select'] = true;
		this.columns = { ...selectColumn, ...this.columns }
		
		for (let rowID in this.tableData){
			const {key, value} = this.table.createKey(this.tableData[rowID]);
			this.tableData[rowID]['select'] = <InputCheck 
				value = {rowID}
				ref={input => this.selectRow[key] = input} 
				defaultChecked = {isset(this.table[STRUCT_TABLE][DATA_SELECT_ROWS][key])}
				type="checkbox" 
				onChange={(checked)=>this.onSelect(checked, rowID)}>
				</InputCheck>;
		}
		
	}
	//=============================================
	
	
	sortHandle(i){
		var currentSort = this.table[STRUCT_TABLE][DATA_SORT][i];
		
		if(!this.table[STRUCT_TABLE][FLAG_MULTI_SORT]){
			this.table[STRUCT_TABLE][DATA_SORT] = {};
		}
		
		if(currentSort == null) this.table[STRUCT_TABLE][DATA_SORT][i] = 'desc';
		else if(currentSort == 'desc') this.table[STRUCT_TABLE][DATA_SORT][i] = 'asc';
		else if(currentSort == 'asc') this.table[STRUCT_TABLE][DATA_SORT][i] = 'desc';
		
		this.table.filter();
	}
	
	
	drawHeader(){
		if(isset(this.table[STRUCT_TABLE][FLAG_HEAD_ROW]) && !this.table[STRUCT_TABLE][FLAG_HEAD_ROW]) 
			return (<tr></tr>);
		var tablehead = [];
		
		for(let i in this.columns){
			 if(!this.permitCol[i]) continue;
			 if(get(this.hiddenCol[i], false)){
				    continue;
			 }
			 
			 var colStyle = get(this.columns[i][COL_STYLE],{});
			 
			 if(this.columns[i][COL_SORT]){
				 var sortClass = 'none';
				 if(this.table[STRUCT_TABLE][DATA_SORT][i] != null){
					 sortClass = this.table[STRUCT_TABLE][DATA_SORT][i];
				 }
				 
				 tablehead.push(
						 <th ref={th => this.headRow[i] = th} style={colStyle} key={i}>
						 	<div className = "column_sort" vector={sortClass} onClick={()=>this.sortHandle(i)}>
						 		{this.columns[i][COL_NAME]}
						 	</div>
						 </th>
				 );
			  }else{
			  		tablehead.push(
						 <th ref={th => this.headRow[i] = th} style={colStyle} key={i}>  
						 	<div>
						 		{this.columns[i][COL_NAME]}
						 	</div>
						 </th>
			  		);
			  }
		 }
		 
		 return <tr>{tablehead}</tr>;
	}
	
	drawFixHeader(){
		
		var tablehead = [];
		
		if(count(this.headRow)==0) return tablehead;
		
		if(this.table[STRUCT_TABLE][FLAG_HEAD_ROW] != false){
			
			for(let i in this.columns){
				
				 if(!this.permitCol[i]) continue;
				 if(get(this.hiddenCol[i], false)){
					    continue;
				 }
				 
					 
				 var colStyle = {...get(this.columns[i][COL_STYLE],{})};
				 colStyle['minWidth'] = this.headRow[i].clientWidth + 0.5;
				 colStyle['minHeight'] = this.headRow[i].clientHeight;
				 if(this.columns[i][COL_SORT]){
					 var sortClass = 'none';
					 if(this.state[DATA_SORT][i] != null){
						 sortClass = this.state[DATA_SORT][i];
					 }
					 
					 tablehead.push(
							 <th style={colStyle} key={i}>
							 	<div className = "column_sort" vector={sortClass} onClick={()=>this.sortHandle(i)}>
							 		{this.columns[i][COL_NAME]}
							 	</div>
							 </th>
					 );
				  }else{
				  		tablehead.push(
							 <th style={colStyle} key={i}>  
							 	<div>
							 		{this.columns[i][COL_NAME]}
							 	</div>
							 </th>
				  		);
				  }
			
			} 
			
		}
		 
		return tablehead
	}
	
	
	drawBody(){
		
		var tableHtml = [];
		
		for(let rowID in this.tableData){
			
			var rowStyle = {}
			if(this.table[STRUCT_ROWS][ROW_STYLE]!=null){
				rowStyle = this.table[STRUCT_ROWS][ROW_STYLE](rowID, this.tableData); 
			}
			
			var rowHtml = [];
			var rowData = this.tableData[rowID];
			
			if(this.table[STRUCT_ROWS][ROW_DECORATOR]){
				rowData = this.table[STRUCT_ROWS][ROW_DECORATOR](rowID, this.tableData); 
			}
			
			for(let colID in this.columns){
				
				if(!this.permitCol[colID]) continue;
				
				if(get(this.hiddenCol[colID], false)){
				    continue; 
				}
				
				var tdData = rowData[colID];
				var cellStyle = {};
				if(isset(this.cells[CELL_STYLE])){
					  cellStyle = this.cells[CELL_STYLE](colID, rowID, this.tableData);
				}
				
				var colStyle = get(this.columns[colID][COL_STYLE],{});
				
				if(isset(this.columns[colID][COL_DECORATOR_IN])){
					
					if(this.columns[colID][COL_DECORATOR_IN].prototype.constructor.length == 1){
						tdData = this.columns[colID][COL_DECORATOR_IN](tdData);
					}else{
						tdData = this.columns[colID][COL_DECORATOR_IN](colID, rowID, this.tableData);
					}
					
				}
				
				if(isset(this.columns[colID][COL_OPTION])){ 
					  if(isset(this.columns[colID][COL_OPTION][tdData])){
						  tdData = this.columns[colID][COL_OPTION][tdData];
					  }
				}
				
				if(tdData == null || tdData == "Invalid date"){tdData = ''}
				
				rowHtml.push(<td key={colID} style={{...cellStyle, ...colStyle}}>{tdData}</td>);
			}
			
			tableHtml.push(<tr key={rowID} style={rowStyle}>{rowHtml}</tr>);
			
		}
		
		return tableHtml;
		
	}
	
	
	componentDidUpdate(){
		this.loadSelect();
		if(this.fixhead) this.fixhead.reload();
	}
	
	
	componentDidMount() {
		var resizeTimeout = null;
	    window.addEventListener("resize", ()=>{
	    	if(resizeTimeout == null){
	    		resizeTimeout = setTimeout(()=>{ 
	    			resizeTimeout = null; 
	    			console.log('resize') 
	    		}, 1000);
	    	}
	    	
	    });
	}
	
	drawFixHeadComp(){
		
		var fixHead = '';
		this.opacity = 1;
		if(this.table[STRUCT_TABLE][FLAG_FIX_HEAD] == true){
			fixHead = <FixHead ref = {fixhead => this.fixhead = fixhead}
						parent={this}
						className={'main_table '+this.props.className} 
						style={this.props.style}>
					 </FixHead>
			
			this.opacity = 0;
		}
		
		return fixHead;
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		this.initial();
		
		return(
				<div>
					
					<div style={{overflow:'auto', ...get(this.props.frameStyle, {})}}>
						<table id={this.table[STRUCT_TABLE][DATA_TABLE_ID]} className={'main_table '+this.props.className} style={this.props.style}>
						    <thead style={{opacity: this.opacity}}>{this.drawHeader()}</thead>
						    <tbody>{this.drawBody()}</tbody>
					    </table>
					    
					    {(!this.tableData||Object.keys(this.tableData).length==0)? <div className="alert alert-warning" role="alert">{lang('No data')}</div> : ''}
					    
			    	</div>
			    	
			    	<FuncEditModal />
					
					<FuncAddModal  />

					<FormFileSuggest 
						link={this.table[STRUCT_TABLE][LINK_UPLOAD]} 
						ref={modal => this.table.children['UploadModal'] = modal}
						decorator = {(file)=>`${this.table[STRUCT_TABLE][LINK_UPLOAD]}?action=Read&file=${file}`}
						/>
					
				</div>
		  );
	}
}

MainTable.contextType = TableContext;


class FixHead extends Component {
	
	
	constructor(props) {
		super(props)
		this.intitial();
		this.table = this.props.table;
	}
	
	intitial(){
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render(){
		
		this.intitial();
		return (
				<table className={'main_table '+this.props.className} style={{...this.props.style, position: 'absolute'}}>
					<thead>
						<tr>{this.props.parent.drawFixHeader()}</tr>
					</thead>
				</table>
		);
	}
	
}


export default MainTable
	  