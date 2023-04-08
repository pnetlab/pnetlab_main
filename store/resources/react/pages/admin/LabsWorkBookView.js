import React, { Component } from 'react';
import "./responsive/workbook.scss";
import HTMLView from '../../components/lab/workbook/viewer/HTMLView';
import PDFView from '../../components/lab/workbook/viewer/PDFView';
import CheckLabSession from '../../components/realtime/CheckLabSession';


class LabsWorkbookView extends Component {
	/** when people click on workbook to open in a new tab */
	constructor(props) {
		super(props);
		this.state = {
			workbook: {}
		}
		this.wbName = get(App.parsed['name'], null);
	}

	render() {
		var type=get(this.state.workbook.type, 'pdf');
		var name=get(this.state.workbook.name, '');
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
				
				<div className="wb-header" style={{height:25}}>
					<h4 className="wb-title" style={{ fontSize: 'medium'}}>{name}</h4>
				</div>
				
				{type == 'html'
					? <HTMLView key={name} workbook={this.state.workbook}></HTMLView>
					: <PDFView key={name} workbook={this.state.workbook}></PDFView>
				}

				<CheckLabSession callback={(result)=>{
						if(result == null || result == '') window.close();
				}}></CheckLabSession>
				
				
			</div>
		);
	}

	componentDidMount(){
		this.loadWorkbook()
		document.title = this.wbName;
		setTimeout(()=>App.Layout.closeMenu(), 3000);
	}


	loadWorkbook() {
		if(!this.wbName) return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook`,
            method: 'get',
            params: {
                name: this.wbName,
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbook = response['message'];
                    this.setState({ workbook: workbook });
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                error_handle(error);
            })
    }

}

export default LabsWorkbookView