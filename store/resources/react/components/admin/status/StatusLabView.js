import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import DoughnutChart from '../../charts/DoughnutChart'
import NodeTable from './NodesTable';
class Status extends Component {

    constructor(props) {
        super(props);


        this.state = {
            cores: '',
            iol: '',
            dynamips: '',
            qemu: '',
            docker: '',
            vpcs: '',
            cpu: '',
            ram: '',
            swap: '',
            disk: '',
            total_ram: '',
            total_swap: '',
            total_disk: '',

        }
    }

    getInfo() {
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/status/getInfo',
            method: 'post',
        })

            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.setState({
                        cores: response['data']['cores'],
                    })
                }
            })

            .catch((error) => {
                error_handle(error);
                App.loading(false);
                return false;
            })

    }

    getRunningNodes() {

        return axios.request({
            url: '/store/public/admin/status/getRunningNodes',
            method: 'post',
        })

            .then(response => {
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.setState({
                        iol: response['data']['iol'],
                        dynamips: response['data']['dynamips'],
                        qemu: response['data']['qemu'],
                        docker: response['data']['docker'],
                        vpcs: response['data']['vpcs'],
                    });
                }
            })

            .catch((error) => {
                error_handle(error);
                return false;
            })

    }

    getSystemInfo() {

        return axios.request({
            url: '/store/public/admin/status/getSystemInfo',
            method: 'post',
        })

            .then(response => {

                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.setState({
                        cpu: response['data']['cpu'],
                        ram: response['data']['ram'],
                        swap: response['data']['swap'],
                        disk: response['data']['disk'],
                        total_ram: response['data']['total_ram'],
                        total_swap: response['data']['total_swap'],
                        total_disk: response['data']['total_disk'],
                    });
                }
            })

            .catch((error) => {
                error_handle(error);
                return false;
            })

    }


    

    startUpdateInfo(){
        this.systemInfoInteval = setInterval(this.getSystemInfo.bind(this), 5000);
        setTimeout(() => {
            this.runningNodeInteval = setInterval(this.getRunningNodes.bind(this), 5000);
        }, 2500)
        setTimeout(() => {
            this.nodeTableInteval = setInterval(()=>this.nodeTable.update(), 15000);
        }, 1000)
    }

    stopUpdateInfo(){
        if (this.systemInfoInteval) clearInterval(this.systemInfoInteval);
        if (this.runningNodeInteval) clearInterval(this.runningNodeInteval);
        if (this.nodeTableInteval) clearInterval(this.nodeTableInteval);
    }

    initialInfo(){
        this.getInfo();
        this.getRunningNodes();
        this.getSystemInfo();
        this.nodeTable.update();
    }

    componentDidMount() {   
        // this.initialInfo();
        // this.startUpdateInfo();

    }

    componentWillUnmount() {
        this.stopUpdateInfo();
    }

    render() {

        var runningNodes = [
            {
                icon: <img src={require('./SwitchL3.png')} style={{width:18}}></img>,
                title: lang('IOL Nodes'),
                value: this.state.iol
            },
            {
                icon: <img src={require('./Router.png')} style={{width:18}}></img>,
                title: lang('Dynamips Nodes'),
                value: this.state.dynamips
            },
            {
                icon: <img src={require('./qemu.png')} style={{width:18}}></img>,
                title: lang('Qemu Nodes'),
                value: this.state.qemu
            },
            {
                icon: <img src={require('./docker.png')} style={{width:18}}></img>,
                title: lang('Docker Nodes'),
                value: this.state.docker
            },
            {
                icon: <img src={require('./Desktop.png')} style={{width:18}}></img>,
                title: lang('VPCS Nodes'),
                value: this.state.vpcs
            }

        ];

        return (

            <div className='box_padding box_shadow' style={{ background: 'white' }}>

                {isAdmin() && <> 
                
                <div className='row'>

                    <div className='col-xs-2'>
                        <div style={{paddingLeft:20, color: '#2cc185'}}><strong>{lang("Total Nodes")}</strong></div>
                        <br></br>
                        
                        <table className="table_total_node">
                            <tbody>
                            {runningNodes.map((item, key) => {
                                return <tr key={key}>
                                    <td>{item.icon}</td>
                                    <td className="box_line">{item.title}</td>
                                    <td>:</td>
                                    <td><strong style={{color:item.value>0?'red':'green'}}>{item.value}</strong></td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                       
                    </div>
                   

                    <div className='col-xs-10' style={{margin:0, padding:0}}>
                        <div className="row" style={{margin:0, padding:0}}>
                            <div className='col-md-3 col-xs-6'><DoughnutChart data={{
                                'Used': { value: this.state.cpu, color: this.state.cpu < 50 ? '#2cc185' : (this.state.cpu < 80 ? 'orange' : 'red') },
                                'Free': { value: 100 - this.state.cpu, color: '#c4c4c4' },
                            }} unit="%" title='CPU Used' legend={<b>{lang("Total")}: {this.state.cores} Cores</b>} /></div>

                            <div className='col-md-3 col-xs-6'><DoughnutChart data={{
                                'Used': { value: this.state.ram, color: this.state.ram < 50 ? '#2cc185' : (this.state.ram < 80 ? 'orange' : 'red') },
                                'Free': { value: 100 - this.state.ram, color: '#c4c4c4' },
                            }} unit="%" title='RAM Used' legend={<b>{lang("Total")}: {Math.round(this.state.total_ram / 1024)}MB</b>} /></div>

                            <div className='col-md-3 col-xs-6'><DoughnutChart data={{
                                'Used': { value: this.state.swap, color: this.state.swap < 50 ? '#2cc185' : (this.state.swap < 80 ? 'orange' : 'red') },
                                'Free': { value: 100 - this.state.swap, color: '#c4c4c4' },
                            }} unit="%" title='Swap Used' legend={<b>{lang("Total")}: {Math.round(this.state.total_swap / 1024)}MB</b>} /></div>

                            <div className='col-md-3 col-xs-6'><DoughnutChart data={{
                                'Used': { value: this.state.disk, color: this.state.disk < 50 ? '#2cc185' : (this.state.disk < 80 ? 'orange' : 'red') },
                                'Free': { value: 100 - this.state.disk, color: '#c4c4c4' },
                            }} unit="%" title='Disk Used' legend={<b>{lang("Total")}: {this.state.total_disk}</b>} /></div>
                        </div>
                    </div>
                    

                </div>
                <hr style={{margin:0}}></hr>
                </>
                }
                
                
                    <style>{`
                        .box_runningnodes {
                            font-size: large;
                            padding: 15px;
                            margin: 0px;
                            background: #ecf0f5;
                            border-radius: 5px;
                            text-align: center;
                            width: 100%;
                            font-weight: bold; 
                        }

                        .col_runningnodes{
                            padding: 5px;
                            display: flex;
                        }

                        .box_runningnodes_value {
                            color: green;
                            font-weight: bold;
                            padding: 0px 15px;
                            font-size: 50px;
                            text-align: center;
                        }
                        .table_total_node td {
                            font-size: 14px;
                            padding: 5px;
                        }

                    `}</style>
               
                

                <NodeTable ref={c => this.nodeTable = c} total_ram={Math.round(this.state.total_ram / 1024)}></NodeTable>
                
               


            </div>




        );
    }

}

export default Status

















