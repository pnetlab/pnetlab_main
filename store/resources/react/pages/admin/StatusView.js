import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";
import Status from '../../components/admin/status/Status';

class StatusView extends Component {

	constructor(props) {
        super(props);
    }

    render(){
        return <div className='box_padding'>
            <Status ref={c => this.status = c}></Status>
            <style>{`
                #app {
                    background: #ecf0f5;
                }
            `}</style>
        </div> 
        

    }
    componentDidMount(){
        this.status.initialInfo();
        this.status.startUpdateInfo();
    }
}

export default StatusView