
class Processing {

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
				url: '/store/public/admin/process/read',
				method: 'post',
				data: { data: [{ [PROCESS_ID]: id }] }
			})

				.then(response => {
					response = response['data'];
					if (response['result']) {
						if (response['data'].length == 0) {
							App.Loading.update('Processing...');
							return;
						}
						response = response['data'][0]
						var processUp = 0;
						var processDown = 0;
						if (response[PROCESS_DTOTAL] != 0) {
							processDown = Math.floor(Number(response[PROCESS_DNOW]) * 100 / response[PROCESS_DTOTAL])
						}
						if (response[PROCESS_UTOTAL] != 0) {
							processUp = Math.floor(Number(response[PROCESS_UNOW]) * 100 / response[PROCESS_UTOTAL])
						}
						
						if (vector == 'upload') {
							if (processUp < 100) {
								var total = Math.ceil(Number(response[PROCESS_UTOTAL])/100000)/10;
								App.Loading.update(`Upload Size: ${total}MB`, processUp);
							} else {
								App.Loading.update('Processing...');
							}
						} else {
							if (processDown == 0) {
								App.Loading.update('Processing...');
							} else {
								var total = Math.ceil(Number(response[PROCESS_DTOTAL])/100000)/10;
								App.Loading.update(`Download Size: ${total}MB`, processDown);
							}
						}

					}
				})

				.catch(error => {
					console.log(error);
					this.clearProcess();
				})

		}, 1000);


	}



}

export default Processing