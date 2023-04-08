import React, { Component } from 'react'
import Logout from './Logout'
class UserName extends Component {
	constructor(props) {
		super(props);

		

	}

	componentDidMount(){
		
		this.dropdown.onclick=(e) => {
			e.stopPropagation();
		}
	}

	render() {
		return (<div className="dropdown">

					<div className='button box_flex dropdown-toggle' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i className="fa fa-user"></i>&nbsp;{this.props.name}
					</div>
					<div className="dropdown-menu">

						<div className='box_flex' style={{padding:'.25rem 1.5rem'}} onClick={e => {e.nativeEvent.stopPropagation()}} ref={c => this.dropdown = c}>
							<i className="fa fa-language"></i>&nbsp;
							<select style={{border:'none', flexGrow:1}} value={get(localStorage.getItem('language'), '')} onChange={(e)=>{
								localStorage.setItem('language', e.target.value);
								window.location.reload();
							}}>
								<option value=''>-{lang('Default')}-</option>
									{get(global.LANG['packages'], []).map(item => <option key = {item} value={item}>{item}</option>)}
								</select> 
						</div>

						{isOffline()
							? <a className="dropdown-item" href='/store/public/admin/profile/view'><i className="fa fa-user"></i>&nbsp;{lang('Profile')}</a>
							: <a className="dropdown-item" href={`${App.server.common['APP_CENTER']}/auth/profile/view?box=${window.location.origin}`}><i className="fa fa-user"></i>&nbsp;{lang('Profile')}</a>
						}
						<div className='dropdown-item'><Logout /></div>
					</div>
				</div>
		)
	}
}


export default UserName