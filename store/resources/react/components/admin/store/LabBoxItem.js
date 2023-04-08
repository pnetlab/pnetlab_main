import React, { Component } from 'react';
import {Link } from "react-router-dom";

class LabItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var item = this.props.lab;
        var currentTime = Number(moment().format('X'));
        var license = <div style={{color:'red', fontWeight:'bold'}}>
            {lang("License Expired")}
            <div className='close' onClick={(e)=>{
                e.preventDefault();
                if(this.props.onDelete) this.props.onDelete(item[LAB_ID]);
            }}>&times;</div>
            </div>;
        var expired = true;
        if(isset(item[LICENSE_TIME])){
            if(Number(item[LICENSE_TIME])>(currentTime + 3*86400)){
                license = <div style={{color:'green', fontWeight:'bold'}}>{lang("License")}: &nbsp; {moment(item[LICENSE_TIME], 'X').format('ll')}</div>;
                expired = false;
            }else if(Number(item[LICENSE_TIME])>currentTime){
                license = <div style={{color:'orange', fontWeight:'bold'}}>
                    {lang("Expires soon")}: &nbsp; {moment(item[LICENSE_TIME], 'X').format('ll')}
                </div>;
                expired = false;
            }
        }


        var labUnl = `${item[LAB_NAME]} Ver_${item[LAB_LAST_VERSION]}`;
        if(this.props.ready[labUnl]){
            var ready = <div style={{fontWeight:'bold', color:'green'}}><i className="fa fa-check-circle-o"></i>&nbsp;{lang("Added to PNET")}</div>
        }else{
            var ready = <div style={{fontWeight:'bold', color:'red'}}><i className="fa fa-bookmark"></i> &nbsp;{lang("New Lab")}</div>
        }

        return <div className='lab_item'>
            <div className='box_shadow d-flex' style={{ padding: 7, width:'100%', flexDirection:'column'}}>
                {expired
                    ?<><a href={`${App.server.common['APP_CENTER']}/store/labs/detail?id=${item[LAB_ID]}&box=${window.location.origin}`}>
                        <div className='lab_item_image'>
                            <img src={item[LAB_IMG] != ''
                                ? file_public(item[LAB_IMG])
                                : file_public(App.server.common['APP_UPLOAD'] + '/Local/labs/lab_img/0/default.png')
                            }></img>
                            <div className='cover box_flex'><div>{lang("Detail")}</div></div>
                        </div>
                    </a>
                    <a href={`${App.server.common['APP_CENTER']}/store/labs/detail?id=${item[LAB_ID]}&box=${window.location.origin}`}><strong className='lab_item_name'>{item[LAB_NAME]}</strong></a>
                    
                    </>
                    :<><Link to={`/store/public/admin/versions/view?${LAB_ID}=${item[LAB_ID]}&${LAB_NAME}=${item[LAB_NAME]}`}>
                        <div className='lab_item_image'>
                            <img src={file_public(item[LAB_IMG])}></img>
                            <div className='cover box_flex'><div>{lang("Detail")}</div></div>
                        </div>
                    </Link>
                    <Link to={`/store/public/admin/versions/view?${LAB_ID}=${item[LAB_ID]}&${LAB_NAME}=${item[LAB_NAME]}`}><strong className='lab_item_name'>{item[LAB_NAME]}</strong></Link>
                    </>
                }

                
                <div><i className="fa fa-user"></i>&nbsp;{item[LAB_UNAME]}</div>
                <div><b>{lang("Latest version")}:&nbsp;{item[LAB_LAST_VERSION]}</b></div>
                <p className='lab_item_name' style={{flexGrow:1}}>{str_limit(item[LAB_DES], 80)}</p>
                {ready}
                <a href={`${App.server.common['APP_CENTER']}/store/labs/detail?id=${item[LAB_ID]}&box=${window.location.origin}`}>{license}</a>
            </div>
        </div>
    }
}

export default LabItem