import React, { Component } from 'react'


class MoveFolderLab extends Component {

    constructor(props) {
        super(props);

        this.dragData = null;

    }

    render() {
        return <>
            <style>{`
                .folder_dropable.dragenter{
                    border: solid thin orange !important;
                    border-radius: 5px;
                }
                .folder_dropable.dragenter *{
                    pointer-events: none;
                }
            `}</style>
        </>
    }

    componentDidMount() {
        global.onDragFolder = (event) => {
            this.dragData ={
                obj: 'folder',
                path: event.target.getAttribute('path'),
            }
        }
        global.onDragLab = (event) => {
            this.dragData = {
                obj: 'lab',
                path: event.target.getAttribute('path'),
            }
        }
        global.onDropObj = (event) =>{
            event.target.classList.remove('dragenter');
            if(this.dragData){
                if(this.dragData.obj == 'lab'){
                    this.moveLab(event.target.getAttribute('path'), this.dragData.path);
                }
                if(this.dragData.obj == 'folder'){
                    var path = this.dragData.path;
                    var match = /.*\/([^\/]+)\/?$/.exec(path);
                    if(match){
                        this.moveFolder(event.target.getAttribute('path')+'/'+match[1], this.dragData.path);
                    }
                    
                }
            }
            this.dragData = null;
        }
        global.onDragObjEnter = (event) => {
            event.target.classList.add('dragenter')
        }
        global.onDragObjLeave = (event) => {
            event.target.classList.remove('dragenter')
        }
    }

    moveLab(newPath, labPath){
		App.loading(true);
		var tempPathNew = (newPath == '/') ? newPath : newPath.replace(/\/$/, '');
		axios({
			method: 'POST',
			url: '/api/labs/move',
			data: { 
				path: labPath,
				new_path: tempPathNew 
			}
		})
			.then(
				function successCallback(response) {
					App.loading(false);
					console.log(response)
					if(global.scope){
                        global.scope.fileMngDraw(global.scope.path);
                    }
				},
				function errorCallback(response) {
					App.loading(false);
					console.log(response)
					error_handle(response);
				}
			);
	}

	moveFolder(newPath, folderPath){
		App.loading(true);
		axios({
			method: 'POST',
			url: '/api/folders/edit',
			data: {
				path: folderPath,
				new_path: newPath
			}
		}).then(
			function successCallback(response) {
				App.loading(false);
				console.log(response)
				if(global.scope){
                    global.scope.fileMngDraw(global.scope.path);
                }
			},
			function errorCallback(response) {
				App.loading(false);
				console.log(response)
				error_handle(response);
			}
		);
	}



}
export default MoveFolderLab
