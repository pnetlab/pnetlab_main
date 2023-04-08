import React, { Component } from 'react'
import Input from '../../input/Input';
import Loading from '../../common/Loading';
import UsersModal from './UsersModal';


class EditLabModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            joinable: 0,
            joinable_emails: [],
            openable: 0,
            openable_emails: [],
            editable: 0,
            editable_emails: [],
            users: {},
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

        global.editLab = (path)=>{
            this.modal();
            this.path = path;
            this.loadLab();
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
                var online = '(online)';
                if(this.state.users[item][USER_OFFLINE] == 1) online='';
                userName.push(formatName(this.state.users[item][USER_USERNAME]) + online);
            }else{
                userName.push(item);
            }
        })
        return userName.join(', ');
    }

    render() {

        return <div className="modal fade" id={this.id}>
            <div className="modal-dialog modal-lg" role="document" style={{maxWidth:'90%'}}>
                <div className="modal-content" style={{position:'absolute'}}>
                    <Loading ref={loading => this.loading = loading} style={{position: 'absolute'}}></Loading>
                    <div className="modal-header">
                        <h4 className='modal-title'>Edit Lab</h4>
                        <i type="button" className="close" data-dismiss="modal"  aria-hidden="true">×</i>
                    </div>

                    <div className='row'>
                        <div className='col-12' style={{fontWeight:'bold'}}>
                            Lab File: <i style={{color:'rgb(23, 162, 184)'}}>{this.path}</i>
                        </div>
                    </div>

                    <div className = 'row'>
                        <div className = 'col-md-6'>
                            <div></div>
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
                                <div className='col-md-4 box_line input_item_text'>{lang("Countdonw Timer")}</div>
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
                        <button type="button" className="btn btn-primary" onClick={()=>{this.editLab()}}>{lang("Save")}</button>
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

    editLab() {

		var newdata = {
            author : this.authorInput.getValue(),
            description : this.descriptionInput.getValue(),
            scripttimeout : this.scripttimeoutInput.getValue(),
            countdown: this.countdownInput.getValue(),
            version : this.versionInput.getValue(),
            openable : this.state.openable,
            openable_emails: this.state.openable_emails,
            joinable : this.state.joinable,
            joinable_emails: this.state.joinable_emails,
            editable : this.state.editable,
            editable_emails: this.state.editable_emails,
        }
		this.loading.loading(true);
		axios({
			method: 'POST',
            url: '/api/labs/edit',
            dataType: 'json',
            data: {
                path: this.path,
                data: newdata,
            }
            })
			.then(response => {
                this.loading.loading(false);
                response = response.data;
                if(response['status'] == 'success'){
                    previewLab(this.path)
                    this.modal('hide');
                }else{
                    error_handle(response);
                }
                
			})
			.catch(error => {
                this.loading.loading(false);
                console.log(error);
                error_handle(error.response);
		});
    }
    

    loadLab() {
        this.loading.loading(true);
		axios({
			method: 'POST',
            url: '/api/labs/get',
            dataType: 'json',
            data: {
                path: this.path,
            }
            })
			.then(response => {
                this.loading.loading(false);
                response = response['data'];
                if(response['status'] == 'success'){
                    var data = response['data'];
                    if(isset(data['version'])) this.versionInput.setValue(data['version']);
                    if(isset(data['author'])) this.authorInput.setValue(data['author']);
                    if(isset(data['scripttimeout'])) this.scripttimeoutInput.setValue(data['scripttimeout']);
                    if(isset(data['countdown'])) this.countdownInput.setValue(data['countdown']);
                    var openable = get(data['openable'], 0);
                    var joinable = get(data['joinable'], 0);
                    var editable = get(data['editable'], 0);
                    
                    if(openable == '') openable = 0;
                    if(joinable == '') joinable = 0;
                    if(editable == '') joinable = 0;

                    var openable_emails = get(data['openable_emails'], []);
                    var joinable_emails = get(data['joinable_emails'], []);
                    var editable_emails = get(data['editable_emails'], []);
                    this.setState({openable_emails, joinable_emails, editable_emails, openable, joinable, editable});
                }else{
                    error_handle(response)
                }
			})
			.catch(error => {
                this.loading.loading(false);
                console.log(error);
                error_handle(error);
		});
	}

   
    

}

export default EditLabModal;
