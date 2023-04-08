import React, { Component } from 'react'
import Script from '../common/Script'
import Style from '../common/Style'
import(/* webpackMode: "eager" */'./responsive/menu.scss')
import Namecard from './Namecard'


import { Link } from 'react-router-dom';
import mnf from './menu_func';
import Syslog from './Syslog';

class Menu extends Component {

	constructor(props) {
		super(props);
		this.id = makeId();

		this.state = {
			selected: ''
		}

		this.struct = {
			[CAMPAIGNS_TABLE]: {
				name: lang(CAMPAIGNS_TABLE),
				icon: 'fa fa-clone',
				link: '/admin/campaigns/view',
				action: null,
				children: null,
				condition: null,
			},

			'accounts': {
				name: lang('Accounts'),
				icon: 'fa fa-group',
				link: null,
				action: null,
				children: {
					[AUTHEN_TABLE]: {
						name: lang(AUTHEN_TABLE),
						icon: 'fa fa-user-circle-o',
						link: '/auth/authentication/view',
						action: null,
						children: null,
						condition: null,
					},

				},
				condition: () => App.server['user'][AUTHEN_GROUP] == 0,
			},

			'system': {
				name: lang('System'),
				icon: 'fa fa-cog',
				link: null,
				action: null,
				children: {
					// [NOTICE_TABLE]: {
					// 	name: lang(NOTICE_TABLE),
					// 	icon: 'fa fa-bell',
					// 	link: '/notice/notice/view',
					// 	action: null,
					// 	children: null,
					// 	condition: null,
					// },
					// [NOTICE_WEB_TABLE]: {
					// 	name: lang(NOTICE_WEB_TABLE),
					// 	icon: 'fa fa-bell',
					// 	link: '/notice/notice_web/view',
					// 	action: null,
					// 	children: null,
					// 	condition: null,
					// },
					[UPLOADER_DISKS_TABLE]: {
						name: lang(UPLOADER_DISKS_TABLE),
						icon: '	fa fa-hdd-o',
						link: '/uploader/uploader_disks/view',
						action: null,
						children: null,
						condition: null,
					},
					[UPLOADER_FILES_TABLE]: {
						name: lang(UPLOADER_FILES_TABLE),
						icon: 'fa fa-file-text-o',
						link: '/uploader/uploader_files/view',
						action: null,
						children: null,
						condition: null,
					},
					[CONTROL_TABLE]: {
						name: lang(CONTROL_TABLE),
						icon: 'fa fa-clone',
						link: '/control/control/view',
						action: null,
						children: null,
						condition: null,
					},
				},
				condition: () => App.server['user'][AUTHEN_GROUP] == 0,
			},





		}


	}


	componentDidMount() {
		this.setState({ selected: App.activePage });
		$(`#${this.id}`).nanoScroller();
	}


	onClickHandle(key) {

		this.setState({ selected: key })

		if (App.Layout) App.Layout.setState({
			menu: App.Layout.loadDefault()
		})

		$(".modal-backdrop").remove();
	}


	drawMenu(item, key) {

		if (item.condition && !item.condition()) return { comp: '', isSelected: false };

		var isSelected = this.state.selected == key;
		var isChildSelected = false;

		if (item.children) {
			var children = [];
			Object.keys(item.children).map(id => {
				var result = this.drawMenu(item.children[id], id);
				children.push(result.comp);
				if (result.isSelected) isChildSelected = true;
			});
			var comp = <li key={key} className="menu_collapse">
				<div className={`menu_group_button menu_item ${isSelected ? 'menu_item_selected' : ''} ${isChildSelected ? 'expand' : ''}`} onClick={(event) => {
					mnf.toggleClass(event.currentTarget, 'expand', event)
				}}>
					<div><i className={item.icon}></i>{item.name}</div>
				</div>
				<ul className="menu_group">
					{children}
				</ul>
			</li>
			return { comp: comp, isSelected: isChildSelected };
		} else {
			var comp = '';
			if (item.link) {
				comp = <li key={key} className={`menu_item ${isSelected ? 'menu_item_selected' : ''}`} onClick={event => { this.onClickHandle(key) }}><Link to={item.link}><div><i className={item.icon}></i>{item.name}</div></Link></li>
			} else if (item.action) {
				comp = <li key={key} className={`menu_item ${isSelected ? 'menu_item_selected' : ''}`} onClick={event => { this.onClickHandle(key) }}><div onClick={event => item.action(event)}><i className={item.icon}></i>{item.name}</div></li>
			} else {
				comp = <li key={key} className={`menu_item ${isSelected ? 'menu_item_selected' : ''}`} onClick={event => { this.onClickHandle(key) }}><div><i className={item.icon}></i>{item.name}</div></li>
			}

			return { comp, isSelected }

		}
	}


	render() {
		var stateMenu = this.props.layout.getMenuState();

		return (
			<>

				<div className={"topbar_left " + stateMenu}><div style={{ margin: 'auto' }}>{App.server.common['APP_NAME']}</div></div>
				<div className="topbar_right">

					<div className="button topbar_button" onClick={(event) => {
						if (stateMenu == '') {
							this.props.layout.setState({ menu: 'closed' })
						} else {
							this.props.layout.setState({ menu: '' })
						}
					}}><i style={{ fontSize: 32 }} className="fa fa-angle-left"></i>
					</div>

					<div className="topbar_content">

					</div>
				</div>


				<div className={`menu ${stateMenu} menu_closed_lg nano`} id={this.id}>


					<div className='nano-content'>
						<div className={`menu_frame `} >

							<div style={{ background: 'white' }}>
								<Namecard />
							</div>

							<ul className="menu_content">
								{Object.keys(this.struct).map(key => this.drawMenu(this.struct[key], key).comp)}
							</ul>
						</div>
					</div>

				</div>




			</>
		);
	}
}
export default Menu