import React, { Component } from 'react'
import Input from '../../input/Input';
import UsersModal from './UsersModal';


class AddLabModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {

            users: {},
            
            joinable: 0,
            joinable_emails: [],
            openable: 0,
            openable_emails: [],
            editable: 0,
            editable_emails: [],
        }

        this.struct = {
            author: {
                [INPUT_TYPE]: 'text',
                [INPUT_NULL]: true,
            },
            description: {
                [INPUT_TYPE]: 'textarea',
                [INPUT_NULL]: true,
            },
            filename : {
                [INPUT_TYPE]: 'text',
                [INPUT_WRITABLE]: false,
            },
            scripttimeout: {
                [INPUT_TYPE]: 'number',
                [INPUT_NULL]: true,
                [INPUT_DEFAULT]: 300,
            },
            version: {
                [INPUT_TYPE]: 'text',
                [INPUT_DEFAULT]: 1,
            },
            name: {
                [INPUT_TYPE]: 'text',
                [INPUT_NULL]: false,
            },
            countdown: {
                [INPUT_TYPE]: 'number',
                [INPUT_NULL]: true,
                [INPUT_DEFAULT]: 60,
            }

        }
        this.path = '/';
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            
        } else {
            $("#" + this.id).modal();
           
        }
    }

    
    componentDidMount() {
        var modalView = $(`#${this.id}`);

        modalView.on('hidden.bs.modal', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        global.addLab = (path)=>{
            this.modal();
            this.path = /.*\/$/.test(path) ? path : (path + '/');
            if(App.server && App.server.user && App.server.user[USER_POD]){
                this.authorInput.setValue(App.server.user[USER_POD])
                this.setState({
                    openable: 2,
                    openable_emails: [App.server.user[USER_POD]],
                    joinable: 2,
                    joinable_emails: [App.server.user[USER_POD]],
                    editable: 2,
                    editable_emails: [App.server.user[USER_POD]],
                })
            }
            this.getMapUser();
        }

    }

    getMapUser(){
		return axios.request({
            url: '/store/public/admin/lab_sessions/mapUser',
            method: 'post',
            
        })

		.then(response => {
			response = response['data'];
			if (!response['result']) {
				error_handle(response);
				return false;
			} else {
                this.setState({users: response['data']})
			}
		})

		.catch((error)=>{
			console.log(error);
			error_handle(error);
		})
    }
    
    showUsers(pods){
        var userName = [];
        pods.map(item => {
            if(isset(this.state.users[item])){
                userName.push(formatName(this.state.users[item][USER_USERNAME]));
            }else{
                userName.push(item);
            }
        })
        return userName.join(', ');
    }

    render() {

        return <div className="modal fade" id={this.id}>
            <div className="modal-dialog modal-lg" role="document" style={{maxWidth:'90%'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className='modal-title'>{lang("Add new Lab")}</h4>
                        <i type="button" className="close" data-dismiss="modal"  aria-hidden="true">×</i>
                    </div>

                    <div className = 'row'>
                        <div className = 'col-md-6'>
                            <div className='box_flex lab_item'>
                                <div className='col-md-4 box_line input_item_text'>{lang('Name')} <span style={{color:'red'}}>(*)</span></div>
                                <div className='col-md-8'>
                                    <Input className='input_item_input' ref={input=>this.nameInput = input} struct={this.struct['name']}></Input>
                                </div>
                            </div>

                            <div className='box_flex lab_item'>
                                <div className='col-md-4 box_line input_item_text'>{lang("Version")}</div>
                                <div className='col-md-8'>
                                    <Input className='input_item_input' ref={input=>this.versionInput = input} struct={this.struct['version']}></Input>
                                </div>
                            </div>

                            <div className='box_flex lab_item'>
                                <div className='col-md-4 box_line input_item_text'>{lang("Author")}</div>
                                <div className='col-md-8'>
                                    <Input className='input_item_input' ref={input=>this.authorInput = input} struct={this.struct['author']}></Input>
                                </div>
                            </div>

                            <div className='box_flex lab_item'>
                                <div className='col-md-4 box_line input_item_text'>{lang("Config Script Timeout")}</div>
                                <div className='col-md-4'>
                                    <Input className='input_item_input' type='number' ref={input=>this.scripttimeoutInput = input} struct={this.struct['scripttimeout']}></Input>
                                </div>
                                <div className='col-md-4'>{lang("Seconds")}</div>
                            </div>

                            <div className='box_flex lab_item'>
                                <div className='col-md-4 box_line input_item_text'>{lang("Countdown Timer")}</div>
                                <div className='col-md-4'>
                                    <Input className='input_item_input' type="number" ref={input=>this.countdownInput = input} struct={this.struct['countdown']}></Input>
                                </div>
                                <div className='col-md-4'>{lang("Minutes")}</div>
                            </div>
                            <br/>
                            <div>
                                <div className='col-12'>
                                    <div className='input_item_text'>{lang("Description")}</div>
                                    <div>
                                        <Input className='input_item_input' ref={input=>this.descriptionInput = input} struct={this.struct['description']}></Input>
                                    </div>
                                </div>
                            </div>



                        </div>
                        <div className = 'col-md-6'>
                            <div>
                                <div className='input_item_text'>{lang("who_open_lab")}</div>
                                <div className="button input_item_option" select={this.state.openable == 0 ? 'true' : 'false'} onClick={()=>this.setState({openable:0})}><i className='fa icon'></i>&nbsp; {lang("Admin Only")}</div>
                                <div className="button input_item_option" select={this.state.openable == 1 ? 'true' : 'false'} onClick={()=>this.setState({openable:1})}><i className='fa icon'></i>&nbsp; {lang("Everyone")}</div>
                                <div className="button input_item_option" select={this.state.openable == 2 ? 'true' : 'false'} onClick={()=>this.setState({openable:2})}><i className='fa icon'></i>&nbsp; {lang("Admin and Special users")}</div>
                                <textarea disabled={this.state.openable != 2} readOnly={true} className='input_item_input' value={this.showUsers(this.state.openable_emails)} onClick={ ()=>{
                                    this.userModal.modal();
                                    this.userModal.setSelect(this.state.openable_emails);
                                    this.userModal.setOnSelect(emails => this.setState({openable_emails: emails}));
                                }}></textarea>
                            </div>
                            <br/>
                            <div>
                                <div className='input_item_text'>{lang("who_join_lab")}</div>
                                <div className="button input_item_option" select={this.state.joinable == 0 ? 'true' : 'false'} onClick={()=>this.setState({joinable:0})}><i className='fa icon'></i>&nbsp; {lang("Admin Only")}</div>
                                <div className="button input_item_option" select={this.state.joinable == 1 ? 'true' : 'false'} onClick={()=>this.setState({joinable:1})}><i className='fa icon'></i>&nbsp; {lang("Everyone")}</div>
                                <div className="button input_item_option" select={this.state.joinable == 2 ? 'true' : 'false'} onClick={()=>this.setState({joinable:2})}><i className='fa icon'></i>&nbsp; {lang("Admin and Special users")}</div>
                                <textarea disabled={this.state.joinable != 2} readOnly={true} className='input_item_input' value={this.showUsers(this.state.joinable_emails)} onClick={ ()=>{
                                    this.userModal.modal();
                                    this.userModal.setSelect(this.state.joinable_emails);
                                    this.userModal.setOnSelect(emails => this.setState({joinable_emails: emails}));
                                }}></textarea>
                            </div>
                            <br/>
                            <div>
                                <div className='input_item_text'>{lang("who_edit_lab")}</div>
                                <div className="button input_item_option" select={this.state.editable == 0 ? 'true' : 'false'} onClick={()=>this.setState({editable:0})}><i className='fa icon'></i>&nbsp; {lang("Admin Only")}</div>
                                <div className="button input_item_option" select={this.state.editable == 1 ? 'true' : 'false'} onClick={()=>this.setState({editable:1})}><i className='fa icon'></i>&nbsp; {lang("Everyone")}</div>
                                <div className="button input_item_option" select={this.state.editable == 2 ? 'true' : 'false'} onClick={()=>this.setState({editable:2})}><i className='fa icon'></i>&nbsp; {lang("Admin and Special users")}</div>
                                <textarea disabled={this.state.editable != 2} readOnly={true} className='input_item_input' value={this.showUsers(this.state.editable_emails)} onClick={ ()=>{
                                    this.userModal.modal();
                                    this.userModal.setSelect(this.state.editable_emails);
                                    this.userModal.setOnSelect(emails => this.setState({editable_emails: emails}));
                                }}></textarea>
                            </div>

                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{lang("Close")}</button>
                        <button type="button" className="btn btn-primary" onClick={()=>{this.addNewLab()}}>{lang("Add")}</button>
                    </div>
                    
                </div>
            </div>
            <style>{`
               
                .lab_item{
                    margin: 7px 0px;
                }
                .input_item_text{
                    font-weight: bold;
                }

                .input_item_option[select=true] .icon:before {
                    content: "\\f192";
                }
                .input_item_option[select=false] .icon:before {
                    content: "\\f10c"
                }
                .input_item_option .icon{
                    color: rgb(23, 162, 184);
                    font-size: 16px;
                }



            `}</style>

            <UsersModal ref={c => this.userModal = c}></UsersModal>
        </div>;
    }

    addNewLab() {

        var labName = this.nameInput.getValue();
        if(labName === null) return;
		labName = labName.replace(/[^a-zA-Z0-9\s_]/g, '')
		
		var newdata = {
            author : this.authorInput.getValue(),
            description : this.descriptionInput.getValue(),
            scripttimeout : this.scripttimeoutInput.getValue(),
            countdown : this.countdownInput.getValue(),
            version : this.versionInput.getValue(),
            name : labName,
            body : '',
            path : this.path,
            openable : this.state.openable,
            openable_emails: this.state.openable_emails,
            joinable : this.state.joinable,
            joinable_emails: this.state.joinable_emails,
            editable : this.state.editable,
            editable_emails: this.state.editable_emails,
        }
		
		axios({
			method: 'POST',
            url: '/api/labs',
            dataType: 'json',
            data: newdata,
            })
			.then(response => {
				openLab(this.path + labName + '.unl');
			})
			.catch(error => {
                console.log(error);
                error_handle(error.response);
		});
	}

   
    

}

export default AddLabModal;
