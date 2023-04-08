import React, { Component } from 'react'
import HTMLView from './HTMLView';
import PDFView from './PDFView';

class Wb_Modal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            workbook: {},
            name: '',
        }
        
        this.workbooks = {};

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
        } else {
            $("#" + this.id).modal();
        }
    }

    setPostion(left, top){
        var modalView = $(`#${this.id}`);
        modalView.css({left, top});
       
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
            start: ( event, ui )=>{$(`#${this.id} .workbook`).css('display', 'none')},
            stop: ( event, ui )=>{$(`#${this.id} .workbook`).css('display', 'flex')},
        });

        modalContent.resizable({
            minHeight: 300,
            minWidth: 300,
            start: ( event, ui )=>{$(`#${this.id} .workbook`).css('display', 'none')},
            stop: ( event, ui )=>{$(`#${this.id} .workbook`).css('display', 'flex')},
        });
    }


    render() {

        var type = get(this.state.workbook.type, 'pdf');
        var name = get(this.state.workbook.name, '');

        return <div
            className="modal fade click"
            id={this.id}
            data-backdrop="false"
            data-keyboard="false"
            style={{ height: 0, overflow: 'unset', top: 30, left: '25%' }}
        >
            <div className="modal-dialog modal-lg" role="document" style={{ margin: 0, height: 0 }}>
                <div className="modal-content" style={{ minHeight: 300, height: 500, flexDirection: 'column', display: 'flex'}}>
                    <div className="modal-header" style={{ height: 25, minHeight: 'unset', cursor: 'move' }}>
                        <span className="modal-title" style={{ fontSize: 'medium', textTransform: 'unset' }}>{name}</span>
                        <i type="button" className="close" data-dismiss="modal" aria-hidden="true">×</i>
                        <i title="Make transparent" className="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>
                        <i className='pull-right button fa fa-clone' onClick={this.openNewTab.bind(this)} style={{ color: '#a6b3b9',  fontSize: 14 }} title="Open in new tab"></i>
                        <span title="Minimize" style={{ fontSize: 14, color: '#a6b3b9', marginRight: 0 }} className="pull-right button glyphicon glyphicon-minus" onClick={() => { this.modal('hide') }}></span>

                    </div>
                    <div className='workbook' style={{flexDirection: 'column', display: 'flex', flexGrow:1}}>
                        {type == 'html'
                            ? <HTMLView key={name} workbook={this.state.workbook}></HTMLView>
                            : <PDFView key={name} workbook={this.state.workbook}></PDFView>
                        }
                    </div>
                </div>
            </div>
        </div >;
    }


    openNewTab(){
        this.newTab = window.open(`/store/public/admin/labs/workbookview?name=${this.state.name}`);
        this.modal('hide');
    }


    loadWorkbook(name) {

        if (isset(this.workbooks[name])) {
            this.setState({ workbook: this.workbooks[name], name });
            return;
        } else {
            this.setState({ name });
        }

        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook`,
            method: 'get',
            params: {
                name: name,
                content: 0,
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbook = response['message'];
                    this.workbooks[name] = workbook;
                    this.setState({ workbook: this.workbooks[name] });
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                error_handle(error);
            })
    }
}

export default Wb_Modal;
