import React, { Component } from 'react'
import Loading from '../../common/Loading';


class WiresharkModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            link: null,
            node: null,
            port: null,
            newtab: false,
            log: '',
        }

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');

        } else {
            $("#" + this.id).modal();

            this.checkGuacSession = setInterval(() => {
                var login = $('.html_console iframe').contents().find('body').find('.login-ui');
                if(login.length > 0){
                    console.log(login);
                    if (!login.hasClass('ng-hide')) {
                        this.updateGuacToken();
                        clearInterval(this.checkGuacSession);
                    }
                }
            }, 2000)

            setTimeout(() => { if (this.checkGuacSession) clearInterval(this.checkGuacSession) }, 30000);

        }
    }


    updateGuacToken() {

        axios.request({
            url: '/store/public/admin/default/updateGuacToken',
            method: 'post',
        })
            .then(response => {
                response = response['data'];
                if (response['result']) {
                    location.reload();
                } else {
                    error_handle(response);
                }
            })

            .catch(function (error) {
                error_handle(error);
            })
    }




    componentDidMount() {
        var modalView = $(`#${this.id}`);
        var modalContent = $(`#${this.id} .modal-content`);
        modalView.on('hidden.bs.modal', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })

        modalView.draggable({
            handle: ".modal-header",
            start: (event, ui) => { $(`#${this.id} iframe`).css('display', 'none') },
            stop: (event, ui) => { $(`#${this.id} iframe`).css('display', 'block') },
        });

        modalContent.resizable({
            minHeight: 300,
            minWidth: 300,
            start: (event, ui) => { $(`#${this.id} iframe`).css('display', 'none') },
            stop: (event, ui) => { $(`#${this.id} iframe`).css('display', 'block') },
        });

    }


    setPostion(left, top) {
        var modalView = $(`#${this.id}`);
        modalView.css({ left, top });
    }


    render() {

        return <div
            className="modal fade click"
            id={this.id}
            data-backdrop="false"
            data-keyboard="false"
            style={{ height: 0, overflow: 'unset', top: 30, left: '25%' }}
        >
            <div className="modal-dialog modal-lg" role="document" style={{ margin: 0, height: 0 }}>
                <div className="modal-content" style={{ minHeight: 300, flexDirection: 'column', display: 'flex', height: 500 }}>
                    <div className="modal-header" style={{ height: 25, minHeight: 'unset', cursor: 'move' }}>
                        <span className='modal-title'>{this.state.node}&nbsp;{this.state.port}</span>
                        <i type="button" className="close" onClick={() => { this.deleteWireshark() }} aria-hidden="true">×</i>
                        <i title="Make transparent" className="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>
                        <i title="Open in new tab" style={{ fontSize: 14, color: '#a6b3b9' }} className="fa fa-clone pull-right button" onClick={() => { this.openNewTab() }}></i>
                        <span title="Minimize" style={{ fontSize: 14, color: '#a6b3b9', marginRight: 0 }} className="pull-right button glyphicon glyphicon-minus" onClick={() => { this.modal('hide') }}></span>

                    </div>
                    {this.state.newtab
                        ? ''
                        : <div className="html_console" style={{ flexGrow: 1, position: 'relative' }}>
                            
                            <iframe onMouseEnter={(ev) => { ev.target.focus() }} src={this.state.link} height="100%" width="100%"></iframe>
                            {this.state.log != ''
                                ?<div className='box_padding' style={{position:'absolute', top:0, left:0, right:0}}>
                                    <div className='alert alert-warning'>
                                        <div>{this.state.log}</div>
                                        <div>Go to <strong><a target='_blank' href='/store/public/admin/devices/store'>Devices Tab</a></strong> to get Wireshark</div>
                                    </div>
                                </div>
                                :''
                            }
                            <Loading style={{ position: 'absolute' }} ref={loading => this.loading = loading}></Loading>
                        </div>
                    }
                </div>
            </div>
        </div >;
    }


    openNewTab() {
        this.setState({ newtab: true }, () => {
            if (!this.state.link) return;
            if (this.newtab) this.newtab.close();
            this.newtab = window.open(this.state.link);
            this.modal('hide');
        })
    }

    closeNewTab() {
        this.setState({ newtab: false }, () => {
            if (this.newtab) this.newtab.close();
        })
    }

    capture() {
        if (this.state.link != null) return;
        this.getWireshark();
    }

    getWireshark() {
        
        this.setState({log: ''});
        this.loading.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/wireshark/capture`,
            method: 'post',
            data: {
                node_id: this.props.wireshark.ws_node,
                interface_id: this.props.wireshark.ws_if,
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    var data = response['message'];
                    setTimeout(()=>{
                        this.setState({
                            link: data.link,
                            node: data.node,
                            port: data.port,
                        })
                        this.loading.loading(false)
                    }, 2000)
                } else {
                    this.loading.loading(false)
                    error_handle(response);
                }

            })

            .catch((error)=>{
                this.loading.loading(false);
                console.log(error);
                error_handle(error);
                this.setState({
                    log: error.response.data.message,
                })
                
            })

    }


    deleteWireshark() {
        this.modal('hide');
        return axios.request({
            url: `/api/labs/session/wireshark/delete`,
            method: 'post',
            data: {
                node_id: this.props.wireshark.ws_node,
                interface_id: this.props.wireshark.ws_if,
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    if (this.props.onDel) this.props.onDel()
                } else {
                    error_handle(response);
                }

            })

            .catch((error)=>{
                console.log(error);
                error_handle(error);
            })

    }


}

export default WiresharkModal;
