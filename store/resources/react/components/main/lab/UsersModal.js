import React, { Component } from 'react'
import Input from '../../input/Input';

import Table from '../../table/Table'
import FilterBar from '../../table/FilterBar'
import MainTable from '../../table/MainTable'
import Pagination from '../../table/Pagination'
import FuncBar from '../../table/FuncBar'

import FuncEdit from '../../table/FuncEdit'
import FuncAdd from '../../table/FuncAdd'
import FuncHideCol from '../../table/FuncHideCol'
import FuncDel from '../../table/FuncDel'
import FuncClear from '../../table/FuncClear'
import FuncRefresh from '../../table/FuncRefresh'
import FuncExport from '../../table/FuncExport'
import FuncEditRows from '../../table/FuncEditRows'
import TableStatic from '../../table/TableStatic'
import AddUserModal from '../../admin/user/AddUserModal'


class UsersModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.users_struct = {};
        this.users_struct[STRUCT_FILTERS] = {}
        this.users_struct[STRUCT_COLUMNS] = {

            [USER_USERNAME]: {
                [COL_NAME]: lang(USER_USERNAME),
                [COL_SORT]: false,
                [COL_DECORATOR_IN]: (colId, rowId, data) => {
					var rowData = data[rowId];
					if(rowData[USER_OFFLINE] == 1) return <span title="Offline Account"><i className="fa fa-map-marker" style={{color:'red', fontSize:16}}></i>&nbsp;{formatName(rowData[USER_USERNAME])}</span>
					return <span title="Online Account"><i className="fa fa-globe" style={{color:'#4caf50'}}></i>&nbsp;{formatName(rowData[USER_USERNAME])}</span>
				},
				[COL_STYLE]: { whiteSpace: 'nowrap' }

            },
            [USER_EMAIL]: {
                [COL_NAME]: lang(USER_EMAIL),
                [COL_SORT]: true,

            },

            [USER_ROLE]: {
                [COL_NAME]: lang(USER_ROLE),
                [COL_SORT]: false,

            },
            [USER_NOTE]: {
                [COL_NAME]: lang(USER_NOTE),
                [COL_SORT]: false,
                [COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) }
            },

        }
        this.users_struct[STRUCT_FILTERS] = {

            [USER_EMAIL]: {
                [FILTER_NAME]: lang(USER_EMAIL),
                [FILTER_TYPE]: 'text',
            },
            [USER_ROLE]: {
                [FILTER_NAME]: lang(USER_ROLE),
                [FILTER_TYPE]: 'select',
            },
            [USER_NOTE]: {
                [FILTER_NAME]: lang(USER_NOTE),
                [FILTER_TYPE]: 'text',
            },


        }

        this.users_struct[STRUCT_EDIT] = {

        }

        this.users_struct[STRUCT_ROWS] = {
            [ROW_FUNCS]: (rowData) => {
                return [
                    <FuncEdit key={1} rowData={rowData} />
                ]
            }
        };
        this.users_struct[STRUCT_TABLE] = {
            [DATA_TABLE_ID]: USERS_TABLE,
            [DATA_FILTERS]: {},
            [DATA_HIDDEN_COL]: {},
            [DATA_PERMIT_COL]: this.permissionUsers(),
            [DATA_SORT]: { [USER_ONLINE_TIME]: 'desc' },
            [DATA_KEY]: [USER_POD],
            [FLAG_FILTER_CHANGE]: true,
            [FLAG_MULTI_SORT]: false,
            [FLAG_RESIZABLE]: true,
            [FLAG_SELECT_ROWS]: true,
            [FLAG_SETTING_ROWS]: false,
            [FLAG_EXPAND_ROWS]: false,
            [FLAG_HEAD_ROW]: true,
            [LINK_FILTER]: '/store/public/admin/users/filter',
            [LINK_MAPPING]: '/store/public/admin/users/mapping',
            

        };

    }

    permissionUsers() {
        return Object.assign(
            ...Object.keys(this.users_struct[STRUCT_COLUMNS]).map((k, i) => ({ [k]: 'Read' })),
            ...Object.keys(this.users_struct[STRUCT_EDIT]).map((k, i) => ({ [k]: 'Write' })),
        )
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');

        } else {
            $("#" + this.id).modal();

        }
    }

    setOnSelect(func){
        this.onSelect = func;
    }

    setSelect(pods){

        var selectData = {};
        for (let i in pods){
            if(isNaN(Number(pods[i]))) continue;
            const {key, value} = this.table.createKey(
                {
                    [USER_POD] : pods[i], 
                }
            );
            selectData[key] = value;
        }
        console.log(selectData); dispatchEvent;
        this.table[STRUCT_TABLE][DATA_SELECT_ROWS] = selectData;
        this.table.reload();
        
    }


    componentDidMount() {


    }

    render() {

        return <div className="modal fade" id={this.id} style={{background: '#00000080'}}>
            <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '80%' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className='modal-title'>{lang("Users")}</h4>
                        <i type="button" className="close" onClick={()=>{this.modal('hide')}}>×</i>
                    </div>

                    <div className="modal-body">

                        <Table ref={c => this.table = c} table={this.users_struct} autoload={true}>
                            <FilterBar></FilterBar>
                            <FuncBar
                                left={<FuncHideCol />}
                                right={<>
                                <div className='button box_flex' onClick={()=>{
                                    this.table[STRUCT_TABLE][DATA_SELECT_ROWS] = {};
                                    this.table.reload();
                                    
                                }}><i className="fa fa-eraser"></i>&nbsp;{lang('Empty Selection')}</div>
                                <FuncClear /><FuncRefresh /><FuncExport /></>}></FuncBar>
                            <MainTable className='table table-bordered table-resizable'></MainTable>
                            <Pagination></Pagination>
                        </Table>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={()=>{this.modal('hide')}}>{lang("Cancel")}</button>
                        <button type="button" className="btn btn-primary" onClick={() => { this.onSelectHandle() }}>{lang("Select")}</button>
                    </div>

                </div>
            </div>
        </div>
    }

    onSelectHandle() {
        var select = this.table[STRUCT_TABLE][DATA_SELECT_ROWS];
        var selectArray = [];
        for( let i in select){
            selectArray.push(select[i][USER_POD]);
        }
        if (this.onSelect) this.onSelect(selectArray);
        this.modal('hide');
    }




}

export default UsersModal;
