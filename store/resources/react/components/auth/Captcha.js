import React, { Component } from 'react'

class Captcha extends Component { 
	
	constructor(props) {
        super(props);
        
        this.id = this.props.id;

        this.state = {
            captcha : '',
            captchaImg : '',
        }
    }
    
    render(){
        return <>
            <div className='box_flex' style={{
                overflow: 'hidden',
                borderRadius: 5,
                border: 'solid thin',
                height: 40,
            }}>
                <div  style={{
                    cursor:'pointer',
                    height:40,
                    overflow:'hidden'
                }} dangerouslySetInnerHTML={{__html: this.state.captchaImg}} onClick={()=>this.reloadCapt()}></div>
                <input autoComplete="off" type='text' value = {this.state.captcha} style={{
                    margin: 0,
                    width:80,
                    height:40,
                    border:'none',
                    borderLeft: 'solid thin',
                    padding:5,
                }} onChange={e=> this.setState({captcha:e.target.value})}/>
            </div>
        </>
    }


    reloadCapt(){
        axios({
              method: "POST",
              url: "/captcha",
              dataType: "JSON",
              data: {
                  id: this.props.id,
              }
            })
            .then(response => {
                response = response['data'];
                if(response['result']){
                    this.setState({captchaImg : response['data']['img']});
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
        return {[this.props.id] : this.state.captcha};
    }

    componentDidMount(){
        setTimeout(()=>this.reloadCapt(), 1000);
    }
    
}

export default Captcha;