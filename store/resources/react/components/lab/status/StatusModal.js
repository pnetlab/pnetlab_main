import React, { Component } from 'react'
import Loading from '../../common/Loading';
import Status from '../../admin/status/StatusLabView';


class StatusModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            link: null,
            node: null,
            port: null,
            newtab: false,
        }

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            this.status.stopUpdateInfo();

        } else {
            $("#" + this.id).modal();
            this.status.initialInfo();
            this.status.startUpdateInfo();
        }
    }

    componentDidMount(){
        var modalView = $(`#${this.id}`);
        modalView.on('hidden.bs.modal', (e)=>{
            this.status.stopUpdateInfo();
            e.preventDefault();
            e.stopPropagation();
        })
        
        $(document).on('click', '.action-systemstatus', ()=>{
            this.modal();
        })

        
    }

    render() {

        return <div
            className="modal fade click"
            id={this.id}
            style={{zIndex:1048}}
        >
            <div className="modal-dialog modal-lg" role="document" style={{ maxWidth:'90%', width:'90%' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <span style={{color:'white'}}>
                            <i className="fa fa-bar-chart-o"></i>&nbsp;{lang("System status")}
                        </span>
                        <i type="button" className="close" onClick={() => { this.modal('hide') }} aria-hidden="true">×</i>
                        <i title={lang("Make transparent")} className="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>
                        {isAdmin() && <i title={lang("Open in new tab")} style={{ fontSize: 14, color: '#a6b3b9' }} className="fa fa-clone pull-right button" onClick={() => { this.openNewTab() }}></i>}
                    </div>
                    <Status ref={c => this.status = c}></Status>
                </div>
            </div>
            
        </div >;
    }


    openNewTab() {
        this.modal('hide');
        window.open('/store/public/admin/status/view');
    }

}

export default StatusModal;
