import React, { Component } from 'react'

class Logout extends Component {
	constructor(props) {
		super(props);
		this.struct = {
			[AUTHEN_USERNAME]: {
				[INPUT_NAME]: AUTHEN_USERNAME,
				[INPUT_TYPE]: 'text',
				[INPUT_NULL]: false,
				[INPUT_DEFAULT]: this.props.value
			}
		}
	}

	logout() {

		axios.request({
			url: '/api/auth/logout',
			method: 'get',
		})
			.then(response => {
				window.location.href = "/";
			})

			.catch(function (error) {
				this.button.load(false);
				Swal('Error', error, 'error');
			})
	}

	render() {
		return (
			<div className="box_flex button" style={{margin:0, padding:0}} onClick={() => { this.logout() }}>
				<i className="fa fa-sign-out"></i>&nbsp;{lang('Logout')}
			</div>
		)
	}
}






export default Logout