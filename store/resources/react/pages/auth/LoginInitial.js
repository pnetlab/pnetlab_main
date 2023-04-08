import React, { Component } from 'react'
import './auth.scss';
import { Link } from 'react-router-dom';

class LoginOffline extends Component {

	constructor(props) {
        super(props);
        
        this.error = get(App.parsed['error'], '');
        this.success = get(App.parsed['success'], '');
        this.version = get(App.server['version'], '4.0.0');


    }
    
    render() {
		return (<>
			
            <div className="background_cover"></div>
            <div className='box_flex box_padding' style={{position:'relative', borderBottom: 'dashed thin white', color:'white'}}>
                <img src="/store/public/assets/auth/img/logo.png" style={{height: 40, margin: 'auto 20px auto 40px'}}/> 
                <div style={{fontSize:24}}>{App.server.common['APP_NAME']}</div>   
            </div>
           
            <div style={{height:'90%', justifyContent:'center', position:'relative'}} className='box_flex'>
                <div style={{width:550}}>

                    <div style={{marginBottom:50, textAlign: 'center'}}>
                        <img src="/store/public/assets/auth/img/logo.png" style={{height: 150}}/> 
                        <div style={{fontSize:'small', color:'white'}}><i>{lang("Version")}:&nbsp;{this.version}</i></div>
                    </div>  
                    
                    <div className='box_flex' style={{justifyContent:'space-between', marginBottom:50}}>
                        <a href='/store/public/auth/login/initialOnline'><div className='login_initial_button button'>Online Mode</div></a>
                        <a href='/store/public/auth/login/initialOffline'><div className='login_initial_button button'>Offline Mode</div></a>
                    </div>
                    
                    {this.error == '' ? '' : <div className="alert alert-danger" style={{textAlign:'center'}}>{this.error}</div>}
                    {this.success == '' ? '' : <div className="alert alert-success" style={{textAlign:'center'}}>{this.success}</div>}
                    
                </div>
			</div>

            </>
		);
    }
    
    componentDidMount(){
        setTimeout(()=>App.Layout.closeMenu(), 3000);
    }
}

export default LoginOffline


