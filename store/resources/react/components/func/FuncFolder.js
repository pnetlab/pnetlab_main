import React, { Component } from 'react'

class Folder extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    		files: [],
	    		folders: [],
	    		folder: this.props.folder,
	    		isset: false,
	    		loading: false,
	    		expand: false,
	    }
	    this.parent = this.props.parent;
 	} 
	
	render(){
		var except = get(this.props.except, []);
		var folderName = this.props.folder.split('/').pop();
		var selected = get(this.props.selected, []);
		
		return <div style={{display:(except.includes(folderName)?'none':'block')}}>
			<div onClick={()=>{this.onClickHandle()}} className={`box_flex folder ${selected.includes(this.props.folder)?'selected':''}`} style={{width:'100%', cursor:'pointer'}}>
				<i className="fa fa-folder" style={{color: '#FFC107'}}></i>
				&nbsp;
				{this.props.folder.split('/').pop()}
				&nbsp;
				{selected.includes(this.props.folder)? <i className="fa fa-check-circle" style={{color:'#00d100'}}></i>: ''}
				{this.state.loading?<i style={{margin:'auto 5px auto auto'}} className="fa fa-circle-o-notch fa-spin"></i> : ''}
			</div>
			
			<div style={{paddingLeft:10, display: this.state.expand? 'block': 'none'}}>
				{this.state.files.map((item, key)=>{return <File key={key} parent={this} file={item} selected={selected}></File>})}
				{this.state.folders.map((item, key)=>{return <Folder except={except} key={key} link={this.props.link} parent={this} folder={item} selected={selected}></Folder>})}
			</div>
			
		
		</div>
	}
	
	componentDidMount(){
		if(this.props.expand){
			this.loadFolder();
		}
	}
	
	onClickHandle(){
		if(!this.state.isset){
			this.loadFolder();
		}else{
			this.setState({
				expand: !this.state.expand
			})
		}
		this.onSelectFolder(this.props.folder);
	}

	onSelectFolder(folder){
		if(!this.props.onSelectFolder){
			if(!this.props.parent) return;
			if(!this.props.parent.onSelectFolder) return;
			this.props.parent.onSelectFolder(folder)
		}else{
			this.props.onSelectFolder(folder)
		}
		
	}
	
	onSelect(file){
		if(!this.props.onSelect){
			if(!this.props.parent) return;
			if(!this.props.parent.onSelect) return;
			this.props.parent.onSelect(file)
		}else{
			this.props.onSelect(file)
		}
		
	}
	
	loadFolder(){
		if(!this.props.link) return;
		this.setState({
			loading: true
		})
		return axios.request ({
		    url: this.props.link,
		    method: 'post',
		    data:{folder: this.props.folder}
			})
			
	      .then(response => {
	    	  response=response['data'];
	    	  if(response['result']){
	    		  this.setState({
	  	  			loading: false,
	  	  			expand: true,
	  	  			isset: true,
	  	  			folders: response['data']['folders'],
	    		  	files: response['data']['files'],
	  	  		  })
	    	  }else{
	    		  this.setState({
	  	  			loading: false,
	  	  			expand: true,
	  	  		  })
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  this.setState({
		  			loading: false
		  	  })
	    	  error_handle(error)
	      })
	}
	
}

export default Folder;

class File extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	file: this.props.file,
	    }
	    
	    this.parent = this.props.parent;
 	} 
	
	render(){
		var selected = get(this.props.selected, []);
		return <div onClick={()=>{this.onClickHandle()}} className={`box_flex file ${selected.includes(this.props.file)?'selected':''}`} style={{width:'100%', cursor:'pointer'}}>
			<i className="fa fa-file-text-o" style={{color: 'gray'}}></i>
			&nbsp;
			{this.props.file.split('/').pop()}
			&nbsp;
			{selected.includes(this.props.file)? <i className="fa fa-check-circle" style={{color:'#00d100'}}></i>: ''}
		</div>
	}
	
	onClickHandle(){
		if(!this.props.parent) return;
		if(!this.props.parent.onSelect) return;
		this.props.parent.onSelect(this.props.file)
	}
}
	  