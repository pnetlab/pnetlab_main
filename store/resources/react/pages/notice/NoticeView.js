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

class Notice extends Component {

	constructor(props) {
		super(props);

		this.notice_struct = {};
		this.notice_struct[STRUCT_FILTERS] = {}
		this.notice_struct[STRUCT_COLUMNS] = {

			[NOTICE_TIME]: {
				[COL_NAME]: lang(NOTICE_TIME),
				[COL_SORT]: true,
				[COL_DECORATOR_IN]: function (data) { if (data == '') return data; else return moment(data, 'X').format(DATE_FORMAT) },
				[COL_STYLE]: { whiteSpace: 'nowrap' }
			},
			[NOTICE_UNAME]: {
				[COL_NAME]: lang(NOTICE_UNAME),
				[COL_SORT]: true,

			},
			[NOTICE_FIRE_UNAME]: {
				[COL_NAME]: lang(NOTICE_FIRE_UNAME),
				[COL_SORT]: true,

			},
			[NOTICE_CONTENT]: {
				[COL_NAME]: lang(NOTICE_CONTENT),
				[COL_SORT]: false,
				[COL_DECORATOR_IN]: function (colID, rowID, tbData) {
					var item = tbData[rowID]
					var variable = {};
					try { variable = JSON.parse(item[NOTICE_VARIABLE])} catch(error){};
					
					return <div dangerouslySetInnerHTML={{
						
						__html: lang(item[NOTICE_CONTENT], {
							[NOTICE_UNAME]: item[NOTICE_UNAME],
							[NOTICE_FIRE_UNAME]: item[NOTICE_FIRE_UNAME],
							...variable,
						})
					}}>
					</div>

				}


			},
			[NOTICE_SEEN]: {
				[COL_NAME]: lang(NOTICE_SEEN),
				[COL_SORT]: true,

			},
			[NOTICE_LEVEL]: {
				[COL_NAME]: lang(NOTICE_LEVEL),
				[COL_SORT]: true,

			},
			[NOTICE_ACTION]: {
				[COL_NAME]: lang(NOTICE_ACTION),
				[COL_SORT]: false,
				[COL_DECORATOR_IN]: function (data) { return HtmlDecode(data) }
			},



		}
		this.notice_struct[STRUCT_FILTERS] = {

			[NOTICE_TIME]: {
				[FILTER_NAME]: lang(NOTICE_TIME),
				[FILTER_TYPE]: 'date',
			},
			[NOTICE_UNAME]: {
				[FILTER_NAME]: lang(NOTICE_UNAME),
				[FILTER_TYPE]: 'text',
			},
			[NOTICE_FIRE_UNAME]: {
				[FILTER_NAME]: lang(NOTICE_FIRE_UNAME),
				[FILTER_TYPE]: 'text',
			},
			[NOTICE_SEEN]: {
				[FILTER_NAME]: lang(NOTICE_SEEN),
				[FILTER_TYPE]: 'select',
			},
			[NOTICE_LEVEL]: {
				[FILTER_NAME]: lang(NOTICE_LEVEL),
				[FILTER_TYPE]: 'text',
			},


		}

		this.notice_struct[STRUCT_EDIT] = {

			[NOTICE_TIME]: {
				[EDIT_NAME]: lang(NOTICE_TIME),
				[EDIT_TYPE]: 'date',
			},
			[NOTICE_UID]: {
				[EDIT_NAME]: lang(NOTICE_UNAME),
				[EDIT_TYPE]: 'text',
				[EDIT_SUGGEST]: '/auth/users/suggest'
			},
			[NOTICE_FIRE_UID]: {
				[EDIT_NAME]: lang(NOTICE_FIRE_UNAME),
				[EDIT_TYPE]: 'text',
				[EDIT_SUGGEST]: '/auth/users/suggest'
			},
			[NOTICE_CONTENT]: {
				[EDIT_NAME]: lang(NOTICE_CONTENT),
				[EDIT_TYPE]: 'textarea',
			},
			[NOTICE_SEEN]: {
				[EDIT_NAME]: lang(NOTICE_SEEN),
				[EDIT_TYPE]: 'select',
			},
			[NOTICE_LEVEL]: {
				[EDIT_NAME]: lang(NOTICE_LEVEL),
				[EDIT_TYPE]: 'text',
			},
			[NOTICE_ACTION]: {
				[EDIT_NAME]: lang(NOTICE_ACTION),
				[EDIT_TYPE]: 'textarea',
			},


		}

		this.notice_struct[STRUCT_ROWS] = {
			[ROW_FUNCS]: (rowData) => {
				return [
					<FuncEdit key={1} rowData={rowData} />
				]
			}
		};
		this.notice_struct[STRUCT_TABLE] = {
			[DATA_TABLE_ID]: NOTICE_TABLE,
			[DATA_FILTERS]: {},
			[DATA_HIDDEN_COL]: {},
			[DATA_PERMIT_COL]: this.permissionNotice(),
			[DATA_KEY]: [NOTICE_ID],
			[DATA_SORT]: { [NOTICE_ID]: 'desc' },
			[FLAG_FILTER_CHANGE]: true,
			[FLAG_MULTI_SORT]: false,
			[FLAG_RESIZABLE]: true,
			[FLAG_SELECT_ROWS]: true,
			[FLAG_SETTING_ROWS]: false,
			[FLAG_EXPAND_ROWS]: false,
			[FLAG_HEAD_ROW]: true,
			[LINK_FILTER]: '/notice/notice/filter',
			[LINK_EDIT]: '/notice/notice/edit',
			[LINK_ADD]: '/notice/notice/add',
			[LINK_DELETE]: '/notice/notice/drop',
			[LINK_MAPPING]: '/notice/notice/mapping',

		};


	}

	permissionNotice() {
		return Object.assign(
			...Object.keys(this.notice_struct[STRUCT_COLUMNS]).map((k, i) => ({ [k]: 'Read' })),
			...Object.keys(this.notice_struct[STRUCT_EDIT]).map((k, i) => ({ [k]: 'Write' })),
		)
	}

	render() {
		return (
			<div>
				<Table table={this.notice_struct} autoload={true}>
					<FilterBar></FilterBar>
					<FuncBar
						left={<FuncHideCol />}
						right={<><FuncAdd /><FuncDel /><FuncClear /><FuncRefresh /><FuncExport /></>}></FuncBar>
					<MainTable className='table table-bordered table-striped table-resizable'></MainTable>
					<Pagination></Pagination>

				</Table>
			</div>
		);
	}
}

export default Notice