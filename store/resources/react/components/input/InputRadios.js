import React, { Component } from 'react'
import Style from '../common/Style'
class InputRadios extends Component {
	
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
		this.setState({value: value});
	}
	
	getValue(){
		var value = this.state.value;
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		return value;
	}
	
	revertValue(value){
		if(isset(this.decoratorOut)) value = this.decoratorOut(value);
		if(isset(this.revert[value])) value = this.revert[value];
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	onChangeHandle(id, value){
		if(value){
			this.setState({value: id}, ()=>{this.onChange(this.state.value)});
		}
		
	}
	
	drawOptions(){
		var optionHtml = [];
		for(let i in this.options){
			optionHtml.push(<div key={'checkbox'+this.id + i}>
				<label className='checkboxs_item'>	
					<input className='checkboxs_input' value={i} type="radio" checked={this.state.value==i} onChange={(event)=>{this.onChangeHandle(i, event.target.checked)}} {...this.rent}/>
					<span title={this.options[i]} className='checkboxs_text'>{this.options[i]}</span>
				</label>
				</div>) ;
			this.revert[this.options[i]] = i;
		}
		return optionHtml;
	}
	
	render(){
		this.initial();
		
		return(
				<>
				<Style id='input_checks_css'>{`
					.checkboxs{
						display: flex;
						flex-wrap: wrap;
					}
					.checkboxs_item {
					    display: flex;
					    align-items: center;
						padding: 5px;
						margin-bottom: 0px;
					}
					.checkboxs_text{
						width: 150px;
				    	font-weight: normal;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow:hidden;
						padding-left: 5px;
					}
					
				`}</Style>
				<div className="checkboxs">
					{this.drawOptions()}
				</div>
				</>
		)
	}
}

export default InputRadios;