import React, { Component } from 'react'
import FolderPlat from '../../func/FuncFolderPlat'
import Input from '../../input/Input';
import '../../input/responsive/input.scss';

class EditRoleModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.id = makeId();
        this.table = this.context;
        this.table.children['FuncAddRole'] = this;

        this.state = {
            permissions: {
                [USER_PER_DEL_FOLDER]: false,
                [USER_PER_ADD_FOLDER]: false,
                [USER_PER_EDIT_FOLDER]: false,
                [USER_PER_DEL_LAB]: false,
                [USER_PER_ADD_LAB]: false,
                //[USER_PER_EDIT_LAB]: false,
                [USER_PER_IMPORT_LAB]: false,
                [USER_PER_EXPORT_LAB]: false,
                [USER_PER_MOVE_LAB]: false,
                [USER_PER_CLONE_LAB]: false,
                [USER_PER_RENAME_LAB] : false,
            },

            action: 'add',
        }

        this.role_id = null;

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#file_mng_modal" + this.id).modal('hide');
        } else {
            $("#file_mng_modal" + this.id).modal();
        }
    }

    setRoleID(role_id) {
        if (role_id != null && role_id != '') {
            this.role_id = role_id;
            this.loadRole();
            this.setState({action: 'edit'})
        }else{
            this.setState({action: 'add'});
            this.nameInput.setValue('');
        }
    }

    render() {

        return (<>
            <div className="modal fade" id={"file_mng_modal" + this.id}>
                <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '90%' }}>
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4>{this.state.action == 'add' ? lang('Add Role') : lang('Edit Role')}</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body" style={{ textAlign: 'initial' }}>

                            <div style={{ padding: 7 }}>
                                <div className='row'>

                                    <div className='col-md-6'>
                                        <div>
                                            <strong>{lang("Name")}</strong>
                                            <Input className='input_item_input' ref={c => this.nameInput = c} struct={{
                                                [INPUT_TYPE]: 'text',
                                                [INPUT_NULL]: false,
                                            }}></Input>
                                        </div>
                                        <br />

                                        <div>
                                            <strong>{lang("Workspace")}</strong>
                                            <p>{lang("role_workspace_des")}</p>
                                            <FolderPlat ref={c => this.workspaceInput = c} except={['Your labs from PNETLab Store']} link="/store/public/admin/default/folder" folder='/opt/unetlab/labs'></FolderPlat>
                                        </div>
                                        <br />
                                        <div>
                                            <strong>{lang("Note")}</strong>
                                            <Input className='input_item_input' ref={c => this.noteInput = c} struct={{
                                                [INPUT_TYPE]: 'textarea',
                                            }}></Input>
                                        </div>


                                    </div>

                                    <div className='col-md-6'>
                                        <strong>{lang("Permission")}</strong>
                                        {Object.keys(this.state.permissions).map(item => {
                                            return <div key={item}><label className='box_flex'>
                                                <input style={{ margin: '5px 10px' }} type='checkbox' checked={this.state.permissions[item]} onChange={(e) => {
                                                    var permissions = this.state.permissions;
                                                    permissions[item] = e.target.checked;
                                                    this.setState({ permissions });
                                                }}></input>{lang(item)}</label></div>
                                        })}

                                        <div style={{marginTop:10}}>
                                            <strong>{lang("CPU Limit")} (%)</strong>
                                            <Input max="95" min="1" step="1" className='input_item_input' ref={c => this.cpuLimitInput = c} struct={{
                                                [INPUT_TYPE]: 'number',
                                            }}></Input>
                                        </div>

                                        <div style={{marginTop:10}}>
                                            <strong>{lang("RAM Limit")} (%)</strong>
                                            <Input max="95" min="1" step="1" className='input_item_input' ref={c => this.ramLimitInput = c} struct={{
                                                [INPUT_TYPE]: 'number',
                                            }}></Input>
                                        </div>


                                        <div style={{marginTop:10}}>
                                            <strong>{lang("Hard disk Limit")} (MB)</strong>
                                            <Input className='input_item_input' ref={c => this.hddLimitInput = c} struct={{
                                                [INPUT_TYPE]: 'number',
                                            }}></Input>
                                        </div>

                                        <div><i><span style={{textDecoration:'underline'}}>{lang("Note")}:</span>&nbsp;{lang("limit_note")}</i></div>

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">
                                {this.state.action == 'add'
                                    ? <button type="button" className="btn btn-primary" onClick={() => { this.addRole() }}>{lang("Add")}</button>
                                    : <button type="button" className="btn btn-primary" onClick={() => { this.editRole() }}>{lang("Save")}</button>
                                }
                                <button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Cancel")}</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
        )
    }


    loadRole() {
        if (this.role_id == null) return;
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/user_roles/getRoleWithPermission',
            method: 'post',
            data: {
                [USER_ROLE_ID]: this.role_id,
            }
        })

            .then(response => {
                response = response['data'];
                App.loading(false);
                if (response['result']) {
                    var data = response['data'];
                    this.nameInput.setValue(data[USER_ROLE_NAME]);
                    this.noteInput.setValue(data[USER_ROLE_NOTE]);
                    this.cpuLimitInput.setValue(data[USER_ROLE_CPU]);
                    this.ramLimitInput.setValue(data[USER_ROLE_RAM]);
                    this.hddLimitInput.setValue(data[USER_ROLE_HDD]);
                    
                    this.workspaceInput.setWorkSpace(data[USER_ROLE_WORKSPACE]);
                    var permissions = this.state.permissions;
                    for (let i in permissions) {
                        if (data[USER_PERMISSION_TABLE].find(item => item[USER_PER_NAME] == i) !== undefined) {
                            permissions[i] = true;
                        } else {
                            permissions[i] = false;
                        }
                    }
                    this.setState({ permissions })
                } else {
                    error_handle(response);
                }
            })

            .catch((error) => {
                App.loading(false);
                error_handle(error);
            })

    }

    addRole() {
        var note = this.noteInput.getValue();
        var name = this.nameInput.getValue();
        if (name === false) return;

        var workspace = this.workspaceInput.getWorkSpace();
        if (workspace == '') workspace = '/';

        var ramLimit = this.ramLimitInput.getValue();
        var cpuLimit = this.cpuLimitInput.getValue();
        var hddLimit = this.hddLimitInput.getValue();
        if(ramLimit === false || cpuLimit === false || hddLimit === false) return;

        var addData = [{
            [USER_ROLE_NAME]: name,
            [USER_ROLE_WORKSPACE]: workspace,
            [USER_ROLE_NOTE]: note,
            [USER_ROLE_RAM]: ramLimit,
            [USER_ROLE_CPU]: cpuLimit,
            [USER_ROLE_HDD]: hddLimit,
        }];

        this.table.addRow(addData).then(response => {
            if (response['result']) {
                var role = response['data'];
                return this.addPermissions(role[USER_ROLE_ID]);
            } else {
                error_handle(response);
            }
        });

    }

    editRole() {
        if (this.role_id == null) return;
        var note = this.noteInput.getValue();
        var name = this.nameInput.getValue();
        if (name === false) return;

        var workspace = this.workspaceInput.getWorkSpace();
        if (workspace == '') workspace = '/';

        var ramLimit = this.ramLimitInput.getValue();
        var cpuLimit = this.cpuLimitInput.getValue();
        var hddLimit = this.hddLimitInput.getValue();
        if(ramLimit === false || cpuLimit === false || hddLimit === false) return;


        var editData = {
            [DATA_KEY]: [{ [USER_ROLE_ID]: this.role_id }],
            [DATA_EDITOR]: {
                [USER_ROLE_NAME]: name,
                [USER_ROLE_WORKSPACE]: workspace,
                [USER_ROLE_NOTE]: note,
                [USER_ROLE_RAM]: ramLimit,
                [USER_ROLE_CPU]: cpuLimit,
                [USER_ROLE_HDD]: hddLimit,
            }
        }

        this.table.editRow(editData).then(response => {
            if (response['result']) {
                return this.addPermissions(this.role_id);
            } else {
                error_handle(response);
            }
        });

    }

    addPermissions(role_id) {
        var addDatas = [];
        for (let i in this.state.permissions) {
            if (this.state.permissions[i]) {
                addDatas.push({
                    [USER_PER_NAME]: i,
                })
            }

        }

        App.loading(true);
        return axios.request({
            url: '/store/public/admin/user_roles/addPermissions',
            method: 'post',
            data: {
                [USER_ROLE_ID]: role_id,
                data: addDatas
            }
        })

            .then(response => {
                response = response['data'];
                App.loading(false);
                if (response['result']) {
                    this.modal('hide');
                    this.table.filter();
                } else {
                    error_handle(response);
                }
            })

            .catch((error) => {
                App.loading(false);
                error_handle(error);
            })


    }


}

EditRoleModal.contextType = TableContext;

export default EditRoleModal
