import React, { Component } from 'react'
import Input from './Input'
import (/* webpackMode: "eager" */ './responsive/input.scss')

class FormInput extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	struct : this.props.struct
	    }
	    
	    this.items = {};
	    this.initial();
	}
	
	initial(){
		this.id = get(this.props.id, '');
	}
	
	getValue(){
		let values = {};
		for (let i in this.state.struct){
			if(!this.items[i].validate()) return null
			values[i] = this.items[i].getValue();
		}
		return values;
	}
	
	
	
	setValue(values){
		
		for (let i in this.state.struct){
			 this.items[i].setValue(get(values[i], ''));
		}
	}
	
	drawForm(){
		let formInputs = [];
		for (let i in this.state.struct){
			formInputs.push(
					<div className="input_item" key={i}>
						<div className="input_item_text">{this.state.struct[i][INPUT_NAME]}</div>
						<div className="">
							<Input className="input_item_input" ref={input=>this.items[i] = input} struct = {this.state.struct[i]}></Input>
						</div>
					</div>
			)
		}
		
		return formInputs;
	}
	
	
	
	render(){
		return(
				<div>{this.drawForm()}</div>
		)
	}
}

export default FormInput;