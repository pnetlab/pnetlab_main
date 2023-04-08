import React, { Component } from 'react'
import Folder from '../../func/FuncFolder'
import Input from '../../input/Input';
import '../../input/responsive/input.scss';



class AddUserModal extends Component {

	constructor(props, context) {
		super(props, context);
        this.id = makeId();
        this.table = this.context;
        this.table.children['FuncAddUser'] = this;
        
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
                        <strong>{lang("Add Users")}</strong>
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

						<div className="modal-body" style={{ textAlign: 'initial' }}>

							<div style={{ padding:7 }}>

								<div>
                                    <div>
                                        <strong>{lang("Emails")}</strong>
                                        <p>{lang("email_des")}</p>
                                        <Input className='input_item_input' ref={c=>this.emailsInput = c} struct={{
                                            [INPUT_TYPE] : 'textarea',
                                            [INPUT_ONCHANGE_BLUR]: (e, input)=>{
                                                var data = input.getValue();
                                                data = data.match(/[\w\d\.\-\+\_]+\@[\w\d\.\-\+\_]+/g);
                                                data = data.join(', ');
                                                input.setValue(data);
                                            },
                                            [INPUT_NULL]: false,
                                        }}></Input>
									</div>
                                    <br/>
                                    <div>
                                        <strong>{lang("Role")}</strong>
                                        <Input className='input_item_input' ref={c=> this.roleInput = c} struct = {{
                                            [INPUT_TYPE] : 'select',
                                            [INPUT_OPTION]: this.table[STRUCT_EDIT][USER_ROLE][EDIT_OPTION],
                                            [INPUT_NULL]: false,
                                        }}></Input> 
                                    </div>
                                    <br/>
                                    <div>
                                        <strong>{lang("Note")}</strong>
                                        <Input className='input_item_input' ref={c=>this.noteInput = c} struct={{
                                            [INPUT_TYPE] : 'textarea',
                                        }}></Input>
                                    </div>


								</div>

							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={() => {this.addUsers()}}>{lang("Add")}</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">{lang("Cancel")}</button>
							</div>

						</div>
					</div>
				</div>
			</div>

		</>
		)
	}




	addUsers(){
        var note = this.noteInput.getValue();
        var role = this.roleInput.getValue();
        if(role === null) return;
        var user = this.emailsInput.getValue();
        if(user === null) return;

        user = user.split(', ');
        var addData=[];
        user.map(item => addData.push({
            [USER_EMAIL]: item,
            [USER_ROLE]: role,
            [USER_NOTE]: note,
            [USER_STATUS]: USER_STATUS_ACTIVE,
            [USER_OFFLINE]: '0',
        }));

        this.table.addRow(addData).then(response=>{
            if(response['result']) this.modal('hide');
        })
        
    }


}

AddUserModal.contextType = TableContext;

export default AddUserModal
