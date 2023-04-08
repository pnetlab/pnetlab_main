import React, { Component } from 'react'
import Folder from '../../func/FuncFolder'
import Input from '../../input/Input';
import '../../input/responsive/input.scss';
import FolderPlat from '../../func/FuncFolderPlat';



class AddOfflineUserModal extends Component {

	constructor(props, context) {
		super(props, context);
        this.id = makeId();
        this.table = this.context;
        this.table.children['FuncAddOffUser'] = this;

        this.state = {role: ''};
        
	}
	
	modal(cmd = 'show') {
		if (cmd == 'hide') {
			$("#file_mng_modal" + this.id).modal('hide');
		} else {
			$("#file_mng_modal" + this.id).modal();
		}
	}

	render() {
        
		return (<>
			<div className="modal fade" id={"file_mng_modal" + this.id}>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">

						<div className="modal-header">
						<strong>{lang("Add User")}</strong>
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

						<div className="modal-body" style={{ textAlign: 'initial' }}>

							<div style={{ padding:7 }}>

								<div>
                                    
                                        <div style={{margin:'10px 0px'}} title={lang("Username")}><Input className='input_item_input' ref={c => this.usernameInput = c} placeholder={lang('Username')} struct={{
                                            [INPUT_TYPE]: 'text',
                                            [INPUT_NULL]: false,
                                        }}></Input></div>

                                        <div style={{margin:'10px 0px'}} title={lang("Password")}><Input className='input_item_input' ref={c => this.passwordInput = c} placeholder={lang('Password')} struct={{
                                            [INPUT_TYPE]: 'password',
                                            [INPUT_NULL]: false,
                                        }}></Input></div>

                                        <div style={{margin:'10px 0px'}} title={lang('Role')}><Input className='input_item_input' ref={c => this.roleInput = c} placeholder={lang('Role')} struct={{
                                            [INPUT_TYPE]: 'select',
                                            [INPUT_NULL]: false,
                                            [INPUT_OPTION]: get(this.table[STRUCT_EDIT][USER_ROLE][EDIT_OPTION], []),
                                            [INPUT_ONCHANGE]: (e, obj) => {
                                                this.setState({'role': obj.getValue()}, ()=>this.getRole());
                                            }
                                        }}></Input></div>

                                        {this.state.role == 0
                                            ? ''
                                            : <>
                                                <div style={{margin:'10px 0px'}} title={lang('Status')}><Input className='input_item_input' ref={c => this.statusInput = c} placeholder={lang('Status')} struct={{
                                                    [INPUT_TYPE]: 'select',
                                                    [INPUT_NULL]: true,
                                                    [INPUT_OPTION]: get(this.table[STRUCT_EDIT][USER_STATUS][EDIT_OPTION], []),
                                                    [INPUT_DEFAULT]: '1',
                                                }}></Input></div>

                                                <div style={{margin:'10px 0px'}} title={lang('Active Time')}><Input className='input_item_input' ref={c => this.activeInput = c} placeholder={lang('Active Time')} struct={{
                                                    [INPUT_TYPE]: 'date',
                                                    [INPUT_NULL]: true,
                                                    [INPUT_FORMAT]: 'llll',
                                                }}></Input></div>

                                                <div style={{margin:'10px 0px'}} title={lang('Expired Time')}><Input className='input_item_input' ref={c => this.expiredInput = c} placeholder={lang('Expired Time')} struct={{
                                                    [INPUT_TYPE]: 'date',
                                                    [INPUT_NULL]: true,
                                                    [INPUT_FORMAT]: 'llll',
                                                }}></Input></div>

                                                <div>
                                                    <strong>{lang("Workspace")}</strong>
                                                    <p>{lang("workspace_des")}</p>
                                                    <FolderPlat ref={c=>this.workspaceInput = c} except={['Your labs from PNETLab Store']} link="/store/public/admin/default/folder" folder='/opt/unetlab/labs'></FolderPlat>
                                                </div>

                                                <div style={{margin:'10px 0px'}} title={lang(USER_MAX_NODE)}><Input min={0} className='input_item_input' ref={c => this.maxNodeInput = c} placeholder={lang(USER_MAX_NODE)} struct={{
                                                    [INPUT_TYPE]: 'number',
                                                    [INPUT_NULL]: true,
                                                }}></Input>
                                                </div>

                                                <div style={{margin:'10px 0px'}} title={lang(USER_MAX_NODELAB)}><Input min={0} className='input_item_input' ref={c => this.maxNodeLabInput = c} placeholder={lang(USER_MAX_NODELAB)} struct={{
                                                    [INPUT_TYPE]: 'number',
                                                    [INPUT_NULL]: true,
                                                }}></Input>

                                                </div>
                                            </>

                                        }

                                        <div style={{margin:'10px 0px'}} title="Note"><Input className='input_item_input' ref={c => this.noteInput = c} placeholder={lang('Note')} struct={{
                                            [INPUT_TYPE]: 'textarea',
                                            [INPUT_NULL]: true,
                                        }}></Input></div>



                                    </div>

								</div>

							</div>

                            <div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={() => {this.addUsers()}}>{lang('Add')}</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Cancel")}</button>
							</div>

                            </div>
					</div>
				</div>
			

		</>
		)
	}



    getRole(){
        App.loading(true);
		return axios.request ({
		    url: '/store/public/admin/user_roles/read',
		    method: 'post',
		    data:{
                data: [{[USER_ROLE_ID]: this.state.role}]
            }
			})
			
	      .then(response => {
              response=response['data'];
              App.loading(false);
	    	  if(response['result']){
                  if(isset(response['data'][0])){
                      var role = response['data'][0];
                      var folder = get(role[USER_ROLE_WORKSPACE], '');
                      this.workspaceInput.setFolder('/opt/unetlab/labs'+folder);
                  }
	    	  }else{
                  error_handle(response);
              }
	      })
	      
	      .catch((error)=>{
            App.loading(false);
            error_handle(error);
	      })
    }


	addUsers(){
        var note = this.noteInput.getValue();
        var role = this.roleInput.getValue();
        if(role === null) return;
        var username = this.usernameInput.getValue();
        if(username === null) return;
        var password = this.passwordInput.getValue();
        if(password === null) return;

        var status = '1';
        if(this.statusInput) status = this.statusInput.getValue();

        var activeTime = '';
        if(this.activeInput) activeTime = this.activeInput.getValue();

        var expiredTime = '';
        if(this.expiredInput) expiredTime = this.expiredInput.getValue();

        var workspace = '';
        if(this.workspaceInput) workspace = this.workspaceInput.getWorkSpace();

        var maxNode = '';
        if(this.maxNodeInput) maxNode = this.maxNodeInput.getValue();

        var maxNodeLab = '';
        if(this.maxNodeLabInput) maxNodeLab = this.maxNodeLabInput.getValue();

        this.table.addRow([{
            [USER_USERNAME]: username,
            [USER_PASSWORD]: password,
            [USER_ROLE]: role,
            [USER_STATUS]: status,
            [USER_ACTIVE_TIME] : activeTime,
            [USER_EXPIRED_TIME] : expiredTime,
            [USER_WORKSPACE]: workspace,
            [USER_NOTE]: note,
            [USER_MAX_NODE]: maxNode,
            [USER_MAX_NODELAB]: maxNodeLab

        }]).then(response =>{
            if(response['result']){
              this.modal('hide');
              this.table.filter();
            }else{
               error_handle(response);
            }
        });
        
    }


}

AddOfflineUserModal.contextType = TableContext;

export default AddOfflineUserModal
