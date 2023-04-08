import React, { Component } from 'react'
import InputText from './InputText'
import InputTextarea from './InputTextarea'
import InputSelect from './InputSelect'
import InputChecks from './InputChecks'
import InputRadios from './InputRadios'
import InputDate from './InputDate'
import InputMoney from './InputMoney'
import InputPhone from './InputPhone'
import InputHtml from './InputHtml'
import InputColor from './InputColor'
import InputMultiSelect from './InputMultiSelect'
import InputFile from './InputFile'
import InputImg from './InputImg'
import Tooltip from '../common/Tooltip'
class Input extends Component {
	
	constructor(props) {
	    super(props);
	    this.oldValue = '';
	    this.id = "input"+Math.ceil(Math.random()*1000000);
	}
	
	initial(){
		var {id, struct, onBlur, onFocus, onClick, onDoubleClick, onChange, onChangeBlur, ...rent} = this.props;
		this.struct = get(struct, {});
	    this.rent = rent;
	   
	}
	
	
	setValue(value){
		this.oldValue = value;
		return this.input.setValue(value);
	}
	
	getValue(){
		var value = this.input.getValue();
		if(!this.validate(value)) return null;
		this.oldValue = value;
		return value;
	}
	
	getInput(){
		return this.input;
	}
	
	onBlurHandle(event){
		
		var value = this.input.getValue();
		
		if(isset(this.props.onBlur)) this.props.onBlur(event, this);
		if(isset(this.struct[INPUT_ONBLUR])) this.struct[INPUT_ONBLUR] (event, this);
		
		if(value == this.oldValue) return;
		if(isset(this.struct[INPUT_ONCHANGE_BLUR])) this.struct[INPUT_ONCHANGE_BLUR] (event, this);
		if(isset(this.props.onChangeBlur)) this.props.onChangeBlur(event, this);
		
		
		
	}
	onFocusHandle(event){
		if(isset(this.props.onFocus))this.props.onFocus(event, this);
		if(isset(this.struct[INPUT_ONFOCUS])) this.struct[INPUT_ONFOCUS] (event, this);
	}
	
	onClickHandle(event){
		if(isset(this.props.onClick))this.props.onClick(event, this);
		if(isset(this.struct[INPUT_ONCLICK])) this.struct[INPUT_ONCLICK] (event, this);
	}
	
	onDoubleClickHandle(event){
		if(isset(this.props.onDoubleClick))this.props.onDoubleClick(event, this);
		if(isset(this.struct[INPUT_DBCLICK])) this.struct[INPUT_DBCLICK] (event, this);
	}
	
	onChangeHandle(event){
		if(isset(this.props.onChange)){this.props.onChange(event, this)}
		if(isset(this.struct[INPUT_ONCHANGE])) this.struct[INPUT_ONCHANGE] (event, this);
	}
	
	validate(value=null){
		if(value==null) value = this.input.getValue();
		this.tooltip.set(false,'');
		if(this.struct[INPUT_NULL] == false){
			if(value == ''){
				this.tooltip.set(true, lang('Please fill out this field'));
				return false;
			}
			
		}else{
			if(value == ''){
				return true;
			}
		}
		
		if(this.struct[INPUT_VALIDATION] == 'email'){
			if(!/^[\w\d\.\-\+\_]+\@[\w\d\.\-\+\_]+$/.test(value)){
				this.tooltip.set(true, lang('This field\'s value must be an Email'));
				return false;
			}else{
				return true;
			}
		}
		
		if(this.struct[INPUT_VALIDATION] == 'phone'){
			if(!/[+\d]{10,11}/.test(value)){
				this.tooltip.set(true, lang('This field\'s value must be a Phone Number'));
				return false;
			}else{
				return true;
			}
		}
		
		if(this.struct[INPUT_VALIDATION] && this.struct[INPUT_VALIDATION].test){
			if(!this.struct[INPUT_VALIDATION].test(value)){
				this.tooltip.set(true, lang('Value must satisfy regex ' + this.struct[INPUT_VALIDATION]));
				return false;
			}else{
				return true;
			}
		}
		
		if(typeof this.struct[INPUT_VALIDATION] == 'function'){
			var result = this.struct[INPUT_VALIDATION](value)
			if(result === true) return true;
			this.tooltip.set(true, lang(result));
			return false;
		}
		
		
		return true;
	}
	
	drawInput(){
		
		switch(this.struct[INPUT_TYPE]) {
		
		  case 'text':
			 
		    return(
			    	<InputText 
	                    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
			    		decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
			    		decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
	                    type = "text" 
	                    autoComplete = "on" 
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
			    		ref = {input => {this.input = input}}
			    	
			    		onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
			    	
			    		options = {get(this.struct[INPUT_OPTION], [])}
			    		suggest = {this.struct[INPUT_SUGGEST]}
			    		{...this.rent}
			    	>
	                </InputText>
	                
		    );
		    break;
		    
		  case 'select':
			 
		    return(
			    	<InputSelect 
	                    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
			    		decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
			    		decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
			    		options = {this.struct[INPUT_OPTION]}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
			    		ref = {input => {this.input = input}}
			    		
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}

			    		{...this.rent}
			    	>
	                </InputSelect>
		    );
		    break;
		    
		  case 'checkbox':
				 
			    return(
				    	<InputChecks 
		                    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}))}
		                    value = {get(this.struct[INPUT_DEFAULT], '')}
				    		decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
				    		decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
				    		options = {this.struct[INPUT_OPTION]}
		                    id = {this.id}
				    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
				    		ref = {input => {this.input = input}}

					    	onClick = {(event)=>{this.onClickHandle(event)}}
					    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					    	onChange = {(event)=>{this.onChangeHandle(event)}}
				    	
				    		{...this.rent}
				    	>
		                </InputChecks>
			    );
			    break;
			    
		  case 'multiSelect':
				 
			    return(
				    	<InputMultiSelect 
		                    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}))}
		                    value = {get(this.struct[INPUT_DEFAULT], '')}
				    		decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
				    		decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
				    		options = {this.struct[INPUT_OPTION]}
		                    id = {this.id}
				    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
				    		ref = {input => {this.input = input}}

					    	onClick = {(event)=>{this.onClickHandle(event)}}
					    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					    	onChange = {(event)=>{this.onChangeHandle(event)}}
				    	
				    		{...this.rent}
				    	>
		                </InputMultiSelect>
			    );
			    break;
		  case 'radio':
			  
			  return(
					  <InputRadios
					  style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}))}
					  value = {get(this.struct[INPUT_DEFAULT], '')}
					  decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
					  decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
					  options = {this.struct[INPUT_OPTION]}
					  id = {this.id}
					  disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  ref = {input => {this.input = input}}

					    onClick = {(event)=>{this.onClickHandle(event)}}
					    onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					    onChange = {(event)=>{this.onChangeHandle(event)}}
					  
					  {...this.rent}
					  >
					  </InputRadios>
			  );
			  break;
		  case "textarea":
			  return(
					 <InputTextarea 
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {this.struct[INPUT_DECORATOR_IN]}
			    		decoratorOut = {this.struct[INPUT_DECORATOR_OUT]}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}

					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputTextarea>
			    	);
		    break;
		    
		  case "date":
			  return(
					 <InputDate
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
			    		decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}
					 
					 	format = {get(this.struct[INPUT_FORMAT], DATE_FORMAT)}
					 	
					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputDate>
			    	);
		    break;
		    
		  case "money":
			  return(
					 <InputMoney
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
			    		decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}
					 	
					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputMoney>
			    	);
		    break;
		    
		  case "phone":
			  return(
					 <InputPhone
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
			    		decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}
					 	
					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputPhone>
			    	);
		    break;
		    
		  case "html":
			  return(
					 <InputHtml
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%', border:'solid thin darkgray', minHeight:50})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
			    		decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}
					 
					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
				    	onFocus = {(event)=>{this.onFocusHandle(event)}}
				    	onClick = {(event)=>{this.onClickHandle(event)}}
				    	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				    	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputHtml>
			    	);
		    break;
		  case "color":
			  return(
					  <InputColor
					  style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%', border:'solid thin darkgray', minHeight:50})}
					  value = {get(this.struct[INPUT_DEFAULT], '')}
					  decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
					  decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
					  id = {this.id}
					  disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  ref = {input => {this.input = input}}
					  
					  onBlur = {(event)=>{this.onBlurHandle(event)}}
					  onFocus = {(event)=>{this.onFocusHandle(event)}}
					  onClick = {(event)=>{this.onClickHandle(event)}}
					  onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					  onChange = {(event)=>{this.onChangeHandle(event)}}
					  
					  {...this.rent}
					  >
					  </InputColor>
			  );
			  break;
			  
		  case "file":
			  return(
					 <InputFile
					    style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%', border:'solid thin darkgray', minHeight:50})}
	                    value = {get(this.struct[INPUT_DEFAULT], '')}
					  	decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
			    		decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	                    id = {this.id}
			    		disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  	ref = {input => {this.input = input}}
					 	upload_link = {get(this.struct[INPUT_UPLOAD], null)}
					 
					 	onBlur = {(event)=>{this.onBlurHandle(event)}}
					  	onFocus = {(event)=>{this.onFocusHandle(event)}}
					  	onClick = {(event)=>{this.onClickHandle(event)}}
					  	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					  	onChange = {(event)=>{this.onChangeHandle(event)}}
					 
					 	{...this.rent}
					 >
	                </InputFile>
			    	);
		    break;
		  case "image":
			  return(
					  <InputImg
					  style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%', border:'solid thin darkgray', minHeight:50})}
					  value = {get(this.struct[INPUT_DEFAULT], '')}
					  decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
					  decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
					  id = {this.id}
					  disabled = {!get(this.struct[INPUT_WRITABLE], true)}
					  ref = {input => {this.input = input}}
					  upload_link = {get(this.struct[INPUT_UPLOAD], null)}
					  
					  onBlur = {(event)=>{this.onBlurHandle(event)}}
					  onFocus = {(event)=>{this.onFocusHandle(event)}}
					  onClick = {(event)=>{this.onClickHandle(event)}}
					  onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
					  onChange = {(event)=>{this.onChangeHandle(event)}}
					  
					  {...this.rent}
					  >
					  </InputImg>
			  );
			  break;
		    
		  default:
			  return(<InputText 
	              style = {Object.assign({}, get(this.struct[INPUT_STYLE_INPUT], {}), {width:'100%'})}
	              value = {get(this.struct[INPUT_DEFAULT], '')}
		    	  decoratorIn = {get(this.struct[INPUT_DECORATOR_IN], null)}
		    	  decoratorOut = {get(this.struct[INPUT_DECORATOR_OUT], null)}
	              type = {this.struct[INPUT_TYPE]} 
	              id = {this.id}
	    		  disabled = {!get(this.struct[INPUT_WRITABLE], true)}
	    		  ref = {input => {this.input = input}}
			  
				  onBlur = {(event)=>{this.onBlurHandle(event)}}
				  onFocus = {(event)=>{this.onFocusHandle(event)}}
				  onClick = {(event)=>{this.onClickHandle(event)}}
				  onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
				  onChange = {(event)=>{this.onChangeHandle(event)}}
			  
			  	  {...this.rent}
	    	  >
          	</InputText>);
		}
	}
	
	render(){
		this.initial();
		return get(this.struct[INPUT_WRITABLE], true) ? 
			 <div style={{position:'relative'}}>
				<Tooltip ref={tooltip => this.tooltip = tooltip}></Tooltip>
				{this.drawInput()}
			</div>
		:
			<div style={{position:'relative'}}
				onClick = {(event)=>{this.onClickHandle(event)}}
			  	onDoubleClick = {(event)=>{this.onDoubleClickHandle(event)}}
			>
				<Tooltip ref={tooltip => this.tooltip = tooltip}></Tooltip>
				{this.drawInput()}
			</div>
			
	}
}

export default Input;