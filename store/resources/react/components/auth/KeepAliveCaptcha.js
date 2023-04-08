import React, { Component } from 'react'

class KeepAliveCaptcha extends Component { 
	
	constructor(props) {
        super(props);
        this.state = {
            captcha : '',
            captchaImg : '',
        }
    }
    
    render(){
        return <>
            <div className='box_flex'>
                <div  style={{
                    border: 'solid thin',
                    borderBottomLeftRadius: 5,
                    borderTopLeftRadius: 5,
                    cursor:'pointer',
                    height:40,
                    overflow:'hidden'
                }} dangerouslySetInnerHTML={{__html: this.state.captchaImg}} onClick={()=>this.reloadCapt()}></div>
                <input autoComplete="off" type='text' value = {this.state.captcha} style={{
                    margin: 0,
                    width:80,
                    height:40,
                    border: 'solid thin',
                    borderBottomRightRadius: 5,
                    borderTopRightRadius: 5,
                    borderLeft:'none',
                }} onChange={e=> this.setState({captcha:e.target.value})}/>
            </div>
        </>
    }


    reloadCapt(){
        axios({
              method: "POST",
              url: "/store/public/admin/mode/keepAliveCaptcha",
              dataType: "JSON",
            })
            .then(response => {
                response = response['data'];
                if(response['result']){
                    this.setState({captchaImg : response['data']});
                }else{
                    error_handle(response);
                }
            })
            
            .catch((error)=>{
                console.log(error);
                error_handle(error);
            })
            
    }

    getCaptcha(){
        return this.state.captcha;
    }

    componentDidMount(){
        this.reloadCapt();
    }
    
}

export default KeepAliveCaptcha;