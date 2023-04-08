import React, { Component } from 'react';
import InputText from '../../../input/InputText';
import DragSort from '../../../common/DragSort';

class WorkbookList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            workbooks: [],
            active: '',
        }

        this.labPath = get(App.parsed['path'], '');
        this.inputComps = {};
    }

    render() {
        return <div style={{ marginTop: 15, color: '#337ab7', height:0, flexGrow:1, overflow:'auto' }}>
            <style>{`
                .workbook_name_input{
                    border: none;
                    color: #337ab7;
                    font-weight: bold;
                    padding: 0px 7px;
                    background: none;
                    width:100%;
                }
                .dragsort_item.dragover .workbook_item{
                    transform: scale(1.01);
                }
            `}</style>

            {this.state.workbooks.map(item => {
                return <DragSort 
                            src_id={item.name} 
                            src_weight={item.weight} 
                            key={item.name}
                            changeOrder={(src_id, dest_id)=>{
                                this.changeOrder(src_id, dest_id);
                            }}
                            >
                            <div className='workbook_item' style={{
                                borderRadius: 5,
                                padding: 7,
                                background: item.name == this.state.active ? '#ffc1074d' : 'white'
                            }}
                                key={item.name} className='button box_flex box_shadow'
                                onClick={() => {
                                    
                                    this.props.onClick(item).then(result=>{
                                        if(result){
                                            this.setState({ active: item.name });
                                        }
                                    });
                                    
                                }}>
                                {item.type == 'pdf'
                                    ? <i className='fa fa-file-pdf-o'></i>
                                    : <i className='fa fa-file-text-o'></i>
                                }
                                &nbsp;&nbsp;
                            <InputText
                                className='workbook_name_input'
                                value={item.name}
                                onBlur={(event) => this.editWb(item.name, event.target.value)}
                                ref={input => this.inputComps[item.name] = input}
                            ></InputText>
                                <div className='close' style={{ margin: 'auto 7px auto auto' }} onClick={() => { this.delWb(item.name) }}>&times;</div>
                            </div>
                        </DragSort>
                    })
            }

        </div >
    }

    componentDidMount() {
        this.loadWorkbooks()
    }

    changeOrder(src_name, dest_name){
        return axios.request({
            url: `/api/labs/session/workbook/order`,
            method: 'post',
            data: {
                src_name, dest_name
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    this.loadWorkbooks();
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                error_handle(error);
            })
    }

    delWb(name) {
        return Swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                return axios.request({
                    url: `/api/labs/session/workbook/delete`,
                    method: 'post',
                    data: {name}
                })
                    .then(response => {
                        App.loading(false, 'Loading...');
                        response = response['data'];
                        if (response['status'] == 'success') {
                            var workbooks = this.state.workbooks;
                            var workbook = workbooks.findIndex(item => item.name == name);
                            if (workbook != -1) {
                                workbooks.splice(workbook, 1);
                                this.setState({
                                    workbooks: workbooks,
                                    active: '',
                                });
                                if(this.props.onClick){
                                    this.props.onClick({});
                                }
                            }
                        } else {
                            error_handle(response);
                        }

                    })

                    .catch(function (error) {
                        console.log(error);
                        App.loading(false, 'Loading...');
                        error_handle(error);
                    })
            }
        })
    }

    editWb(name, new_name) {
        if (name == new_name) return;
        if (this.labPath == '') return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook/edit`,
            method: 'post',
            data: {
                name, new_name
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbooks = this.state.workbooks;
                    var workbook = workbooks.find(item => item.name == name);
                    if (workbook) {
                        workbook.name = new_name;
                        this.setState({ 
                            workbooks: workbooks,
                            active: new_name 
                        });
                    }
                } else {
                    this.inputComps[name].setValue(name);
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                this.inputComps[name].setValue(name);
                error_handle(error);
            })

    }



    loadWorkbooks() {
        if (this.labPath == '') return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook`,
            method: 'get',
            data: {

            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
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
                App.loading(false, 'Loading...');
                error_handle(error);
            })

    }
}

export default WorkbookList;