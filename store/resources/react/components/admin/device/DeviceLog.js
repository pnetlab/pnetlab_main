import React, { Component } from 'react'


class DeviceLog extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();
        this.isHide = true;

        this.state = {
            log : ''
        }
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
            this.isHide = true;
        } else {
            $("#" + this.id).modal();
            this.isHide = false;
        }
    }

    setLog(log){
        if(!log) log = '';
        this.setState({
            log: log
        });
        var objDiv = document.getElementById(`${this.id}_log`);
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    getLog(){
        return this.state.log;
    }

    

    componentDidMount() {
        var modalView = $(`#${this.id}`);
        var modalContent = $(`#${this.id} .modal-content`);
        modalView.draggable({ 
            handle: ".modal-header",
        });

        modalContent.resizable({
            minHeight: 300,
            minWidth: 300,
        });
    }


    setPostion(left, top){
        var modalView = $(`#${this.id}`);
        modalView.css({left, top});

        
       
    }


    render() {

        return <div
            className="modal fade click"
            id={this.id}
            data-backdrop="false"
            data-keyboard="false"
            style={{height:0, overflow:'unset', top: 30, left: '25%', zIndex:'1000000'}}
        >
            <div className="modal-dialog modal-lg" role="document" style={{margin:0, height:0}}>
                <div className="modal-content" style={{ minHeight: 300, flexDirection:'column', display:'flex', height:500}}>
                    <div className="modal-header" style={{
                        height: '30px',
                        minHeight: 'unset',
                        cursor: 'move',
                        padding: '2px 5px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: '#225baf',
                    }}>
                        <span className='modal-title'>{lang("Device Logs")}</span>
                        <i type="button" className="close" data-dismiss="modal" aria-hidden="true" style={{color:'white'}}>×</i>
                    </div>
                    <div id={`${this.id}_log`} className='box_padding' style={{flexGrow:1, overflow:'auto', whiteSpace: 'pre-line'}}>{this.state.log}</div>
                </div>
            </div>
        </div >;
    }

   

    

}

export default DeviceLog;
