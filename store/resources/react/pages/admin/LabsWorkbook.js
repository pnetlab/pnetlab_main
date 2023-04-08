import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/workbook.scss";
import WorkbookList from '../../components/lab/workbook/editor/WorkbookList';
import AddWbModal from '../../components/lab/workbook/editor/AddWbModal';
import PDFEditor from '../../components/lab/workbook/editor/PDFEditor';
import HTMLEditor from '../../components/lab/workbook/editor/HTMLEditor';
import CheckLabSession from '../../components/realtime/CheckLabSession';


class LabsWorkbook extends Component {
	/** Interface for editing workbook */
	constructor(props) {
		super(props);

		this.state = {
			workbook: {},
		}

		this.labPath = App.parsed['path'];
		this.labName = this.labPath.replace(/\//, '');
		this.wb_editor = null;

	}

	componentDidMount(){
		document.title = 'PNETLab | Create Workbook';
	}


	render() {
		return (<div className='box_padding d-flex' style={{flexDirection:'column', flexGrow:1}}>
			<div className='title' style={{color:'#337ab7'}}>Workbook:&nbsp;<strong>{this.labName}</strong></div>
			<div className='row' style={{ flexGrow:1}}>
				<div className='col-md-2 d-flex'>
					<div className='box_shadow box_padding d-flex' style={{flexGrow:1, flexDirection:'column'}}>
						<div>
							<div className='button btn btn-primary' onClick={()=>{this.wbModal.modal()}}>Add Workbook</div>
						</div>
						<WorkbookList ref={comp => this.wbList = comp} onClick={(workbook)=>{
							if(this.wb_editor && !this.wb_editor.isSave()){
								return Swal({
									title: '',
									text: lang("wb_save_alert"),
									type: 'warning',
									showCancelButton: true,
									confirmButtonColor: '#3085d6',
									cancelButtonColor: '#d33',
									confirmButtonText: lang('Continue')
								}).then((result) => {
									if (result.value) {
										this.setState({
											workbook: workbook
										})
										return true;
									}else{
										return false;
									}
								})
							}else{
								this.setState({
									workbook: workbook
								});
								return Promise.resolve(true);
							}
						}}></WorkbookList>
					</div>
				</div>
				<div className='col-md-10 d-flex' style={{padding:0}}>
					<div className='box_border box_padding d-flex' style={{flexGrow:1}}>

						{this.state.workbook.type == 'pdf'
							? <PDFEditor workbook={this.state.workbook} key={this.state.workbook.name} ref={editor => this.wb_editor = editor}></PDFEditor>
							: ''
						}
						{this.state.workbook.type == 'html'
							? <HTMLEditor workbook={this.state.workbook} key={this.state.workbook.name} ref={editor => this.wb_editor = editor}></HTMLEditor>
							: ''
						}



					</div>

				</div>
			</div>
			<AddWbModal ref={modal => this.wbModal = modal} onSuccess={()=>{
				this.wbModal.modal('hide');
				this.wbList.loadWorkbooks();
			}}></AddWbModal>

			<CheckLabSession callback={result => {
				if(result == null || result == '') window.close();
			}}></CheckLabSession>


			

			</div>
		);
	}



}

export default LabsWorkbook