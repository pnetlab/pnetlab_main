import React, { Component } from 'react'

class Load extends Component {
	
	constructor(props) {
	    super(props);
	    if(typeof(global.uniqueLoader) == "undefined") global.uniqueLoader = {};
	}
	
	shouldComponentUpdate(){
		return false;
	}

	
	  render () {
		  if(global.uniqueLoader[this.props.id]){
			  return(<React.Fragment/>);
		  }else{
			  global.uniqueLoader[this.props.id] = true;
			  return (this.props.children);
		  }
		  
	  }
}
export default Load 
	  