import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Processing from '../../func/Processing'
import Step from './Step';
import '../../lab/workbook/ckeditor.css'
class Step_04 extends Step {

	constructor(props) {
		super(props);
		this.product = this.props.product;
		this.processing = new Processing();
		this.labID = '';
		this.versionID = '';

		this.state = {
			agreement : '',
			agree: false,
		}
	}


	render() {
		return <div id={this.id}>


			<div className='row'>
				<div className='col-12' style={{
					border: 'solid thin darkgray',
					boxShadow: '2px 2px 4px grey',
					borderRadius: 10,
					padding:0,
				}}>
					<div className="ck-content box_padding" dangerouslySetInnerHTML={{__html:this.state.agreement}} style={{
						height:400,
						overflow: 'auto',
						borderBottom: 'solid thin #ccc',
					}}></div>
					<div style={{padding:5, fontWeight:'bold'}} >
						<label className="box_flex"><input type="checkbox" value={this.state.agree} onChange={(e)=>{this.setState({agree:e.target.checked})}}></input>&nbsp;I accept this Agreement </label>
					</div>
					<div style={{ textAlign: 'center' }}>
						{!this.product.state.complete ?
							<button className='button btn btn-danger' style={{ padding: 10, fontSize: 'large' }} onClick={() => {
								this.createProduction();
							}} disabled={!this.state.agree}>{lang("Public your Lab")}</button>
							: ''}
						<div>
							<br />
							<p>{this.product.state.message}</p>
						</div>
						{this.product.state.complete ?
							<button className='button btn btn-info'>{lang("Go to Labs page")}</button>
							: ''}
					</div>

				</div>


			</div>


		</div>
	}

	componentDidMount(){
		this.getUserAgreement();
	}


	async createProduction() {

		var data = {
			...await this.product.stepRefs[0].getData(),
			...await this.product.stepRefs[1].getData(),
			...await this.product.stepRefs[2].getData(),
		}

		if (data[VERSION_UNL] == '') {
			Swal('Error', lang('Please select UNL file'), 'error');
			this.product.flow.gotoStep(0);
			return;
		}

		if (data[LAB_NAME] == '') {
			Swal('Error', lang('Please fill') + ' ' + lang(LAB_NAME), 'error');
			this.product.flow.gotoStep(1);
			return;
		}

		if (data[LAB_PRICE] == '') {
			Swal('Error', lang('Please fill') + ' ' + lang(LAB_PRICE), 'error');
			this.product.flow.gotoStep(1);
			return;
		}

		if (data[LAB_UNIT] == '') {
			Swal('Error', lang('Please fill') + ' ' + lang(LAB_UNIT), 'error');
			this.product.flow.gotoStep(1);
			return;
		}

		var check_exist = await this.checkUnlExist(data[VERSION_UNL]);
		if (!check_exist) return;

		if (this.labID == '') {
			var addData = {
				[LAB_NAME]: data[LAB_NAME],
				[LAB_IMG]: data[LAB_IMG],
				[LAB_PRICE]: data[LAB_PRICE],
				[LAB_DES]: data[LAB_DES],
				[LAB_ARTICLE]: data[LAB_ARTICLE],
				[LAB_UNIT]: data[LAB_UNIT],
				[LAB_SUBJECT]: data[LAB_SUBJECT],
				[LAB_OPEN]: data[LAB_OPEN],
			}

			var labID = await this.addLab(addData);
			if (!labID) return;
			this.labID = labID;
		}

		if (this.versionID == '') {
			var result = await this.uploadUnlfile(data[VERSION_UNL]);
			if (!result) return;

			var versionData = {
				[VERSION_UNL]: result[VERSION_UNL],
				[VERSION_MD5]: result[VERSION_MD5],
				[VERSION_PATH]: data[VERSION_UNL],
				[VERSION_LABID]: this.labID,
				[VERSION_NOTE]: data[VERSION_NOTE],
			}

			result = await this.addVersion(versionData);
			if (!result) return;
			this.versionID = result[VERSION_ID];
		}


		var dependList = [];
		for (let i in data[DEPENDENCE_TABLE]) {
			var result = await this.uploadDependFile(data[DEPENDENCE_TABLE][i]);
			if(!result) return;
			dependList.push({
				[DEPEND_PATH]: i,
				[DEPEND_MD5] : result[PACK_MD5],
			});
		}

		if(dependList.length > 0){
			var result = await this.addDepend(dependList);
			if(!result) return;
		}

		Swal({
			text: lang('lab_approve_message'),
			type: 'success',
			confirmButtonColor: '#3085d6',
			confirmButtonText: lang('OK')
		  }).then( result => {
			this.props.history.push('/store/public/admin/labs/view');
		})

	}


	checkUnlExist(unl) {
		App.loading(true, 'Checking');
		return axios.request({
			url: '/store/public/admin/versions/check_exist',
			method: 'post',
			data: {
				[VERSION_UNL]: unl
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}

				if (response['data']) {
					Swal('Error', lang('lab_existed_message'), 'error');
					return false;
				}

				return true;
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})

	}


	addLab(addData) {
		App.loading(true, lang('Create Lab')+'...');
		addData.agree = this.state.agree;
		return axios.request({
			url: '/store/public/admin/labs/addGetId',
			method: 'post',
			data: addData,
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					return response['data'];
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})
	}

	uploadUnlfile(unl) {
		App.loading(true, lang('Upload UNL file'));
		this.processing.showProcess(unl, 'upload');
		return axios.request({
			url: '/store/public/admin/versions/uploader',
			method: 'post',
			data: {
				[VERSION_UNL]: unl
			}
		})

			.then(response => {
				App.loading(false);
				this.processing.clearProcess();
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				return response['data'];
			})

			.catch( error => {
				console.log(error);
				this.processing.clearProcess();
				App.loading(false);
				error_handle(error);
				return false;
			})

	}


	addVersion(addData) {
		App.loading(true, lang("Add Lab Version")+'...')
		return axios.request({
			url: '/store/public/admin/versions/addGetId',
			method: 'post',
			data: addData,
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					return response['data'];
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})
	}


	uploadDependFile(path) {
		App.loading(true, lang('Upload') + ' ' + path.replace(/.*\//, ''));
		this.processing.showProcess(path, 'upload');
		return axios.request({
			url: '/store/public/admin/dependence/uploader',
			method: 'post',
			data: {
				[DEPEND_PATH]: path
			}
		})

			.then(response => {
				App.loading(false);
				this.processing.clearProcess();
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}
				return response['data'];
			})

			.catch( error =>{
				console.log(error);
				this.processing.clearProcess();
				App.loading(false);
				error_handle(error);
				return false;
			})

	}

	addDepend(addData) {
		App.loading(true, lang('Add Dependence') + '...')
		return axios.request({
			url: '/store/public/admin/dependence/add',
			method: 'post',
			data: {
				data: addData,
				[DEPEND_VID]: this.versionID,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					return true;
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})
	}

	getUserAgreement(){
		
		return axios.request({
			url: '/store/public/admin/labs/getUserAgreement',
			method: 'post',
		})

			.then(response => {
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
				} else {
					this.setState({
						agreement: response['data']
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


export default withRouter(Step_04);
