import React, { Component } from 'react'
import XLSX from 'xlsx';
import {Prompt} from "react-router-dom"

class FuncImport extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FuncImport'+this.props.id] = this;
	    this.id = this.table[STRUCT_TABLE][DATA_TABLE_ID] + Math.floor(Math.random() * 10000);
	    this.imported = [];
	    this.revert = {};
	    this.state={
	    		uploadding : false,
	    	    total : 0,
	    	    uploaded : 0,
	    	    show : false,
	    }
	    
	    this.unit = get(this.props.unit, 20);
	    this.sleep = get(this.props.sleep, 100);
	    
	}
	
	initial(){
		
	}
	
	componentWillUnmount(){
		this.table.children['FuncImport'+this.props.id] = false;
	}
	
	loadTemplate(){
		this.addModal =  this.table.children['AddModal']; 
		this.excel_export(this.addModal.struct)
	}
	
	import(file, callback=null){
		
		if(this.imported.includes(file.name)){
			console.log('stata');
			Swal('Alert', lang('This file is imported'), 'warning');
			return;
		}
		
		this.addModal =  this.table.children['AddModal']; 
		this.revert = {};
		for(let i in this.addModal.struct){
			this.revert[this.addModal.struct[i][EDIT_NAME]] = i;
		}
		
	    var reader = new FileReader();
	    var name = file.name;
	    reader.onload = (e)=>{
	    	var data = e.target.result;
	        var wb = XLSX.read(data, {type: 'binary'});
	        if(this.process_wb(wb)){
	        	this.imported.push(file.name);
	        	if(callback) callback(file);
	        	this.forceUpdate();
	        
	        };
	    };
	    reader.readAsBinaryString(file);
		
	}
	
	async process_wb(wb) {
		  var workbook = this.to_json(wb);
		  var currentTime = moment().format('X');
		  if(isset(Object.keys(workbook)[0])){
			  var page = workbook[Object.keys(workbook)[0]]
			  this.setState ({total: page.length});
			  var uploaded = 0;
			  var uploadDataArray = [];
			  while (page.length > 0) {
				  uploadDataArray.push(page.splice(0,this.unit));
			  }
			  
			  this.setState({uploadding: true, show: true});
			  for(let i = 0; i < uploadDataArray.length; i++){
				  if(!this.state.uploadding) break;
				  this.convertData(uploadDataArray[i]);
				  if(this.props.decorator){
					 uploadDataArray[i] = this.props.decorator(uploadDataArray[i]);
				  }
				  
				 this.setState({uploadding: true, show: true});
				 this.table.addRow(uploadDataArray[i], false, {time: currentTime}).then((response)=>{
					  if(!response['result']){
						  Swal(response['message'], response['data'], 'error');
						  this.setState({uploadding: false});
					  }else{
						  var uploaded = this.state.uploaded + this.unit;
						  uploaded = uploaded > this.state.total? this.state.total: uploaded;
						  this.setState({uploaded: uploaded})
					  }
				  });
				 
				 
				 await sleep(this.sleep, this.sleep);
				  
			  }
			  
			  this.setState({uploadding: false});
			  
		  }else{
			  Swal('Alert', lang('No data'), 'warning');
			  return false;
		  }
	}
	
	convertData(datas){
		
		for (let i in datas){
			var convertData = {}
			var editorItems = this.addModal.form.items;
			for (let colName in datas[i]){
				if(!isset(this.revert[colName]) || !isset(editorItems[this.revert[colName]])) continue;
				var convertVl = editorItems[this.revert[colName]].getInput().revertValue(datas[i][colName]);
				convertData[this.revert[colName]] = convertVl;
			}
			datas[i] = convertData
		}
		
		return datas;
	}
	
	to_json(workbook) {
	    var result = {};
	    workbook.SheetNames.forEach(function(sheetName) {
	        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
	        if(roa.length > 0){
	            result[sheetName] = roa;
	        }
	    });
	    return result;
	}
	
	reload(){
		this.forceUpdate();
	}
	
	excel_export(struct, data=[])
	{
		var filename = "template.xlsx";
		var header = [];
		for(let i in struct){
			header.push(struct[i][EDIT_NAME]);
		}
		
		var arrayOfArray = [header].concat(data);
		
		var wb = XLSX.utils.book_new();
		var ws = XLSX.utils.aoa_to_sheet(arrayOfArray);
		var range = XLSX.utils.decode_range(ws['!ref'])
		ws['!cols'] = this.fitToColumn(arrayOfArray);
		
		XLSX.utils.book_append_sheet(wb, ws);
		XLSX.writeFile(wb, filename);
	}
	
	fitToColumn(arrayOfArray) {
	    return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
	}
	
	render () {
		  this.initial();
		  return(
				  <>
				  <div className="dropdown">
				    <div className="table_function" data-toggle="dropdown"><div className="button"><i className="fa fa-sign-in"></i>&nbsp;{lang('Import')}</div></div>
				    <ul className="dropdown-menu" style={{padding: 5, fontSize: 'inherit'}}>
				      <li><div style={{padding: 5}} className="button" onClick = {()=>this.loadTemplate()}><i className="fa fa-table"></i>&nbsp;{lang('Template')}</div></li>
				      <li><div style={{padding: 5}}>
				      		<label className='button' htmlFor={this.id+'fileInput'}><i className="fa fa-upload"></i>&nbsp;{lang('Upload')}</label>
				      		<input type="file" id={this.id+'fileInput'} style={{display:'none'}} onChange={(event)=>this.import(event.target.files[0])}/>
				      </div></li>
				      	<div>
				      		<hr/>
					    	<div><b>{lang('Imported:')}</b></div>
					    	<ul>
					    	{this.imported.map((item)=>{return <li key={item}>{item}</li>})}
					    	</ul>
				    	</div>
				    </ul>
				    
				  </div>
				  
				  <div style={{
					  
					position: 'fixed',
				    top: 0,
				    bottom: 0,
				    right: 0,
				    left: 0,
				    background: '#857a7abf',
				    zIndex: 1000,
				    display: this.state.show?'flex':'none',
					  
				  }}>
				  
					  <div style={{
						margin: 'auto',
					    textAlign: 'center',
					    background: 'white',
					    padding: '15px 50px',
					    borderRadius: 5,
					  }}>
					  	<strong>{this.state.uploadding?'Uploadding....':'Completed'}</strong>
					  	<div style={{padding:10}}>{this.state.uploaded+'/'+this.state.total}</div>
					  	<button className='button btn btn-primary' onClick={()=>{
					  		this.setState({uploadding: false, show: false});
					  		this.table.filter();
					  	}}>{this.state.uploadding?'Stop':'Close'}</button>
					  </div>
				  
				  	
				  </div>
				  
				  
				  <Prompt
		          when={this.state.uploadding}
		          message={location => lang('Do you want to stop importing?')}
		          />
				  
				  </>
		)  
	}
	
	
	
	

}



FuncImport.contextType = TableContext;
export default FuncImport
	  