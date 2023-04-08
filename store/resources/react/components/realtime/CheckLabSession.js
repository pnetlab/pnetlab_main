import React, { Component } from 'react'

class CheckLabSession extends Component {

	constructor(props) {
        super(props);
        this.getSession = this.getSession.bind(this);
    }
    

    render(){ 
        return <></>
    }


    componentDidMount(){
        this.getSession();
        this.intervalId = setInterval(this.getSession, 17000);
    }
      
    componentWillUnmount(){
        if(this.intervalId) clearInterval(this.intervalId);
    }

    getSession(){
        axios.request ({
            url: '/store/public/admin/lab_sessions/getSession',
            method: 'post',
            })
            .then(response => {
                response = response['data'];
                if(response['result']){
                    if(this.props.callback) this.props.callback(response['data']);
                }else{
                    error_handle(response);
                }
            })
            
            .catch((error)=>{
                console.log(error);
                error_handle(error);
            })
    }

}
export default CheckLabSession