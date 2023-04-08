import React, { Component } from 'react';
import {Link } from "react-router-dom";

class LabItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var item = this.props.lab;
        return <div className='lab_item'>
            <div className='box_shadow' style={{ padding: 7, width:'100%'}}>
                <a href={`${App.server.common['APP_CENTER']}/store/labs/detail?id=${item[LAB_ID]}&box=${window.location.origin}`}>
                    <div className='lab_item_image'>
                        <img src={item[LAB_IMG] != ''
                                ? file_public(item[LAB_IMG])
                                : file_public(App.server.common['APP_UPLOAD'] + '/Local/labs/lab_img/0/default.png')
                            }></img>
                        <div className='cover box_flex'><div>{lang("Detail")}</div></div>
                    </div>
                </a>

                <a href={`${App.server.common['APP_CENTER']}/store/labs/detail?id=${item[LAB_ID]}&box=${window.location.origin}`}><strong className='lab_item_name'>{item[LAB_NAME]}</strong></a>
                <div><i className="fa fa-user"></i>&nbsp;{item[LAB_UNAME]}</div>
                <p className='lab_item_name'>{str_limit(item[LAB_DES], 80)}</p>
            </div>
        </div>
    }
}

export default LabItem