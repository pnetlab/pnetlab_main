import React, { Component } from 'react'
import Input from '../../components/input/Input'
import './auth.scss';
import Captcha from '../../components/auth/Captcha';

class LoginOffline extends Component {

	constructor(props) {
        super(props);
        
        
        var selectConsole = localStorage.getItem('html_console_mode');
        if(!selectConsole) selectConsole = '0';

        this.defaultConsole = get(App.server['console'], '');
        
        if(this.defaultConsole != ''){
            selectConsole = (this.defaultConsole == 'html' ? '1' : '0');
        }

        console.log(selectConsole);

        this.state = {
            html: selectConsole,
            error : get(App.parsed['error'], ''),
            success : get(App.parsed['success'], ''),
        }
        
        this.nexlink = get(App.parsed['link'], '/');
        this.isCaptcha = get(App.server['captcha'], '1');
        this.version = get(App.server['version'], '4.0.0');
        this.online = get(App.server['online'], '1');

    }
    
    render() {
		return (<>
			
            <div className="background_cover"></div>
            <div className='box_flex box_padding' style={{position:'relative', borderBottom: 'dashed thin white', color:'white'}}>
                <img src="/store/public/assets/auth/img/logo.png" style={{height: 40, margin: 'auto 20px auto 40px'}}/> 
                <div style={{fontSize:24}}>{App.server.common['APP_NAME']}</div>   
            </div>
           

            <div style={{height:'90%', justifyContent:'center', position:'relative'}} className='box_flex'>
                <div style={{width:'90%', maxWidth:500}}>
                    <div style={{marginBottom:15, textAlign: 'center'}}>
                        <img src="/store/public/assets/auth/img/logo.png" style={{height: 150}}/> 
                        <div style={{fontSize:'small', color:'white'}}><i>{lang("Version")}:&nbsp;{this.version}</i></div>
                        <div style={{fontSize:'small', color:'white'}}>{lang("Default account")}: admin/pnet</div>
                    </div>  
                    {this.state.error == '' ? '' : <div className="alert alert-danger" style={{marginBottom:15}}>{this.state.error}</div>}
                    {this.state.success == '' ? '' : <div className="alert alert-success" style={{marginBottom:15}}>{this.state.success}</div>}
                    
                    <div style={{marginBottom:15}}>
                        <Input className='offline_login_input' struct={{
                            [INPUT_TYPE] : 'text',
                            [INPUT_NULL]: false,
                        }} placeholder={lang("Username")} ref={c => this.usernameInput = c}></Input>
                    </div>
                    <div style={{marginBottom:15}}>
                        <Input  className='offline_login_input' struct={{
                            [INPUT_TYPE] : 'password',
                            [INPUT_NULL]: false,
                        }} placeholder={lang("Password")} ref={c => this.passwordInput = c}></Input>
                    </div>
                    <div style={{marginBottom:30}}>
                        <select className="offline_login_input" value={this.state.html} onChange={(e)=>{
                            localStorage.setItem('html_console_mode', e.target.value);
                            this.setState({html: e.target.value});
                        }}>
                            <option key={'0'} style={{color:'gray', padding:5}} value={'0'}>{lang("Default Console")}</option>
                            <option key={'1'} style={{color:'gray', padding:5}} value={'1'}>{lang("HTML Console")}</option>
                        </select>
                    </div>

                    <div style={{marginBottom:30, justifyContent: (this.isCaptcha==1 ? 'space-between': 'center')}} className='box_flex'>
                        {this.isCaptcha == '1' ? <div style={{marginRight:30}}><Captcha id='login_captcha' ref = {e => this.captcha = e}></Captcha></div>: ''}
                        <div tabIndex="0" className='button btn btn-info' style={{padding:8, flexGrow:1}} onClick = {()=>this.login()}>{lang("Login")}</div>
                    </div>

                    {this.online == '1' && <div style={{marginBottom:30}} className='box_flex'>
                        <a href="/store/public/auth/login/online" style={{width:'100%'}}>
                            <div className='button btn btn-info' style={{padding:8, width:200, background:'none', width:'100%'}}>{lang("Login by Online Account")}</div>
                        </a>
                    </div>}

                </div>
                {/* <div style={{textAlign:'center', textDecoration:'underline', color:'white', position:'fixed', bottom:15, right:15}} className='button'><a href="/store/public/auth/login/online">Login by Online Account</a></div> */}
			</div>

                    <style>{`
                        .offline_login_input{
                            padding: 5px;
                            border: solid thin white;
                            background: #ffffff3d;
                            border-radius: 5px;
                            color: white;
                            width: 100%;
                        }

                        .offline_login_input::placeholder{
                            color: white;
                        }
                    
                    `}</style>
            

            </>
		);
    }
    
    componentDidMount(){
        setTimeout(()=>App.Layout.closeMenu(), 5000);
        document.addEventListener("keydown", (event)=>{
			if (event.key === "Enter") {
				event.preventDefault();
				this.login()
			}
		});
    }

    login() {
        var user = this.usernameInput.getValue();
        var pass = this.passwordInput.getValue();
        var captcha = '';
        if(this.isCaptcha && this.captcha) captcha = this.captcha.getCaptcha();
        if(user === null || pass === null) return;
		App.loading(true, 'Loading...');
		return axios.request({
			url: '/store/public/auth/login/login',
			method: 'post',
			data: {
                username : user,
                password : pass,
                html : this.state.html,
                captcha: captcha,
            },
		})

		.then(response => {
			App.loading(false, 'Adding...');
            response = response['data'];
			if (response['result']) {
				window.location.href = this.nexlink;
			} else {
                if(this.captcha) this.captcha.reloadCapt();
				this.setState({
                    success: '',
                    error: lang(response['message'], response['data']),
                })
			}
		})

		.catch((error)=>{
            if(this.captcha) this.captcha.reloadCapt();
			console.log(error);
			App.loading(false, 'Adding...');
			error_handle(error)
		})
	}

}

export default LoginOffline