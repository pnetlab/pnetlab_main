import React, { Component } from 'react'
import Folder from '../../func/FuncFolder'
import Processing from '../../func/Processing'

class VersionEditModal extends Component {

	constructor(props) {
		super(props);
		this.id = makeId();
		this.state={
			[DEPENDENCE_TABLE]:{},
			[VERSION_NAME]: '',
			[VERSION_ID]: '',
		}
		this.processing = new Processing();
		
	}

	setData(data){
		this.setState(data);
	}

	modal(cmd = 'show') {
		if (cmd == 'hide') {
			$("#file_mng_modal" + this.id).modal('hide');
		} else {
			$("#file_mng_modal" + this.id).modal();
		}
	}

	render() {
		return (<>
			<div className="modal fade" id={"file_mng_modal" + this.id}>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">

						<div className="modal-header">
						<strong>{lang("Version")}:&nbsp; {this.state[VERSION_NAME]}</strong>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

						<div className="modal-body" style={{ textAlign: 'initial' }}>

							<div style={{ padding:7 }}>

								<div>
									<strong>{lang('Additional packages')}</strong>
									<p>{lang('additional_packages_des')}<b>{' /opt/unetlab/addons'}</b></p>
									<div>
										<div className='box_border' style={{padding:5, borderRadius:5}}>
											<div><strong>{'Selected file: '}</strong></div>
											<style>{`
													.file_selected:hover {
														background: #eee;
													}
												`}</style>
											{Object.keys(this.state[DEPENDENCE_TABLE]).map((item) => {
												return <div key={item} className='box_flex file_selected' style={{ padding: 5 }}>
													<i className="fa fa-file-text-o" style={{ color: 'gray' }}></i>
													&nbsp;
													{this.state[DEPENDENCE_TABLE][item]}
													&nbsp;
													<i className="fa fa-close button" style={{ marginLeft: 'auto' }} onClick={() => {
														var selected = this.state[DEPENDENCE_TABLE];
														delete (selected[item]);
														this.setState({
															[DEPENDENCE_TABLE]: selected
														}) 
													}}></i>
												</div>
											})}
										</div>

										<Folder expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/addons' onSelect={(file) => {
											var selected = this.state[DEPENDENCE_TABLE];
											selected[file] = file;
											this.setState({
												[DEPENDENCE_TABLE]: selected
											})
										}}></Folder>
										<Folder expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/html/templates' onSelect={(file) => {
											var selected = this.state[DEPENDENCE_TABLE];
											selected[file] = file;
											this.setState({
												[DEPENDENCE_TABLE]: selected
											})
										}}></Folder>
										<Folder expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/html/images/icons' onSelect={(file) => {
											var selected = this.state[DEPENDENCE_TABLE];
											selected[file] = file;
											this.setState({
												[DEPENDENCE_TABLE]: selected
											})
										}}></Folder>
										<Folder expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/scripts' onSelect={(file) => {
											var selected = this.state[DEPENDENCE_TABLE];
											selected[file] = file;
											this.setState({
												[DEPENDENCE_TABLE]: selected
											})
										}}></Folder>

									</div>

								</div>

							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={() => { this.createProduction();}}>{lang('Save')}</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">{lang('Close')}</button>
							</div>

						</div>
					</div>
				</div>
			</div>

		</>
		)
	}



	async createProduction() {

		var dependList = [];
		var data = this.state;
		for (let i in data[DEPENDENCE_TABLE]) {
			var result = await this.uploadDependFile(data[DEPENDENCE_TABLE][i]);
			if(!result) break;
			dependList.push({
				[DEPEND_PATH]: i,
				[DEPEND_MD5] : result[PACK_MD5],
			});
		}

		if(dependList.length > 0){
			var result = await this.addDepend(dependList);
			if(!result) return;
		}

		this.modal('hide');
		if(this.props.onSuccess) this.props.onSuccess();

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
				[DEPEND_VID]: this.state[VERSION_ID],
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



}

export default VersionEditModal
