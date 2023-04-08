import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";

import LabBoxItem from '../../components/admin/store/LabBoxItem';
import LabStoreItem from '../../components/admin/store/LabStoreItem';


class LabsStore extends Component {

	constructor(props) {
		super(props);

		this.unit = 16;
		this.labs = [];

		this.state = {
			labs: [],
			freeLabs: [],
			ready: {},
			search: '',
			filter: '',
			limit: this.unit,
		}
		
	}


	render() {
		var labs = this.state.labs.slice(0, this.state.limit);
		return (
			<>
				<div className='box_padding'>
					<br/>
					<div className="box_flex">
						<div className="title">New Free labs</div>
						<a style={{ margin: 'auto 0px auto auto' }} href={`${App.server.common['APP_CENTER']}/store/labs/view?box=${window.location.origin}`}>
							<button className='button btn btn-warning box_shadow' style={{padding:7, fontWeight: 'bold', border:'none', background:'#7d358a'}}><i className='fa fa-shopping-cart'></i>&nbsp;{lang("Go to Store")}</button></a>
					</div>

					<div className='row'>

						{this.state.freeLabs.length == 0
							? <a style={{width:'100%'}} href={App.server.common['APP_CENTER']}><div style={{width:'100%'}} className="alert alert-warning" role="alert">{lang("No Lab Found")}</div></a>
							: <>
								{this.state.freeLabs.map(item => {
									return <LabStoreItem key={item[LAB_ID]} lab={item}></LabStoreItem>
								})}
							</>
						}


					</div>

					<hr/>
					<div className="box_flex">
						<div className="title">Your labs from PNETLab Store</div>
						<div style={{ margin: 'auto 15px auto auto' }}>
							<select className='box_border'
								style={{ padding: 7, borderRadius: 5, lineHeight:'14px' }}
								value={this.state.filter}
								onChange={(event) => { this.setState({ filter: event.target.value }, ()=>{this.filter()}) }}
							>
								<option value=''>{lang("All")}</option>
								<option value='added'>{lang("Added to PNET")}</option>
								<option value='new'>{lang("New Labs")}</option>
							</select>
							&nbsp;
							<input className='box_border'
								style={{ padding: 7, borderRadius: 5,  lineHeight:'14px' }}
								placeholder='Search' value={this.state.search}
								onChange={(event) => { this.setState({ search: event.target.value }) }}
								onBlur={() => { this.filter() }}
							></input>
						</div>
					</div>
					<div className='row'>

						{labs.length == 0
							? <a style={{width:'100%'}} href={App.server.common['APP_CENTER']}><div style={{width:'100%'}} className="alert alert-warning" role="alert">You don't have any lab. Get more Lab on store</div></a>
							: <>
								{labs.map(item => {
									return <LabBoxItem ready={this.state.ready} key={item[LAB_ID]} lab={item} onDelete={lab_id => this.removeLabLicese(lab_id)}></LabBoxItem>
								})}
							</>
						}
					</div>

					{this.state.limit < this.state.labs.length 
						? <div className="box_flex" style={{justifyContent: 'center'}}><div className="loadmore button" onClick={()=>{this.setState({limit: this.state.limit+this.unit})}}>{lang("Load More")}</div></div>
						: ''
					}

				</div>

			</>
		);
	}


	componentDidMount() {
		this.loadLabs();
		this.loadFreeLabs();
		this.loadReadyLabs();
	}

	filter() {

		var filterData = this.labs;
		if(this.state.search != ''){
			var search = this.state.search.toLowerCase();
			filterData = filterData.filter((item) => {
				var itemData = item[LAB_NAME] + item[LAB_DES];
				return itemData.toLowerCase().indexOf(search) !== -1
			});
		}
		if(this.state.filter != ''){
			filterData = filterData.filter((item) => {
				var itemData = `${item[LAB_NAME]} Ver_${item[LAB_LAST_VERSION]}`;
				var isExist = isset(this.state.ready[itemData]);
				if(this.state.filter == 'added'){
					return isExist;
				}else{
					return !isExist;
				}
			});
		}
		this.setState({ labs: filterData, limit: this.unit });

	}

	loadLabs() {

		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/user/labs/getOwnLabs',
			method: 'post',
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.labs = response['data'];
					this.filter();
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})

	}

	loadFreeLabs() {



		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/user/labs/getFreeLabs',
			method: 'post',
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.setState({ freeLabs: response['data'] });
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})



	}

	loadReadyLabs() {

		return axios.request({
			url: '/store/public/user/labs/getReadyLabs',
			method: 'post',
		})
			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					var ready = {};
					response['data'].map(item=>{ready[item] = true});
					this.setState({ready});
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})

	}


	removeLabLicese(lab_id) {
		return axios.request({
			url: '/store/public/user/labs/removeLabLicense',
			method: 'post',
			data : {
				[LAB_ID]: lab_id
			}
		})
			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.loadLabs();
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})
	}

}

export default LabsStore