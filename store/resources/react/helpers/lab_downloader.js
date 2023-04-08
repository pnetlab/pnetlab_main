import Processing from "../components/func/Processing";

class lab_downloader {

	

	constructor(){
		this.processing = new Processing();
		this.versionInfo = {};
		this.versionId = '';
		this.labName = '';
	}

	async download(version, labName) {
		this.versionId = version[VERSION_ID];
		this.labName = labName;
		this.versionName = version[VERSION_NAME];
		this.versionInfo = version;
		//if (! await this.getVerisonInfo()) return;

		var isExist = await this.checkUNLExist();
		if (!isExist['result']) {
			error_handle(isExist);
			return;
		} else if (isExist['data']) {
			var isContinue = await this.makeQuestion('This Lab already exists in your device it will be overwritten. Do you want to continue?', 'Continue', 'Stop Download');
			if (!isContinue) return;
		}

		if(! await this.downloadUNLFile()) return;

		var dependences = this.versionInfo[DEPENDENCE_TABLE];

		for (let i in dependences){
			var depend = dependences[i];
			if(depend['download'] === false) continue;
			var isExist = await this.checkDependExist(depend[DEPEND_PATH], depend[DEPEND_MD5]);
			if(!isExist['result']){
				error_handle(isExist);
				return;
			}

			if(isExist['data'] == 2){
				var isContinue = await this.makeQuestion(`${depend[DEPEND_PATH]} already exists in your device but is not the same as on the store. It will be overwritten. Do you want to overwrite?`, 'Yes', 'No');
				if(!isContinue) continue;
			}else if(isExist['data'] == 1){
				continue;
			}

			var downloadResult = await this.downloadDependFile(depend[DEPEND_ID], depend[DEPEND_PATH]);
			if(!downloadResult) return;
		}

		Swal({
			title: 'Success!',
			text: 'The Lab is saved in your device. Go to home page to use.',
			type: 'success',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Go to Lab'
		}).then((result) => {
			if(result.value) window.location = '/';
		});


	}


	makeQuestion(question, confirmButtonText = 'Yes', cancelButtonText='No') {
		return Swal({
			title: 'Warning!',
			text: question,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: confirmButtonText,
			cancelButtonText: cancelButtonText
		}).then((result) => {
			return result.value;
		})
	}

	getVerisonInfo() {
		if (this.versionId == '') return false;
		App.loading(true, 'Get Information...');
		return axios.request({
			url: '/store/public/user/versions/getInfo',
			method: 'post',
			data: {
				[VERSION_ID]: this.versionId
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.versionInfo = response['data'];
					return true;
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}

	checkUNLExist() {
		App.loading(true, 'Checking...');
		return axios.request({
			url: '/store/public/user/versions/checkExist',
			method: 'post',
			data: {
				[VERSION_PATH]: this.versionInfo[VERSION_PATH],
				[VERSION_NAME]: this.versionName,
				[LAB_NAME]: this.labName,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				return response;
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}

	downloadUNLFile() {
		App.loading(true, `Download ${this.labName}`);
		this.processing.showProcess(this.versionId, 'download');
		return axios.request({
			url: '/store/public/user/versions/download',
			method: 'post',
			data: {
				[VERSION_ID]: this.versionId,
				[LAB_NAME]: this.labName,
			}
		})

			.then(response => {
				App.loading(false);
				this.processing.clearProcess();
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
				this.processing.clearProcess();
				error_handle(error)
				return false;
			})
	}


	checkDependExist(path, md5) {
		
		App.loading(true, `Checking ${path}`);
		return axios.request({
			url: '/store/public/user/dependence/checkExist',
			method: 'post',
			data: {
				[DEPEND_PATH]: path,
				[DEPEND_MD5]: md5,
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				return response;
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}

	downloadDependFile(id, name) {

		App.loading(true, `Download ${name}`);
		this.processing.showProcess(id, 'download');

		return axios.request({
			url: '/store/public/user/dependence/download',
			method: 'post',
			data: {
				[DEPEND_ID]: id,
			}
		})

			.then(response => {
				App.loading(false);
				this.processing.clearProcess();
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
				this.processing.clearProcess();
				error_handle(error)
				return false;
			})
	}

}

export default lab_downloader