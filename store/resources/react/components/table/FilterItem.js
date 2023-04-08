import React, { Component } from 'react'
import Input from '../input/Input'
import Style from '../common/Style'
class FilterItem extends Component {
	
	constructor(props) {
	    super(props);
	}
	
	initial(){
		var {id, struct, colID, ...rent} = this.props;
		this.struct = get(struct, {});
	    this.id = get(id, '');
	    this.colID = colID;
	    this.rent = rent;
	    this.logic = this.struct[FILTER_LOGIC]
	    this.input_truct = {
			[INPUT_NAME] : this.struct[FILTER_NAME],
			[INPUT_TYPE] : this.struct[FILTER_TYPE],
			[INPUT_LIMIT] : this.struct[FILTER_LIMIT],
			[INPUT_FORMAT] : this.struct[FILTER_FORMAT],
			[INPUT_OPTION] : this.struct[FILTER_OPTION],
			[INPUT_STYLE_INPUT] : this.struct[FILTER_STYLE_INPUT],
			[INPUT_DECORATOR_IN] : this.struct[FILTER_DECORATOR_IN],
			[INPUT_DECORATOR_OUT] : this.struct[FILTER_DECORATOR_OUT],         
			[INPUT_SUGGEST] : this.struct[FILTER_SUGGEST],         
			
	    };
	    
	    this.onChangeBlur = this.props.onChangeBlur;
		  
	}
	
	setValue(value){
		if(this.struct[FILTER_TYPE] == 'date'){
			
			if(!value){
				this.input_min.setValue('');
				this.input_max.setValue('');
			}else{
				this.input_min.setValue(value['data'][0][1]);
				this.input_max.setValue(value['data'][1][1]);
			}
			
		}else if(this.struct[FILTER_TYPE] == 'check'){
			
			if(!value){
				this.input.setValue('');
			}else{
				this.input.setValue(value['data'].map((e)=>{return e[1]}));
			}
			
		}else{
			
			if(!value){
				this.input.setValue('');
			}else{
				this.input.setValue(value['data'][0][1]);
			}
			
		}
	}
	
	getValue(){
		 
		if(this.struct[FILTER_TYPE] == 'date'){
			return {
			        'logic' : 'and',
			        'data' : [['>=', this.input_min.getValue()],
						       ['<=', this.input_max.getValue()]]
			        
			}
			
		}

		if(this.struct[FILTER_TYPE] == 'check'){
			var value = this.input.getValue();
			var data = [];
			for (let i in value){
				data.push(['=', value[i]])
			}
			
			return {
			        'logic' : 'or',
			        'data' : data
			}
		}
		
		return {
		        'logic' : 'and',
		        'data' : [[this.getLogic(), this.input.getValue()]]
		}
		
	}
	
	getInput(){
		return this.input.getInput();
	}
	
	getLogic(){
		if(isset(this.logic)) return this.logic;
		if(this.struct[FILTER_TYPE] == 'text') return 'contain';
		if(this.struct[FILTER_TYPE] == 'number') return '=';
		return '=';
	}
	
	drawInput(){
	  
		switch(this.struct[FILTER_TYPE]) {
		case 'select':{
			return(
				<>
				  <div className = "filter_item">
					  <div className = "filter_text" title={this.struct[FILTER_NAME]}>{this.struct[FILTER_NAME]}</div>
					  <div className = "filter_input"><Input ref={input => this.input = input} className = "filter_item_input" struct={this.input_truct} onChange={this.onChangeBlur} {...this.rent}></Input></div> 
				  </div>
				</>
			);
		}
		
		case 'check':{
			this.input_truct[INPUT_TYPE] = 'multiSelect';
			return(
				<>
				  <div className = "filter_item">
					  <div className = "filter_text" title={this.struct[FILTER_NAME]}>{this.struct[FILTER_NAME]}</div>
					  <div className = "filter_input"><Input ref={input => this.input = input} className = "filter_item_input" struct={this.input_truct} onChange={this.onChangeBlur} {...this.rent}></Input></div> 
				  </div>
				</>
			);
		}
		
		case 'date':{
			return(
				<>
				  <div className = "filter_item">
				  	  <div className = "filter_text" title={this.struct[FILTER_NAME]}>{this.struct[FILTER_NAME]}</div>
					  <div className = "filter_input" style={{position:'relative', display: 'flex'}}>
						  <Input ref={input => this.input_min = input} className = "filter_item_input" struct={this.input_truct} onChangeBlur={this.onChangeBlur} {...this.rent}></Input>
						  <Input ref={input => this.input_max = input} className = "filter_item_input" struct={this.input_truct} onChangeBlur={this.onChangeBlur} {...this.rent}></Input>
					  </div> 
				  </div>
				</>
			);
		}
		  default:
			  
			  return(
					  <>
					  <div className = "filter_item">
					  	  <div className = "filter_text" title={this.struct[FILTER_NAME]}>{this.struct[FILTER_NAME]}</div>
						  <div className = "filter_input"><Input ref={input => this.input = input} className = "filter_item_input" struct={this.input_truct} onChangeBlur={this.onChangeBlur} {...this.rent}></Input></div> 
					  </div>
		  			</>
		  			);
		}
	}
	
	render(){
		this.initial();
		return(
			<React.Fragment>
				{this.drawInput()}
			</React.Fragment>
		)
	}
}

export default FilterItem;