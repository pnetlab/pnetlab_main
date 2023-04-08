import React, { Component } from 'react'
import Folder from '../func/FuncFolder'
class Flow extends Component {
	
	constructor(props) {
	    super(props);
	    this.frame = this.props.frame;
	    this.state = {
	    		step = 0,
	    		disable = false,
	    }
	}
	
	disable(disable = true){
		this.setState({
			disable: disable,
			step: 0,
		})
	}
	
	
	gotoStep(step){
		if(this.state.disable) return;
		this.setState({
			step: step
		})
		this.frame.gotoStep(step);
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
			{this.product.steps.map((item, key)=>
					<div key={key} className = 'step_item box_flex' onClick={()=>{
					
				}}>
					<div className = {'step_item_frame ' + (this.state.step==(key)?'active':'')}>
						<h4 className='box_line'>{item.title}</h4>
						{item.des == ''? '' : <div>{item.des}</div>}
					</div>
				</div>
			)}
			
		</div>
		
		
	}
	
}
export default Flow