import React, { Component } from 'react'
import Style from './Style'
import { render } from 'react-dom'

class Loading extends Component {
	
	constructor(props) {
	    super(props);
	    this.state={
	    		flag: this.props.flag, 
	    		text: this.props.text,
				update: '',
				process: null,
		};
	    
	    
	}
	
	loading(flag, text, update='', process=null){
		this.setState({
			flag: flag, 
			text: text,
			update: update,
			process: process,
			});
	}
	update(update, process=null){
		this.setState({update, process});
	}
	
	  render () {
		  
		  return (
		  
		   <>
			<Style id="loadingcss">{`
				.loading_text {
					color: white;
					font-weight:bold;
				}
				.loading_container{
					margin: auto;
					text-align: center;
				}
				
				.loading_cover.none {
					display: none;
				}
				
				.loading_cover {
					position: fixed;
				    background: rgba(0, 0, 0, 0.2); 
					display: flex;
				    top: 0;
				    bottom: 0;
				    left: 0;
				    right: 0;
					z-index: 10000;
				}
				  .lds-spinner {
				  color: official;
				  display: inline-block;
				  position: relative;
				  width: 64px;
				  height: 64px;
				  margin: auto;
				}
				.lds-spinner div {
				  transform-origin: 32px 32px;
				  animation: lds-spinner 1.2s linear infinite;
				}
				.lds-spinner div:after {
				  content: " ";
				  display: block;
				  position: absolute;
				  top: 3px;
				  left: 29px;
				  width: 5px;
				  height: 14px;
				  border-radius: 20%;
				  background: white;
				}
				.lds-spinner div:nth-child(1) {
				  transform: rotate(0deg);
				  animation-delay: -1.1s;
				}
				.lds-spinner div:nth-child(2) {
				  transform: rotate(30deg);
				  animation-delay: -1s;
				}
				.lds-spinner div:nth-child(3) {
				  transform: rotate(60deg);
				  animation-delay: -0.9s;
				}
				.lds-spinner div:nth-child(4) {
				  transform: rotate(90deg);
				  animation-delay: -0.8s;
				}
				.lds-spinner div:nth-child(5) {
				  transform: rotate(120deg);
				  animation-delay: -0.7s;
				}
				.lds-spinner div:nth-child(6) {
				  transform: rotate(150deg);
				  animation-delay: -0.6s;
				}
				.lds-spinner div:nth-child(7) {
				  transform: rotate(180deg);
				  animation-delay: -0.5s;
				}
				.lds-spinner div:nth-child(8) {
				  transform: rotate(210deg);
				  animation-delay: -0.4s;
				}
				.lds-spinner div:nth-child(9) {
				  transform: rotate(240deg);
				  animation-delay: -0.3s;
				}
				.lds-spinner div:nth-child(10) {
				  transform: rotate(270deg);
				  animation-delay: -0.2s;
				}
				.lds-spinner div:nth-child(11) {
				  transform: rotate(300deg);
				  animation-delay: -0.1s;
				}
				.lds-spinner div:nth-child(12) {
				  transform: rotate(330deg);
				  animation-delay: 0s;
				}
				@keyframes lds-spinner {
				  0% {
				    opacity: 1;
				  }
				  100% {
				    opacity: 0;
				  }
				}
			`}</Style>
			
			<div className={"loading_cover" + (this.state.flag?"":" none ") + get(this.props.className, '')} style={this.props.style}>
			    <div className = "loading_container" style={{width:'50%', minWidth:300}}>
			        <div className="lds-spinner" >
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        	<div></div>
			        </div>
			        <div className="loading_text">{this.state.text}</div>
			        <div className="loading_text">{this.state.update}</div>
						  {this.state.process != null
							  ? <div className="progress" style={{backgroundColor:'white'}}>
								  	<div className="progress-bar progress-bar-striped active" role="progressbar" style={{width:`${this.state.process}%`}}>
									  {this.state.process}%
									</div>
							  </div>
							  : ''
						  }
					
			    </div>
		    </div>
	    </>
		  )
		  
	  }
}




export default Loading;
	  