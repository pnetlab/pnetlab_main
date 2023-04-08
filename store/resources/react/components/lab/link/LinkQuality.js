import React, { Component } from 'react'

class LinkQuality extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            
            ints : [],
            show: false, // show or hide control bar

        }

        
    }

    
    render() {
        return <>
           
            <style>{`
                .link_quality_item{
                    width: 150px;
                    margin: 2px;
                }

                .link_quality_item .input{
                    width: 100%;
                }

                .link_quality_item .link_quality_title{
                    color: #346789;
                    font-weight:bold;
                }
                
                .quality_applied{
                    position: relative;
                }
            `}</style>

            <div ref={c => this.dom = c} className='box_shadow link_ctl_frame' style={{display:(this.state.show?'block':'none')}}>

                <div className='box_flex'>


                    

                    <div className='box_flex' style={{flexWrap:'wrap'}}>

                        {this.state.ints.map((intf, key)=>{
                            var quality = get(intf['quality'], {});
                            return <div key={key} style={{border:'solid thin #ccc', margin:'auto 2px', background: 'aliceblue'}}>
                                <div style={{textAlign:'center', borderBottom:'solid thin #ccc'}}><strong>{get(intf['node'], '')}: {intf['name']}</strong></div>
                                <div className='box_flex'>
                                    
                                    <div className='link_quality_item'>
                                        <div className='box_line link_quality_title'>{lang('Delay')}(ms)</div>
                                        <input className='input' type='number' min='0' value={get(quality['delay'], '')} onChange={(ev)=>{
                                            quality['delay'] =  ev.target.value
                                            var ints = this.state.ints
                                            ints[key]['quality'] = quality
                                            this.setState({ints})
                                        }}></input>
                                    </div>

                                    <div className='link_quality_item'>
                                        <div className='box_line link_quality_title'>{lang('Jitter')}(ms)</div>
                                        <input className='input' type='number' min='0' value={get(quality['jitter'], '')} onChange={(ev)=>{
                                            quality['jitter'] =  ev.target.value
                                            var ints = this.state.ints
                                            ints[key]['quality'] = quality
                                            this.setState({ints})
                                        }}></input>
                                    </div>

                                    <div className='link_quality_item'>
                                        <div className='box_line link_quality_title'>{lang('Bandwidth')}(Kbit)</div>
                                        <input className='input' type='number' min='0' value={get(quality['bandwidth'], '')} onChange={(ev)=>{
                                            quality['bandwidth'] =  ev.target.value
                                            var ints = this.state.ints
                                            ints[key]['quality'] = quality
                                            this.setState({ints})
                                        }}></input>
                                    </div>

                                    <div className='link_quality_item'>
                                        <div className='box_line link_quality_title'>{lang('Loss')}(%)</div>
                                        <input className='input' type='number' min='0' max="100" value={get(quality['loss'], '')} onChange={(ev)=>{
                                            quality['loss'] =  ev.target.value
                                            var ints = this.state.ints
                                            ints[key]['quality'] = quality
                                            this.setState({ints})
                                        }}></input>
                                    </div>
                                
                                </div>
                                </div>
                        })}

                    </div>

                    <div style={{margin:'auto 5px auto auto'}}>
                        <button className='button btn btn-xs btn-primary' onClick={()=>{this.onApply()}} style={{margin:'5px', width:60}}>{lang("Apply")}</button>
                        <button className='button btn btn-xs btn-danger' onClick={()=>{this.onCancel()}} style={{margin:'5px', width:60}}>{lang("Cancel")}</button>
                    </div>

                </div>
            </div>


        </>
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            this.setState({
                show: false
            }, ()=>{
                var height = 0;
                document.getElementById('alert_container').style.top = height+'px';
                document.getElementById('notification_container').style.top = (height + 30)+'px'
            })
            App.topControl = false;
            
        } else {
            this.setState({
                show: true
            }, ()=>{
                var height = this.dom.clientHeight;
                document.getElementById('alert_container').style.top = height+'px';
                document.getElementById('notification_container').style.top = (height + 30)+'px'
            })
            App.topControl = true;
        }
    }

    async onApply(){

        for(let i in this.state.ints){
            var intf = this.state.ints[i];
            await this.setQuality(intf['node_id'], intf['id'], intf['quality'])
        }
        this.modal('hide');
        App.topology.printTopology();
        

    }

    onCancel(){
        this.modal('hide');
    }


    setQuality(node_id, interface_id, $p){
        App.loading(true)
        return axios.request({
            url: '/api/labs/session/interfaces/setquality',
            method: 'post',
            data: {
                node_id, interface_id, ...$p
            }
        })

            .then(response => {
                App.loading(false)
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                    return true;
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                App.loading(false)
                console.log(error);
                error_handle(error);
                return false;
            })

    }

    

    setConnection(cn) {
        
        this.connection = cn;
        var id = this.connection.id;
        var node_id = null;
        var interface_id = null;
        var network_id = null;
        if ( id.search('iface') != -1 ){
            node_id=id.replace('iface:node','').replace(/:.*/,'');
            interface_id=id.replace(/.*:/,'');
            this.getInterface(node_id, interface_id)
        }else{
            network_id = id.replace('network_id:','');
            this.getNetworkInts(network_id)
        }

    }


    getInterface(node_id=null, interface_id=null){
        var url = '';
        var data = {};
        if(interface_id !== null && node_id !== null){
            url = '/api/labs/session/interface';
            data = {
                node_id : node_id,
                interface_id: interface_id
            }
        }

        if(url == '') return;
        App.loading(true)
        return axios.request({
            url: url,
            method: 'get',
            params: data
        })

            .then(response => {
                App.loading(false)
                response = response['data'];
                if (response['status'] == 'success') {
                    this.setState({ints : [response['message']]}, ()=>{
                        var height = this.dom.clientHeight;
                        document.getElementById('alert_container').style.top = height+'px';
                        document.getElementById('notification_container').style.top = (height + 30)+'px'
                    })
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                App.loading(false)
                console.log(error);
                error_handle(error);
            })

    }

    getNetworkInts(network_id=null){
        
        var url = '';
        var data = {};
        if(network_id !== null){
            url = '/api/labs/session/networkints';
            data = {
                network_id: network_id
            }
        }

        if(url == '') return;
        App.loading(true)
        return axios.request({
            url: url,
            method: 'get',
            params: data
        })

            .then(response => {
                App.loading(false)
                response = response['data'];
                if (response['status'] == 'success') {
                    this.setState({ints : response['message']}, ()=>{
                        var height = this.dom.clientHeight;
                        document.getElementById('alert_container').style.top = height+'px';
                        document.getElementById('notification_container').style.top = (height + 30)+'px'
                    })
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                App.loading(false)
                console.log(error);
                error_handle(error);
            })

    }
    

    componentDidMount() {

        $(document).on('click', '.action-qualityedit', (e) => {
            if(App.topControl){
                showLog(lang('Apply your change first'), 'error');
                return;
            }
            this.setConnection(window.connToDel);
            this.modal();
            $('#context-menu').remove();
        })

    }

}
export default LinkQuality;