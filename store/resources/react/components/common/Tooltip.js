import React, { Component } from 'react'
import Style from './Style'
import { render } from 'react-dom'

class ToolTip extends Component {
	
	constructor(props) {
	    super(props);
	    this.state={
	    		flag: false,
	    		text: ''
		}
		this.id = makeId();
	    
	}
	
	set(flag, text, scroll=true){
		this.setState({flag: flag, text: text});
		if(flag){
			setTimeout(()=>{this.setState({flag: false})}, 3000);
		}
		if(scroll){
			setTimeout(()=>{
			var elmnt = document.getElementById(this.id);
  			elmnt.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})},200);
		}
	}
	
	  render () {
		  
		  return (
				  <>
				  <Style id="wrgatgrtga">{`
						.input_tootip{
							position: absolute;
							border: solid thin orange;
							border-radius: 5px;
						    top: -42px;
						   
						}
						.input_tootip::before{
							content: '';
						    bottom: -8px;
							left: 45%;
						    border: solid thin orange;
						    position: absolute;
						    width: 16px;
						    height: 16px;
						    background: white;
						    transform: rotate(45deg);
						    z-index: 0;
							
						}
						.input_tootip div {
					    	padding: 5px;
							background: white;
							position:relative;
							border-radius: 5px;
							z-index:1;
							white-space: nowrap;
					    	
						}
						
						
					`}</Style>
					<div id={this.id} className="input_tootip" style={{display:this.state.flag?'block':'none'}}>
						<div className='box_flex'>
						<i className="fa fa-exclamation-circle" style={{color: 'orange'}}>
						</i>&nbsp;{this.state.text}</div>
					</div>
				  </>
		  )
		  
	  }
}




export default ToolTip;
	  