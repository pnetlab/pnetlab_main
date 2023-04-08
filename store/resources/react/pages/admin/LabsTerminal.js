import React, { Component } from 'react';
import Consoles from '../../components/lab/html/Consoles';
import CheckLabSession from '../../components/realtime/CheckLabSession';

class LabsTerminal extends Component {
	/** when people click on Terminal to open in a new tab */
	constructor(props) {
		super(props);
		this.terminals = JSON.parse(atob(App.parsed['terminals']));
	}

	render() {
		return (
			<div className='d-flex' style={{flexGrow:1, flexDirection:'column', height:'100%'}}>

				<style>{`
					.menu{
						display: none;
					}
					.main{
						margin-top: 0px;
						padding-top: 0px;
					}
					.wb-header {
						background-color: #263339 !important;
						padding: 5px;
					}
					.wb-title {
						color: #a6b3b9 !important;
					}
				`}</style>
				
				<Consoles ref={consoles => this.consoles = consoles} show={true}></Consoles>

				<CheckLabSession callback={(result)=>{
					if(result == null || result == '') window.close();
				}}></CheckLabSession>
				
			</div>
		);
	}

	componentDidMount(){
		this.consoles.setState(this.terminals);
		document.title = 'Terminal';
		setTimeout(()=>App.Layout.closeMenu(), 3000);
	}

}

export default LabsTerminal