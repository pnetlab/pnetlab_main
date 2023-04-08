import React, { Component } from 'react'

class InputDate extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    this.state = {
	    	value: this.decoratorIn(get(this.value, ''))
	    }
	    this.id = 'input_date' + Math.floor(Math.random() * 10000);
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, className, onChange, ...rent} = this.props;
		this.onChange = get(onChange, ()=>{});
	    this.decoratorOut = get(decoratorOut, function(data){ if(data == "") return data; else return moment(data, this.props.format).format('X')});
	    this.decoratorIn = get(decoratorIn, function(data){ if(data == "") return data; else return moment(data,'X').format(this.props.format)});
	    this.rent = rent;
	    this.className = get(className, '');
	    this.value = get(value, '');
	}
	
	setValue(value){
		if(isset(this.decoratorIn)) value = this.decoratorIn(value);
		if(value == null || value == "Invalid date"){value = ''}
		this.setState({value: value});
	}
	
	getValue(){
		var value = this.input.value;
		this.setState({value: value});
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		if(value == null || value == "Invalid date"){value = ''}
		return value;
	}
	
	revertValue(value){
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		if(value == null || value == "Invalid date"){value = ''}
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	componentDidMount(){
		try { 
			$("#"+this.id).datetimepicker({
				format: this.props.format,
			}).on('dp.hide', ()=>{this.onChange()});
		} catch(err){
			console.log(err)
		}
	}
	
	render(){
		this.initial();
		return(
				<input
					id={this.id}
					className = {'datepicker '+this.className}
					value={this.state.value} 
					onChange={(event)=>{this.setState({'value': event.target.value}, ()=>{this.onChange()})}}
					ref = {input => this.input = input}
					{...this.rent}
				>
				</input>
		)
	}
}

export default InputDate;