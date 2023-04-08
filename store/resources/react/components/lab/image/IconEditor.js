import React, { Component } from 'react'
import Style from '../../common/Style'

class IconEditor extends Component {
	
	constructor(props) { 
	    super(props);
	    this.id = makeId();
	    
	    this.state={
				files : [],
	    		selects : {},
				value: '',
				search: '',
		}
		this.files = [];
	    this.selects = {};
	    this.page = 1;
	    this.number = 40;
		this.change = moment().format('X');
	    
	}
	
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#file_mng_modal"+this.id).modal('hide');
		}else{
			$("#file_mng_modal"+this.id).modal();
		}
	}


	
	updatePage(vector){
		var oldPage = this.page;
		if(vector == 'up'){
			if(count(this.state.files) >= this.number){
				this.page ++;
			}
		}else{
			this.page --;
		}
		if(this.page <= 0) this.page = 1;
		
		if(oldPage != this.page){
			this.scand();
		}
		
	}
	
	scand(){
		axios.request ({
		    url: '/store/public/admin/image/scan',
		    method: 'post',
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
				  this.files = response['data'];
				  this.filter();
	    	  }else{
	    		  return Promise.reject(response);
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  console.log(error); 
	    	  error_handle(error);
	      })
	}
	
	filter(){
		App.loading(true);
		var showFile = this.files;
		if(this.state.search != ''){
			showFile = showFile.filter(item => item.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()));
		}
		
		var start = this.number*(this.page - 1);
		showFile = showFile.slice(start, start + this.number);
		
		this.setState({files: showFile}, ()=>{setTimeout(()=>App.loading(false), 500)});
	}

	search(search){
		this.setState({search});
		if(this.searchTimeout) clearTimeout(this.searchTimeout);
		this.page = 1;
		this.searchTimeout = setTimeout(()=>this.filter(), 500);
	}

	
	async deleteFiles(){
		var files = this.state.selects;
		for(let i in files){
			await this.deleteFile(files[i]);
		}
		this.scand();
	}
	
	deleteFile(file){
		App.loading(true, 'Deleting...')
		return axios.request ({
		    url: '/store/public/admin/image/delete',
		    method: 'post',
		    data:{
			    	'file': file,
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Deleting...');
	    	  response = response['data'];
	    	  if(response['result']){
	    		  delete(this.selects[file]);
	    	  }else{
	    		  return Promise.reject(response);
	    	  }
	    	  
	      })
	      
	      .catch(function (error) {
	    	  App.loading(false, 'Deleting...');
	    	  console.log(error);
	    	  error_handle(error);
	      })
	}

	upload(files, confirm=0){
		
		App.loading(true, 'Uploading...');

		let formData = new FormData();
		formData.append('confirm', confirm);
		
		for (let i = 0; i < files.length; i++) {
			formData.append(`files[${i}]`, files[i]);
		}
		
		return axios.request({
			url: '/store/public/admin/image/upload',
			method: 'post',
			headers: {
				'content-type': 'multipart/form-data',
			},
			data: formData,
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if(!response['result']){
					if(response['data']['code'] == 'confirm'){
						makeQuestion(response['data']['data'], 'Yes', 'No').then(res=>{
							if(res){
								this.upload(files, 1);
							}else{
								this.upload(files, -1);
							}
						})
					}else{
						error_handle(response);
					}
				}else{
					this.change = moment().format('X');
					this.scand();
				}
				
				return response;

			})

			.catch((error) => {
				App.loading(false);
				console.log(error);
				error_handle(error)
			})

	}

	onSelect(){
		
		
		if(this.onSelectPure) this.onSelectPure(this.state.value);
	}

	componentDidMount(){

		var modalView = $(`#file_mng_modal${this.id}`);
        modalView.on('hidden.bs.modal', function (e) {
            e.preventDefault();
            e.stopPropagation();
		})
		
		global.selectImage = (onSelectPure)=>{
			this.scand();
			this.modal();
			
			if(onSelectPure){
				this.onSelectPure = onSelectPure
			}else{
				this.onSelectPure = null;
			}
		}
	}
	
	render () {
		
		var files = [];
		
		for ( let i in this.state.files){
			let file = this.state.files[i];
			let filePreview = '/images/icons/' + file +'?_=' + this.change;
			let fileIcon = <img src={filePreview} style={{maxHeight:80}}></img>
			

			files.push(<div title={file} className='file_item' key={i}>
				<label style={{justifyContent: 'center', width:'100%'}}>
					<input checked={isset(this.state.selects[file]) && this.state.selects[file]} 
					onChange={(event)=>{
						
						if (window.event.ctrlKey){
							if(event.target.checked){
								this.selects[file] = file;
							}else{
								delete(this.selects[file]);
							}
						}else{
							this.selects = {};
							this.selects[file] = file;
						}
						
						this.setState({
							selects: this.selects,
							value: file,
						});
						
						
						
						
					}} 
					
					className='file_select' type='checkbox'></input>
					
					<div className='file_icon'>
						{fileIcon}
						<div className='file_name' title={file}>{file}</div>
					</div>
					
				</label>
				
			</div>)
		}
		
		  return(
				<>
				<div className="modal fade" id={"file_mng_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<strong style={{color:'white'}}>{lang("Device Icons")}</strong>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
							
							{//<input type='text' style={{padding:5, marginBottom:15, width:'100%', border:'solid thin darkgray', borderRadius:4}} 
								//value={this.state.value} onChange={(event)=>{this.setState({value: event.target.value})}}
							//placeholder='Image link'/>
							}
							
							<div style={{display: 'flex'}}>
							
								

								<div style={{marginLeft:0}}>
									<div>
										<input type='text' style={{padding:5, borderRadius:5, border:'solid thin #eee'}} placeholder="Search" value={this.state.search} onChange={(e)=>this.search(e.target.value)}></input>
									</div>
								</div>
								
								<div style={{marginRight: 0, marginLeft: 'auto', display:'flex'}}> 
									<div className="button box_flex" title="Delete selected" onClick={() => {this.deleteFiles()}} style={{display: 'flex', margin:'0px 5px'}}>
								 		<i className="fa fa-trash"></i>&nbsp;{lang("Delete")}
								 	</div>
								 	<div className="button box_flex" title="Upload Icons" style={{margin:'0px 5px'}}>
									 	<label className='button' htmlFor={`input${this.id}`}><i className="fa fa-cloud-upload"></i>&nbsp;{lang("Upload")}</label>
										 <input id={`input${this.id}`}
												type="file"
												style={{display: 'none'}}
												onChange = {(event)=>{this.upload(event.target.files);}}
												multiple = {true}
										 />
								 	</div>
								 </div>
							 </div>
							 
								<div className='file_container'>
									<Style id='file_manager_css'>{`
										.file_container {
											display: flex;
											flex-wrap: wrap;
											margin-top: 15px;
										}
										.file_item {
										    border-radius: 5px;
										    padding: 5px;
										    text-align: center;
										    width: 100px;
										    align-items: center;
										    overflow: hidden;
										    margin: 4px;
											position: relative;
										}
										.file_name {
											width: 100%;
											font-size: small;
											margin-top: 5px;
											color: #607D8B;
										}
										.file_icon {
											padding: 5px;
								    		border-radius: 4px;
										}
										.file_icon i{
											font-size: 40px;
											color: #607D8B;
											-webkit-text-stroke: 1px white;
											cursor: pointer;
										}
										.file_icon img{
											width:40px;
											cursor: pointer; 
										}
										
										.file_select {
											display:none;
										}
										.file_page {
											line-height: 1.25;
										    color: #607d8b;
										    background-color: #fff;
										    border: 1px solid #dee2e6;
										    padding: 5px 10px;
										    border-radius: 4px;
										    margin: 2px;
										}
										.file_select:checked ~ .file_icon {
										    background: #e5e5e5;
										}
									`}</Style>
								
								{files}
								</div>
								
								
								<div  className="modal-footer box_flex"> 
									<div style={{marginLeft: 0}}>
										<div>
											<div style={{display: 'flex'}}>
											{this.page == 1 ? '' : <div><span className='file_page button' onClick={()=>this.updatePage('down')}>{'<'}</span></div>}
											{count(this.state.files) < this.number? '' : <div><span className='file_page button' onClick={()=>this.updatePage('up')}>{'>'}</span></div>}
											</div>
										</div>
									</div>
									<div style={{margin:'auto 0px auto auto'}}>
							  			<button type="button" className="btn btn-primary" onClick={()=>{this.onSelect(this.state.value); this.modal('hide');}}>{lang('Select')}</button>
							  			<button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Close")}</button>
									</div>
						        </div>
								
							</div>
							
						</div>
					</div>
				</div>
				
				</>
		)  
	}
}
export default IconEditor