import React, { Component } from 'react'

class InputText extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    
	    this.state = {
	    	value: ''
	    }
	    
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, onChange, ...rent} = this.props;
		this.id = get(id, '');
		this.onChange = get(onChange, ()=>{})
	    this.decoratorOut = get(decoratorOut, function(data){return HtmlEncode(data)});
	    this.decoratorIn = get(decoratorIn, function(data){return HtmlDecode(data)});
	    this.rent = rent;
	}
	
	setValue(value){
		if(isset(this.decoratorIn)) value = this.decoratorIn(value);
		if(value == null) value = '';
		this.input.innerHTML = value;
	}
	
	getValue(){
		var value = this.input.innerHTML;
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		return value;
	}
	
	revertValue(value){
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		return value;
	}
	
	getInput(){
		return this.input;
	}

	
	render(){
		this.initial();
		return(
				<div
					ref = {input => this.input = input}
					contentEditable={true}
					{...this.rent}
				>
				</div>
		)
	}

	componentDidMount(){
		if(isset(this.props.value)){
			this.setValue(this.props.value);
		}
	}
}



export default InputText;