import React, { Component } from 'react'
import Folder from '../../func/FuncFolder'
import Step from './Step'
class Step_01 extends Step {

	constructor(props) {
		super(props);


		this.state = {
			[VERSION_UNL]: '',
			[VERSION_NOTE]: '',
			[DEPENDENCE_TABLE]: {},

		}
	}


	getData() {
		return this.state;
	}


	render() {

		this.product = this.props.product;

		return <div id={this.id}>

			<div className='row' style={{ justifyContent: 'flex-end', display: this.props.next ? '' : 'none' }}>
				<div className="btn btn-primary" onClick={() => {
					this.product.flow.nextStep();
				}}>{lang('Next')}</div>
			</div>


			

			<div className='row'>

				<div className='col-md-6'>
					<strong>{lang('UNL file')}:</strong>
					<p>{lang("UNL file des")}<b>{' /opt/unetlab/labs'}</b></p>
					<div>
						<div className='box_border' style={{ padding: 5, borderRadius: 5 }}>
							<div><strong>{lang('Selected Lab')}:</strong></div>
							<style>{`
								.file_selected:hover {
									background: #eee;
								}
							`}</style>

							{this.state[VERSION_UNL] == '' ? '' :
								<div className='box_flex file_selected' style={{ padding: 5 }}>
									<i className="fa fa-file-text-o" style={{ color: 'gray' }}></i>
									&nbsp;
									<span title={this.state[VERSION_UNL]} className='box_line'>{this.state[VERSION_UNL]}</span>
								</div>
							}

						</div>

						<Folder except={['Your labs from PNETLab Store']} expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/labs' onSelect={(file) => {
							this.getDepends(file);
						}}></Folder>

					</div>

					<br />
				</div>

				<div className='col-md-6'>
					<strong>{lang('Additional packages')}</strong>
					<p>{lang("Additional packages des")}</p>
					<div>
						<div className='box_border' style={{ padding: 5, borderRadius: 5 }}>
							<div><strong>{lang('Selected file')}: </strong></div>
							<style>{`
								.file_selected:hover {
									background: darkgray;
								}
							`}</style>
							{Object.keys(this.state[DEPENDENCE_TABLE]).map((item) => {
								return <div key={item} className='box_flex file_selected' style={{ padding: 5 }}>
									<i className="fa fa-file-text-o" style={{ color: 'gray' }}></i>
			  							&nbsp;
			  							<span title={this.state[DEPENDENCE_TABLE][item]} className='box_line'>{this.state[DEPENDENCE_TABLE][item]}</span>
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

						<Folder expand={false} link="/store/public/admin/default/folder" folder='/opt/unetlab/html/templates' onSelect={(file) => {
							var selected = this.state[DEPENDENCE_TABLE];
							selected[file] = file;
							this.setState({
								[DEPENDENCE_TABLE]: selected
							})
						}}></Folder>
						
						<Folder expand={false} link="/store/public/admin/default/folder" folder='/opt/unetlab/html/images/icons' onSelect={(file) => {
							var selected = this.state[DEPENDENCE_TABLE];
							selected[file] = file;
							this.setState({
								[DEPENDENCE_TABLE]: selected
							})
						}}></Folder>

						<Folder expand={false} link="/store/public/admin/default/folder" folder='/opt/unetlab/scripts' onSelect={(file) => {
							var selected = this.state[DEPENDENCE_TABLE];
							selected[file] = file;
							this.setState({
								[DEPENDENCE_TABLE]: selected
							})
						}}></Folder>



					</div>
				</div>

				<br />
			</div>


			<div>

				<div>
					<strong>{lang(VERSION_NOTE)}</strong>
					<p>{lang('version_node_des')}</p>
				</div>

				<div>
					<textarea onChange={event => this.setState({ [VERSION_NOTE]: event.target.value })} value={this.state[VERSION_NOTE]} className="product_input" style={{ width: '100%' }}></textarea>
				</div>

			</div>
		</div>



	}

	getDepends(file){
		App.loading(true, 'Checking');
		return axios.request({
			url: '/store/public/admin/labs/getDepends',
			method: 'post',
			data: {
				path: file
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				}else{
					var depends = {};
					response['data'].map( item=>depends[item] = item);
					this.setState({
						[VERSION_UNL]: file,
						[DEPENDENCE_TABLE]: depends,
					})

					
				}
			})

			.catch((error)=>{
				error_handle(error);
				App.loading(false);
				return false;
			})

	}
}


export default Step_01;