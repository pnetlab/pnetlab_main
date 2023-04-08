import React, { Component } from 'react'

class InputMoney extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	value: get(this.props.value, '')
	    }
	    
	    this.initial();
	    this.oldValue;
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, onChange, onChangeBlur, onBlur, ...rent} = this.props;
		this.id = get(id, '');
		
		this.onChange = get(onChange, ()=>{});
		this.onChangeBlur = get(onChangeBlur, ()=>{});
		this.onBlur = get(onBlur, ()=>{});
		
	    this.decoratorOut = get(decoratorOut, (data)=>{return this.clearNumber(data)});
	    this.decoratorIn = get(decoratorIn, (data)=>{return this.formatNumber(data)});
	    this.rent = rent;
	}
	
	 clearNumber(string){
		return string.toString().replace(/[^\d\-]/g,'');
	}
	
	 formatNumber(num) {
		  num = this.clearNumber(num);
		  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}
	
	setValue(value, callback = ()=>{}){
		this.oldValue = this.state.value;
		if(this.decoratorIn) value = this.decoratorIn(value);
		if(value == null) value = '';
		this.setState({value: value}, ()=>{callback()});
	}
	
	getValue(){
		var value = this.state.value;
		if(this.decoratorOut) value = this.decoratorOut(value);
		return value;
	}
	
	revertValue(value){
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	onBlurHandle(){
		if(isset(this.onBlur))this.onBlur();
		if(this.state.value == this.oldValue) return;
		if(isset(this.onChangeBlur))this.onChangeBlur();
	}
	
	render(){
		this.initial();
		return(
				<input
					value={this.state.value} 
					onChange={function(event){this.setValue(event.target.value, (event)=>{this.onChange()})}.bind(this)} 
					ref = {input => this.input = input}
					type='text'
					onBlur = {()=>this.onBlurHandle()}
					{...this.rent}
				>
				</input>
		)
	}
}

export default InputMoney;