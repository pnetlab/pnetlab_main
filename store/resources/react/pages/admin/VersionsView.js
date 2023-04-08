import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/input/Input';
import { withRouter } from "react-router-dom";
import VersionEditModal from '../../components/admin/product/VersionEditModal';
import lab_downloader from '../../helpers/lab_downloader';

class VersionsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lab: {},
            versions: [],
            owner : false,
            dependency_control: {},
        }

        this.lab_downloader = new lab_downloader();

    }


    render() {
        return (
            <>

                <style>{`

					.box_shadow.card-frame {
						cursor: pointer;
						padding: 7px;
					}
					.card-title {
						font-family: 'Open Sans', sans-serif;
						font-size: 16px;
						font-weight: 600;
						color: #5ba818;
						display: block;
						margin-bottom: 0px;
					}
					.card-post-body {
						font-family: 'Open Sans', sans-serif;
						font-size: 14px;
						font-weight: 300;
						color: #222831;
						opacity: 0.8;
					}
				`}</style>



                <br />
                <div className='container'>

                    <div className="headline" style={{ margin: '0px 15px' }}><div className="title">{lang("Lab name")}:&nbsp;{App.parsed[LAB_NAME]}</div></div>
                    <br />

                    {this.state.owner
                    ? <div className='row' style={{ justifyContent: 'flex-end' }}>
                        <div style={{ marginRight: 15 }}>
                        <div className="btn btn-primary" onClick={()=>{this.addVersion()}}>{lang("New version")}</div>
                        </div>
                    </div>
                    : ''
                    }
                    

                    {this.state.versions.map((item, key) => {
                        var versionStatus = '';
                        var dependControl = get(this.state.dependency_control[item[VERSION_ID]], {});
                        
                        if (item[VERSION_STATUS] == VERSION_STATUS_UNPUBLIC) versionStatus = <strong style={{ color: 'red' }}>{lang("Unpublic")}</strong>
                        else if (item[VERSION_STATUS_ADMIN] == VERSION_STATUS_ADMIN_APPROVE) versionStatus = <strong style={{ color: 'green' }}>{lang("Published")}</strong>
                        else if (item[VERSION_STATUS_ADMIN] == VERSION_STATUS_ADMIN_EMPTY) versionStatus = <strong style={{ color: 'orange' }}>{lang("Waiting for approve")}</strong>
                        else if (item[VERSION_STATUS_ADMIN] == VERSION_STATUS_ADMIN_DENY) versionStatus = <strong style={{ color: 'orange' }}>{lang("Denied by Admin")}</strong>

                        return <div key={item[VERSION_ID]} style={{marginBottom: 5}}>
                            <div className='box_shadow card-frame'>

                                {item[VERSION_STATUS_ADMIN] == VERSION_STATUS_ADMIN_EMPTY && this.state.owner
                                    ? <span className='close' onClick={()=>{this.delVersion(item[VERSION_ID])}}>&times;</span> 
                                    : ''
                                }

                                <div className='row' style={{ padding: 0 }}>
                                    <div className='col-sm-6'>
                                        <div className='title line'>Version: {item[VERSION_NAME]}</div>
                                        <div><i className="fa fa-archive"></i>&nbsp;{item[VERSION_PATH]}</div>
                                        <div><i className="fa fa-calendar"></i>&nbsp;<span>{moment(item[VERSION_TIME], 'X').format('lll')}</span></div>
                                        <div>{lang("Status")}:&nbsp;{versionStatus}</div>

                                        <div style={{ marginTop: 5 }}>
                                            <span>
                                                <strong>{lang("Dependency packages")}:</strong>
                                                {item[VERSION_STATUS_ADMIN] == VERSION_STATUS_ADMIN_EMPTY && this.state.owner
                                                    ? <strong className='button' style={{ color: 'blue' }} onClick={()=>{this.editDepend(item)}}>{lang("Edit")}</strong> 
                                                    : ''
                                                }
                                            </span>
                                            {this.state.owner ? '' : <div><i style={{color:'red'}}>(The following dependencies are uploaded by the user. PNETLab is not responsible for the content and related issues.)</i></div>}
                                            <div className='box_flex' style={{borderBottom: 'solid thin #ccc', padding: '5px 0px', marginBottom: 5}}>
                                                <b>{lang("Select to Download")}</b>
                                                <input type='checkbox' style={{margin:'auto 0px auto auto'}} defaultChecked={true} onChange={e=>{
                                                    var versions = this.state.versions;
                                                    var dependTable = item[DEPENDENCE_TABLE];
                                                    for(let i in dependTable){
                                                        dependTable[i]['download'] = e.target.checked;
                                                    }
                                                    versions[key][DEPENDENCE_TABLE] = dependTable;
                                                    this.setState(versions);
                                                }}></input>
                                            
                                            </div>
                                            {item[DEPENDENCE_TABLE].map((depend, dpid) => {
                                                return <div key={dpid} className="box_flex">
                                                    <span style={{flexGrow:1}} className='box_line' title={depend[DEPEND_PATH]}><i className="fa fa-file-text-o"></i>&nbsp;{depend[DEPEND_PATH]}</span>
                                                    <div><input type='checkbox' checked={depend['download'] !== false} onChange={e=>{
                                                        var versions = this.state.versions;
                                                        depend['download'] = e.target.checked;
                                                        versions[key][DEPENDENCE_TABLE][dpid] = depend;
                                                        this.setState(versions);
                                                    }}></input></div>
                                                </div>
                                            })}

                                        </div>

                                    </div>
                                    <div className='col-sm-6'>
                                        <Input className='input_item box_border'
                                            struct = {{
                                                [INPUT_TYPE]:'textarea',
                                                [INPUT_DEFAULT]: item[VERSION_NOTE],
                                                [INPUT_ONCHANGE_BLUR]: (event, input)=>{this.editNote(item[VERSION_ID], input.getValue())},
                                                [INPUT_WRITABLE]: !item[VERSION_STATUS_ADMIN],
                                            }}
                                        ></Input>
                                        <br/>
                                        {(item[VERSION_FEEDBACK]==''||item[VERSION_FEEDBACK]==null)?'':<p style={{color:'red'}}><strong>FeedBack:&nbsp;</strong>{item[VERSION_FEEDBACK]}</p>}
                                    </div>


                                </div>
                                <br/>
                                <div className='box_flex' style={{ padding: '0px 15px' }}>
                                    <button className='btn button btn-danger' onClick={()=>{
                                        this.lab_downloader.download(item, App.parsed[LAB_NAME]);
                                    }}>{lang("Download")}</button>
                                </div>

                            </div>

                        </div>
                    }

                    )}

                    <VersionEditModal ref={modal => this.versionEditModal = modal} onSuccess={()=>{this.loadVersions()}}></VersionEditModal>

                </div>


            </>
        );
    }


    componentDidMount() {
        this.loadVersions();
    }

    editDepend(data){
        this.versionEditModal.modal();
        var depends = {};
        data[DEPENDENCE_TABLE].map(item=>{
            depends[item[DEPEND_PATH]] = item[DEPEND_PATH]
        })
        var dataSet = {
            [VERSION_ID] : data[VERSION_ID],
            [VERSION_NAME] : data[VERSION_NAME],
            [DEPENDENCE_TABLE] : depends,
        }
        this.versionEditModal.setData(dataSet);
    }

    loadVersions() {
        App.loading(true, 'Loading...')

        return axios.request({
            url: '/store/public/user/versions/readGetDepend',
            method: 'post',
            data: {
                [LAB_ID]: App.parsed[LAB_ID],
            }
        })

            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    this.setState({ 
                        versions: response['data'] ,
                        owner: response['message']['owner'],
                    });

                }
            })

            .catch(function (error) {
                console.log(error);
                App.loading(false);
                error_handle(error)
                return false;
            })
    }


    delVersion(vid) {

        Swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                App.loading(true, 'Deleting...')

                return axios.request({
                    url: '/store/public/admin/versions/drop',
                    method: 'post',
                    data: {
                        [VERSION_ID]: vid
                    }
                })

                    .then(response => {
                        App.loading(false);
                        response = response['data'];
                        if (!response['result']) {
                            error_handle(response);
                            return false;
                        } else {
                            this.loadVersions();
                        }
                    })

                    .catch(function (error) {
                        console.log(error);
                        App.loading(false);
                        error_handle(error)
                        return false;
                    })
            }
        })


    }

    addVersion(){
        var pendingVersion = this.state.versions.find(item=>{return item[VERSION_STATUS_ADMIN] == 0});
        
        if(isset(pendingVersion)){
            Swal('Error', `Can not create new version. Version ${pendingVersion[VERSION_NAME]} still not been approved`, 'error');
            return ;
        }

        this.props.history.push(`/store/public/admin/versions/addview?${LAB_ID}=${App.parsed[LAB_ID]}&${LAB_NAME}=${App.parsed[LAB_NAME]}`);
    }


    editNote(vid, data) {
        
        App.loading(true, 'Loading...')

        return axios.request({
            url: '/store/public/admin/versions/editNote',
            method: 'post',
            data: {
                [VERSION_ID]: vid,
                [VERSION_NOTE]: data,
            }
        })

            .then(response => {
                App.loading(false);
                response = response['data'];
                if (!response['result']) {
                    error_handle(response);
                    return false;
                } else {
                    return true;
                }
            })

            .catch(function (error) {
                console.log(error);
                App.loading(false);
                error_handle(error)
                return false;
            })
    }








}

export default withRouter(VersionsView)