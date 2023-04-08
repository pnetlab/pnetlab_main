import React, { Component } from 'react'

class InputImg extends Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			value: '',
			loading: false,
			loaded: 0,
			total: 1,
			preview: '',
		}
		this.upload_link = get(this.props.upload_link, null);
		this.unique = 'input_file_' + Math.floor(Math.random() * 10000);


	}

	initial() {
		var { id, value, decoratorOut, decoratorIn, onChange, upload, children, style, className, ...rent } = this.props;
		this.id = get(id, '');
		this.onChange = get(onChange, () => { });
		this.decoratorOut = get(decoratorOut, null);
		this.decoratorIn = get(decoratorIn, null);
		this.rent = rent;
		this.className = className;

	}

	setValue(value) {
		if (!value) value = '';
		if (this.decoratorIn) value = this.decoratorIn(value);
		this.input.value = '';
		return new Promise(resolve => this.setState({
			value: value,
			preview: value != '' ? this.upload_link + '?action=Read&file=' + value : '',
		}, () => { resolve(value) }));
	}

	getValue() {

		var value = this.state.value;
		if (this.decoratorOut) value = this.decoratorOut(value);
		return value;


	}

	getFile() {
		return this.input.file;
	}

	getInput() {
		return this.input;
	}

	revertValue(value) {
		if (this.decoratorOut) value = this.decoratorOut(value);
		return value;
	}

	async upload() {
		
		var response = await this.getUploadLink();
		if (!response) return false;
		if (!response['result']) {
			error_handle(response)
			return false;
		}

		if (response['data']) {
			response = response['data'];
			response = await this.uploadData(response['ulink'], response['utoken']);
			if (!response) return false;
			if (!response['result']) {
				error_handle(response)
				return false;
			}

			await this.setValue(response['data']);

			return true;
		}

		return true;

	}

	getUploadLink() {

		if (!isset(this.upload_link) || !isset(this.input.files[0])) {
			return Promise.resolve({ result: true });
		}

		this.setState({
			loading: true,
		});

		return axios.request({
			url: this.upload_link,
			method: 'post',
			data: {
				column: this.props.column,
				action: 'Upload',
				file: { 'size': this.input.files[0].size }
			}
		})

			.then((response) => {
				response = response['data'];
				this.setState({
					loading: false,
				});

				return response;

			})
			.catch((error) => {
				this.setState({
					loading: false,
				});
				console.log(error);
				error_handle(error)
			})
	}

	uploadData(url, token) {

		if (!isset(this.upload_link) || !isset(this.input.files[0])) {
			return Promise.resolve({ result: true });
		}

		let formData = new FormData();

		formData.append('file', this.input.files[0]);
		formData.append('utoken', token);

		this.setState({
			loading: true,
		});
		return axios.request({
			url: url,
			method: 'post',
			headers: {
				'content-type': 'multipart/form-data',
			},
			data: formData,
			onUploadProgress: event => {
				this.setState({
					total: event.total,
					loaded: event.loaded,
				})
			}
		})

			.then(response => {
				response = response['data'];
				this.setState({
					loading: false,
				});

				return response;

			})

			.catch((error) => {
				this.setState({
					loading: false,
				});
				console.log(error);
				error_handle(error)
			})
	}

	onChangeHandle(event) {
		var file = event.target.files[0];
		var img = new Image();
		var _URL = window.URL || window.webkitURL;
		img.src = _URL.createObjectURL(file);
		this.setState({
			preview: img.src
		})
	}


	render() {
		this.initial();

		var loading = '';
		if (this.state.loading) {
			var percentage = Math.floor(95 * this.state.loaded / this.state.total)

			loading = <div className="progress" style={{ height: 5 }}>
				<div className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar" style={{ width: `${percentage}%` }}>
				</div>
			</div>
		}

		return (
			<div>


				<div className='box_flex' style={{ marginTop: 15, fontWeight: 'normal'}}>
					<label style={{marginBottom:0}} className='button' htmlFor={this.unique}><i className="fa fa-cloud-upload"></i>&nbsp;Upload</label>
					<input id={this.unique} ref={input => this.input = input}
						type="file"
						style={{ display: 'none' }}
						onChange={(event) => { this.onChangeHandle(event) }}
						{...this.rent}
					/>
					{this.props.children}
				</div>
				{loading}
				{this.state.preview != ''
					? <div className={'box_border ' + this.className} style={{ textAlign: 'center' }}>
						<img src={this.state.preview} style={{ maxWidth: '80%' }}></img>
						<div className='close' onClick={() => { this.setValue('') }}>&times;</div>
					</div>
					: ''}

			</div>
		)
	}


	componentDidMount(){
		if(isset(this.props.value)){
			this.setValue(this.props.value);
		}
	}
}

export default InputImg;