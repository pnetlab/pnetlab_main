import React, { Component } from 'react'
import EditorItem from './EditorItem'

class FormEditor extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.items = {};
	    this.state = {
	    		select : {},
	    }
	    
	}
	
	initial(){
		this.id = get(this.props.id, '');
		this.select = get(this.props.select, false);
		this.struct = get(this.props.struct, {});
	}
	
	getValue(){
		let values = {};
		for (let i in this.struct){
			if(this.select){
				if(isset(this.state.select[i]) && this.state.select[i]){
					if(!this.items[i].validate()) return null
					values[i] = this.items[i].getValue();
				}
			}else{
				if(!this.items[i].validate()) return null
				values[i] = this.items[i].getValue();
			}
			
		}
		return values;
	}
	
	setValue(values){
		for (let i in this.struct){
			 this.items[i].setValue(values[i]);
		}
	}
	
	selectInput(id, value){
		var select = this.state.select;
		select[id] = value;
		this.setState({
			select: select
		})
	}
	
	drawForm(){
		
		let formitems = [];
		for (let i in this.struct){
			var select = '';
			if(this.select && this.struct[i][EDIT_MULTI] === false) continue;
			if(this.select) select = <input style={{margin:5}} type='checkbox' checked = {isset(this.state.select[i]) && this.state.select[i]==true} onChange={(event)=>{this.selectInput(i, event.target.checked)}}/>
			formitems.push( <div style={{display:'flex', alignItems: 'center'}} key={i}><EditorItem column={i} onChange={()=>{this.selectInput(i, true)}} form={this} key={i} ref={input=>this.items[i] = input} struct = {this.struct[i]}></EditorItem>{select}</div> )
		}
		
		return formitems;
	}
	
	reload(){
		this.forceUpdate();
	}
	
	render(){
		this.initial();
		return(
				<div>{this.drawForm()}</div>
		)
	}
}
FormEditor.contextType = TableContext;
export default FormEditor;