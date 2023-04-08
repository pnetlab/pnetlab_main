import React, { Component } from 'react'
import(/* webpackMode: "eager" */'./responsive/menu_client.scss')

import UserName from './UserName'
import { a, withRouter } from 'react-router-dom';
import mnf from './menu_func';
import Syslog from './Syslog'
import RunningLabButton from '../realtime/RunningLabButton';
import Upgrade from '../admin/system/Upgrade';
import OffSyslog from './OffSyslog';

class MenuClient extends Component {

	constructor(props) {
		super(props);
		this.closeAllButton = this.closeAllButton.bind(this);
	}


	componentDidMount() {
		
	}

	closeAllButton() {
		console.log('closed all menu');
		var groupButtons = document.getElementsByClassName('menu_group_button');
		for (var i = 0; i < groupButtons.length; i++) {
			mnf.rmClass(groupButtons[i], 'expand');
		}
		document.removeEventListener("click", this.closeAllButton);
	}

	menuGroupButtonHandle(event) {
		mnf.toggleClass(event.currentTarget, 'expand', event);
		document.addEventListener("click", this.closeAllButton);
	}

	render() {

		return (<>
			<div className="menu menu_expand_lg">

				<a href={`${App.server.common['APP_CENTER']}/store/labs/view?box=${window.location.origin}`}>
					<img style={{ height: 40, margin: 'auto 20px auto 40px' }} src='/store/public/assets/auth/img/logo.png'></img>
				</a>


				<div className="menu_button" onClick={(event) => { this.menuButton = event.currentTarget; mnf.toggleClass(event.currentTarget, 'expand', event) }}>
					<i className="fa fa-navicon" style={{fontSize:20}}></i>
				</div>


				<div className="menu_frame">


					<ul className="menu_content">

						<li className="menu_item menu_item_parent"><a href="/"><i className="fa fa-home"></i>&nbsp;{lang('Main')}</a></li>

						<li className="menu_item menu_item_parent"><RunningLabButton></RunningLabButton></li>

						{isAdmin()
							? <>
								<li className="menu_collapse">
									<div className="menu_group_button" onClick={(event) => { this.menuGroupButtonHandle(event) }}>
										<i className="fa fa-group"></i>&nbsp;{lang('Accounts')}&nbsp;<span className="caret"></span>
									</div>
									<ul className="menu_group">
										{isOffline()
											? <li className="menu_item"><a href="/store/public/admin/users/offline">
											<i className="fa fa-user"></i>&nbsp;{lang('Users Management')}</a></li>
											: <li className="menu_item"><a href="/store/public/admin/users/view">
											<i className="fa fa-user"></i>&nbsp;{lang('Users Management')}</a></li>
										}
										
										<li className="menu_item"><a href="/store/public/admin/user_roles/view">
											<i className="fa fa-id-card-o"></i>&nbsp;{lang('Roles Management')}</a></li>
									</ul>
								</li>

								<li className="menu_collapse">
									<div className="menu_group_button" onClick={(event) => { this.menuGroupButtonHandle(event) }}>
										<i className="fa fa-cog"></i>&nbsp;{lang('System')}&nbsp;<span className="caret"></span>
									</div>
									<ul className="menu_group">
										<li className="menu_item"><a href="/store/public/admin/mode/view">
											<i className="fa fa-globe"></i>&nbsp;{lang('System Mode')}</a></li>
										<li className="menu_item"><a href="/store/public/admin/status/view">
											<i className="fa fa-bar-chart-o"></i>&nbsp;{lang('System status')}</a></li>
										<li className="menu_item"><a href="/store/public/admin/system/view">
											<i className="fa fa-cog"></i>&nbsp;{lang('System Setting')}</a></li>
										<li className="menu_item"><a href="#" onClick={() => { global.upgrade() }}>
											<i className="fa fa-angle-double-up"></i>&nbsp;&nbsp;{lang('Versions')}</a></li>

									</ul>
								</li>


								{isOffline()
									? <li className="menu_item menu_item_parent"><a href={`${App.server.common['APP_CENTER']}/store/labs/view?box=${window.location.origin}`}><i className="fa fa-cloud-download"></i>&nbsp;{lang('Download Labs')}</a></li>
									: <li className="menu_item menu_item_parent"><a href="/store/public/admin/labs/store"><i className="fa fa-cloud-download"></i>&nbsp;{lang('Download Labs')}</a></li>
								}
								{isOffline()? '' : <li className="menu_item menu_item_parent"><a href="/store/public/admin/labs/view"><i className="fa fa-shopping-cart"></i>&nbsp;{lang('Sell Your Labs')}</a></li>}
								<li className="menu_item menu_item_parent"><a href="/store/public/admin/devices/store"><i className="fa fa-arrows" style={{
									border: 'solid thin',
									borderRadius: '50%',
									padding: 2,
									fontSize: 10
								}}>
								</i>&nbsp;{lang('Devices')}</a></li>

							</> : ''}
					</ul>
				</div>

				<div className='menu_cover' onClick={e=>{
					if(this.menuButton){
						mnf.rmClass(this.menuButton, 'expand');
					}
				}}></div> 

				<div style={{ margin: 'auto 15px auto auto' }} className='box_flex'>
					{isOffline()?<OffSyslog></OffSyslog>:<Syslog></Syslog>} 
					<div style={{width:20}}></div>
					<UserName name={formatName(App.server.user[USER_USERNAME])} /> 
					
				</div>



			</div>
			<Upgrade></Upgrade>
			
		</>
		);
	}
}
export default MenuClient