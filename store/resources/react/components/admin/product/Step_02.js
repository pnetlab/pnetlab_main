import React, { Component } from 'react'
import Step from './Step'
class Step_02 extends Step {

	constructor(props) {
		super(props);
		this.product = this.props.product;
		var labName = '';
		if (isset(App.parsed['path'])) {
			var match = /.*\/(.+)\.unl$/.exec(App.parsed['path']);
			if (match) {
				labName = match[1];
			}
		}

		this.state = {
			[LAB_NAME]: labName,
			[LAB_SUBJECT]: '',
			[LAB_PRICE]: '0',
			[LAB_UNIT]: '30',
			[LAB_OPEN]: '1',
			lab_subjects: {},
			sellable: false,
		}
	}

	getData() {
		return this.state;
	}

	setData(data) {
		var state = {
			[LAB_NAME]: get(data[LAB_NAME], ''),
			[LAB_SUBJECT]: get(data[LAB_SUBJECT], ''),
			[LAB_PRICE]: get(data[LAB_PRICE], ''),
			[LAB_UNIT]: get(data[LAB_UNIT], ''),
			[LAB_OPEN]: get(data[LAB_OPEN], '1'),
		}

		this.setState(state);

	}


	render() {

		return <div id={this.id}>

			<div className='row' style={{ justifyContent: 'flex-end', display: this.props.next ? '' : 'none' }}>
				<div className="btn btn-primary" onClick={() => {
					this.product.flow.nextStep();
				}}>{lang("Next")}</div>
			</div>


			<div className='row'>

				<div className='col-md-6'>
					<div className='row'>

						<div className='col-6' style={{padding:0}}>
							<strong>{lang(LAB_NAME)}</strong>
							<p>{lang('lab_name_des')}</p>
						</div>
						<div className='col-6' style={{padding:0}}>
							<input value={this.state[LAB_NAME]} onChange={
								(event) => { this.setState({ [LAB_NAME]: event.target.value }) }
							} className="product_input" type="text"></input>
						</div>

					</div>
				</div>


				<div className='col-md-6'>
					<div className='row'>

						<div className='col-6' style={{padding:0}}>
							<strong>{lang(LAB_SUBJECT)}</strong>
							<p>{lang('lab_subject_des')}</p>
						</div>
						<div className='col-6' style={{padding:0}}>
							<select value={this.state[LAB_SUBJECT]} onChange={
								(event) => { this.setState({ [LAB_SUBJECT]: event.target.value }) }
							} className="product_input">
								<option value=''>--Select--</option>
								{Object.keys(this.state.lab_subjects).map(item => <option key={item} value={item}>{this.state.lab_subjects[item]}</option>)}
							</select>
						</div>

					</div>
				</div>

			</div>


			<div className='row'>
				<div className='col-12'>
					<div style={{fontWeight:'bold', cursor:'pointer'}}><label className='box_flex'><input type='checkbox' checked={this.state[LAB_OPEN] == 1} onChange={(e)=>{this.setState({[LAB_OPEN]: e.target.checked? '1': '0'})}}></input>&nbsp; {lang("Open your Lab")}</label></div>
					{this.state[LAB_OPEN] == 1? <i style={{color:'red'}}>{lang('lab_open_des')}</i> : ''}
				</div>
			</div>

			<div className='row'>

				<div className='col-md-6'>
					<div className='row'>

						<div className='col-6' style={{padding:0}}>
							<strong>{lang(LAB_PRICE) + '($)'}</strong>
							{this.state.sellable ? '' : <div style={{ color: 'red' }}>(Available in next version)</div>}
							<p>{lang('lab_price_des')}</p>
						</div>
						<div className='col-6' style={{padding:0}}>
							<input disabled={!this.state.sellable || this.state[LAB_OPEN] == 1} value={this.state[LAB_PRICE]} onChange={
								(event) => { this.setState({ [LAB_PRICE]: event.target.value }) }
							} className="product_input" type="number" min={0}></input>
						</div>
					</div>
				</div>


				<div className='col-md-6'>
					<div className='row'>

						<div className='col-6' style={{padding:0}}>
							<strong>{lang(LAB_UNIT) + '(days)'}</strong>
							{this.state.sellable ? '' : <div style={{ color: 'red' }}>(Available in next version)</div>}
							<p>{lang('lab_unit_des')}</p>
						</div>
						<div className='col-6' style={{padding:0}}>
							<input disabled={!this.state.sellable || this.state[LAB_OPEN] == 1} value={this.state[LAB_UNIT]} onChange={
								(event) => { this.setState({ [LAB_UNIT]: event.target.value }) }
							} className="product_input" type="number" min={0}>

							</input>
						</div>

					</div>
				</div>

			</div>




		</div>
	}

	componentDidMount() {
		this.loadLabSubject();
		this.checkSellable();
	}

	loadLabSubject() {

		return axios.request({
			url: '/store/public/admin/labs/mapping',
			method: 'post',
			data: {

			}
		})

			.then(response => {
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.setState({
						lab_subjects: response['data'][LAB_SUBJECT],
					})
				}
			})

			.catch(function (error) {
				console.log(error);
				error_handle(error);
				return false;
			})
	}

	checkSellable() {

		return axios.request({
			url: '/store/public/admin/labs/sellable',
			method: 'post',
		})

			.then(response => {
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
				} else {
					this.setState({
						sellable: response['data']
					})
				}
			})

			.catch(function (error) {
				console.log(error);
				error_handle(error);
				return false;
			})
	}


}


export default Step_02;