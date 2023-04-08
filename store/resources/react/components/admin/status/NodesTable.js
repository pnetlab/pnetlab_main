
import React, { Component } from 'react'
import Table from '../../table/TableStatic'
import MainTable from '../../table/MainTable'
import Pagination from '../../table/Pagination'
import FuncBar from '../../table/FuncBar'

import FuncEdit from '../../table/FuncEdit'
import FuncRefresh from '../../table/FuncRefresh'
import FuncExport from '../../table/FuncExport'

class NodeTable extends Component {

    constructor(props) {
        super(props);

        this.node_sessions_struct = {};
        this.node_sessions_struct[STRUCT_FILTERS] = {}
        this.node_sessions_struct[STRUCT_COLUMNS] = {

            [NODE_SESSION_NID]: {
                [COL_NAME]: lang(NODE_SESSION_NID),
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center'}

            },
            'node_name': {
                [COL_NAME]: lang('node_name'),
                [COL_SORT]: true,
                [COL_DECORATOR_IN] : (colID, rowID, data)=>{
                    if(!window.nodes) return '';
                    var nodes = window.nodes;
                    var nid = data[rowID][NODE_SESSION_NID];
                    if(!nodes[nid]) return '';
                    return <div><img src={`/images/icons/${nodes[nid]['icon']}`} style={{width:18, marginRight:10}}></img>{nodes[nid]['name']}</div>
                }
            },

            [NODE_SESSION_PORT]: {
                [COL_NAME]: lang(NODE_SESSION_PORT),
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center'}

            },
            [NODE_SESSION_TYPE]: {
                [COL_NAME]: lang(NODE_SESSION_TYPE),
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center'},
                [COL_DECORATOR_IN]: data => data.toLocaleUpperCase(),

            },
            [NODE_SESSION_WORKSPACE]: {
                [COL_NAME]: lang(NODE_SESSION_WORKSPACE),
                [COL_SORT]: true,
                [COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) }
            },
            device_ram: {
                [COL_NAME]: lang('device_ram'),
                [COL_SORT]: false,
                [COL_DECORATOR_IN] : (colID, rowID, data)=>{
                    if(!window.nodes) return '';
                    var nodes = window.nodes;
                    var nid = data[rowID][NODE_SESSION_NID];
                    if(!nodes[nid]) return '';
                    if(!this.props.total_ram) return '';
                    if(data[rowID][NODE_SESSION_RAM] == null) return '';
                    var ramUsed = this.props.total_ram * Number(data[rowID][NODE_SESSION_RAM])/100;
                    var percent = Math.round(ramUsed*100/Number(nodes[nid]['ram']));
                    return <div className='box_flex'>
                                <div className='box_line' style={{width:50}} title={`${nodes[nid]['ram']}M`}><b>{nodes[nid]['ram']}M</b>&nbsp;</div>
                                <div className="progress" style={{margin:0, flexGrow:1,  height:'unset'}}>
                                    <div className="progress-bar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                                </div>
                        </div>
                }

            },
            [NODE_SESSION_RAM]: {
                [COL_NAME]: lang(NODE_SESSION_RAM),
                [COL_SORT]: true,
                [COL_DECORATOR_IN] : data=>{
                    var percent = data;
                    if(data == null) return '';
                    return <div className="progress" style={{margin:0, width:'100%',  height:'unset'}}>
                            <div className="progress-bar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                        </div>
                   
                }
            },
            [NODE_SESSION_CPU]: {
                [COL_NAME]: lang(NODE_SESSION_CPU),
                [COL_SORT]: true,
                [COL_DECORATOR_IN] : data=>{
                    var percent = data;
                    if(data == null) return '';
                    return <div className="progress" style={{margin:0, width:'100%',  height:'unset'}}>
                            <div className="progress-bar" style={{width:`${percent}%`, lineHeight:'unset', background:(percent > 80 ? 'red': (percent > 50 ? 'orange': 'green'))}}>&nbsp;{`${percent}%`}</div>
                    </div>
                   
                }
            },
            [NODE_SESSION_HDD]: {
                [COL_NAME]: lang(NODE_SESSION_HDD),
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center', fontWeight:'bold'},
                [COL_DECORATOR_IN] : data=> {
                    if(data == null) return '';
                    return data + "MB"
                }

            },
            [NODE_SESSION_RUNNING]: {
                [COL_NAME]: lang(NODE_SESSION_RUNNING),
                [COL_SORT]: true,
                [COL_STYLE]: {textAlign:'center'},
                [COL_DECORATOR_IN]: data => {
                    if(data === 1) return <i className='fa fa-play' title="Running" style={{color:'#00d108'}}></i>
                    return <i className='fa fa-stop' title="Stopped" style={{color:'red'}}></i>
                }

            },



        }
        this.node_sessions_struct[STRUCT_FILTERS] = {}

        this.node_sessions_struct[STRUCT_EDIT] = {}

        this.node_sessions_struct[STRUCT_ROWS] = {
            [ROW_FUNCS]: (rowData) => {
                return [
                    <div className="box_flex" key={1}>
                        <div className="button action-nodestart" data-path={rowData[NODE_SESSION_NID]} title={lang("Start")} style={{margin:'0px 4px'}}><i className="glyphicon glyphicon-play"></i></div>
                        <div className="button action-nodestop" data-path={rowData[NODE_SESSION_NID]} title={lang("Stop")} style={{margin:'0px 4px'}}><i className="glyphicon glyphicon-stop"></i></div>
                        <div className="button action-nodewipe" data-path={rowData[NODE_SESSION_NID]} title={lang("Wipe")} style={{margin:'0px 4px'}}><i className="glyphicon glyphicon-erase"></i></div>
                        <div className="button action-nodeexport" data-path={rowData[NODE_SESSION_NID]} title={lang("Export CFG")} style={{margin:'0px 4px'}}><i className="glyphicon glyphicon-save"></i></div>
                    </div>
                ]
            }
        };
        this.node_sessions_struct[STRUCT_TABLE] = {
            [DATA_TABLE_ID]: NODE_SESSIONS_TABLE,
            [DATA_FILTERS]: {},
            [DATA_HIDDEN_COL]: {},
            [DATA_PERMIT_COL]: this.permissionNode_sessions(),
            [DATA_SORT]: { [NODE_SESSION_NID]: 'desc' },
            [FLAG_FILTER_CHANGE]: true,
            [FLAG_MULTI_SORT]: false,
            [FLAG_RESIZABLE]: true,
            [FLAG_SELECT_ROWS]: false,
            [FLAG_SETTING_ROWS]: true,
            [FLAG_EXPAND_ROWS]: false,
            [FLAG_HEAD_ROW]: true,
            [FLAG_ROW_INDEX]: false,
            
            [LINK_READ]: '/store/public/admin/node_sessions/read',

        };


    }

    permissionNode_sessions() {
        return Object.assign(
            ...Object.keys(this.node_sessions_struct[STRUCT_COLUMNS]).map((k, i) => ({ [k]: 'Read' })),
            ...Object.keys(this.node_sessions_struct[STRUCT_EDIT]).map((k, i) => ({ [k]: 'Write' })),
        )
    }

    update(){
        this.table.loadOrigin([], false);
    }


    loadOrigin(dataKeys, loading=true, special={}){
		if(loading) App.loading(true, 'Loading...');
		return axios.request ({
		    url: this.table[STRUCT_TABLE][LINK_READ],
		    method: 'post',
		    data:{
			    	data: dataKeys,
			    	...this.table[STRUCT_TABLE][DATA_SPECIAL],
			    	...special
		    	}
			})
			
	      .then(response => {
	    	  App.loading(false, 'Loading...');
	    	  response = response['data'];
	    	  
	    	  if(response['result']){

                for(let rowID in response['data']){

                    if(!window.nodes) continue;
                    var nodes = window.nodes;
                    var nid = response['data'][rowID][NODE_SESSION_NID];
                    if(!nodes[nid]) continue;
                    response['data'][rowID]['node_name'] = nodes[nid]['name'];
	    		  
                }
                console.log(response['data']);
                this.table.setOrigin(response['data']);
				this.table.filter();
		    	  
	    	  }
	    	  
	    	  return response;
	    	  
	    	  
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  App.loading(true, 'Loading...');
	    	  error_handle(error)
	      })
	}

    render() {
        return (
            <div>
                <Table table={this.node_sessions_struct} loadOrigin={this.loadOrigin.bind(this)} autoload={false} ref={c => this.table = c}>
                    <FuncBar right={<><FuncRefresh /><FuncExport /></>}></FuncBar>
                    <MainTable className='table table-bordered table-resizable'></MainTable>
                    <Pagination></Pagination>
                </Table>
            </div>
        );
    }
}

export default NodeTable