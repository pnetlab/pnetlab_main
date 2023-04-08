import React, { Component } from 'react'
import Input from '../../input/Input';
import '../../input/responsive/input.scss';

class OfflineLicenseModal extends Component {

    constructor(context) {
        super(context);
        this.id = makeId();


        this.state = {
            keys: [],
            error: ''
        }

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#modal" + this.id).modal('hide');
        } else {
            $("#modal" + this.id).modal();
            this.loadKeys();
        }
    }

    render() {

        return (<>
            <div className="modal fade" id={"modal" + this.id}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body" style={{ textAlign: 'initial' }}>

                            <div className='row'>

                                <div className='col-md-10'>

                                    <Input placeholder="Key License" className='input_item_input' ref={c => this.keyInput = c} struct={{
                                        [INPUT_TYPE]: 'text',
                                        [INPUT_NULL]: false,
                                    }}></Input>

                                </div>
                                <div className='col-md-2'>
                                    <div style={{padding:5, width:'100%'}} className='button btn btn-info' onClick={()=>this.activeKey()}>Active</div>
                                </div>

                            </div>
                            <div className='box_padding'>
                                {this.state.keys.length == 0
                                ? <div className="alert alert-warning">No license. You need to keep your PNETLab alive to use the extended license</div>
                                : <>{this.state.keys.map((item, key)=> {
                                    var currentTime = Number(moment().format('X'));
                                    var expired = Number(item[OFF_MA_LIC_EXP]) < currentTime;
                                    console.log(expired); 
                                    return <div key={key} className='box_padding box_shadow' style={{position:'relative', margin:'5px 0px'}}>
                                        <div className='close' onClick={()=>this.deleteKey(item[OFF_MA_LIC_KEY])}>&times;</div>
                                        <div className='box_flex'>
                                            <div>Exp: <b>{moment(item[OFF_MA_LIC_EXP], 'X').format('llll')}</b> {expired ? <b style={{color:'red'}}>(Expired)</b> : ''}</div>
                                            <div style={{width:15}}></div>
                                            <div>Quantity: <b>{item[OFF_MA_LIC_QTY]}</b></div>
                                        </div>
                                        <div style={{wordBreak:'break-all'}}>{item[OFF_MA_LIC_KEY]}</div>
                                        
                                    </div>
                                })}</>}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
        )
    }




    loadKeys() {
        
        return axios.request({
            url: '/store/public/admin/users/getKeys',
            method: 'post',
        })

            .then(response => {
                response = response['data'];
                if (response['result']) {
                    this.setState({
                        keys : response['data']
                    })
                }
            })

            .catch((error) => {
                console.log(error)
            })
    }

    deleteKey(key) {
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/users/deleteKey',
            method: 'post',
            data: {
                [OFF_MA_LIC_KEY] : key
            }
        })

            .then(response => {
                App.loading(false);
                response = response['data'];
                if (response['result']) {
                    this.loadKeys();
                }else{
                    error_handle(response);
                }
            })

            .catch((error) => {
                App.loading(false);
                console.log(error)
                error_handle(response);
            })
    }

    activeKey() {
        var key = this.keyInput.getValue();
        if(key == null) return;
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/users/activeKey',
            method: 'post',
            data: {
                [OFF_MA_LIC_KEY] : key
            }
        })

            .then(response => {
                App.loading(false);
                response = response['data'];
                if (response['result']) {
                    this.loadKeys();
                    this.keyInput.setValue('');
                }else{
                    error_handle(response);
                }
            })

            .catch((error) => {
                App.loading(false);
                console.log(error)
                error_handle(response);
            })
    }


}

export default OfflineLicenseModal
