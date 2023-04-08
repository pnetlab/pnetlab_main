import React, { Component } from 'react';
import Loading from '../../common/Loading';

class Upgrade extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();
        this.state = {
            upgrading: false,
            version: '1.0.0',
            percent: 0,
            latest: '1.0.0',
            note: '',
        }
    }

    modal(cmd = 'show') {
		if (cmd == 'hide') {
			$("#modal" + this.id).modal('hide');
		} else {
			$("#modal" + this.id).modal();
		}
	}

    render() {
        return <>
        <div className="modal fade" id={"modal" + this.id} data-backdrop="false">
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

                <div className="modal-header">
                    <h4>{lang("Version")}</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>

                <div className="modal-body" style={{ textAlign: 'center', padding:15, position:'relative' }}>

                    <div style={{textAlign:'center'}}>
                        <img src = '/store/public/assets/auth/img/logo.png' style={{width: 100}}></img>
                    </div>
                    <br></br>
                    <div className='box_flex' style={{justifyContent:'center'}}>
                        <table className='table table-bordered' id='version_table'>
                            <tbody>
                                <tr><th>{lang("Current Version")}</th><td><b>{this.state.version}</b></td></tr>
                                <tr><th>{lang("Latest Version")}</th>
                                    <td>
                                        <b>{this.state.latest}</b>
                                        <div style={{whiteSpace: 'pre'}} dangerouslySetInnerHTML={{__html:this.state.note}}></div> 
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {this.state.upgrading
                        ? <>
                        <b>{lang("Upgrading")}...</b>
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuemin="0" aria-valuemax="100" style={{width: this.state.percent + '%'}}>
                                {this.state.percent + '%'}
                            </div>
                        </div>
                        </>
                        : <div className='button btn btn-primary' onClick={()=>{this.upgrade()}}>{lang("Upgrade")}</div>
                    }

                    <Loading ref={c=>this.loader = c} style={{position:'absolute'}}></Loading>

                </div>
            </div>
        </div>
    </div>

    <style>{`
        #version_table th, #version_table td {
            padding: 5px;
            text-align: left;
        }
        #version_table th{
            white-space: nowrap;
        }
    `}</style>

</>
    }


    clearProcess() {
		if (this.processInteval) {
			clearInterval(this.processInteval);
			this.processInteval = null;
		}
    }


    upgrade(){

        this.setState({
            upgrading: true,
            percent: 0,
        })
        
        axios.request({
            url: '/store/public/admin/default/upgrade',
            method: 'post',
        })

            .then(response => {
                response = response['data'];
                if (response['result']) {
                    this.showProcess();
                }else{
                    error_handle(response);
                }
            })

            .catch(error => {
                console.log(error);
                error_handle(error);
                this.clearProcess();
            })

    }
    
    componentDidMount(){
        //this.showProcess();
        global.upgrade = ()=>{
            this.modal();
            this.getVersion();
            this.showProcess();
        }
    }

    showProcess() {

		this.processInteval = setInterval(() => {
			axios.request({
				url: '/store/public/admin/default/upgrading',
				method: 'post',
			})

				.then(response => {
					response = response['data'];
					if (response['result']) {
                        var data = response['data'];
                        if(data[0]){

                            this.setState({
                                upgrading: false,
                                version: data[1],
                            })
                            this.getVersion();
                            this.clearProcess();

                        }else{
                            this.setState({
                                upgrading: true,
                                percent: data[1],
                            })
                        }

					}else{
                        error_handle(response);
                        this.clearProcess();
                    }
				})

				.catch(error => {
                    console.log(error);
                    location.reload();			
				})

		}, 1000);


    }
    
    getVersion(){
        this.loader.loading(true);
        axios.request({
            url: '/store/public/admin/default/getVersion',
            method: 'post',
        })

            .then(response => {
                this.loader.loading(false);
                response = response['data'];
                if (response['result']) {
                    var data = response['data'];
                    this.setState({
                        version : data['version'],
                        latest : data['latest'][UPGRADE_VERSION],
                        note : get(data['latest'][UPGRADE_NOTE], ''),
                    })
                }else{
                    error_handle(response);
                }
            })

            .catch(error => {
                this.loader.loading(false);
                console.log(error);
                error_handle(error);
            })
    }

}

export default Upgrade;