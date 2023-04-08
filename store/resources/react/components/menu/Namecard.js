import React, { Component } from 'react'
import Style from '../common/Style'
import { Link } from 'react-router-dom';
import Profile from '../auth/Profile'
import Logout from './Logout'
import Notice from '../notice/Notice';

class Namecard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			expand: true,
		}

		this.id = makeId();

	}

	userRole() {
		var userRole = [];
		var userGroup = App.server['user'][AUTHEN_GROUP];
		for (let i in userGroup) {
			userRole.push(userGroup[i][GROUP_NAME])
		}
		return userRole;
	}

	render() {
		return (
			<React.Fragment>
				<Style id="namecardcss">{`
					.profile {
						padding: 15px;
						overflow: auto;
						width: 100%;
					    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
					    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
					    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
						background: white;
					}
	
					.profile-image {
						width: 45px;
					    height: 45px;
					    float: left;
					    margin: 0px 10px;
						border-radius: 50%;    
						border: solid thin darkgray;
					}
	
					.profile-name {
						display: block;
					    color: #212529;
					    vertical-align: middle;
					    font-size: 16px;
					    font-weight: bold;
					    text-align: left;
					    margin-top: 4px;
					}
					.profile-role{
						display: block;
					    text-align: left;
					    font-size: 12px;
						margin-top: 4px;
					    color: #777777;
					}
					.profile-menu{
						background: white;
						border-bottom: 1px solid #d6d5d5;
						margin-top: 16px;
						padding-bottom: 16px;
					}
					.profile-menu-item {
						display: block;
						position: relative;
						cursor: pointer;
						white-space: nowrap;
						border-left: solid transparent;
					}
					.profile-menu-item div {
						white-space: nowrap;
						padding: 10px 15px;
						display: flex;
						align-items: center;
					}

					.profile-menu-item:HOVER {
						background-color: #e8e8e8;
					}

					.profile-menu-item div i {
						margin-right: 15px;
						font-size: 18px;
						color: #777777;
						margin-right: 10px;
					}

				`}</Style>
				<div className="profile">
					<img alt="profile" className="profile-image" 
					src={App.server.user[AUTHEN_IMG]!=''? file_public(App.server.user[AUTHEN_IMG]):"/assets/auth/img/profile.png"} />
					<span className="profile-name">{server['user'][AUTHEN_USERNAME]}</span>
					<span className="profile-role">
						{this.userRole().join(', ')}
						<i className={'button ' + (this.state.expand ? 'fa fa-caret-down' : 'fa fa-caret-right')} onClick={() => {
							this.setState({ expand: !this.state.expand });
							this.profileMenu.slideToggle();
						}}></i>
					</span>



				</div>
				<div className='profile-menu' id={this.id}>
					<li className="profile-menu-item" ><Logout /></li>
					<li className="profile-menu-item"><Link to='/auth/profile/view'><div><i className="fa fa-user"></i> {lang('Profile')}</div></Link></li>
					{/* <li className='profile-menu-item'><Notice></Notice></li> */}

				</div >

				
				
			</React.Fragment >
		)
	}

	componentDidMount() {
		this.profileMenu = $(`#${this.id}`);
		// this.profileMenu.hide();
	}
}

export default Namecard;