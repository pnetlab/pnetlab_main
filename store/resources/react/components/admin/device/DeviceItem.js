import React, { Component } from 'react';
import {Link } from "react-router-dom";

class DeviceItem extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
        var item = this.props.device;
       
        if(item['available'] == '1'){
            var ready = <div style={{fontWeight:'bold', color:'green'}}><i className="fa fa-check-circle-o"></i>&nbsp;{lang("Added to PNET")}</div>
        }else{
            var ready = <div style={{fontWeight:'bold', color:'red'}}><i className="fa fa-bookmark"></i> &nbsp;{lang('New Device')}</div>
        }

        return <div className='lab_item'>
            
            <div className='box_shadow d-flex' style={{ padding: 7, width:'100%', flexDirection:'column', position:'relative'}}>
                
                
                <div className='lab_item_image'>
                    <img style={{width:'50%'}} src={file_public(item[DEVICE_IMG])}></img>
                </div>
            
                <strong className='lab_item_name'>{item[DEVICE_NAME]}</strong>
                <p className='lab_item_name' style={{flexGrow:1}}>{str_limit(item[DEVICE_DES], 80)}</p>
                <div>{ready}</div>
                <div className='box_flex' style={{marginTop:5}}>
                    <button className='btn button btn-sm btn-primary' onClick={()=>{
                        if(this.props.onDownload) this.props.onDownload(item[DEVICE_ID]);
                    }}>Get Device</button>&nbsp;					
				    <a target='_blank' href={`${App.server.common['APP_CENTER']}/store/devices/guide?id=${item[DEVICE_ID]}`}><button className='btn button btn-sm btn-info'>{lang("Guide")}</button></a>
                </div>
                {item['available'] == '1'
                    ? <div className='close' title={lang("Delete Device")} onClick={()=>{if(this.props.onDelete) this.props.onDelete(item[DEVICE_ID])}} style={{position:'absolute', top:7, right:10, cursor:'pointer'}}>&times;</div>
                    : ''
                }
            </div>

            
        </div>
    }
}

export default DeviceItem