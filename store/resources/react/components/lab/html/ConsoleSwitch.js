import React, { Component } from 'react'

class ConsoleSwitch extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        var console = HTML5;
        if(console == 1){
            return <a onClick={()=>{this.changeConsole(0)}} href="#"><i style={{fontSize:16, color:'#5bc0de'}} className="fa fa-toggle-on" ></i><span className='lab-sidebar-title'>{lang("HTML Console")}</span></a>
        }else{
            return <a onClick={()=>{this.changeConsole(1)}} href="#"><i style={{fontSize:16}} className="fa fa-toggle-off"></i><span className='lab-sidebar-title'>{lang("HTML Console")}</span></a>
        }
    }

    changeConsole(html){
        App.loading(true, 'Loading...');
        localStorage.setItem('html_console_mode', html);
        return axios.request({
            url: `/store/public/admin/default/changeConsole`,
            method: 'post',
            data: {html}
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['result']) {
                    location.reload();
                } else {
                    App.loading(false, 'Loading...');
                    location.reload();
                }

            })

            .catch(function (error) {
                App.loading(false, 'Loading...');
                console.log(error);
                location.reload();
            })

    }
}
export default ConsoleSwitch