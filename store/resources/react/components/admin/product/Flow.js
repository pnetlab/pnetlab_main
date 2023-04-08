import React, { Component } from 'react'
class Flow extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    		loading: false,
	    }
	    
	}
	
	
	
	
	
	render(){
		return <div className = 'box_flex' style={{flexWrap: 'wrap'}}>
			<style>{`
				.step_item{
				    flex-grow: 1;
					position:relative;
					justify-content: center;
					margin-top:5px;
					
				}
				.step_item::after{
					content: '';
				    width: 100%;
				    border-top: solid;
				    position: absolute;
				    left: 50%;
					border-color: gray;
				}
				.step_item:last-child::after{
					width: 0;
				}
				.step_item_frame{
					padding:20px;
					border: solid thin darkgray;
					border-radius:50%;
					z-index: 1;
					background: white;
					cursor: pointer;
					box-shadow: 2px 2px grey;
			    	background: beige;
					text-align: center;
				}
				
				.step_item_frame.active{
			    	background: #8bc34a;
					color: white;
				}
				@media only screen and (max-width: 768px) {
					  
					.step_item::after{
						display:none;
					}
					  
				}
				
			`}</style>
			{this.props.product.steps.map((item, key)=>
					<div key={key} className = 'step_item box_flex' onClick={()=>{
					if(this.props.product.state.complete) return;
					this.gotoStep(key);
				}}>
					<div className = {'step_item_frame ' + (this.props.product.state.step==(key)?'active':'')}>
						<h4 className='box_line'>{item.title}</h4>
						{item.des == ''? '' : <div>{item.des}</div>}
						{this.state.loading? <div>{lang("Loading")}...</div> : ''}
					</div>
				</div>
			)}
			
		</div>
		
		
	}
	
	gotoStep(step){
		
		var currentStep = this.props.product.state.step;
		if(currentStep == step) return ;
		var flow = (step > currentStep ? 'right': 'left');
		App.loading(true);
		setTimeout(()=>{
			this.props.product.setState({
				step: step,
			}, ()=>{
				App.loading(false);
				var animeClass = (flow == 'right') ? 'bounceInRight' : 'bounceInLeft'
				this.props.product.stepRefs[step].animate(animeClass)
			})
		}, 1);
	}

	nextStep(){
		this.gotoStep(this.props.product.state.step + 1);
	}

	preriodStep(){
		this.gotoStep(this.props.product.state.step - 1);
	}
	
}
export default Flow