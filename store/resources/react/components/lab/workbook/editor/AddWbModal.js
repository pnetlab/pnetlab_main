import React, { Component } from 'react'
import Input from '../../../input/Input';

class AddWbModal extends Component {

	constructor(props) {
		super(props);
		this.id = makeId();
		this.state = {

		}

	}

	setData(data) {
		this.setState(data);
	}

	modal(cmd = 'show') {
		if (cmd == 'hide') {
			$("#" + this.id).modal('hide');
		} else {
			$("#" + this.id).modal();
		}
	}

	render() {
		return (<>
			<div className="modal fade" id={this.id}>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">

						<div className="modal-header">
							<strong>{lang("Workbook")}</strong>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

						<div className="modal-body" style={{ textAlign: 'initial' }}>
							<div className='input_item'>
								<div className="input_item_text">{lang("Workbook Name")}</div>
								<div className="">
									<Input className="input_item_input" ref={input => this.inputName = input} struct={{
										[INPUT_TYPE]: 'text',
										[INPUT_NULL]: false,
									}}></Input>
								</div>
							</div>
							<br/>
							<div className='input_item'>
								<div className="input_item_text">{lang("Workbook Type")}</div>
								<div className="">
									<Input className="input_item_input" ref={input => this.inputType = input} struct={{
										[INPUT_TYPE]: 'radio',
										[INPUT_NULL]: false,
										[INPUT_OPTION]: {
											'html' : 'HTML',
											'pdf' : 'PDF',
										},
										[INPUT_DEFAULT]: 'html',
									}}></Input>
								</div>
							</div>

						</div>

						<div className="modal-footer">
							<button type="button" className="button btn btn-primary" onClick={() => { this.createWorkbook(); }}>{lang("Add")}</button>
							<button type="button" className="button btn btn-danger" data-dismiss="modal">{lang("Close")}</button>
						</div>

					</div>
				</div>
			</div>

		</>
		)
	}





	createWorkbook() {
		
		var name = this.inputName.getValue();
		if(name === null) return;

		var type = this.inputType.getValue();
		if(type === null) return;

		App.loading(true, 'Loading...');

		return axios.request({
			url: `/api/labs/session/workbook/add`,
			method: 'POST',
			dataType: 'JSON',
			data: {
				name: name, 
				type: type
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (response['status'] != 'success') {
					error_handle(response);
					return false;
				}
				if(this.props.onSuccess) this.props.onSuccess(response);
			})

			.catch(error => {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})

	}

}

export default AddWbModal
