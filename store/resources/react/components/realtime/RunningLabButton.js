import React, { Component } from 'react'

class RunningLabButton extends Component {

	constructor(props) {
		super(props);
        this.id = makeId();
        
        this.state = {
            running: 0
        }

        this.count = this.count.bind(this)

    }
    

    render(){ 
        return <>
            <a href ="/store/public/admin/lab_sessions/view" className='box_flex'>
                {this.state.running > 0 ? <div id="number_running_lab" className='box_flex'>{this.state.running}</div> : <i className="fa fa-cogs"></i>}
                &nbsp;{lang('Running Labs')}</a>
            <style>{`
                #number_running_lab{
                    top: 10px;
                    right: 0px;
                    background: #F44336;
                    padding: 0px 3px;
                    font-size: 12px;
                    border-radius: 4px;
                    font-weight: bold;
                    color: white;
                    border: solid thin white;
                    line-height: 16px;

                }
            `}</style>

        </>
    }


    componentDidMount(){
        this.count();
        this.intervalId = setInterval(this.count, 30000);
    }
      
    componentWillUnmount(){
        if(this.intervalId) clearInterval(this.intervalId);
    }

    count(){
        axios.request ({
            url: '/store/public/admin/lab_sessions/count',
            method: 'post',
            })
            .then(response => {
                response = response['data'];
                if(response['result']){
                    this.setState({running : response['data']})
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
export default RunningLabButton