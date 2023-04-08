import React, { Component } from 'react'
import WiresharkModal from './WiresharkModal';
// import WiresharkModal from './WiresharkModal';

class Wireshark extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wiresharks: [],
        }

        this.wiresharkModals = {};

    }

    render() {
        return <>


            <div style={{ display: (this.state.wiresharks.length==0?'none':'flex')}} className="dropup">
                <div className='box_flex button btn btn-xs btn-primary dropdown-toggle' style={{ margin: 'auto', display: 'flex' }} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={require('./wireshark.png')} style={{ height: 20 }}></img>
                    &nbsp;Wireshark&nbsp;({this.state.wiresharks.length})
                </div>
                <div className="dropdown-menu" style={{padding:0}}>
                    {this.state.wiresharks.map(item => {
                        return <div key={item.ws_id} className='box_flex button' style={{padding:5, color:'#286090', fontWeight:'bold'}} onClick={()=>{
                            this.wiresharkModals[item.ws_id].capture();
                            this.wiresharkModals[item.ws_id].modal();
                            this.wiresharkModals[item.ws_id].closeNewTab();
                            this.wiresharkModals[item.ws_id].setPostion('15%', '150px');
                        }}>
                            <i className="glyphicon glyphicon-search"></i>&nbsp;
                            <span className='box_line' title={item.ws_node_name+' '+item.ws_if_name}>{item.ws_node_name}&nbsp;{item.ws_if_name}</span>&nbsp;
                            <div onClick={(ev)=>{
                                ev.stopPropagation();
                                this.wiresharkModals[item.ws_id].deleteWireshark()
                            }} style={{margin:'auto 0px auto auto', color: 'darkgray',fonWeight: 800,fontSize: 18}}>&times;</div>
                        </div>
                    })}
                </div>
            </div>

            {this.state.wiresharks.map(item => {
                    return <WiresharkModal key={item.ws_id} wireshark ={item} 
                    ref={modal => this.wiresharkModals[item.ws_id] = modal}
                    onDel={()=>{this.loadWiresharks()}}
                    ></WiresharkModal>
            })}

        </>
    }

    componentDidMount() {
        global.wireshark_capture = (node_id, if_id) => {
            this.addWireshark(node_id, if_id);
        }

        this.loadWiresharks();

    }


    showWireshark(node_id, interface_id){
        var wiresharks = this.state.wiresharks;

        var wireshark = wiresharks.find(item => (item['ws_node'] == node_id && item['ws_if'] == interface_id));

        if(wireshark){
            if(this.wiresharkModals[wireshark.ws_id]){
                this.wiresharkModals[wireshark.ws_id].capture();
                this.wiresharkModals[wireshark.ws_id].modal();
                return true;
            }
        }
        return false;
    }

    addWireshark(node_id, interface_id){


        if(this.showWireshark(node_id, interface_id)) return;

        return axios.request({
            url: `/api/labs/session/wireshark/add`,
            method: 'post',
            data: {
                node_id, interface_id,
            }
        })

        .then(response => {
            response = response['data'];
            if (response['status'] == 'success') {
                this.loadWiresharks(node_id, interface_id);
            } else {
                error_handle(response);
            }

        })

        .catch(function (error) {
            console.log(error);
            error_handle(error);
        })
    }

    loadWiresharks(node_id = null, interface_id=null) {

        return axios.request({
            url: `/api/labs/session/wireshark`,
            method: 'get',
            data: {}
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {

                    this.setState({
                        wiresharks: response['message']
                    }, ()=>{
                        if(node_id != null && interface_id != null){
                            this.showWireshark(node_id, interface_id);
                        }
                    })
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })

    }

    







}
export default Wireshark;