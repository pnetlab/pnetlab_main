import React, { Component } from 'react'

class FuncRefreshGroup extends Component {
	
	constructor(props) {
	    super(props);
	}
	
	refreshGroup(){
		 if(isset(this.props.parent)) this.props.parent.refresh();
	}
	
	render () {
		  return(
				  <div>
					 <div className="button" title="Refresh" onClick={function(){this.refreshGroup()}.bind(this)}>
					 	<i className="fa fa-refresh"></i>
					 </div>
				</div>
		)  
				  
	}
}
export default FuncRefreshGroup
	  