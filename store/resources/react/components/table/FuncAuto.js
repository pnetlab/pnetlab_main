import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncAuto extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    
	    this.state = {
	    		auto : false
	    }
	    
	    this.filterInterval = null;
	   
	}
	
	
	
	onClickHandle(){
		if(!this.state.auto){
			this.filterInterval = setInterval(()=>{this.table.filter()}, get(this.props.interval, 60000));
		}else{
			if(this.filterInterval) clearInterval(this.filterInterval);
		}
		this.setState({
			auto: !this.state.auto
		})
	}
	
	componentWillUnmount() {
		if(this.filterInterval) clearInterval(this.filterInterval);
    }
	
	render () {
		 
		  var text = get(this.props.text, 'Auto');
		  var autoUpdate = <i className="fa fa-toggle-off"></i>
			if(this.state.auto){
				autoUpdate = <i style={{color: '#457fca'}} className="fa fa-toggle-on"></i>
		  }
		  return(
				  <div className="table_function"> 
				  
					 <div className="button" title="Auto Refresh table" onClick={() => {this.onClickHandle()}} style={{display: 'flex'}}>
					 	{autoUpdate}&nbsp;{text}
					 </div>
					  
				</div>
		)  
	}
}

FuncAuto.contextType = TableContext;
export default FuncAuto
	  