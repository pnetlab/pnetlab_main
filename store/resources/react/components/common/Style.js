import React, { Component } from 'react'

class Style extends Component {
	
	constructor(props) {
	    super(props);
	    
	    
	    
    	if(typeof(global.uniqueLoader) == "undefined") global.uniqueLoader = {};
    	if(!global.uniqueLoader[this.props.id]){
    			
	    		var dataTemp = this.props.children.replace(/(\s{2})/g,'');
		    	global.uniqueLoader[this.props.id] = true;
		    	var style = document.createElement('style'); 
				style.type = 'text/css'; 
				style.id = this.props.id;
	            style.innerHTML = dataTemp;
		    	document.body.prepend(style);
    	}
	}
	
	shouldComponentUpdate(){
		return false;
	}
	
	 render () {
		 return <></>;
	 }
}

export default Style
	  