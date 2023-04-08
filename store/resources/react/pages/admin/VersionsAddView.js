import React, { Component } from 'react'

import Step_01 from '../../components/admin/product/Step_01'
import Processing from '../../components/func/Processing'
import { withRouter } from "react-router-dom";
import CheckLabSession from '../../components/realtime/CheckLabSession';

class Product extends Component {
	
	constructor(props) {
	    super(props);
	    
		this.lab = {};
		this.version = {};
        this.dependences = {};
        
        this.labID = get(App.parsed[LAB_ID], '');
        this.versionID = '';

        this.processing = new Processing();

	}
	    
	
	render () {
		
		return <div className='container'>
            <br/>
            <div className='title'>{lang("Lab name")}:&nbsp; {App.parsed[LAB_NAME]}</div>
            <Step_01 next={false} ref={step => this.step = step}></Step_01>
            <br/>
            <button className='button btn btn-primary' onClick={()=>this.createVersion()}>{lang("Save")}</button>
			<CheckLabSession callback={(result)=>{
				if(result != null && result != '') window.location='/legacy/topology';
			}}></CheckLabSession>
        </div> 
			  
    }
    

    async createVersion() {

		var data = await this.step.getData();

		if (data[VERSION_UNL] == '') {
			Swal('Error', 'Please select UNL file', 'error');
			return;
        }
        if (data[VERSION_NOTE] == '') {
			Swal('Error', 'Please note the new feature of this version', 'error');
			return;
        }
        
		var check_exist = await this.checkUnlExist(data[VERSION_UNL]);
		if (!check_exist) return;

		

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

		Swal({
			text: "This version needs approval from the administrator before being public",
			type: 'success',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'OK'
		  }).then( result => {
			this.props.history.push(`/store/public/admin/versions/view?${LAB_ID}=${App.parsed[LAB_ID]}&${LAB_NAME}=${App.parsed[LAB_NAME]}`);
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
					Swal('Error', 'This lab is existed on store', 'error');
					return false;
				}

				return true;
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})

	}


	

	uploadUnlfile(unl) {
		App.loading(true, 'Upload UNL file');
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
				error_handle(error)
				return false;
			})

	}


	addVersion(addData) {
		App.loading(true, 'Add Lab Version...')
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
				error_handle(error)
				return false;
			})
	}


	uploadDependFile(path) {
		App.loading(true, 'Upload ' + path.replace(/.*\//, ''));
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
				error_handle(error)
				return false;
			})

	}

	addDepend(addData) {
		App.loading(true, 'Add Dependence...')
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
				error_handle(error)
				return false;
			})
        }
}

export default withRouter(Product);