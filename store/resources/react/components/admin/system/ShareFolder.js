import React, { Component } from 'react';
import Loading from '../../common/Loading';
import Folder from '../../func/FuncFolder'

class ShareFolder extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();
        this.state = {
            shared: [],

            permissions: {
                [USER_PER_DEL_FOLDER]: false,
                [USER_PER_ADD_FOLDER]: false,
                [USER_PER_EDIT_FOLDER]: false,
                [USER_PER_DEL_LAB]: false,
                [USER_PER_ADD_LAB]: false,
                [USER_PER_IMPORT_LAB]: false,
                [USER_PER_EXPORT_LAB]: false,
                [USER_PER_MOVE_LAB]: false,
                [USER_PER_CLONE_LAB]: false,
                [USER_PER_JOIN_LAB]: false,
                [USER_PER_OPEN_LAB]: false,
                [USER_PER_RENAME_LAB]: false,
            },
        }
    }



    render() {
        return <>

            <div className='box_shadow box_padding'>
                <div className='row'>
                    <div className='col-md-6'>
                        <strong>{lang("Share Folders")}</strong>
                        <p>{'Choose folders to share with all users'}</p>
                        <div>
                            <div className='box_border' style={{ padding: 5, borderRadius: 5 }}>
                                <div><strong>{lang('Selected Folders')}:</strong></div>
                                <style>{`
                            .file_selected:hover {
                                background: #eee;
                            }
                           
                        `}</style>
                                {this.state.shared.map((item) => {
                                    return <div key={item} className='box_flex file_selected' style={{ padding: 5 }}>
                                        <i className="fa fa-share-alt fa-border" style={{ color: '#00BCD4' }}></i>
                            &nbsp;
                            {item}
                            &nbsp;
                            <i className="fa fa-close button" style={{ marginLeft: 'auto' }} onClick={() => {
                                            var selected = this.state.shared;
                                            var index = selected.findIndex(folder => folder == item);
                                            if (index == undefined) return;
                                            selected.splice(index, 1);
                                            this.setState({
                                                shared: selected
                                            })
                                        }}></i>
                                    </div>
                                })}
                            </div>

                            <Folder expand={true} link="/store/public/admin/default/folder" folder='/opt/unetlab/labs' onSelectFolder={(folder) => {
                                var selected = [];

                                this.state.shared.map(item => {
                                    if ((folder + '/').indexOf(item + '/') == 0) return;
                                    if ((item + '/').indexOf(folder + '/') == 0) return;
                                    selected.push(item);
                                })

                                selected.push(folder);
                                this.setState({
                                    shared: selected
                                })
                            }} selected={this.state.shared}></Folder>
                        </div>
                        
                    </div>

                    <div className='col-md-6'>
                    <strong>{lang("Share Folders permissions")}</strong>
                    {Object.keys(this.state.permissions).map(item => {
                        return <div key={item}><label className='box_flex'>
                            <input style={{ margin: '5px 10px' }} type='checkbox' checked={this.state.permissions[item]} onChange={(e) => {
                                var permissions = this.state.permissions;
                                permissions[item] = e.target.checked;
                                this.setState({ permissions });
                            }}></input>{lang(item)}</label></div>
                    })}
                    </div>

                </div>

                <br></br>
                <div><div className='button btn btn-primary' onClick={() => this.shareFolder()}>{lang("Save")}</div></div>

            </div>

        </>
    }


    shareFolder() {
        App.loading(true);
        axios.request({
            url: '/store/public/admin/system/update',
            method: 'post',
            data: {
                [CTRL_SHARED]: this.state.shared,
                [CTRL_SHARED_PERMISSION]: this.state.permissions,
            }
        })

            .then(response => {
                response = response['data'];
                App.loading(false);
                if (response['result']) {
                    this.getShareFolder();
                } else {
                    error_handle(response);
                }
            })

            .catch(error => {
                App.loading(false);
                console.log(error);
                error_handle(error);

            })
    }

    getShareFolder() {

        axios.request({
            url: '/store/public/admin/system/getShareFolder',
            method: 'post',
        })

            .then(response => {
                response = response['data'];
                if (response['result']) {
                    var data = response['data'];
                    var state = {};
                    if(isset(data[CTRL_SHARED])) state['shared'] = data[CTRL_SHARED];
                    if(typeof data[CTRL_SHARED_PERMISSION] == 'object'){
                        state['permissions'] = {};
                        for (let i in this.state.permissions){
                            if(isset(data[CTRL_SHARED_PERMISSION][i])){
                                state['permissions'][i] = data[CTRL_SHARED_PERMISSION][i];
                            }else{
                                state['permissions'][i] = false;
                            }
                        }
                    }
                    this.setState({...state});
                } else {
                    error_handle(response);
                }
            })

            .catch(error => {
                console.log(error);
                error_handle(error);
                this.clearProcess();
            })

    }

    componentDidMount() {
        this.getShareFolder();
    }



}

export default ShareFolder;