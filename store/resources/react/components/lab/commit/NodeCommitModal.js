import React, { Component } from 'react'
import Loading from '../../common/Loading';
import Input from '../../input/Input';


class NodeCommitModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            error: '',
            success: '',
            type: 'existed',
        }

        this.node_id = null;

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            
        } else {
            $("#" + this.id).modal();
            this.setState({error: '', success:''});
        }
    }
   
    commitHandle(node_id){
        this.setState({error: '', success:''});
        if(!isset(global.nodes[node_id])){
            showLog('Node is undefined', 'error');
            return;
        }
        var node_image = global.nodes[node_id]['image'];

        var device_name = '';
        if(this.state.type == 'snapshot'){
            device_name = this.newSnapshotName.getValue();
            if(device_name == null) return;
        }
        if(this.state.type == 'new'){
            device_name = this.newDeviceName.getValue();
            if(device_name == null) return;
        }

        App.loading(true);
        axios({
			method: 'POST',
            url: '/store/public/admin/node_sessions/checkCommitDevice',
            dataType: 'json',
            data: {
                node_id : node_id,
                node_image: node_image,
                device_name: device_name,
                type: this.state.type,
            },
            })
			.then(response => {
                App.loading(false);
                response = response['data'];
                if(response['result']){
                    var hardDisk = Math.floor(Number(response['data'])*100/1024/1024)/100;
                    makeQuestion(lang('commit_hdd_alert', {size: hardDisk})).then(result=>{
                        if(result) this.commitDevice(node_id);
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

    commitDevice(node_id){
        this.setState({error: '', success:''});
        if(!isset(global.nodes[node_id])){
            showLog('Node is undefined', 'error');
            return;
        }
        var node_image = global.nodes[node_id]['image'];

        var device_name = '';
        if(this.state.type == 'snapshot'){
            device_name = this.newSnapshotName.getValue();
            if(device_name == null) return;
        }
        if(this.state.type == 'new'){
            device_name = this.newDeviceName.getValue();
            if(device_name == null) return;
        }

        App.loading(true);
        axios({
			method: 'POST',
            url: '/store/public/admin/node_sessions/commitDevice',
            dataType: 'json',
            data: {
                node_id : node_id,
                node_image: node_image,
                device_name: device_name,
                type: this.state.type,
            },
            })
			.then(response => {
                App.loading(false);
                response = response['data'];
                if(response['result']){
                    response = response['data'];
                    this.setState({success: `${lang("Commit Successfully")}. ${response['name']==''?'': 'New Device Name: ' + response['name']}`});
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

        var noteType = ''
        if(this.node_id != null && isset(global.nodes[this.node_id])){
            noteType = global.nodes[this.node_id]['type'];
        }

        return <>
        <div className="modal fade" id={this.id}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">

						<div className="modal-header">
                            <strong className='modal-title'>{lang("Commit Node")}</strong>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

                        <div className='modal-body'>

                            <div>
                                <div><label className='box_flex'><input type='radio' checked={(this.state.type == 'existed')} onChange={(e)=>this.setState({type: 'existed'})} style={{margin:0}}></input>&nbsp; {lang("Commit to original Image")}</label></div>
                                <div><label className='box_flex'><input type='radio' checked={this.state.type == 'snapshot'} onChange={(e)=>this.setState({type: 'snapshot'})} style={{margin:0}}></input>&nbsp; {lang("Take Snapshot from original Image")}</label></div>
                                {noteType == 'qemu' ? <div><label className='box_flex'><input type='radio' checked={this.state.type == 'new'} onChange={(e)=>this.setState({type: 'new'})} style={{margin:0}}></input>&nbsp; {lang("Create a completely new Image")} </label></div>: ''}

                                {this.state.type == 'new'
                                    ?<Input className='input_item_input' struct={{
                                        [INPUT_TYPE]: 'text',
                                        [INPUT_NULL]: false,
                                        [INPUT_ONBLUR]: (e, obj)=>{
                                            var val = obj.getValue();
                                            val = val.replace(/[^\w]/g, '_');
                                            obj.setValue(val);
                                        }
                                    }} ref={c=>this.newDeviceName = c} placeholder={lang("New Device Name")}></Input>
                                    :''
                                }
                                {this.state.type == 'snapshot'
                                    ?<Input className='input_item_input' struct={{
                                        [INPUT_TYPE]: 'text',
                                        [INPUT_NULL]: false,
                                        [INPUT_ONBLUR]: (e, obj)=>{
                                            var val = obj.getValue();
                                            val = val.replace(/[^\w]/g, '_');
                                            obj.setValue(val);
                                        }
                                    }} ref={c=>this.newSnapshotName = c} placeholder={lang("New Snapshot Name")}></Input>
                                    :''
                                }

                                <div style={{color:'#2196F3'}}>
                                    {this.state.type == 'existed'
                                        ? <div><b>{lang("Commit to original Image")}:</b> {lang("commit_origin_des")}</div>
                                        : ''
                                    }
                                    {this.state.type == 'snapshot'
                                        ? <div><b>{lang("Take Snapshot from original Image")}:</b> {lang("take_snapshot_des")}</div>
                                        : ''
                                    }
                                    {this.state.type == 'new'
                                        ? <div><b>{lang("Create a completely new Image")}:</b> {lang("new_image_des")}</div>
                                        : ''
                                    }
                                </div>

                                <div style={{textAlign:'center', margin:10}}><div className='button btn btn-primary' onClick={()=>this.commitHandle(this.node_id)}>{lang("Commit")}</div></div>

                            </div>
                            <div>
                                {this.state.error != '' ? <div className='alert alert-danger'>{this.state.error}</div> : ''}
                                {this.state.success != '' ? <div className='alert alert-success'>{this.state.success}</div> : ''}
                            </div>
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
        $(document).on('click', '.action-nodecommit', (e)=>{
            this.node_id = e.target.getAttribute('data-path');
            this.modal();
        })
        
    }

}



export default NodeCommitModal;