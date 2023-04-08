import React, { Component } from 'react'

class Script extends Component { 
	
	constructor(props) {
	    super(props);
	    if(typeof(global.uniqueLoader) == "undefined") global.uniqueLoader = {};
	    this.id = this.props.id? this.props.id: Math.random();
	    if(!global.uniqueLoader[this.id]){
	    	global.uniqueLoader[this.id] = true;
	    	const script = document.createElement("script");
	        script.src = this.props.src
	        script.onload = () =>{
	            if(this.props.onLoad != null){
	            	this.props.onLoad();
	            }
	        };
	        if(this.props.onStart !=null){
	        	this.props.onStart();
	        }
	        document.body.appendChild(script); 
	    }
	}
	
	shouldComponentUpdate(){
		return false;
	}
	
	render(){
		return(<React.Fragment/>);
	}
}
export default Script
	  