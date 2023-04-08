import React, { Component } from 'react'
import Loading from '../common/Loading';

class FolderFlat extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    		files: [],
	    		folders: [],
                folder: this.props.folder,
                workspace:'',
                editing: '',
                editing_value: '',
	    }
	    this.parent = this.props.parent;
    }

    setFolder(folder, reload=true){
        if(!folder || folder=='') folder = this.props.folder;
        this.setState({folder: folder, editing: '', workspace: ''}, ()=>{
            if(reload) this.loadFolder();
        });
    }
     
    setWorkSpace(path){
        if(!path) path = '';
        this.setState({workspace: path, editing: ''}, ()=>{
            this.loadFolder();
        }); 
    }

    getWorkSpace(){
        return this.state.workspace;
    }
	
	render(){
        var except = get(this.props.except, []);
        var splits = this.state.workspace.split('/');
        var workspaceArray = [];
        splits.map(item=>{if(item != '') workspaceArray.push(item)});

        return <>
            
            <div>
                <div>
                    <ol className="breadcrumb" style={{margin:0, padding:'5px', position:'relative'}}>
                        <li className="breadcrumb-item button" onClick={()=>{this.setWorkSpace('')}}><i className="fa fa-folder" style={{color:'#dfba49'}}></i>&nbsp;{this.state.folder.replace(/.*\//,'')}</li>
                        {workspaceArray.map((item, key) => {
                            var path = '/' + workspaceArray.slice(0, key+1).join('/');
                            return <li key={key} className="breadcrumb-item button" onClick={()=>{this.setWorkSpace(path)}}><i className="fa fa-folder" style={{color:'#dfba49'}}></i>&nbsp;{item}</li>
                        })}

                        <div style={{position:'absolute', right:5, top:0, bottom:0, background:'inherit'}} className='box_flex'><i title='Add New Folder' className='fa fa-plus-circle button' onClick={()=>{this.addNewFolder()}}></i></div>
                    </ol>
                </div>
                <div style={{paddingLeft: 10, overflow:'auto', height:(this.props.height? this.state.height: 200)}}>
                    {/* {this.state.workspace != '' ? <div className='button' onClick={()=>{this.setWorkSpace(workspaceArray.slice(0, workspaceArray.length-1).join('/'))}}><i className='fa fa-arrow-left' style={{padding:5}}></i></div> : ''} */}
                    {this.state.folders.map((item, key )=> {
                        var folderName = item.split('/').pop()
                        return <div className='folder_item' key={key} style={{display:(except.includes(folderName)?'none':'block'), position:'relative'}} >
                            <i className="fa fa-folder" style={{color:'#dfba49'}}></i>&nbsp;
                                {this.state.editing == folderName
                                    ? <input ref={c=>this.editingInput = c} type='text' onBlur={()=>{this.editFolder()}} value={this.state.editing_value} onChange={(e)=>{this.setState({editing_value: e.target.value})}}></input>
                                    : <span className='button' onClick={()=>{this.setWorkSpace(this.state.workspace + '/' + folderName)}}>{folderName}</span>
                                }
                            <div style={{position:'absolute', right:5, top:0, bottom:0, background:'inherit'}} className='box_flex folder_buttons'>
                                <i style={{padding:5}} title='Edit Folder' className='fa fa-edit button' onClick={(e)=>{e.stopPropagation(); this.setState({editing: folderName, editing_value: folderName})}}></i> 
                                <i style={{padding:5}} title='Delete Folder' className='fa fa-close button' onClick={(e)=>{e.stopPropagation(); this.deleteFolder(folderName)}}></i>
                            </div>
                        </div>
                    })}

                    {this.state.files.map((item, key) => {
                        return <div key={key}><i className="fa fa-file-text-o" style={{color: 'gray'}}></i>&nbsp;{item.split('/').pop()}</div>
                    })}

                </div>
                <div style={{position:'relative'}}><Loading ref={c=>this.load = c} style={{position:'absolute'}}></Loading></div>
            </div>
                <style>{`
                    .folder_item .folder_buttons{
                        display: none;
                    }
                    .folder_item:hover .folder_buttons{
                        display: flex;
                    }

                `}</style>

            </>
        
	}
	
	componentDidMount(){
		this.setWorkSpace('')
	}
	
	loadFolder(){
		if(!this.props.link) return;
		this.load.loading(true);
		return axios.request ({
		    url: this.props.link,
		    method: 'post',
		    data:{folder: this.state.folder + this.state.workspace}
			})
			
	      .then(response => {
              response=response['data'];
              this.load.loading(false);
	    	  if(response['result']){
	    		  this.setState({
	  	  			folders: response['data']['folders'],
	    		  	files: response['data']['files'],
	  	  		  }, ()=>{if(this.editingInput) this.editingInput.focus()})
	    	  }
	      })
	      
	      .catch((error)=>{
              this.load.loading(false);
              error_handle(error);
	      })
    }
    
    addNewFolder(){
        
        var newFolder = 'New Folder';
        var index = 1;
        while(this.state.folders.find(item => {
            var folderName = item.split('/').pop();
            return folderName == newFolder;
        }) !== undefined){
            newFolder = 'New Folder '+index;
            index ++;
        }
        
        var path = this.state.folder + this.state.workspace;
        path = path.replace('/opt/unetlab/labs', '');

		App.loading(true);
		return axios.request ({
		    url: '/api/folders/add',
		    method: 'post',
		    data:{
                path: path,
                name: newFolder
            }
			})
			
	      .then(response => {
              response=response['data'];
              App.loading(false);
	    	  if(response['status'] == 'success'){
                  this.setState({editing: newFolder, editing_value: newFolder})
	    		  this.loadFolder();
	    	  }else{
                  error_handle(response);
              }
	      })
	      
	      .catch((error)=>{
            App.loading(false);
            error_handle(error);
	      })
    }
    
    editFolder(){
		if(this.state.editing == this.state.editing_value){
            this.setState({editing: '', editing_value: ''});
            return;
        }

        var path = this.state.folder + this.state.workspace + '/' + this.state.editing;
        var new_path = this.state.folder + this.state.workspace + '/' + this.state.editing_value;

        path = path.replace('/opt/unetlab/labs', '');
        new_path = new_path.replace('/opt/unetlab/labs', '');

		App.loading(true);
		return axios.request ({
		    url: '/api/folders/edit',
		    method: 'post',
		    data:{
                path: path,
                new_path: new_path
            }
			})
			
	      .then(response => {
              response=response['data'];
              App.loading(false);
	    	  if(response['status'] == 'success'){
                  this.setState({editing: '', editing_value: ''}, ()=>{this.loadFolder()})
	    	  }else{
                  error_handle(response);
              }
	      })
	      
	      .catch((error)=>{
            App.loading(false);
            error_handle(error);
	      })
    }
    
    deleteFolder(folderName){

        var delPath = this.state.folder + this.state.workspace + '/' + folderName;
        delPath = delPath.replace('/opt/unetlab/labs', '');
        makeQuestion('Do you want to Delete this Folder?', 'Yes', 'Cancel').then(response=>{
            if(response){
                App.loading(true);
                return axios.request ({
                    url: '/api/folders/delete',
                    method: 'post',
                    data:{
                        path: delPath,
                    }
                    })
                    
                .then(response => {
                    response=response['data'];
                    App.loading(false);
                    if(response['status'] == 'success'){
                        this.setState({editing: '', editing_value: ''}, ()=>{this.loadFolder()})
                    }else{
                        error_handle(response);
                    }
                })
                
                .catch((error)=>{
                    App.loading(false);
                    error_handle(error);
                })
            }
        })
		
	}
	
	
}

export default FolderFlat;
