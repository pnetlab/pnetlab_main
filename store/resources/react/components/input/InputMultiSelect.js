import React, { Component } from 'react'

class InputMultiSelect extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    
	    this.state = {
	    	value: {}
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
		if(!isset(value) || values == '') values = {};
		if(typeof value != 'object') return;
		var values = {};
		for (let i in value){
			if(isset(this.decoratorIn)) value[i] = this.decoratorIn(value[i]);
			values[value[i]] = true;
		}
		
		this.setState({value: values});
	}
	
	getValue(){
		var values = this.state.value;
		var value = [];
		for (let i in values){
			if(values[i]){
				if(isset(this.decoratorOut)) {
					value.push(this.decoratorOut(i));
				}else{
					value.push(i);
				}
			}
		}
		
		return value;
	}
	
	updateValue(id, checked){
		var values = this.state.value;
		if(id == ''){
			for (let i in this.options){
				values[i] = checked;
			}
		}else{
			values[id] = checked;
		}
		
		this.setState({
			value: values
		}, ()=>{this.onChange(values)})
		
		
	}
	
	revertValue(value){
		//Using for import
		for (let i in value){
			if(isset(this.decoratorOut)) value[i] = this.decoratorOut(value[i]);
			if(isset(this.revert[value])) value[i] = this.revert[value[i]];
		}
		
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	drawOptions(){
		var optionHtml = [];
		for(let i in this.options){
			optionHtml.push(<div key={i} className="dropdown-item"><label><input checked={isset(this.state.value[i]) && this.state.value[i]} onChange={(event)=>{this.updateValue(i, event.target.checked)}} type="checkbox"/>&nbsp;{this.options[i]}</label></div>) ;
			this.revert[this.options[i]] = i;
		}
		return optionHtml;
	}
	
	componentDidMount(){
		this.setValue(this.props.value);
	}
	
	render(){
		this.initial();
		
		return(
				<div className="dropdown">
				  <div className="filter_item_input" data-toggle="dropdown" aria-haspopup="true" style={{cursor:'pointer'}}>
				  	&nbsp;{Object.keys(this.state.value).map((e)=>{if( e != '' && this.state.value[e]){return this.options[e]} }).filter((e)=>{return e}).join(', ')}
				  </div>
				  <div className="dropdown-menu" style={{maxHeight: 500, overflow: 'auto'}}>
				  	{this.drawOptions()}
				    
				  </div>
				</div>
		)
	}
}

export default InputMultiSelect;