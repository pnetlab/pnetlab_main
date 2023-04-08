import React, { Component } from 'react'

class InputCheck extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    
	    this.state = {
	    	checked: get(this.props.defaultChecked, false)
	    }
	}
	
	initial(){
		var {id, checked, onChange, defaultChecked, value, ...rent} = this.props;
		this.id = get(id, '');
		this.onChange = get(onChange, ()=>{});
	    this.rent = rent;
	    this.value = value;
	}
	
	setValue(checked){
		this.setState({checked: checked});
	}
	
	getValue(){
		var checked = this.state.checked;
		return checked;
	}
	
	getInput(){
		return this.input;
	}
	
	render(){
		this.initial();
		return(
				<input
					checked={this.state.checked} 
					onChange={(event) => {this.setState({checked: !this.state.checked}, ()=>{this.onChange(this.state.checked)})} }
					ref = {input => this.input = input}
					{...this.rent}
				>
				</input>
		)
	}
}

export default InputCheck;