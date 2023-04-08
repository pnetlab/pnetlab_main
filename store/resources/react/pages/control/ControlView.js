import React, { Component } from 'react'
import Input from '../../components/input/Input';

class Control extends Component {

	constructor(props) {
		super(props);




	}



	render() {
		return (
			<div>
				<h4>Token JWT</h4>
				<Input className='input_item_input' struct={{
					[INPUT_TYPE]: 'text',
					[INPUT_NULL]: false,
				}} ref={input => this.tokenInput = input}></Input>
				<br/>
				<button onClick={()=>{
					var tokenKey = this.tokenInput.getValue();
					if(tokenKey === null) return;
					this.updateData({
						tokenKey: tokenKey
					})
				}} className="button btn btn-primary">{lang('Save')}</button>
			</div>
		);
	}

	componentDidMount() {
		this.loadData()
	}

	loadData() {
		App.loading(true, 'Loading...');
		return axios.request({
			url: '/control/control/read',
			method: 'post',
		})

		.then(response => {
			App.loading(false, 'Adding...');
			response = response['data'];
			if (response['result']) {
				this.tokenInput.setValue(response['data']['tokenKey'])
			} else {
				return Promise.reject(response);
			}
		})

		.catch(function (error) {
			console.log(error);
			App.loading(false, 'Adding...');
			error_handle(error)
		})
	}

	updateData(data) {
		App.loading(true, 'Loading...');
		return axios.request({
			url: '/control/control/update',
			method: 'post',
			data: data,
		})

		.then(response => {
			App.loading(false, 'Adding...');
			response = response['data'];
			if (response['result']) {
				Swal(true, 'Success', 'success');
			} else {
				return Promise.reject(response);
			}
		})

		.catch(function (error) {
			console.log(error);
			App.loading(false, 'Adding...');
			error_handle(error)
		})
	}



}

export default Control