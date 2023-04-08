import React, { Component } from 'react'
import FormEditor from './FormEditor' 

class FuncUpload extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    
	}
	render () {
		  return(
				  <div className="button" title="Files Management" onClick={() => {
					  this.table[this.props.modal].scand();
					  this.table[this.props.modal].modal();
				  }}
				  style={{display: 'flex'}}>
				 	<i className="fa fa-file-o"></i>&nbsp;{lang('Files')}
				  </div>
				  
		)  
	}
}
FuncUpload.contextType = TableContext;
export default FuncUpload
	  