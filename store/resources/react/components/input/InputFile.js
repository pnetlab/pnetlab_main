import React, { Component } from 'react'

class InputFile extends Component {
	
	constructor(props, context) {
		super(props, context)
	    this.state = {
	    	value: get(this.props.value, ''),
	    	loading: false,
	    	loaded: 0,
	    	total: 1,
	    }
	    this.upload_link = get(this.props.upload_link, null);
		this.unique = 'input_file_' + Math.floor(Math.random() * 10000);
	}
	
	initial(){
		var {id, value, decoratorOut, decoratorIn, onChange, upload, children, style, ...rent} = this.props;
		this.id = get(id, '');
		this.onChange = get(onChange, ()=>{});
	    this.decoratorOut = get(decoratorOut, null);
	    this.decoratorIn = get(decoratorIn, null);
	    this.rent = rent;
	    
	}
	
	setValue(value, callback){
		if(!value) value = '';
		if(this.decoratorIn) value = this.decoratorIn(value);
		this.input.value = '';
		return new Promise(resolve=>this.setState({
			value: value,
		}, ()=>{resolve(value)}));
	}
	
	getValue(){
		var value = this.state.value;
		if(this.decoratorOut) value = this.decoratorOut(value);
		return value;
	}
	
	getFile(){
		return this.input.file;
	}
	
	getInput(){
		return this.input;
	}
	
	revertValue(value){
		if(this.decoratorOut) value = this.decoratorOut(value);
		return value;
	}
	
	async upload(){
		var response = await this.getUploadLink();
		if(!response) return false;
		if(!response['result']){
			Swal(response['message'], response['data'], 'error');
			return false;
		}
		
		if(response['data']){
			response = response['data'];
			response = await this.uploadData(response['ulink'], response['utoken']);
			if(!response) return false;
			if(!response['result']){
				Swal(response['message'], response['data'], 'error');
				return false;
			}
			
			await this.setValue(response['data']);
			
			return true;
		}
		
		return true; 
		
	}
	
	
	getUploadLink(){
		
		if(!isset(this.upload_link) || !isset(this.input.files[0])){
			return Promise.resolve({result:true});
		}
		
		this.setState({
  		  loading: true,
  	  	});
		
		return axios.request ({
		    url: this.upload_link,
		    method: 'post',
		    data:{
			    	column: this.props.column,
			    	action: 'Upload',
			    	file: {'size': this.input.files[0].size}
		    	}
			})
			
	      .then( async (response) => {
	    	  response = response['data'];
	    	  this.setState({
	    		  loading: false,
	    	  });
	    	  
	    	  return response;
	    	  
	      })
	      .catch((error)=>{
	    	  this.setState({
	    		  loading: false,
	    	  });
	    	  console.log(error);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	uploadData(url, token, callback){
			
			if(!isset(this.upload_link) || !isset(this.input.files[0])){
				return Promise.resolve({result:true});
			}
			
			let formData = new FormData();
		    formData.append('file', this.input.files[0]);
		    formData.append('utoken', token);
			
			this.setState({
	  		  loading: true,
	  	  	});
			return axios.request ({
			    url: url,
			    method: 'post',
			    headers: {
			        'content-type': 'multipart/form-data',
			        },
			    data:formData,
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
		      
		      .catch((error)=>{
		    	  this.setState({
		    		  loading: false,
		    	  });
		    	  console.log(error);
		    	  Swal('Error', error, 'error');
		      })
		}
	
	
	
	
	render(){
		this.initial();
		
		var loading = '';
		if(this.state.loading){
			var percentage = Math.floor( 95 * this.state.loaded/this.state.total )
			
			loading = <div className="progress" style={{height:5}}>
						  <div className="progress-bar progress-bar-striped progress-bar-animated" 
							  role="progressbar" style={{width:`${percentage}%`}}>
						  </div>
					 </div>
		}
		
		return( 
				<div>
						<div><li>{this.state.value}</li></div>
						
						{loading}
						
						<div style={{marginTop:15, fontWeight: 'normal', display: 'flex'}}>
							<label className='button' htmlFor={this.unique}><i className="fa fa-cloud-upload"></i>&nbsp;Upload</label>
							<input id={this.unique} ref={input=>this.input = input}
								type="file"
								style={{display: 'none'}}
								onChange = {(event)=>{this.setState({value: event.target.files[0].name})}}
								{...this.rent}
							/>
							{this.props.children}
						</div>
					
            	</div>
		)
	}
}

export default InputFile;