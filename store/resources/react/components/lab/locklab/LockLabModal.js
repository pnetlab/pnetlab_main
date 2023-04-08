import React, { Component } from 'react'
import Loading from '../../common/Loading';
import Input from '../../input/Input';


class LockLabModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            action: 'lock',
            clear: false,       
        }

        this.menuButton = $('#action_lock_lab');

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            
        } else {
            $("#" + this.id).modal();
           
        }
    }

    updateMenuButton(){
        if(LOCK == 0){
            this.menuButton.html(`<a onClick="App.lockLab()" href="#"><i style="font-size:1.5em;" class="fa fa-unlock-alt" ></i><span class='lab-sidebar-title'>${lang("Lock Lab")}</span></a>`)
        }else{
            this.menuButton.html(`<a onClick="App.unlockLab()" href="#"><i style="font-size:1.5em;" class="fa fa-lock" ></i><span class='lab-sidebar-title'>${lang("Unlock Lab")}</span></a>`)
        }
    }

    lockLab(withPass=true){
        if(withPass){
            var password = this.passwordInput.getValue();
            if(password === null) return;
            var passwordAgain = this.passwordAgainInput.getValue();
            if(passwordAgain === null) return;

            if(password != passwordAgain){
                showLog(lang('Password not match'), 'error');
                return;
            }
        }else{
            var password = null;
        }
        

        axios({
			method: 'POST',
            url: '/api/labs/session/lab/lock',
            dataType: 'json',
            data: {
                password : password
            },
            })
			.then(response => {
                response = response['data'];
                App.topology.updateData(response['update']);
                App.topology.printTopology().then(()=>this.updateMenuButton())
                
                this.modal('hide');
                $('.action-labobjectadd-li').hide();

			})
			.catch(error => {
                console.log(error);
                error_handle(error);
		});
    }

    unlockLab(){
        var password = this.passwordInput.getValue();
        if(password === null) return;
        axios({
			method: 'POST',
            url: '/api/labs/session/lab/unlock',
            dataType: 'json',
            data: {
                password : password,
                clear: this.state.clear,
            },
            })
			.then(response => {
                response = response['data'];
                App.topology.updateData(response['update']);
                App.topology.printTopology().then(()=>this.updateMenuButton())
                this.modal('hide');
                $('.action-labobjectadd-li').show();
			})
			.catch(error => {
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
                            <strong className='modal-title'>{this.state.action=='lock'? lang('Lock Lab') : lang('Unlock Lab')}</strong>
							<button type="button" className="close" data-dismiss="modal">&times;</button>
						</div>

                        <div className='modal-body'>
                            <div><Input ref = {c => this.passwordInput = c} className='input_item_input' placeholder='Password' struct={{[INPUT_TYPE]: 'password', [INPUT_NULL]: false}}></Input></div><br/>
                            { this.state.action == 'lock'
                            ?<>
                                <div><Input ref = {c => this.passwordAgainInput = c} className='input_item_input' placeholder='Password Again' struct={{[INPUT_TYPE]: 'password', [INPUT_NULL]: false}}></Input></div><br/>
                                <div className='box_flex' style={{justifyContent:'center'}}><div className='button btn btn-sm btn-primary' onClick={()=>{this.lockLab()}}>{lang("Lock")}</div></div>
                            </>
                            :<>
                                <label><input type='checkbox' checked={this.state.clear} onChange={(e)=>this.setState({clear: e.target.checked})}></input> {lang("Clear Password")}</label><br/>
                                <div className='box_flex' style={{justifyContent:'center'}}><div className='button btn btn-sm btn-primary' onClick={()=>{this.unlockLab()}}>{lang("Unlock")}</div></div>
                            </>
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

        App.lockLab = ()=> {
            if(window.lab.password == 1){
                this.lockLab(false);
            }else{
                this.modal();
                this.setState({action: 'lock'});
            }
        }

        App.unlockLab = ()=> {
            this.modal();
            this.setState({action: 'unlock'});
        }

        App.onReadyRegister.push(this.updateMenuButton.bind(this))
       
    }

}



export default LockLabModal;