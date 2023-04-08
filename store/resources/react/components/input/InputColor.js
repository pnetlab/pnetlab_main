import React, { Component } from 'react'
import Style from '../common/Style'

class InputColor extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.initial();
	    
	    this.state = {
	    	value: get(this.props.value, '')
	    }
	    
	    this.colorlib=['#ffffff','#000000','#f44336', 
	                   '#e91e63', '#9c27b0', '#673ab7', 
	                   '#3f51b5', '#2196f3', '#03a9f4', 
	                   '#00bcd4', '#009688', '#4caf50', 
	                   '#8bc34a', '#cddc39', '#ffeb3b', 
	                   '#ffc107', '#ff9800', '#ff5722', 
	                   '#795548', '#9e9e9e', '#607d8b'];
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
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	drawOptions(){
		var optionHtml = [];
		for(let i in this.colorlib){
			optionHtml.push(<div style={{background: this.colorlib[i]}} className="color_item button" key={i} onClick={()=>{this.setState({value: this.colorlib[i]})} }></div>) ;
		}
		return optionHtml;
	}
	
	render(){
		this.initial();
		
		return(
				<>
				<Style id="color_picker_css">{`
					.color_frame {
						display: flex;
						flex-wrap: wrap;
						padding: 5px;
				
					}
					.color_item {
						width: 25px;
						height: 25px;
						margin: 2px;
						width: 25px;
					    height: 25px;
					    margin: 2px;
					    border-radius: 4px;
					    border: solid thin #607D8B;
						
					}
				`}</Style>
				<div className="btn-group dropup">
				  <input style={{background: this.state.value, fontWeight:'bold', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'}} 
				  	  type="text" className="dropdown-toggle button editor_item_input" 
					  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
					  onChange={(event)=>{this.setState({value: event.target.value})}}
				  	  value = {this.state.value}
				  ></input>
				  <div className="dropdown-menu">
				  	<div className="color_frame">
				    {this.drawOptions()}
				    </div>
				  </div>
				</div>
				</>
		)
	}
}

export default InputColor;