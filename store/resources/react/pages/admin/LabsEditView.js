import React, { Component } from 'react'

import Step_02 from '../../components/admin/product/Step_02'
import Step_03 from '../../components/admin/product/Step_03'
import { withRouter } from "react-router-dom";

class LabEditView extends Component {
	/** Interface for editing Lab */
	constructor(props) {
	    super(props);
	    
        this.labID = get(App.parsed[LAB_ID], '');

	}
	    
	
	render () {
		
		return <div className='container'>
			<style>{`
			  		.product_input{
			  			width: 100%;
			  			border: solid thin darkgray;
			  			padding: 5px;
			  			border-radius: 5px;
			  		}
			  		.box_flex {
			  			display: flex;
			  			align-items: center;
			  		}
			  		.ck.ck-editor .ck-editor__editable {
			  		    min-height: 500px;
			  		}
			  		
			  	`}</style>
            <br/>

            <Step_02 next={false} ref={step => this.step2 = step}></Step_02>
            <Step_03 next={false} ref={step => this.step3 = step}></Step_03>
            <br/>
			<div className='box_flex'>
				<button className='button btn btn-primary' onClick={()=>this.updateLab()}>{lang("Save")}</button> &nbsp;
				<button className='button btn btn-danger' onClick={this.props.history.goBack}>{lang("Back")}</button>
			</div>
            
			<br/>

        </div> 
			  
	}

	componentDidMount(){
		this.loadLab();
	}
	
	async updateLab() {

		var data = {
			...await this.step2.getData(),
			...await this.step3.getData(),
		}

		if (data[LAB_NAME] == '') {
			Swal('Error', 'Please fill ' + lang(LAB_NAME), 'error');
			return;
		}

		// if (data[LAB_PRICE] == '') {
		// 	Swal('Error', 'Please fill ' + lang(LAB_PRICE), 'error');
		// 	return;
		// }

		// if (data[LAB_UNIT] == '') {
		// 	Swal('Error', 'Please fill ' + lang(LAB_UNIT), 'error');
		// 	return;
		// }
		
		var editData = {};

		for(let i in data){
			if(data[i] != this.oldData[i]){
				editData[i] = data[i];
			}
		}

		this.editLab(editData);
	}

	editLab(editData) {
		App.loading(true, 'Update...')
		return axios.request({
			url: '/store/public/admin/labs/edit',
			method: 'post',
			data: {
				[LAB_ID]: this.labID,
				data: editData,
			},
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.props.history.push('/store/public/admin/labs/view');
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error)
				return false;
			})
	}

	loadLab() {
		if(this.labID == '') return;

		App.loading(true, 'Loading...')
		return axios.request({
			url: '/store/public/admin/labs/read',
			method: 'post',
			data: {
				[LAB_ID]: this.labID,
			},
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.oldData = response['data'][0];
					this.step2.setData(response['data'][0]);
					this.step3.setData(response['data'][0]);
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

export default withRouter(LabEditView);
	
