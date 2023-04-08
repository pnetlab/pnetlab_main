
class device_downloader {

	constructor(showLog) {
		this.showLog = showLog;
	}

	async download(device_id, overwritten = false) {
		this.device_id = device_id;
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/devices/get',
			method: 'post',
			data: {
				[DEVICE_ID]: device_id,
				overwritten: overwritten,
			}
		})

			.then(response => {

				response = response['data'];
				if (!response['result']) {
					if (response['data']['confirm']) {
						App.loading(false);
						this.makeQuestion(lang(response['message'], response['data'])).then(res => {
							if (res) {
								return this.download(device_id, true);
							}
						})
					} else {
						error_handle(response);
						return false;
					}
				} else {
					this.showProcess(device_id, 'download');
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}


	async delete(device_id) {
		var confirm = await this.makeQuestion('Do you want to remove this device from your Box?');
		if(!confirm) return;
		this.device_id = device_id;
		App.loading(true);
		return axios.request({
			url: '/store/public/admin/devices/delete',
			method: 'post',
			data: {
				[DEVICE_ID]: device_id,
			}
		})

			.then(response => {

				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.showProcess(device_id, 'download');
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}

	makeQuestion(question, confirmButtonText = 'Yes', cancelButtonText = 'No') {
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

	clearProcess() {
		if (this.processInteval) {
			clearInterval(this.processInteval);
			this.processInteval = null;
			App.Loading.update('');
		}

	}

	showProcess(id, vector) {

		this.processInteval = setInterval(() => {
			axios.request({
				url: '/store/public/admin/devices/process',
				method: 'post',
				data: { 
					[DEVICE_ID]: id	
				}
			})

				.then(response => {
					response = response['data'];
					if (response['result']) {
						if (response['data']['finish']) {
							this.clearProcess();
							App.loading(false);
							if (this.onFinish) this.onFinish();
							return;
						}
						response = response['data']['data']
						if(response['log'] && response['log']!=''){
							if(this.showLog) this.showLog(response['log']);
						}
						
						App.loading(true, response[PROCESS_DEVICE_LOG]);
						var processUp = 0;
						var processDown = 0;
						
						if (response[PROCESS_DEVICE_DTOTAL] != 0 && response[PROCESS_DEVICE_DTOTAL] != null) {
							processDown = Math.floor(Number(response[PROCESS_DEVICE_DNOW]) * 100 / response[PROCESS_DEVICE_DTOTAL])
						}
						if (response[PROCESS_DEVICE_UTOTAL] != 0 && response[PROCESS_DEVICE_UTOTAL] != null) {
							processUp = Math.floor(Number(response[PROCESS_DEVICE_UNOW]) * 100 / response[PROCESS_DEVICE_UTOTAL])
						}

						if (vector == 'upload') {
							if (processUp < 100) {
								var total = Math.ceil(Number(response[PROCESS_DEVICE_UTOTAL]) / 100000) / 10;
								App.Loading.update(`Upload Size: ${total}MB`, processUp);
							} else {
								App.Loading.update('Processing...');
							}
						} else {
							if (processDown == 0) {
								App.Loading.update('Processing...');
							} else {
								var total = Math.ceil(Number(response[PROCESS_DEVICE_DTOTAL]) / 100000) / 10;
								App.Loading.update(`Download Size: ${total}MB`, processDown);
							}
						}

					}
				})

				.catch(error => {
					console.log(error);
					this.clearProcess();
					App.loading(false);
				})

		}, 1000);


	}




}

export default device_downloader