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
import LabPreview from '../../components/main/preview/LabPreview'
import PreviewFrame from '../../components/main/preview/PreviewFrame'
import FilterItem from '../../components/table/FilterItem'
import EditLabModal from '../../components/main/lab/EditLabModal'
import CheckLabSession from '../../components/realtime/CheckLabSession';
import Input from '../../components/input/Input'

class Lab_sessions extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			running: {},
			preview: localStorage.getItem('lab_preview')=="false"? false: true,
			consume: {},
			hide_idlelab: false,
		}

	    this.lab_sessions_struct = {};
	    this.lab_sessions_struct[STRUCT_FILTERS] = {}
	    this.lab_sessions_struct[STRUCT_COLUMNS] = {


			actions:{
				[COL_NAME]: 'Actions',
				[COL_SORT]: false, 
				[COL_DECORATOR_IN] : (colId, rowId, data)=> {
					var sessionId = data[rowId][LAB_SESSION_ID];
					return <div className='box_flex' style={{justifyContent:'center'}}>
						<div className='button lab_session_button' title={lang('Join Lab Session')} onClick={()=>{this.joinLabSession(sessionId)}}><i className='fa fa-sign-in'></i></div>&nbsp;
						
						<div className='button lab_session_button' title={lang('Stop all Nodes')} onClick={()=>{this.stopLabSession(sessionId)}}><i className='fa fa-stop'></i></div>&nbsp;

						<div className='button lab_session_button' title={lang('Destroy Lab Session')} onClick={()=>{this.destroyLabSession(sessionId)}}><i className='fa fa-chain-broken'></i></div>
					</div>
				},
				[COL_STYLE]: {textAlign: 'center'}
			},
				
			[LAB_SESSION_PATH]:{
				[COL_NAME]: lang(LAB_SESSION_PATH),
				[COL_SORT]: false,
				[COL_DECORATOR_IN] : (colId, rowId, dataTable)=>{
					var data = dataTable[rowId][colId];
					var rowData = dataTable[rowId];
					return <div className='button box_line' 
					style={{
						color: (data==this.selectLab?'#4CAF50':'rgb(23, 162, 184)'), 
						fontWeight:'bold'
					}}
					onClick={()=>{
						this.selectLab = data;
						previewLab(data);
						this.table.reload();
						this.setState({preview:true});
					}} title={data} data-toggle="tooltip">
						{(rowData[LAB_SESSION_RUNNING] > 0)
						 ? <><i className='fa fa-play' style={{color:'#00d108'}}></i>&nbsp;{data}</>
						 : <><i className='fa fa-stop' style={{color:'red'}}></i>&nbsp;{data}</>
						}
					</div>
				}
			},
			[LAB_SESSION_RUNNING]: {
				[COL_NAME]: lang(LAB_SESSION_RUNNING),
				[COL_SORT]: true,
				[COL_DECORATOR_IN] : (data)=>{
					return (data > 0)
						? <b style={{color:'#00d108'}}>{data}</b>
						: <b style={{color:'#00d108'}}>0</b>
					
				},
				[COL_STYLE]: {textAlign: 'center'}
			},

			[LAB_SESSION_POD]:{
				[COL_NAME]: lang(LAB_SESSION_POD),
				[COL_SORT]: true,
				[COL_DECORATOR_IN] : (data)=>{ 
					
					if(!this.users[data]) return data;
					var current = moment().format('X');
					var inteval = Number(current) - Number(this.users[data][USER_ONLINE_TIME]);
					var online = moment(this.users[data][USER_ONLINE_TIME], 'X').format('llll');
					if (online == 'Invalid date') online = '';

					if (inteval < 600) {
						return <span style={{ textAlign: 'left' }}><i title={'Online: ' + online} className="fa fa-circle" style={{ color: 'green', cursor: 'pointer' }}></i>&nbsp;<b title={this.users[data][USER_EMAIL]}>{formatName(this.users[data][USER_USERNAME])}</b></span>
					} else {
						return <span style={{ textAlign: 'left' }}><i title={'Offline: ' + online} className="fa fa-circle" style={{ color: 'red', cursor: 'pointer' }}></i>&nbsp;<b title={this.users[data][USER_EMAIL]}>{formatName(this.users[data][USER_USERNAME])}</b></span>
					}
				}
			},

			[LAB_SESSION_JOINED]:{
				[COL_NAME]: lang(LAB_SESSION_JOINED),
				[COL_SORT]: false,
				[COL_DECORATOR_IN] : (data)=>{ 
					var members = data.split(',');
					var leng = members.length;
					members = members.map((item, key) => {
						var data = item.trim()
						if(!this.users[data]) return data;
						var current = moment().format('X');
						var inteval = Number(current) - Number(this.users[data][USER_ONLINE_TIME]);
						var online = moment(this.users[data][USER_ONLINE_TIME], 'X').format('llll');
						if (online == 'Invalid date') online = '';

						if (inteval < 600) {
							return <span key={key} style={{ textAlign: 'left', marginRight:5 }}><i title={'Online: ' + online} className="fa fa-circle" style={{ color: 'green', cursor: 'pointer' }}></i>&nbsp;<b title={this.users[data][USER_EMAIL]}>{formatName(this.users[data][USER_USERNAME])}</b></span>
						} else {
							return <span key={key} style={{ textAlign: 'left', marginRight:5 }}><i title={'Offline: ' + online} className="fa fa-circle" style={{ color: 'red', cursor: 'pointer' }}></i>&nbsp;<b title={this.users[data][USER_EMAIL]}>{formatName(this.users[data][USER_USERNAME])}</b></span>
						}
					})
					return members;
				}
			},
			
			consume_cpu: {
                [COL_NAME]: 'CPU',
                [COL_SORT]: true,
				[COL_STYLE]: {minWidth:100},
                [COL_DECORATOR_IN] : (colID, rowID, data)=>{
					var lab_id = data[rowID][LAB_SESSION_ID];
					if(!this.state.consume[lab_id]) return '';
                    var percent = Math.round(this.state.consume[lab_id]['cpu']*100)/100;
                   
                    return <div className="progress" style={{margin:0, width:'100%',  height:'unset'}}>
                            <div className="progress-bar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                        </div>
                   
                }
            },
            consume_ram: {
                [COL_NAME]: 'RAM',
                [COL_SORT]: true,
				[COL_STYLE]: {minWidth:100},
                [COL_DECORATOR_IN] : (colID, rowID, data)=>{
					var lab_id = data[rowID][LAB_SESSION_ID];
					if(!this.state.consume[lab_id]) return '';
                    var percent = Math.round(this.state.consume[lab_id]['ram']*100)/100;
                    
                    return <div className="progress" style={{margin:0, width:'100%',  height:'unset'}}>
                            <div className="progress-bar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                    </div>
                   
                }
            },
            consume_hdd: {
                [COL_NAME]: 'Hard Disk',
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center', fontWeight:'bold'},
                [COL_DECORATOR_IN] : (colID, rowID, data)=>{
					var lab_id = data[rowID][LAB_SESSION_ID];
					if(!this.state.consume[lab_id]) return '';
                    return Math.round(this.state.consume[lab_id]['hdd']*100)/100 + "MB"
                }

            },

			
                        
		}
		this.lab_sessions_struct[STRUCT_EDIT] = {}
	    this.lab_sessions_struct[STRUCT_FILTERS] = {
	    		
    			[LAB_SESSION_PATH]:{
    			 	[FILTER_NAME]: lang(LAB_SESSION_PATH),
    			 	[FILTER_TYPE]:'text',
    			},
    			
			
	    }
	    
	    
	    this.lab_sessions_struct[STRUCT_ROWS]= {
	    		[ROW_FUNCS]: (rowData) => {
	    			return [
	    			   <FuncEdit key={1} rowData={rowData}/>
	    		]}
	    };
	    this.lab_sessions_struct[STRUCT_TABLE]= {
	            [DATA_TABLE_ID] : LAB_SESSIONS_TABLE,
	            [DATA_FILTERS] : {},
	            [DATA_HIDDEN_COL] : {},
	            [DATA_PERMIT_COL] : this.permissionLab_sessions(),
	            [DATA_KEY] : [LAB_SESSION_ID],
	            [DATA_SORT] : {[LAB_SESSION_ID] : 'desc'},
	            [FLAG_FILTER_CHANGE] : true,
	            [FLAG_MULTI_SORT] : false,
	            [FLAG_RESIZABLE] : true,
	            [FLAG_SELECT_ROWS] : false,
	            [FLAG_SETTING_ROWS] : false,
	            [FLAG_EXPAND_ROWS] : false,
	            [FLAG_HEAD_ROW] : true,
	            [LINK_FILTER] : '/store/public/admin/lab_sessions/filter',      
		};
		
		this.selectLab = '';
		this.users = {};
	}
	
	permissionLab_sessions(){
		return Object.assign(
			...Object.keys(this.lab_sessions_struct[STRUCT_COLUMNS]).map((k, i) => ({[k]: 'Read'})), 
			...Object.keys(this.lab_sessions_struct[STRUCT_EDIT]).map((k, i) => ({[k]: 'Write'})), 
		)
	}

	getMapUser(){
		return axios.request({
            url: '/store/public/admin/lab_sessions/mapUser',
            method: 'post',
            
        })

		.then(response => {
			App.loading(false);
			response = response['data'];
			if (!response['result']) {
				error_handle(response);
				return false;
			} else {
				this.users = response['data'];
				this.table.reload();
			}
		})

		.catch((error)=>{
			console.log(error);
			App.loading(false);
			error_handle(error);
		})
	}

	destroyLabSession(lab_session){
		if(global.destroyLabSession){
			global.destroyLabSession(lab_session).then(res => {
				if(res){
					this.table.filter();
        			localStorage.removeItem(`countdown_timer_${lab_session}`);
				}
			})
		}
		
	}

	stopLabSession(lab_session){
		if(global.stopNodesLabSession){
			global.stopNodesLabSession(lab_session).then(res => {
				if(res){
					this.table.filter();
        			localStorage.removeItem(`countdown_timer_${lab_session}`);
				}
			})
		}
		
	}

	joinLabSession(lab_session){

		App.loading(true);
		return axios.request({
            url: '/api/labs/session/factory/join',
			method: 'post',
			dataType: 'json',
			data: {
				lab_session: lab_session
			}
        })

		.then(response => {
			App.loading(false);
			window.location.href = "/legacy/topology";
		})

		.catch((error)=>{
			console.log(error);
			App.loading(false);
			error_handle(error);
		})
	}
	

	getRunningNodes(){
		
		return axios.request({
            url: '/api/nodestatus',
			method: 'post',
			dataType: 'json',
        })

		.then(response => {
			
			response = response['data'];
			if (!response['status' == 'success']) {
				var datas = response['data'];

				var runningData = {};
				for(let i in datas){
					var data = datas[i]
					if(!runningData[data[NODE_SESSION_LAB]]){
						runningData[data[NODE_SESSION_LAB]] = {
							running: false,
							started: 0,
						}
					}
					if(data['node_session_status'] > 1){
						runningData[data[NODE_SESSION_LAB]].running = true;
						runningData[data[NODE_SESSION_LAB]].started ++;
					}
				}
				this.setState({
					running: runningData
				})

				
			} else {
				error_handle(response);
				return false;
			}
		})

		.catch((error)=>{
			console.log(error);
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
					if(!consume[data[NODE_SESSION_LAB]]) consume[data[NODE_SESSION_LAB]] = {ram:0, cpu:0, hdd: 0};
					consume[data[NODE_SESSION_LAB]]['ram'] += Number(data[NODE_SESSION_RAM]);
					consume[data[NODE_SESSION_LAB]]['cpu'] += Number(data[NODE_SESSION_CPU]);
					consume[data[NODE_SESSION_LAB]]['hdd'] += Number(data[NODE_SESSION_HDD]);
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
	

	componentDidMount(){
		
		this.getMapUser();
		this.getConsume();
		
        this.intervalId = setInterval(()=>{
			this.getConsume().then(result => {
				this.table.filter(null, false)
			})
		}, 30*1000);

		this.mapUserInteval = setInterval(()=>{
			this.getMapUser();
		}, 300*1000);

    }
      
    componentWillUnmount(){
		if(this.intervalId) clearInterval(this.intervalId);
		if(this.mapUserInteval) clearInterval(this.mapUserInteval);
    }
	
	render () {
		  return(

				<div className='row'>
					<div style={{padding:7}} className={`col-md-${this.state.preview?'6':'12'} order-md-0 order-1`}>
						<div className='box_flex lab_preview_title'>
							<i className='fa fa-cogs'></i>&nbsp;{lang("Running Lab Sessions")}
							<i className={`fa fa-border button ${this.state.preview?'fa-expand':'fa-compress'}`} style={{margin:'auto 0px auto auto', padding:'5px 8px', borderRadius:2}} onClick={()=>{
								var preview = this.state.preview;
								localStorage.setItem('lab_preview', !preview);
								this.setState({preview: !preview});
							}}></i>
						
						</div>
						<Table ref={c=>this.table = c} table = {this.lab_sessions_struct} autoload={true}>
							<div className="lab_session_filter_item"><Input struct={{
								[INPUT_TYPE]: 'text',
								[INPUT_ONCHANGE_BLUR]: (evt, obj)=>{
									console.log(obj);
									this.table[STRUCT_TABLE][DATA_FILTERS][LAB_SESSION_PATH] = {logic: "and", data: [["contain", obj.getValue()]]} ;
									this.table.filter();
								}
							}}
							placeholder = 'Search Lab'
							style={{width: '100%'}}
							className='input'
							></Input></div>

							<FuncBar 
								left = {<FuncHideCol/>}
								right = {<>
								<div className='box_flex button' onClick={()=>{
										if(!this.state.hide_idlelab){
											this.table[STRUCT_TABLE][DATA_FILTERS][LAB_SESSION_RUNNING] = {logic:'and', data:[['>', 0]]};
										}else{
											delete(this.table[STRUCT_TABLE][DATA_FILTERS][LAB_SESSION_RUNNING]);
										}
										this.table.filter();
										this.setState({hide_idlelab: !this.state.hide_idlelab});
									}}>
									<i style={{color: '#457fca'}} className={`button fa ${this.state.hide_idlelab?'fa-toggle-on':'fa-toggle-off'}`} ></i>{lang("Hide Idle Labs")}
								</div>
								
								<FuncRefresh/><FuncExport/></>}>
							</FuncBar>

							<MainTable className='table table-bordered table-resizable' frameStyle={{maxHeight: '75vh'}}></MainTable>
							<Pagination></Pagination>
						</Table>
					</div>
					<div className='col-md-6 order-md-1 order-0' style={{display: (this.state.preview?'block':'none'), padding:7 }}>
						<PreviewFrame></PreviewFrame>
						<EditLabModal></EditLabModal>
					</div>
						<style>{`
						.lab_session_filter_item .filter_item{
							width: 100%;
							padding: 0px;
							margin: 5px 0px;
						}
						#lab_sessions th {
							background: #0d274d;
							color: white;
						}
						.lab_session_button {
							padding: 4px 5px;
							border: solid thin darkgray;
							border-radius: 3px;
						}
						`}</style>


					<CheckLabSession callback={(result)=>{
						if(result != null && result != '') window.location='/legacy/topology';
					}}></CheckLabSession>
					
				</div>

			
		  ); 
	  }

}

export default Lab_sessions