import React, { Component } from 'react'
import Style from '../common/Style'

class FormFileSuggest extends Component {
	
	constructor(props) { 
	    super(props);
	    this.id = makeId();
	    
	    this.state={
	    		files : [],
	    		directories : {},
	    		pwd : '',
	    		selects : {},
	    		value: '',
	    }
	    this.selects = {};
	    this.page = 1;
	    this.number = 20;
	    this.onSelect = get(this.props.onSelect, null);
		this.column = get(this.props.column, '');
		this.table = get(this.props.table, '');
		this.type = get(this.props.type, '');
		this.link = get(this.props.link, '');
		this.decorator = get(this.props.decorator, null);
	    
	}
	
	setOnSelect(onSelect){
		this.onSelect = onSelect;
	}
	
	setColumn(column){
		this.column = column;
	}

	setTable(table){
		this.table = table;
	}

	setType(type){
		this.type = type;
	}

	setLink(link){
		this.link = link;
	}

	setDecorator(decorator){
		this.decorator = decorator;
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
		    url: this.link,
		    method: 'post',
		    data:{
		    		'column': this.column,
			    	'action': 'History',
			    	'page': this.page,
			    	'number': this.number,
		    	}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.setState({files: response['data']})
	    	  }else{
	    		  return Promise.reject(response);
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  console.log(error); 
	    	  error_handle(error);
	      })
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
		    url: this.link,
		    method: 'post',
		    data:{
			    	'action': 'Delete',
			    	'file': file[FILE_PATH],
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Deleting...');
	    	  response = response['data'];
	    	  if(response['result']){
	    		  delete(this.selects[file[FILE_PATH]]);
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
	
	async downloadFile(){
		var files = this.state.selects;
		for(let i in files){
			await this.readFile(files[i]);
		}
	}
	
	readFile(file){
		App.loading(true, 'Downloading...')
		return axios.request ({
			url: this.link,
			method: 'post',
			data:{
				'action': 'Read',
				'file': file[FILE_PATH],
			},
			responseType: 'blob'
		})
		
		.then(response => {
			App.loading(false, 'Downloading...');
			response = response['data'];
			var blob = new Blob([response]);
    	    var a = document.createElement('a'); 
    	    a.download = file.replace(/^.*[\\\/]/, ''); 
    	    a.href = URL.createObjectURL(blob); 
    	    a.click();
		})
		
		.catch(function (error) {
			App.loading(false, 'Downloading...')
			console.log(error);
			error_handle(error);
		})
	}
	
	render () {
		
		var files = [];
		
		for ( let i in this.state.files){
			let file = this.state.files[i];
			let fileLink = file[FILE_PATH];
			let filePreview = file[FILE_PATH];
			if(this.decorator) filePreview = this.decorator(filePreview);
			let fileName = file[FILE_NAME];
			var fileExtension = fileName.split('.').pop().toLocaleLowerCase();

			var fileIcon = <i className="fa fa-file-text-o"></i>
			if(/jpeg|png|jpg|tiff|gif/.test(fileExtension)){
				fileIcon = <img src={filePreview}></img>
			}

			files.push(<div title={fileLink} className='file_item' key={i}>
				<label style={{justifyContent: 'center', width:'100%'}}>
					<input checked={isset(this.state.selects[fileLink]) && this.state.selects[fileLink]} 
					onChange={(event)=>{
						
						if (window.event.ctrlKey){
							if(event.target.checked){
								this.selects[fileLink] = file;
							}else{
								delete(this.selects[fileLink]);
							}
						}else{
							this.selects = [];
							this.selects[fileLink] = file;
						}
						
						this.setState({
							selects: this.selects,
							value: fileLink,
						});
						
						
						
						
					}} 
					
					className='file_select' type='checkbox'></input>
					
					<div className='file_icon'>
						{fileIcon}
						<div className='file_name'>{fileName}</div>
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
								<h4 className="modal-title">{lang(this.state.pwd)}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
							
							{//<input type='text' style={{padding:5, marginBottom:15, width:'100%', border:'solid thin darkgray', borderRadius:4}} 
								//value={this.state.value} onChange={(event)=>{this.setState({value: event.target.value})}}
							//placeholder='Image link'/>
							}
							
							<div style={{display: 'flex'}}>
							
								<div style={{marginLeft: 0}}>
									<div>
										<div style={{display: 'flex'}}>
										  {this.page == 1 ? '' : <div><span className='file_page button' onClick={()=>this.updatePage('down')}>{'<'}</span></div>}
										  {count(this.state.files) < this.number? '' : <div><span className='file_page button' onClick={()=>this.updatePage('up')}>{'>'}</span></div>}
										</div>
									</div>
								</div>
								
								<div style={{marginRight: 0, marginLeft: 'auto', display:'flex'}}> 
									<div className="button box_flex" title="Delete selected" onClick={() => {this.deleteFiles()}} style={{display: 'flex'}}>
								 		<i className="fa fa-trash"></i>&nbsp;{lang("Delete")}
								 	</div>
								 	<div className="button box_flex" title="Download selected" onClick={() => {this.downloadFile()}} style={{display: 'flex'}}>
								 		<i className="fa fa-save"></i>&nbsp;{lang("Download")}
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
								
								
								<div  className="modal-footer"> 
							  		<button type="button" className="btn btn-primary" onClick={()=>{this.onSelect(this.state.value); this.modal('hide');}}>{lang('Select')}</button>
							  		<button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Close")}</button>
						        </div>
								
							</div>
							
						</div>
					</div>
				</div>
				
				</>
		)  
	}
}
export default FormFileSuggest