/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module upload/adapters/StandardUploadAdapter
 */

/* globals XMLHttpRequest, FormData, console */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '../filerepository';
import { attachLinkToDocumentation } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import axios from 'axios';

/**
 * The Simple upload adapter allows uploading images to an application running on your server using
 * the [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API with a
 * minimal {@link module:upload/adapters/StandardUploadAdapter~SimpleUploadConfig editor configuration}.
 *
 *		ClassicEditor
 *			.create( document.querySelector( '#editor' ), {
 *				simpleUpload: {
 *					uploadUrl: 'http://example.com',
 *					headers: {
 *						...
 *					}
 *				}
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See the {@glink features/image-upload/simple-upload-adapter "Simple upload adapter"} guide to learn how to
 * learn more about the feature (configuration, server–side requirements, etc.).
 *
 * Check out the {@glink features/image-upload/image-upload comprehensive "Image upload overview"} to learn about
 * other ways to upload images into CKEditor 5.
 *
 * @extends module:core/plugin~Plugin
 */
export default class StandardUploadAdapter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FileRepository ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'StandardUploadAdapter';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const options = this.editor.config.get( 'image.imgmngt' );

		if ( !options ) {
			console.log('Configuration is not defined');
			return;
		}
		
		if(options.type == 'standard'){
			if ( !options.link ) {
				console.log('Link is not defined');
				return;
			}
			
			if ( !options.column ) {
				console.log('Column is not defined');
				return;
			}
			
			this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => new Adapter( loader, options );
			
		}else{
			
			this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => new AdapterBase64( loader );
		}

		
	}
}

/**
 * Upload adapter.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class Adapter {
	/**
	 * Creates a new adapter instance.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 * @param {module:upload/adapters/StandardUploadAdapter~SimpleUploadConfig} options
	 */
	constructor( loader, options ) {
		/**
		 * FileLoader instance to use during the upload.
		 *
		 * @member {module:upload/filerepository~FileLoader} #loader
		 */
		this.loader = loader;

		/**
		 * The configuration of the adapter.
		 *
		 * @member {module:upload/adapters/StandardUploadAdapter~SimpleUploadConfig} #options
		 */
		this.options = options;
		const CancelToken = axios.CancelToken;
		this.source = CancelToken.source();
	}

	/**
	 * Starts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise}
	 */
	upload() {
		return this.loader.file
			.then( file => {
					return this.uploadFile(file);
					}
			);
	}

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
	abort() {
		this.source.cancel('Operation canceled by the user.');
	}


	async uploadFile(file){
		var response = await this.getUploadLink(file);
		console.log(response); return;
		if(!response) return false;
		if(!response['result']){
			Swal(response['message'], response['data'], 'error');
			return false;
		}
		
		if(response['data']){
			response = response['data'];
			response = await this.uploadData(response['ulink'], response['utoken'], file);
			if(!response) return false;
			if(!response['result']){
				Swal(response['message'], response['data'], 'error');
				return false;
			}
			
			return {default: this.options.onClick(response['data'])};
		}
		
		return false; 
		
	}
	
	
	getUploadLink(file=null){
		
		if(!isset(file)){
			return Promise.resolve({result:true});
		}
		
		return axios.request ({
		    url: this.options['link'],
		    method: 'post',
		    data:{
			    	column: this.options.column,
			    	action: 'Upload',
			    	file: {'size': file.size}
		    	}
			})
			
	      .then(  (response) => {
	    	  response = response['data'];
	    	  return response;
	      })
	      .catch((error)=>{
	    	  console.log(error);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	uploadData(url, token, file){
			
			if(!isset(file)){
				return Promise.resolve({result:true});
			}
			
			let formData = new FormData();
		    formData.append('file', file);
		    formData.append('utoken', token);
			
			return axios.request ({
			    url: url,
			    method: 'post',
			    headers: {
			        'content-type': 'multipart/form-data',
			        },
			    data:formData,
			    onUploadProgress: evt => {
					if ( evt.lengthComputable ) {
						this.loader.uploadTotal = evt.total;
						this.loader.uploaded = evt.loaded;
					}
				},
				cancelToken: this.source.token,
			})
				
		      .then(response => {
		    	  response = response['data'];
		    	  return response;
		    	  
		      })
		      
		      .catch((error)=>{
		    	  console.log(error);
		    	  Swal('Error', error, 'error');
		      })
		}
	
	
	
}



class AdapterBase64 {
	/**
	 * Creates a new adapter instance.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 */
	constructor( loader ) {
		/**
		 * `FileLoader` instance to use during the upload.
		 *
		 * @member {module:upload/filerepository~FileLoader} #loader
		 */
		this.loader = loader;
	}

	/**
	 * Starts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise}
	 */
	upload() {
		return new Promise( ( resolve, reject ) => {
			const reader = this.reader = new window.FileReader();

			reader.addEventListener( 'load', () => {
				resolve( { default: reader.result } );
			} );

			reader.addEventListener( 'error', err => {
				reject( err );
			} );

			reader.addEventListener( 'abort', () => {
				reject();
			} );

			this.loader.file.then( file => {
				reader.readAsDataURL( file );
			} );
		} );
	}

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
	abort() {
		this.reader.abort();
	}
}
