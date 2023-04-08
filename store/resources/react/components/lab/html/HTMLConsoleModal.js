import React, { Component } from 'react'
import Consoles from './Consoles';

class Wb_Modal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();
        this.isHide = true;

        this.state = {
            newTab: false
        }

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            this.isHide = true;
        } else {
            $("#" + this.id).modal();
            this.isHide = false;
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
        modalView.on('hidden.bs.modal', (e) => {
            this.isHide = true;
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
                        <span className='modal-title'>{lang("Terminal")}</span>
                        <i type="button" className="close" data-dismiss="modal" aria-hidden="true">×</i>
                        <i title="Make transparent" className="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>
                        <i title="Open in new tab" style={{ fontSize: 14, color: '#a6b3b9' }} className="fa fa-clone pull-right button" onClick={() => { this.openNewTab() }}></i>
                        <span title="Minimize" style={{ fontSize: 14, color: '#a6b3b9', marginRight: 0 }} className="pull-right button glyphicon glyphicon-minus" onClick={() => { this.modal('hide') }}></span>
                    </div>
                    <Consoles ref={consoles => this.consoles = consoles} show={!this.state.newTab}
                        onDelTab={() => { if (this.props.onDelTab) this.props.onDelTab(); }}
                        onAddTab={() => { if (this.props.onAddTab) this.props.onAddTab(); }}
                    ></Consoles>

                </div>
            </div>
        </div >;
    }

    getConsoleLink(nid, index){
        return axios.request({
            url: '/api/labs/session/console_guac_link?',
            method: 'get',
            params: {
                'node_id': nid,
                'index': index
            }
        })
            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    return response['data'];
                } else {
                    error_handle(response);
                    return ''
                }
            })

            .catch(function (error) {
                error_handle(error);
                return ''
            })
    }

    addTab(name, nid, index) {
        this.getConsoleLink(nid, index).then(url => {
            if (url == '') return;
            this.consoles.addTab(name, url);
            if (this.state.newTab) {
                if (this.newtab) {
                    this.newtab.addTabToConsole(name, url);
                    this.newtab.focus();
                } else {
                    this.openNewTab();
                }
            } else {
                this.modal();
            }
        })
       
    }

    openNewTab() {
        this.setState({ newTab: true }, () => {
            var terminals = btoa(JSON.stringify(this.consoles.state))
            if (this.newtab) this.newtab.close();
            this.newtab = window.open(`/store/public/admin/labs/terminal?terminals=${terminals}`);
            this.modal('hide');
        })
    }

    closeNewTag() {
        this.setState({ newTab: false }, () => {
            if (this.newtab) this.newtab.close();
        })
    }

}

export default Wb_Modal;
