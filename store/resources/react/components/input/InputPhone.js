import React, { Component } from 'react'

class InputPhone extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	value: get(this.props.value, '')
	    }
	    
	    this.initial();
	    this.oldValue;
	    this.network = '';
	    
	    this.listNetwork = {
    		'8486' : 'Viettel',
    		'8496' : 'Viettel',
    		'8497' : 'Viettel',
    		'8498' : 'Viettel',
    		'8432' : 'Viettel',
    		'8433' : 'Viettel',
    		'8434' : 'Viettel',
    		'8435' : 'Viettel',
    		'8436' : 'Viettel',
    		'8437' : 'Viettel',
    		'8438' : 'Viettel',
    		'8439' : 'Viettel',
    		'8489' : "MobiFone",
    		'8490' : "MobiFone",
    		'8493' : "MobiFone",
    		'8470' : "MobiFone",
    		'8479' : "MobiFone",
    		'8477' : "MobiFone",
    		'8476' : "MobiFone",
    		'8478' : "MobiFone",
    		'8488' : "VinaPhone",
    		'8491' : "VinaPhone",
    		'8494' : "VinaPhone",
    		'8483' : "VinaPhone",
    		'8484' : "VinaPhone",
    		'8485' : "VinaPhone",
    		'8481' : "VinaPhone",
    		'8482' : "VinaPhone",
    		'8492': "Vietnamobile",
    		'8456': "Vietnamobile",
    		'8458': "Vietnamobile",
    		'84099': "Gmobile",
    		'84059': "Gmobile",
    		'086' : 'Viettel',
    		'096' : 'Viettel',
    		'097' : 'Viettel',
    		'098' : 'Viettel',
    		'032' : 'Viettel',
    		'033' : 'Viettel',
    		'034' : 'Viettel',
    		'035' : 'Viettel',
    		'036' : 'Viettel',
    		'037' : 'Viettel',
    		'038' : 'Viettel',
    		'039' : 'Viettel',
    		'089' : "MobiFone",
    		'090' : "MobiFone",
    		'093' : "MobiFone",
    		'070' : "MobiFone",
    		'079' : "MobiFone",
    		'077' : "MobiFone",
    		'076' : "MobiFone",
    		'078' : "MobiFone",
    		'088' : "VinaPhone",
    		'091' : "VinaPhone",
    		'094' : "VinaPhone",
    		'083' : "VinaPhone",
    		'084' : "VinaPhone",
    		'085' : "VinaPhone",
    		'081' : "VinaPhone",
    		'082' : "VinaPhone",
    		'092': "Vietnamobile",
    		'056': "Vietnamobile",
    		'058': "Vietnamobile",
    		'099': "Gmobile",
    		'059': "Gmobile"
	    }
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, onChange, onChangeBlur, onBlur, ...rent} = this.props;
		this.id = get(id, '');
		
		this.onChange = get(onChange, ()=>{});
		this.onChangeBlur = get(onChangeBlur, ()=>{});
		this.onBlur = get(onBlur, ()=>{});
		
	    this.decoratorOut = get(decoratorOut, (data)=>{return this.formatNumber(data)});
	    this.decoratorIn = get(decoratorIn, (data)=>{return this.formatNumber(data)});
	    this.rent = rent;
	}
	
	 clearNumber(string){
		return string.toString().replace(/[^\d\-\+]/g,'');
	}
	
	 formatNumber(num) {
		  num = this.clearNumber(num);
		  
		  if(num[0] == '0'){
              num = '84' + num.slice(1);
          }

		  if(num[0] == '+'){
              num = num.slice(1);
          }

		  var prefix = /(\84\d{2})/.exec(num);
		  if(prefix){
			  if(isset(this.listNetwork[prefix[0]])){
				  this.network = this.listNetwork[prefix[0]];
			  }
		  }
		  
//		  var prefix = /^(0\d{2})/.exec(num);
//		  if(prefix){
//			  if(isset(this.listNetwork[prefix[0]])){
//				  this.network = this.listNetwork[prefix[0]];
//			  }
//		  }
		  
		  return num;
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

export default InputPhone;