import React, { Component } from 'react'
import Menu from '../menu/MenuClient'
import scss from '@root/assets/css/constants'

class Layout extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
			menu: this.loadDefault(),
			page: '',
	    }
	    
	}
	
	loadDefault(){
		if(window.location.href.includes('auth/login')) return 'closed';
		return '';
	}

	closeMenu(){
		this.setState({menu: 'closed'});
	}

	openMenu(){
		this.setState({menu: ''});
	}

	getMenuState(){
		return this.state.menu;
	}

	
	render () { 
		return(
				
		  <>
		  
		  	<style>{`
				.modal {
					left: ${this.state.menu == '' ? scss.menu_left : 0};
		  			max-width: ${screen.width * 1.25}
				}
			`}</style>
			
	  
		  	  {this.state.menu=='closed'? '' : <Menu layout = {this}></Menu>}
		  
		      <div className = {"main "+this.state.menu}>
				  	{this.props.children}
			  </div>
			  
		  </>	
		  );
	}
}
export default Layout
	  