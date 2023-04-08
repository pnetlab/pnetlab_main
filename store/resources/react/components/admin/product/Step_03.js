import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InputImg from '../../input/InputImg';
import FormFileSuggest from '../../input/FormFileSuggest';
import Step from './Step'


class Step_03 extends Step {

	constructor(props) {
		super(props);
		this.product = this.props.product;

		this.state = {
			[LAB_IMG]: '',
			[LAB_ARTICLE]: '',
			[LAB_DES]: '',

		}
	}

	async getData() {
		await this.InputImg.upload();
		var state = {...this.state};
		state[LAB_ARTICLE] = HtmlEncode(this.editor.editor.getData());
		state[LAB_IMG] = this.InputImg.getValue();
		state[LAB_DES] = HtmlEncode(state[LAB_DES]);
		return state;
	}

	setData(data){
		if(isset(data[LAB_ARTICLE])){
			this.editor.editor.setData(output_secure(HtmlDecode(data[LAB_ARTICLE])))
		}
		if(isset(data[LAB_IMG])){
			this.InputImg.setValue(data[LAB_IMG]);
		}
		if(isset(data[LAB_DES])){
			this.setState({[LAB_DES]: HtmlDecode(data[LAB_DES])});
		}
	}

	render() {
		return <div id={this.id}>

			<style>{`
				.lab_img_input{
					height: 200px;
					position: relative;
					justify-content: center;
					overflow: hidden;
				}
				.lab_img_input img {
					width:100%
				}
				.lab_img_input .close {
					position: absolute;
					right: 7;
					top: 7;
				}
			`}</style>

			<div className='row' style={{ justifyContent: 'flex-end', display: this.props.next?'':'none'}}>
				<div className="btn btn-primary" onClick={() => {
					this.product.flow.nextStep();
				}}>{lang('Next')}</div>
			</div>

			<div className='row'>

				<div className='col-md-4'>
					<strong>{lang(LAB_IMG)}</strong>
					<InputImg className="lab_img_input box_flex" value={App.server.common['APP_UPLOAD'] + '/Local/labs/lab_img/0/default.png'} column={LAB_IMG} upload_link="/store/public/admin/labs/uploader" ref={comp => this.InputImg = comp}>
						<span onClick={() => {
							this.uploadModal.setType('image');
							this.uploadModal.setOnSelect((file) => { this.InputImg.setValue(file) });
							this.uploadModal.setColumn(LAB_IMG);
							this.uploadModal.setLink('/store/public/admin/labs/uploader');
							this.uploadModal.setDecorator(file=>file_public(file));
							this.uploadModal.scand();
							this.uploadModal.modal();
						}} className='button'>&nbsp;<i className="fa fa-folder"></i>&nbsp;{lang("Browser")}</span>
					</InputImg>
				</div>


				<div className='col-md-8'>

					<strong>{lang(LAB_DES)}:</strong>
					<p>{lang('lab_des_des')}</p>
					<textarea className="product_input" style={{ minHeight: 200 }} value={this.state[LAB_DES]} onChange={
						(event) => { this.setState({ [LAB_DES]: event.target.value }) }
					}></textarea>

				</div>

			</div>


			<div>

				<div>
					<strong>{lang(LAB_ARTICLE)}</strong>
					<p>{lang("lab_article_des")}</p>
				</div>

				<CKEditor

					ref={editor => this.editor = editor}
					editor={ClassicEditor}
					data=""
					onInit={editor => {
						editor.setData(this.state[LAB_ARTICLE]);
					}}

					config={{
						'height': '300px',
						toolbar: {
							items: [
								'cpformatButton',
								'undo',
								'redo',
								'|',
								'heading',
								'paddingButton',
								'marginButton',
								'borderButton',
								'backgroundButton',
								'|',
								'bold',
								'italic',
								'underline',
								'link',
								'bulletedList',
								'numberedList',
								'imagemngt',
								'blockQuote',
								'mediaEmbed',
								'|',
								'insertTable', 
								'tableColumn',
								'tableRow',
								'mergeTableCells', 
								'colorTable',
								'lineTable',
								'paddingTableButton',
								'|',
								'fontSize', 
								'fontFamily', 
								'fontColor', 
								'fontBackgroundColor',
								'alignment',
								'|',
								'iconsButton',

								// 'insertGrid',
								// 'paddingButton',
								// 'marginButton',
								// 'borderButton',
								// 'backgroundButton',
								// 'positionButton',


							]
						}
						,
						link: {
							decorators: {
								addTargetToLinks: {
									mode: 'manual',
									label: 'Open in a new tab',
									attributes: {
										target: '_blank',
										rel: 'noopener noreferrer'
									}
								}
							}
						},
						image: {

							styles: ['full', 'alignLeft', 'alignRight'],
							imgmngt: {
								onClick: (callback) => {
									this.uploadModal.setType('image');
									this.uploadModal.setOnSelect((file) => { callback(file) });
									this.uploadModal.setColumn(LAB_ARTICLE);
									this.uploadModal.setLink('/store/public/admin/labs/uploader');
									this.uploadModal.scand();
									this.uploadModal.setDecorator(file=>file_public(file));
									this.uploadModal.modal();
								},
								browser: true,
								type: 'standard',
								column: LAB_ARTICLE,
								link: '/store/public/admin/labs/uploader',
								decorator: file=>file_public(file),
							}
						},



						// extraPlugins: [ (editor)=>{
						// 	editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => new CkeditorUploadAdapter( loader, {
						// 		column: LAB_ARTICLE,
						// 		link: '/store/public/admin/labs/uploader',
						// 	});
						// } ],

					}}

				/>
			</div>

			<FormFileSuggest table={LABS_TABLE} ref={modal => this.uploadModal = modal}></FormFileSuggest>

		</div>
	}
}


export default Step_03;