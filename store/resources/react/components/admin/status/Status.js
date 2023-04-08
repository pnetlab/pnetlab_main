import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import DoughnutChart from '../../charts/DoughnutChart'
class Status extends Component {

    constructor(props) {
        super(props);


        this.state = {
            qemu_version: '',
            uksm: '',
            ksm: '',
            cpulimit: '',
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
                        qemu_version: response['data']['qemu_version'],
                        uksm: response['data']['uksm'],
                        ksm: response['data']['ksm'],
                        cpulimit: response['data']['cpulimit'],
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


    changeUKSM(state) {
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/status/apiSetUksm',
            method: 'post',
            data: {
                state
            }
        })
            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.getInfo();
                }
            })
            .catch((error) => {
                error_handle(error);
                App.loading(false);
                return false;
            })
    }

    changeKSM(state) {
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/status/apiSetKsm',
            method: 'post',
            data: {
                state
            }
        })
            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.getInfo();
                }
            })
            .catch((error) => {
                error_handle(error);
                App.loading(false);
                return false;
            })
    }

    changeCPULimit(state) {
        App.loading(true);
        return axios.request({
            url: '/store/public/admin/status/apiSetCpuLimit',
            method: 'post',
            data: {
                state
            }
        })
            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.getInfo();
                }
            })
            .catch((error) => {
                error_handle(error);
                App.loading(false);
                return false;
            })
    }

    startUpdateInfo(){
        this.systemInfoInteval = setInterval(this.getSystemInfo.bind(this), 5000);
        setTimeout(() => {
            this.runningNodeInteval = setInterval(this.getRunningNodes.bind(this), 5000);
        }, 2500)
    }

    stopUpdateInfo(){
        if (this.systemInfoInteval) clearInterval(this.systemInfoInteval);
        if (this.runningNodeInteval) clearInterval(this.runningNodeInteval);
    }

    initialInfo(){
        this.getInfo();
        this.getRunningNodes();
        this.getSystemInfo();
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
                icon: <img src={require('./SwitchL3.png')} style={{ width: 50 }}></img>,
                title: lang('Running IOL Nodes'),
                value: this.state.iol
            },
            {
                icon: <img src={require('./Router.png')} style={{ width: 50 }}></img>,
                title: lang('Running Dynamips Nodes'),
                value: this.state.dynamips
            },
            {
                icon: <img src={require('./qemu.png')} style={{ width: 50 }}></img>,
                title: lang('Running Qemu Nodes'),
                value: this.state.qemu
            },
            {
                icon: <img src={require('./docker.png')} style={{ width: 50 }}></img>,
                title: lang('Running Docker Nodes'),
                value: this.state.docker
            },
            {
                icon: <img src={require('./Desktop.png')} style={{ width: 50 }}></img>,
                title: lang('Running VPCS Nodes'),
                value: this.state.vpcs
            }

        ];

        return (

            <div className='box_padding box_shadow' style={{ background: 'white' }}>

                <div className='box_flex' style={{ fontSize: 'medium' }}>
                    <i className="fa fa-bar-chart-o"></i>&nbsp;{lang("System status")}
                </div>


                <div className='row'>

                    <div className='col-md-3 col-6'><DoughnutChart data={{
                        'Used': { value: this.state.cpu, color: this.state.cpu < 50 ? '#2cc185' : (this.state.cpu < 80 ? 'orange' : 'red') },
                        'Free': { value: 100 - this.state.cpu, color: '#c4c4c4' },
                    }} unit="%" title='CPU Used' legend={<b>Total: {this.state.cores} Cores</b>} /></div>

                    <div className='col-md-3 col-6'><DoughnutChart data={{
                        'Used': { value: this.state.ram, color: this.state.ram < 50 ? '#2cc185' : (this.state.ram < 80 ? 'orange' : 'red') },
                        'Free': { value: 100 - this.state.ram, color: '#c4c4c4' },
                    }} unit="%" title='RAM Used' legend={<b>Total: {Math.round(this.state.total_ram / 1024)}MB</b>} /></div>

                    <div className='col-md-3 col-6'><DoughnutChart data={{
                        'Used': { value: this.state.swap, color: this.state.swap < 50 ? '#2cc185' : (this.state.swap < 80 ? 'orange' : 'red') },
                        'Free': { value: 100 - this.state.swap, color: '#c4c4c4' },
                    }} unit="%" title='Swap Used' legend={<b>Total: {Math.round(this.state.total_swap / 1024)}MB</b>} /></div>

                    <div className='col-md-3 col-6'><DoughnutChart data={{
                        'Used': { value: this.state.disk, color: this.state.disk < 50 ? '#2cc185' : (this.state.disk < 80 ? 'orange' : 'red') },
                        'Free': { value: 100 - this.state.disk, color: '#c4c4c4' },
                    }} unit="%" title='Disk Used' legend={<b>Total: {this.state.total_disk}</b>} /></div>

                </div>
                <hr></hr>
                <div className='row' style={{ justifyContent: 'center', padding: '0px 5%', display:'flex', flexWrap:'wrap' }}>
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
                        width: 20%;
                        min-width: 300px;
                    }

                    .box_runningnodes_value {
                        color: green;
                        font-weight: bold;
                        padding: 0px 15px;
                        font-size: 50px;
                        text-align: center;
                    }



                `}</style>

                    {runningNodes.map((item, key) => {
                        return <div key={key} className='col_runningnodes'>
                            <div className='box_runningnodes'>
                                <div className='box_runningnodes_value'>{item.value > 0 ? <div style={{color:'red'}}>{item.value}</div> : <div style={{color:'green'}}>{item.value}</div>}</div>
                                <div className='box_line'>{item.title}</div>
                                <br />
                                {item.icon}
                            </div>
                        </div>
                    })}

                </div>
                <hr></hr>
                <style>{`
                    .status_infor_table td {
                        padding: 15px;
                    }
                    .status_infor_table td i{
                        font-size: 20px;
                    }
                `}</style>
                <div style={{padding: '15px 5%'}}>
                    <table className='status_infor_table'>
                        <tbody>
                            <tr>
                                <td>{lang("Qemu Version")}</td><td>:</td><td><b>{this.state.qemu_version}</b></td>
                            </tr>
                            <tr>
                                <td>{lang("UKSM Status")}</td><td>:</td><td>
                                    {this.state.uksm == 'unsupported'
                                        ? <i className="fa fa-toggle-off" title={lang("Unsupported")}></i>
                                        : (this.state.uksm == 'enabled' 
                                            ? <i className="fa fa-toggle-on button" style={{color:'green'}} title='Enabled' onClick={()=>this.changeUKSM(false)}></i> 
                                            : <i className="fa fa-toggle-off button" style={{color:'red'}} title='Disabled' onClick={()=>this.changeUKSM(true)}></i>
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>{lang("KSM Status")}</td><td>:</td><td>
                                    {this.state.ksm == 'unsupported'
                                        ? <i className="fa fa-toggle-off" title={lang("Unsupported")}></i>
                                        : (this.state.ksm == 'enabled' 
                                            ? <i className="fa fa-toggle-on button" style={{color:'green'}} title='Enabled' onClick={()=>this.changeKSM(false)}></i> 
                                            : <i className="fa fa-toggle-off button" style={{color:'red'}} title='Disabled' onClick={()=>this.changeKSM(true)}></i>
                                        )
                                    }    
                                </td>
                            </tr>
                            <tr>
                                <td>{lang("CPU Limit Status")}</td><td>:</td><td>

                                    {this.state.cpulimit == 'unsupported'
                                        ? <i className="fa fa-toggle-off" title={lang("Unsupported")}></i>
                                        : (this.state.cpulimit == 'enabled' 
                                            ? <i className="fa fa-toggle-on button" style={{color:'green'}} title='Enabled' onClick={()=>this.changeCPULimit(false)}></i>
                                            : <i className="fa fa-toggle-off button" style={{color:'red'}} title='Disabled' onClick={()=>this.changeCPULimit(true)}></i>
                                        )
                                    }

                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>



            </div>




        );
    }

}

export default Status

















