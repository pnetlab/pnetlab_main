import React, { Component } from 'react'
import Group from './Group'
class Frame extends Component { 
	
	constructor(props) {
	    super(props);
	    this.state={
	    		rootGroups: {},
	    		user: {}
	    };
	    this.dragComp = null;
	  }
	
	setDragComp(comp){
		console.log(comp); 
		console.log('teata');
		this.dragComp = comp;
		
		
	} 
	
	getDragComp(){
		return this.dragComp;
	} 
	
	createRootGroups(){
		let rootGroups = this.state.rootGroups;
		let output = [];
		if(count(rootGroups) == 0) return output;
		
		for(let i = 0; i < count(rootGroups); i++ ){
			output.push(<Group key={rootGroups[i][global.GROUP_ID]} frame={this} group={rootGroups[i]} member={this.state.user} expand={true} root={true}></Group>); 
		}
		return output;
	}
	
	componentDidMount () {
	    axios.post('/auth/account/getInitialGroup')
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.setState({ 
	    			  rootGroups : response['data']['groups'], 
	    			  user : response['data']['user'] });
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	  }
	 
	  render () {
		  return(
				  <div>
					  {this.createRootGroups()}
					  
				  </div>
				  );
	  }
}

export default Frame;
	  