import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";


class SellLab extends Component {

	constructor(props) {
		super(props);

		this.unit = 16;

		this.state = {
			labs: [],
			search: '',
			limit: this.unit,
		}

		this.labs = [];



	}


	render() {
		var labs = this.state.labs.slice(0, this.state.limit);
		return (
			<div className='box_padding'>

				<style>{`

					.box_shadow.card-frame {
						cursor: pointer;
						padding: 7px;
					}
					.card-title {
						font-family: 'Open Sans', sans-serif;
						font-size: 16px;
						font-weight: 600;
						color: #5ba818;
						display: block;
						margin-bottom: 0px;
					}
					.card-post-body {
						font-family: 'Open Sans', sans-serif;
						font-size: 14px;
						font-weight: 300;
						color: #222831;
						opacity: 0.8;
					}
				`}</style>

				<div className='row' style={{ justifyContent: 'flex-end' }}>

					<div style={{ margin: 'auto auto auto 15px'}}>
						<input className='box_border'
							style={{ padding: 7, borderRadius:5}}
							placeholder='Search' value={this.state.search}
							onChange={(event) => { this.setState({ search: event.target.value }) }}
							onBlur={() => { this.filter() }}
						></input>
					</div>

					<div style={{ marginRight: 15 }}>
						<Link to="/store/public/admin/labs/create"><div className="btn btn-primary">{lang("New Product")}</div></Link>
					</div>
				</div>

				<div className="headline" style={{ margin: '0px 15px' }}><div className="title">{lang("Your Labs")}</div></div>

				<div className='row'>

					{labs.length == 0 
						?<div style={{width:'100%'}} className="alert alert-warning" role="alert">You don't have any lab. Click on <strong>{lang("New Product")}</strong> to create new lab on store.</div>
						:''
					}

					{labs.map((item) => {
						var labStatus = '';
						if (item[LAB_STATUS] == LAB_STATUS_UNPUBLIC) labStatus = <strong style={{ color: 'red' }}>{lang("Unpublic")}</strong>
						else if (item[LAB_STATUS_PENDING] == LAB_STATUS_PENDING_LAB) labStatus = <strong style={{ color: 'orange' }}>{lang("Waiting for approve")}</strong>
						else if (item[LAB_STATUS_ADMIN] == LAB_STATUS_ADMIN_EMPTY) labStatus = <strong style={{ color: 'orange' }}>{lang('Waiting for approve')}</strong>
						else if (item[LAB_STATUS_ADMIN] == LAB_STATUS_ADMIN_DENY) labStatus = <strong style={{ color: 'red' }}>{lang("Denied by Admin")}</strong>
						else if (item[LAB_STATUS_ADMIN] == LAB_STATUS_ADMIN_APPROVE){
						if (item[LAB_STATUS_VERSION] == LAB_STATUS_VERSION_AVAILABLE) labStatus = <strong style={{ color: 'green' }}>{lang("Publiced")}</strong>
							else if(item[LAB_STATUS_VERSION] == LAB_STATUS_VERSION_UNAVAILABLE) labStatus = <strong style={{ color: 'red' }}>{lang("Version Unavailable")}</strong>
						} 
						
						return <div className='lab_item' key={item[LAB_ID]} style={{minWidth:300}}>
								<div className='box_shadow d-flex' style={{ padding: 7, width:'100%', flexDirection:'column'}}>
									<div className="lab_item_image">
										<img src={file_public(item[LAB_IMG])} style={{ width:'100%' }}></img>
									</div>
									<div style={{ padding: 5, flexGrow:1}}>
										<div className="card-title">{item[LAB_NAME]}</div>
										<div className="card-text card-post-body">{str_limit(get(item[LAB_DES], ''), 100)}</div>
										<div><i className="fa fa-calendar"></i>&nbsp;<span>{moment(item[LAB_TIME], 'X').format('lll')}</span></div>
										<div>{labStatus}</div>
										{(item[LAB_FEEDBACK]=='' || item[LAB_FEEDBACK]==null || item[LAB_STATUS_PENDING] == LAB_STATUS_PENDING_LAB) ? '':<p style={{color:'red'}}><strong>{lang("FeedBack")}:&nbsp;</strong>{item[LAB_FEEDBACK]}</p>}
									</div>

									<div className='box_flex' style={{ padding:7 }}>
								
										{item[LAB_STATUS_ADMIN]==LAB_STATUS_ADMIN_EMPTY 
											? <><button onClick={()=>{this.delLabs(item[LAB_ID])}} className='btn button btn-sm btn-danger'>{lang("Delete")}</button>&nbsp;</> 
											: ''
										}

										{item[LAB_STATUS]==LAB_STATUS_UNPUBLIC 
											? <><button onClick={()=>{this.publicLabs(item[LAB_ID])}} className='btn button btn-sm btn-primary'>{lang("Public")}</button>&nbsp;</> 
											: <><button onClick={()=>{this.unpublicLabs(item[LAB_ID])}} className='btn button btn-sm btn-danger'>{lang("Unpublic")}</button>&nbsp;</>
										}
										
										<Link to={`/store/public/admin/versions/view?${LAB_ID}=${item[LAB_ID]}&${LAB_NAME}=${item[LAB_NAME]}`}><button className='btn button btn-sm btn-primary'>{lang("Versions")}</button></Link>&nbsp;
										
										<Link to={`/store/public/admin/labs/editview?${LAB_ID}=${item[LAB_ID]}&${LAB_NAME}=${item[LAB_NAME]}`}><button className='btn button btn-sm btn-info'>{lang("Edit")}</button></Link>
										

									</div>
								</div>

							</div>

						
					}

					)}

				</div>

				{this.state.limit < this.state.labs.length 
					? <div className="box_flex" style={{justifyContent: 'center'}}><div className="loadmore button" onClick={()=>{this.setState({limit: this.state.limit+this.unit})}}>{lang("Load More")}</div></div>
					: ''
				}

			</div>
		);
	}


	componentDidMount() {
		this.loadLabs();
	}

	loadLabs() {
		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/admin/labs/getOwnLabs',
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
				error_handle(error)
				return false;
			})
	}


	delLabs(labId) {

		Swal({
			title: lang('del_alert_title'),
			text: lang("del_alert_text"),
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: lang("Yes")
		}).then((result) => {
			if (result.value) {
				App.loading(true, 'Deleting...')

				return axios.request({
					url: '/store/public/admin/labs/drop',
					method: 'post',
					data: {
						[LAB_ID]: labId
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
						error_handle(error)
						return false;
					})
			}
		})


	}


	filter() {
		var filterData = this.labs;
		if (this.state.search != '') {
			var search = this.state.search.toLowerCase();
			filterData = filterData.filter((item) => {
				var itemData = item[LAB_NAME] + item[LAB_DES];
				return itemData.toLowerCase().indexOf(search) !== -1
			});
		}
		this.setState({ labs: filterData, limit: this.unit});

	}

	publicLabs(labId) {
		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/admin/labs/public',
			method: 'post',
			data :{
				[LAB_ID]: labId
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					var labs = this.state.labs;
					var lab = this.state.labs.find(item => item[LAB_ID] == labId );
					if(lab) lab[LAB_STATUS] = LAB_STATUS_PUBLIC;
					this.setState({labs});
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}


	unpublicLabs(labId) {
		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/admin/labs/unpublic',
			method: 'post',
			data :{
				[LAB_ID]: labId
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					var labs = this.state.labs;
					var lab = this.state.labs.find(item => item[LAB_ID] == labId );
					if(lab) lab[LAB_STATUS] = LAB_STATUS_UNPUBLIC;
					this.setState({labs});
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})

		}







}

export default SellLab