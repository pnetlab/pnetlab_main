import React, { Component } from 'react'
import Table from '../../components/table/Table'
import FilterBar from '../../components/table/FilterBar'
import MainTable from '../../components/table/MainTable'
import Pagination from '../../components/table/Pagination'
import FuncBar from '../../components/table/FuncBar'

import FuncEdit from '../../components/table/FuncEdit'
import FuncAdd from '../../components/table/FuncAdd'
import FuncHideCol from '../../components/table/FuncHideCol'
import FuncDel from '../../components/table/FuncDel'
import FuncClear from '../../components/table/FuncClear'
import FuncRefresh from '../../components/table/FuncRefresh'
import FuncExport from '../../components/table/FuncExport'
import FuncEditRows from '../../components/table/FuncEditRows'
import TableStatic from '../../components/table/TableStatic'
import AddUserModal from '../../components/admin/user/AddUserModal'
import { Prompt } from 'react-router-dom';
import EditUserModal from '../../components/admin/user/EditUserModal'

class Users extends Component {

	constructor(props) {
		super(props);

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
			[USER_IP]: {
				[COL_NAME]: lang(USER_IP),
				[COL_SORT]: false,
				[COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) }
			},
			[USER_ROLE]: {
				[COL_NAME]: lang(USER_ROLE),
				[COL_SORT]: false,

			},
			[USER_FOLDER]: {
				[COL_NAME]: lang(USER_FOLDER),
				[COL_SORT]: false,
				[COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) },
				[COL_STYLE]: {whiteSpace: 'nowrap'}
			},

			[USER_WORKSPACE]: {
				[COL_NAME]: lang(USER_WORKSPACE),
				[COL_SORT]: false,
				[COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) },
				[COL_STYLE]: {whiteSpace: 'nowrap'}
			},

			[USER_ONLINE_TIME]: {
				[COL_NAME]: lang(USER_ONLINE_TIME),
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: (data) => {
					var current = moment().format('X');
					var inteval = Number(current) - Number(data);
					var online = moment(data, 'X').format('llll');
					if (online == 'Invalid date') online = '';
					if (inteval < 600) {
						return <span style={{ textAlign: 'left' }}><i title={'Online: ' + online} className="fa fa-circle" style={{ color: '#4caf50', cursor: 'pointer' }}></i>&nbsp;{online}</span>
					} else {
						return <span style={{ textAlign: 'left' }}><i title={'Offline: ' + online} className="fa fa-circle" style={{ color: 'red', cursor: 'pointer' }}></i>&nbsp;{online}</span>
					}
				},
				[COL_STYLE]: { whiteSpace: 'nowrap' }

			},

			[USER_STATUS]: {
				[COL_NAME]: lang(USER_STATUS),
				[COL_SORT]: true,
				[COL_DECORATOR_IN] : data => {
					if(data == USER_STATUS_BLOCK) return <b style={{color:'red'}}>Block</b>
					return <b style={{color:'#4caf50'}}>Active</b>
				}
			},

			[USER_ACTIVE_TIME]: {
				[COL_NAME]: lang(USER_ACTIVE_TIME),
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: function (data) { return moment(data, 'X').format('llll'); },
				[COL_STYLE]: { whiteSpace: 'nowrap' }
			},

			[USER_EXPIRED_TIME]: {
				[COL_NAME]: lang(USER_EXPIRED_TIME),
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: function (data) { return moment(data, 'X').format('llll'); },
				[COL_STYLE]: { whiteSpace: 'nowrap' }
			},

			ram_limit : {
				[COL_NAME]: "RAM Limit",
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: (colID, rowID, data)=>{
					var uid = data[rowID][USER_POD];
					var consume = 0;
					var limit = data[rowID]['ram_limit'];
					if(typeof(limit) == 'undefined') return '';
					if(this.state.consume[uid]) consume =  Math.round(this.state.consume[uid]['ram']*100)/100;
					var background = (consume > 80 ? 'red': (consume > 50 ? 'orange': 'green'));
					if(consume >= limit) background='red';

					return <div className="progress" style={{position:'relative', overflow:'unset', marginTop:5}}>
						<div className="progress-bar" role="progressbar" style={{width:`${consume}%`, lineHeight:'unset', background:background}}>&nbsp;{`${consume}%`}</div>
						<div style={{position:'absolute', width:`${limit}%`, top:0, bottom:0, left:0, borderRight:'solid thin red'}}>
							<div style={{position:'absolute', right:-10, top:-10, color:'red', fontSize:8}}>{`${limit}%`}</div>
						</div>
					</div>

				}
				
			},

			cpu_limit: {
				[COL_NAME]: "CPU Limit",
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: (colID, rowID, data)=>{
					var uid = data[rowID][USER_POD];
					var consume = 0;
					var limit = data[rowID]['cpu_limit'];
					if(typeof(limit) == 'undefined') return '';
					if(this.state.consume[uid]) consume =  Math.round(this.state.consume[uid]['cpu']*100)/100;
					var background = (consume > 80 ? 'red': (consume > 50 ? 'orange': 'green'));
					if(consume >= limit) background='red';

					return <div className="progress" style={{position:'relative', overflow:'unset', marginTop:5}}>
						<div className="progress-bar" role="progressbar" style={{width:`${consume}%`, lineHeight:'unset', background:background}}>&nbsp;{`${consume}%`}</div>
						<div style={{position:'absolute', width:`${limit}%`, top:0, bottom:0, left:0, borderRight:'solid thin red'}}>
							<div style={{position:'absolute', right:-10, top:-10, color:'red', fontSize:8}}>{`${limit}%`}</div>
						</div>
					</div>

				}
				
			},

			hdd_limit: {
				[COL_NAME]: "Hard disk Limit",
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: (colID, rowID, data)=>{
					var uid = data[rowID][USER_POD];
					var limit = data[rowID]['hdd_limit'];
					if(typeof(limit) == 'undefined') return '';
					var limitGB = Math.round(limit*10/1000)/10;
					var consume = 0;
					if(this.state.consume[uid]) consume =  this.state.consume[uid]['hdd'];
					var percent = Math.round(Number(consume)*1000/Number(limit))/10

                    return <div className='box_flex'>
                                <div className='box_line' style={{width:50, fontSize:12}} title={`${limitGB}GB`}><b>{limitGB}G</b>&nbsp;</div>
                                <div className="progress" style={{margin:0, flexGrow:1,  height:'unset'}}>
                                    <div className="progress-bar" role="progressbar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                                </div>
                        </div>

				}
				
			},

			[USER_MAX_NODE]: {
				[COL_NAME]: lang(USER_MAX_NODE),
				[COL_SORT]: true,
				[COL_STYLE]: { textAlign: 'center' }
			},
			[USER_MAX_NODELAB]: {
				[COL_NAME]: lang(USER_MAX_NODELAB),
				[COL_SORT]: true,
				[COL_STYLE]: { textAlign: 'center' }
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
			[USER_STATUS]: {
				[FILTER_NAME]: lang(USER_STATUS),
				[FILTER_TYPE]: 'select',
			},
			
			[USER_NOTE]: {
				[FILTER_NAME]: lang(USER_NOTE),
				[FILTER_TYPE]: 'text',
			},


		}

		this.users_struct[STRUCT_EDIT] = {
			[USER_ROLE]: {
				[EDIT_NAME]: lang(USER_ROLE),
				[EDIT_TYPE]: 'select',
			},
			[USER_STATUS]: {
				[EDIT_NAME]: lang(USER_STATUS),
				[EDIT_TYPE]: 'select',
				[EDIT_DEFAULT]: '1',
				[EDIT_NOTE]: 'Does not apply to Admin'
				
			},
			[USER_ACTIVE_TIME]: {
				[EDIT_NAME]: lang(USER_ACTIVE_TIME),
				[EDIT_TYPE]: 'date',
				[EDIT_FORMAT]: 'llll',
				[EDIT_NOTE]: 'Does not apply to Admin'
			},
			[USER_EXPIRED_TIME]: {
				[EDIT_NAME]: lang(USER_EXPIRED_TIME),
				[EDIT_TYPE]: 'date',
				[EDIT_FORMAT]: 'llll',
				[EDIT_NOTE]: 'Does not apply to Admin'
			},

			[USER_WORKSPACE]: {
				[EDIT_NAME]: lang(USER_WORKSPACE),
				[EDIT_TYPE]: 'text',
				[EDIT_NOTE]: 'Does not apply to Admin'
			},

			[USER_MAX_NODE]: {
				[EDIT_NAME]: lang(USER_MAX_NODE),
				[EDIT_TYPE]: 'number',
				[EDIT_NOTE]: 'Does not apply to Admin'
			},
			[USER_MAX_NODELAB]: {
				[EDIT_NAME]: lang(USER_MAX_NODELAB),
				[EDIT_TYPE]: 'number',
				[EDIT_NOTE]: 'Does not apply to Admin'
			},

			[USER_NOTE]: {
				[EDIT_NAME]: lang(USER_NOTE),
				[EDIT_TYPE]: 'textarea',
			},
		}

		this.users_struct[STRUCT_ROWS] = {
			[ROW_FUNCS]: (rowData) => {
				return [
					<div key='1' className="button" onClick={() =>{
						this.editUserModal.modal();
						this.editUserModal.setData(rowData);
						}} >
						<i className="fa fa-edit"></i>
					</div>
				]
			}
		};
		this.users_struct[STRUCT_TABLE] = {
			[DATA_TABLE_ID]: USERS_TABLE,
			[DATA_FILTERS]: {},
			[DATA_HIDDEN_COL]: {},
			[DATA_PERMIT_COL]: this.permissionUsers(),
			[DATA_SORT]: { [USER_ONLINE_TIME]: 'desc' },
			[DATA_KEY]: ['table_key'],
			[FLAG_FILTER_CHANGE]: true,
			[FLAG_MULTI_SORT]: false,
			[FLAG_RESIZABLE]: true,
			[FLAG_SELECT_ROWS]: true,
			[FLAG_SETTING_ROWS]: true,
			[FLAG_EXPAND_ROWS]: false,
			[FLAG_HEAD_ROW]: true,
			[LINK_FILTER]: '/store/public/admin/users/filter',
			[LINK_EDIT]: '/store/public/admin/users/edit',
			[LINK_ADD]: '/store/public/admin/users/add',
			[LINK_DELETE]: '/store/public/admin/users/drop',
			[LINK_UPLOAD]: '/store/public/admin/users/uploader',
			[LINK_MAPPING]: '/store/public/admin/users/mapping',
			[LINK_READ]: '/store/public/admin/users/read',

		};

		this.state = {
			change: false,
			maximum: '',
			UUID: '',

			consume: {},
		}

		
		this.checkEdit = this.checkEdit.bind(this);

	}

	permissionUsers() {
		return Object.assign(
			...Object.keys(this.users_struct[STRUCT_COLUMNS]).map((k, i) => ({ [k]: 'Read' })),
			...Object.keys(this.users_struct[STRUCT_EDIT]).map((k, i) => ({ [k]: 'Write' })),
			{[USER_OFFLINE]: 'Read'}
		)
	}

	render() {
		return (
			<div className='box_padding' style={{position:'relative'}}>
				
				<TableStatic ref={c => this.table = c} table={this.users_struct} autoload={true} 
					successAdd = {e => this.setState({change:true})}
					successEdit = {e => this.setState({change:true})}
					successDel = {e => this.setState({change:true})}
				>
					<div className='box_flex'>
						<FilterBar></FilterBar>
						<div style={{margin:'auto 0px auto auto'}}>
							<a target="_blank" href={`${App.server.common.APP_CENTER}/auth/multi_access/view`}><div>Maximum Accounts: <b>{this.state.maximum}</b></div></a>
							<div>Box's ID: <b>{this.state.UUID}</b></div>
							<br/>
						</div>
					</div>
					<FuncBar
						left={<><FuncHideCol />&nbsp;<div style={{display: 'block'}} className='button btn btn-xs btn-danger' onClick={()=>{this.apply()}}>{lang("Apply")}</div></>}
						right={<>
							<div className="table_function">
								<div className="button box_flex" title="Add Row" onClick={() => this.addUserModal.modal()} >
									<i className="fa fa-plus-square"></i>&nbsp;{lang("Add")}
								</div>
							</div>
							<FuncEditRows></FuncEditRows><FuncDel /><FuncClear /><FuncRefresh /><FuncExport /></>
						}></FuncBar>
					<MainTable className='table table-bordered table-resizable'></MainTable>
					<Pagination></Pagination>
					<AddUserModal ref={c => this.addUserModal = c}></AddUserModal>
					<EditUserModal ref={c => this.editUserModal = c}></EditUserModal>

				</TableStatic>

				<Prompt
					when={this.state.change}
					message={location => "You still not Apply your change. It will be lost. Do you want to continue?"}
				/>

			</div>
		);
	}

	checkEdit() {
        if (!this.state.change) {
            return undefined;
        }
        var confirmationMessage = 'If you leave before saving, your changes will be lost.';
        window.event.returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }

	componentDidMount() {
		window.addEventListener("beforeunload", this.checkEdit);
		this.getLimit();
		this.getConsume();

		this.nodeTableInteval = setInterval(()=>{
			this.getConsume().then(res =>{  });
		}, 15000);

		this.loadOriginInteval = setInterval(()=>{
			if (!this.state.change) this.table.loadOrigin([], false);
		}, 60000);
		
	}
	
	componentWillUnmount() {
        window.removeEventListener("beforeunload", this.checkEdit);
		if(this.nodeTableInteval) clearInterval(this.nodeTableInteval);
		if(this.loadOriginInteval) clearInterval(this.loadOriginInteval);
	}
	
	apply(){
		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/admin/users/apply',
			method: 'post',
			data :{
				data: this.table.getOrigin()
			}
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if(response['result']){
					this.setState({change: false});
				}else{
					error_handle(response);
				}
				this.table.loadOrigin();
				this.setState({change: false});
			})

			.catch((error)=>{
				console.log(error); 
				App.loading(false);
				error_handle(error);
				this.table.loadOrigin();
				return false;
			})

		}

	getLimit(){
		return axios.request({
			url: '/store/public/admin/users/getLimit',
			method: 'post',
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if(response['result']){
					this.setState({
						maximum: response['data']['limit'],
						UUID: response['data']['UUID'],
					});
				}else{
					error_handle(response);
				}
			})

			.catch((error)=>{
				console.log(error); 
				App.loading(false);
				error_handle(error);
			})

	}


	getConsume(){
		return axios.request({
			url: '/store/public/admin/node_sessions/getConsume',
			method: 'post',
		})

		.then(response => {
			App.loading(false);
			response = response['data'];
			if(response['result']){
				var datas = response['data'];
				var consume = {};
				for(let i in datas){
					var data = datas[i];
					if(!consume[data[NODE_SESSION_POD]]) consume[data[NODE_SESSION_POD]] = {ram:0, cpu:0, hdd: 0};
					consume[data[NODE_SESSION_POD]]['ram'] += Number(data[NODE_SESSION_RAM]);
					consume[data[NODE_SESSION_POD]]['cpu'] += Number(data[NODE_SESSION_CPU]);
					consume[data[NODE_SESSION_POD]]['hdd'] += Number(data[NODE_SESSION_HDD]);
					this.setState({consume});
				}
				
			}else{
				error_handle(response);
			}
		})

		.catch((error)=>{
			console.log(error); 
			App.loading(false);
			error_handle(error);
		})
	}
	


}

export default Users