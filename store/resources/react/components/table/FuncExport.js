import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncExport extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	   
	}
	
	excel_export(tableID)
	{
	    var tab_text="\uFEFF<table border='2px'>";
	    var textRange; var j=0;
	    var tab = document.getElementById(tableID); // id of table
	    
	    tab_text=tab_text+tab.innerHTML;
	    tab_text=tab_text+"</table>";
	    //tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
	    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
	    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
	    tab_text= tab_text.replace(/>(0[^<]+)</gm, ">&nbsp;$1<"); 
	    
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE "); 

	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
	    {
	        txtArea1.document.open("txt/html","replace");
	        txtArea1.document.write(tab_text);
	        txtArea1.document.close();
	        txtArea1.focus(); 
	        var sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
	    }  
	    else {
	    	   
	    	    var blob = new Blob([tab_text], {type: 'application/vnd.ms-excel;charset=utf-8;'});
	    	    var a = document.createElement('a'); 
	    	    a.download = tableID+'.xls';   
	    	    a.href = URL.createObjectURL(blob); 
	    	    a.click();
	    
	    }
	   
	}
	
	render () {
		  return(
			<div className="table_function">
				<div className="button function_button" onClick={()=>{this.excel_export(this.table[STRUCT_TABLE][DATA_TABLE_ID])}}> 
				    <span><i className="fa fa-save"></i></span>
				    <span>&nbsp;{lang('Export')}</span>
				</div>
			</div>
		)  
	}
}

FuncExport.contextType = TableContext;
export default FuncExport
	  