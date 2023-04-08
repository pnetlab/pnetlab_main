import React, { Component } from 'react'

class InputSelect extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    
	    this.state = {
	    	value: get(this.props.value, '')
	    }
	    this.revert = {};
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, options, onChange, ...rent} = this.props;
		this.id = get(id, '');
		this.onChange = get(onChange, ()=>{});
	    this.decoratorOut = get(decoratorOut, null);
	    this.decoratorIn = get(decoratorIn, null);
	    this.options = get(options, []);
	    this.rent = rent;
	}
	
	setValue(value){
		if(isset(this.decoratorIn)) value = this.decoratorIn(value);
		if(value == null) value = '';
		this.setState({value: value});
	}
	
	getValue(){
		var value = this.state.value;
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		return value;
	}
	
	revertValue(value){
		//Using for import
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		if(isset(this.revert[value])) value = this.revert[value];
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	drawOptions(){
		var optionHtml = [];
		for(let i in this.options){
			optionHtml.push(<option key={'option'+this.id + i} value={i}>{this.options[i]}</option>) ;
			this.revert[this.options[i]] = i;
		}
		return optionHtml;
	}
	
	render(){
		this.initial();
		
		return(
				<select
					value={this.state.value} 
					onChange={function(event){this.setState({'value': event.target.value}, (event)=>{this.onChange(event, this.getValue())})}.bind(this)}
					ref = {input => this.input = input}
					{...this.rent}
				>
				{this.drawOptions()}
				</select>
		)
	}
}

export default InputSelect;