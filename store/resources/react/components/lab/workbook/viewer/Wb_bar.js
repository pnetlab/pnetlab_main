import React, { Component } from 'react';
import Wb_Modal from './Wb_Modal';
class Wb_bar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            workbooks: {}
        }

        this.labPath = $('#lab-viewport').attr('data-path');
    }

    render() {
        return <>
            <style>{`
                .wb_bar {
                    overflow:auto;
                }
            `}</style>
            <div className='wb_bar box_flex'>
                <div className='box_flex' style={{margin:'auto auto auto 7px'}}>
                    {Object.keys(this.state.workbooks).map(key => {
                        var workbook = this.state.workbooks[key];
                        return <div style={{margin:2}} key={workbook.name} className='button btn btn-xs btn-primary box_flex' onContextMenu={(event)=>{
                            App.ContextMenu.show(event);
                            App.ContextMenu.setMenu(<div 
                                className='box_shadow box_border' 
                                style={{background: 'white', color:'#0066aa', borderRadius:2, padding:5}}>
                                <a target="_blank" href={`/store/public/admin/labs/workbookview?path=${this.labPath}&name=${workbook.name}`}><div className='button'><b>{lang("Open in new tab")}</b></div></a>
                            </div>);
                        }} onClick={() => {
                            this.wb_modal.modal()
                            this.wb_modal.loadWorkbook(workbook.name)
                            this.wb_modal.setPostion('20%', '200px')
                        }}>{workbook.name}</div>
                    })}
                </div>
            </div>

            <Wb_Modal ref={modal => this.wb_modal = modal}></Wb_Modal>

        </>
    }

    componentDidMount() {
        this.loadWorkbooks();
        $(document).on('click', '.lab_workbook', (e) => {
            window.open(`/store/public/admin/labs/workbook?path=${window.lab.filename}`)
        })
    }

    loadWorkbooks() {
        if (this.labPath == '') return;
        return axios.request({
            url: `/api/labs/session/workbook`,
            method: 'get',
            data: {}
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbooks = response['message'].sort((a, b) => Number(a['weight']) - Number(b['weight']));
                    this.setState({
                        workbooks: workbooks
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

export default Wb_bar

