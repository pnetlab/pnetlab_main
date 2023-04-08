import React, { Component } from 'react'

class SelectFolder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			folders: [],
			folder: this.props.folder,
			isset: false,
			loading: false,
			expand: false,
			select: get(this.props.default, 1), //0 unselect, 1 select, 2 select a part
		}
		this.parent = this.props.parent;
		this.root = get(this.props.root, this);
		this.files = {};
		this.folders = {};

	}

	render() {
		var except = get(this.props.except, []);
		var folderName = this.props.folder.split('/').pop();

		return <div style={{ display: (except.includes(folderName) ? 'none' : 'block') }}>
			<div onClick={() => { this.onClickHandle() }} className={`box_flex folder`} style={{ width: '100%', cursor: 'pointer' }}>
				<div className='button' onClick={e => {
					if (this.props.fileOnly) return;
					e.stopPropagation();
					var newState = 0;
					if (this.state.select == 0) newState = 1;
					this.setSelect(newState).then(() => this.root.updateSelectState());

				}}><i className={"fa " + (this.state.select == 1 ? 'fa-check-circle-o' : (this.state.select == 0 ? "fa-circle-o" : "fa-dot-circle-o"))} style={{ color: '#00bcd4' }}></i></div>
				<i className="fa fa-folder" style={{ color: '#FFC107' }}></i>
				&nbsp;
				{this.props.folder.split('/').pop()}
				{this.state.loading ? <i style={{ margin: 'auto 5px auto auto' }} className="fa fa-circle-o-notch fa-spin"></i> : ''}
			</div>

			<div style={{ paddingLeft: 10, display: this.state.expand ? 'block' : 'none' }}>
				{this.state.files.map((item, key) => { return <SelectFile folderOnly={this.props.folderOnly} ref={c => this.files[key] = c} key={key} root={this.root} parent={this} file={item} default={get(this.props.default, 1)}></SelectFile> })}
				{this.state.folders.map((item, key) => { return <SelectFolder fileOnly={this.props.fileOnly} ref={c => this.folders[key] = c} except={except} root={this.root} key={key} link={this.props.link} parent={this} folder={item} default={get(this.props.default, 1)}></SelectFolder> })}
			</div>


		</div>
	}


	getState() {
		// Check children status
		var selectNumber = 0;
		var unselectNumber = 0;

		var folders = this.folders;
		for (let i in folders) {
			var state = folders[i].updateSelectState();
			if (state == 0) unselectNumber++;
			if (state == 1) selectNumber++;
			if (state == 2) return 2;
		}

		var files = this.files;
		for (let i in files) {
			var state = files[i].updateSelectState();
			if (state == 0) unselectNumber++;
			if (state == 1) selectNumber++;
		}

		if (selectNumber == 0 && unselectNumber == 0) return this.state.select;
		if (selectNumber == 0 && unselectNumber > 0) return 0;
		if (unselectNumber == 0 && selectNumber > 0) return 1;
		if (selectNumber > 0 && unselectNumber > 0) return 2;
	}


	updateSelectState() {
		var select = this.getState();
		this.setState({ select });
		return select;
	}

	async setSelect(select) {
		await this.loadFolderIfNot();
		var folders = this.folders;
		for (let i in folders) {
			await folders[i].setSelect(select);
		}

		var files = this.files;
		for (let i in files) {
			await files[i].setSelect(select);
		}

		return new Promise(resolv => {
			this.setState({ select: select }, resolv)
		});
	}




	getSelectPath() {
		if (this.state.select == 1) return [this.state.folder];
		if (this.state.select == 0) return [];
		var paths = [];
		var folders = this.folders;
		for (let i in folders) {
			paths = paths.concat(folders[i].getSelectPath());
		}

		var files = this.files;
		for (let i in files) {
			paths = paths.concat(files[i].getSelectPath());
		}

		return paths;
	}

	async setSelectPath(selects) {
		await this.loadFolderIfNot();
		if (selects.includes(this.state.folder)) {
			await this.setSelect(1);
		} else {
			await this.setSelect(0);
			var folders = this.folders;
			for (let i in folders) {
				await folders[i].setSelectPath(selects);
			}

			var files = this.files;
			for (let i in files) {
				await files[i].setSelectPath(selects);
			}
		}
		if (this.root === this) {
			console.log('is root');
			this.updateSelectState();
		}
	}

	componentDidMount() {
		if (this.props.expand) {
			this.loadFolder();
		}
	}

	onClickHandle() {
		if (!this.state.isset) {
			this.loadFolder();
		} else {
			this.setState({
				expand: !this.state.expand
			})
		}
		this.onSelectFolder(this.props.folder);
	}

	async loadFolderIfNot() {
		if (!this.state.isset) {
			await this.loadFolder();
		}
	}

	onSelectFolder(folder) {
		if (!this.props.onSelectFolder) {
			if (!this.props.parent) return;
			if (!this.props.parent.onSelectFolder) return;
			this.props.parent.onSelectFolder(folder)
		} else {
			this.props.onSelectFolder(folder)
		}

	}

	onSelect(file) {
		if (!this.props.onSelect) {
			if (!this.props.parent) return;
			if (!this.props.parent.onSelect) return;
			this.props.parent.onSelect(file)
		} else {
			this.props.onSelect(file)
		}

	}

	loadFolder() {
		if (!this.props.link) return Promise.resolve();
		this.setState({
			loading: true
		})
		return axios.request({
			url: this.props.link,
			method: 'post',
			data: { folder: this.props.folder }
		})

			.then(response => {
				response = response['data'];
				if (response['result']) {
					return new Promise(resolv => {
						this.setState({
							loading: false,
							expand: true,
							isset: true,
							folders: response['data']['folders'],
							files: response['data']['files'],
						}, resolv)
					})
				} else {
					this.setState({
						loading: false,
						expand: true,
					})
				}
			})

			.catch(function (error) {
				this.setState({
					loading: false
				})
				error_handle(error)
			})
	}

}

export default SelectFolder;

class SelectFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: this.props.file,
			select: get(this.props.default, 1)
		}

		this.parent = this.props.parent;
		this.root = this.props.root;
	}

	render() {

		return <div onClick={() => { this.onClickHandle() }} className={`box_flex file`} style={{ width: '100%', cursor: 'pointer' }}>
			<div className='button' onClick={e => {
				if (this.props.folderOnly) return;
				e.stopPropagation();
				var newState = 0;
				if (this.state.select == 0) newState = 1;
				this.setState({ select: newState }, () => this.root.updateSelectState());

			}}><i className={"fa " + (this.state.select == 1 ? 'fa-check-circle-o' : (this.state.select == 0 ? "fa-circle-o" : "fa-dot-circle-o"))} style={{ color: '#00bcd4' }}></i></div>
			<i className="fa fa-file-text-o" style={{ color: 'gray' }}></i>
			&nbsp;
			{this.props.file.split('/').pop()}

		</div>
	}

	onClickHandle() {
		if (!this.props.parent) return;
		if (!this.props.parent.onSelect) return;
		this.props.parent.onSelect(this.props.file)
	}

	updateSelectState() {
		return this.state.select;
	}

	async setSelect(select) {
		var pro = new Promise(resolv => {
			this.setState({ select: select }, resolv);
		})
		return pro.then(res => res);
	}

	getSelectPath() {
		if (this.state.select == 1) return [this.state.file];
		if (this.state.select == 0) return [];
	}

	async setSelectPath(selects) {
		if (selects.includes(this.state.file)) {
			await this.setSelect(1);
		} else {
			await this.setSelect(0);
		}
	}
}
