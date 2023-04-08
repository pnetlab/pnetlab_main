import React, { Component } from 'react'


class LabBackground extends Component {

    constructor(props) {
        super(props);
        this.darkmode = 0;
        this.mode3d = 0;

        this.labviewport = $('#lab-viewport');

        this.state = {
            hideLabel : false,
        }
    }

    updateBackground(){
        axios({
			method: 'POST',
            url: '/api/labs/session/background/edit',
            dataType: 'json',
            data: {
                darkmode: this.darkmode,
                mode3d: this.mode3d,
                nogrid: this.nogrid,
            },
            })
			.then(response => {
                global.getLabInfo().then(()=>{this.applyLabBackground()});
			})
			.catch(error => {
                console.log(error);
                error_handle(error);
		});
    }

    applyLabBackground(){
        if(!window.lab) return;
        var backgroundcss = '';
        this.darkmode = window.lab.darkmode;
        this.mode3d = window.lab.mode3d;
        this.nogrid = window.lab.nogrid;
        if(this.nogrid == 0){
            if(window.lab.darkmode == 1 && window.lab.mode3d == 1) backgroundcss += 'dark3d'; 
            if(window.lab.darkmode == 1 && window.lab.mode3d == 0) backgroundcss += 'dark2d'; 
            if(window.lab.darkmode == 0 && window.lab.mode3d == 1) backgroundcss += 'light3d'; 
            if(window.lab.darkmode == 0 && window.lab.mode3d == 0) backgroundcss += 'light2d'; 
        }else{
            if(window.lab.darkmode == 1 ) backgroundcss += 'dark'; 
            if(window.lab.darkmode == 0 ) backgroundcss += 'light'; 
        }
        
        this.labviewport.removeClass();
        this.labviewport.addClass(backgroundcss);
    }

    render(){return <>
        {this.state.hideLabel
            ? <style>{`
                .node_interface {
                    display:none !important;
                }
            `}</style>
            :''
        }
    </>}

    componentDidMount(){
        global.setDarkMode = (e)=>{
            this.darkmode = e.target.checked? 1 : 0;
            this.updateBackground();
        }
        global.set3dMode = (e)=>{
            this.mode3d = e.target.checked ? 1: 0;
            this.updateBackground();
        }
        global.setNoGrid = (e)=>{
            this.nogrid = e.target.checked ? 1: 0;
            this.updateBackground();
        }
        global.editInterfaceLabel = (e)=>{
            window.hideLabel = e.target.checked;
            this.setState({hideLabel: e.target.checked});
        }

        App.onReadyRegister.push(()=>this.applyLabBackground());
    }


}
export default LabBackground
