import React, { Component } from 'react'
import Loading from '../../common/Loading';
import Input from '../../input/Input';


class NodeFolderModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            error: '',
            path: '',
            size: '',
            status: '',
            attach: '',
        }

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            
        } else {
            $("#" + this.id).modal();
            this.setState({error: ''});
        }
    }
   

    getNodeFolder(node_id){
        App.loading(true);
        axios({
			method: 'POST',
            url: '/store/public/admin/node_sessions/getNodeWorkspace',
            dataType: 'json',
            data: {
                node_id : node_id
            },
            })
			.then(response => {
                App.loading(false);
                response = response['data'];
                if(response['result']){
                    this.setState({
                        error: '',
                        path: get(response['data']['path'], ''),
                        size: get(response['data']['size'], ''),
                        status: get(response['data']['status'], ''),
                        attach: get(response['data']['attach'], ''),
                    })
                }else{
                    this.setState({error: lang(response['message'], response['data'])});
                }
			})
			.catch(error => {
                App.loading(false);
                console.log(error);
                error_handle(error);
		});
    }


    render(){
        return <>
        <div className="modal fade" id={this.id}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">

						<div className="modal-header">
                            <strong className='modal-title'>{lang("Node Folder")}</strong>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

                        <div className='modal-body'>
                            {this.state.error == ''
                            ? <div>
                                <div style={{padding:5}}><strong>{lang("Path")}: </strong>{this.state.path}</div>
                                <div style={{padding:5}}><strong>{lang("State")}: </strong>{this.state.status == 1 ? <b style={{color:'orange'}}>Created</b> : <b style={{color:'green'}}>Empty</b>}</div>
                                <div style={{padding:5}}><strong>{lang("Size")}: </strong>{Math.round(this.state.size*100/1024/1024)/100}MB</div>
                                {this.state.attach == ''? '' : <div style={{padding:5}}><strong>{lang("Attach Command")}: </strong>{this.state.attach}</div>}
                            </div>
                            : <div className='alert alert-danger'>{this.state.error}</div>
                            }
                        </div>
					</div>
				</div>
			</div>

        </>
    }

    componentDidMount(){
        var modalView = $(`#${this.id}`);
        modalView.on('hidden.bs.modal', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $(document).on('click', '.action-nodefolder', (e)=>{
            var node_id = e.target.getAttribute('data-path');
            this.getNodeFolder(node_id);
            this.modal();
        })
        
    }

}



export default NodeFolderModal;