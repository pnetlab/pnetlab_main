import React, { Component } from 'react'

class FuncDelMem extends Component {
	
	constructor(props) {
	    super(props);
	}
	
	delGroup(){
		Swal({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
			  if (result.value) {
				  
				  axios.request ({
					    url: '/auth/account/member_del',
					    method: 'post',
					    data:{
						    	[global.GROUP_ID]: this.props.group[global.GROUP_ID],
						    	[global.AUTHEN_ID] : this.props.parent.member[global.AUTHEN_ID]
					    	}
						})
						
				      .then(response => {
				    	  response = response['data'];
				    	  if(response['result']){
				    		  if(isset(this.props.parent)) this.props.parent.refreshParent();
				    	  }else{
				    		  Swal(response['message'], response['data'], 'error');
				    	  }
				      })
				      
				      .catch(function (error) {
				    	  Swal('Error', error, 'error');
				      })
				        
				  }
			})
		
	}
	
	render () {
		return(
				  <div>
					 <div className="button" title="Remove member from this group" onClick={function(){this.delGroup()}.bind(this)}>
					 <i className="fa fa-user-times"></i>
					 </div>
				</div>
		)  
				  
	}
}
export default FuncDelMem
	  