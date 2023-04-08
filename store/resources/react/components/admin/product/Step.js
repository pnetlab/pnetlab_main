import React, { Component } from 'react'
class Step extends Component {
	
	constructor(props) {
	    super(props);
	    this.id = makeId();
	}
	
	animate(animation){
		const element =  document.getElementById(this.id);
		element.classList.add('animated', animation)
		const handleAnimationEnd = () => {
			element.classList.remove('animated', animation)
			element.removeEventListener('animationend', handleAnimationEnd)
		}
		element.addEventListener('animationend', handleAnimationEnd)
	}
	
	// render(){
		
	// 	return <div style={this.props.style} id={this.id}>
			
			

	// 		{this.props.children}
		
	// 	</div>
	// }
}

export default Step;