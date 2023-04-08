import React, { Component } from 'react'

class FuncHideCol extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FuncHideCol'+this.props.id] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID]+ DATA_HIDDEN_COL;
	}
	
	initial(){
		this.struct = {};
		this.permitCol = this.table[STRUCT_TABLE][DATA_PERMIT_COL];
		this.hiddenCol = this.table[STRUCT_TABLE][DATA_HIDDEN_COL];
		
	}
	
	onChangeHandle(event, colID){
		this.hiddenCol[colID] = !event.target.checked;
		localStorage.setItem(this.id, JSON.stringify(this.hiddenCol));
		this.table[STRUCT_TABLE][DATA_HIDDEN_COL] = this.hiddenCol;
		this.table.reload();
	}
	
	onDefault(){
		localStorage.removeItem(this.id); 
		this.table.loadHidenCol();
		this.table.reload();
	}
	
	drawColSel(){
		var colSels = [];
		for(let colID in this.permitCol){
			if(!this.table[STRUCT_COLUMNS][colID]) continue;
			var isCheck = true;
			if(this.hiddenCol[colID]) isCheck = false;
			
			colSels.push(
				<li key={colID} style={{whiteSpace: 'nowrap'}}>
				<label><input type = "checkbox" 
						onChange = {(event)=>{this.onChangeHandle(event, colID)}} 
						style = {{margin: '0px 10px', cursor: 'pointer'}} 
						checked = {isCheck}
					/>{this.table[STRUCT_COLUMNS][colID][COL_NAME]}</label>
					
				</li>
			)
		}
		return colSels;
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render () {
		  this.initial();
		  return(
				  <div className="dropdown" id={this.id}>
				    <button className="button btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Columns 
				    <span className="caret"></span></button>
				    <ul className="dropdown-menu" style={{padding: 5}}>
				      {this.drawColSel()}
				      <li><div className="button btn btn-primary" onClick = {()=>{this.onDefault()}}>Default</div></li> 
				    </ul>
				    
				  </div>
		)  
	}
}

FuncHideCol.contextType = TableContext;
export default FuncHideCol
	  