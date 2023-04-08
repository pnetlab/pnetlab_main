import React, { Component } from 'react'

import Step_01 from '../../components/admin/product/Step_01'
import Step_02 from '../../components/admin/product/Step_02'
import Step_03 from '../../components/admin/product/Step_03'
import Step_04 from '../../components/admin/product/Step_04'
import Flow from '../../components/admin/product/Flow'
class Product extends Component {
	
	constructor(props) {
	    super(props);
	    
		this.lab = {};
		this.version = {};
		this.dependences = {};

		this.state = {
			step : 0, 
		}

		this.stepRefs = [];
	    
	    this.steps = [{
		    	'title': lang('Step 01'),
		    	'des': lang('Select Lab'),
		    	'comp': <Step_01 product={this} ref={step => this.stepRefs[0] = step} next={true}></Step_01>
		    },
		    {
		    	'title': lang('Step 02'),
		    	'des': lang('Fix a price'),
		    	'comp': <Step_02 product={this} ref={step => this.stepRefs[1] = step} next={true}></Step_02>
		    },
		    {
		    	'title': lang('Step 03'),
		    	'des': lang('Description'),
		    	'comp': <Step_03 product={this} ref={step => this.stepRefs[2] = step} next={true}></Step_03>
		    },
		    {
		    	'title': lang('Step 04'),
		    	'des': lang('Finish'),
		    	'comp': <Step_04 product={this} wrappedComponentRef={step => this.stepRefs[3] = step}></Step_04>
		    },
	    ];
	    
	    
	    
	    
	}
	    
	
	render () {
		
			
		
		
		  return(
			  <>
			  	<style>{`
			  		.product_input{
			  			width: 100%;
			  			border: solid thin darkgray;
			  			padding: 5px;
			  			border-radius: 5px;
			  		}
			  		.box_flex {
			  			display: flex;
			  			align-items: center;
			  		}
			  		.ck.ck-editor .ck-editor__editable {
			  		    min-height: 500px;
			  		}
			  		
			  	`}</style>
			  	
			  	
			  	
			  	<div className='container'>
			  		
			  		<br/>
			  	
			  		<Flow ref={flow=>this.flow=flow} product={this}></Flow>
			  		
			  		<br/>
			  		
			  		<div>
			  			{this.steps.map((item, key)=>{
			  				return <div key={key} style={{display: ((key)==this.state.step ? 'block': 'none')}}>{item.comp}</div>
			  			})}
			  		</div>
			  		
			  	</div>
			  	
			  	</>
			  )
	}
			  	
			  		
			  	
	
	
	
	
	componentDidMount(){
		if(isset(App.parsed['path'])){
			this.stepRefs[0].getDepends('/opt/unetlab/labs' + App.parsed['path']);
		}
	}
	
	
	
	
	
}

export default Product