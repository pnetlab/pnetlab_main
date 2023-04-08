import React, { Component } from 'react'
class BtnLoad extends Component {
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	loading : false
	    }
	    
	}
	
	initial(){
		var {...rent} = this.props;
		this.rent = rent;
	}
	
	load(loading){
		this.setState({loading: loading});
	}
	
	render(){
		this.initial();
		var content = this.state.loading?(<i className="fa fa-refresh fa-spin"></i>): this.props.children;
		return(
				<div disabled={this.state.loading} {...this.rent}>{content}</div>
		)
	}
}

export default BtnLoad;