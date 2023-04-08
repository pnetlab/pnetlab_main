import React, { Component } from 'react'
import {Link} from 'react-router-dom';
class FuncSpecial extends Component {
	
	constructor(props) {
	    super(props);
	}
	
	
	
	render () {
		  this.group = get(this.props.group, '');
		  return(
				  <div>
					 <div className="button" title="Customer table permission setting">
					 	<Link to={'/admin/permission/view?'+ GROUP_ID +'=' + this.group[GROUP_ID]}><i style={{color:'red'}} className="fa fa-table"></i></Link>
					 </div>
				</div>
		)  
				  
	}
}
export default FuncSpecial
	  