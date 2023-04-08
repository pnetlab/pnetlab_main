import React, { Component } from 'react'
import ReactDOM from 'react-dom';
class OffSyslog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			new_logs: 0,
			expand: false,
			logs: [],

		}

		this.levelColor = {
			1: '#c00000',
			2: '#ff3300',
			3: '#ffc000',
			4: '#70ad47',
			5: '#5b9bd5',
			6: '#44484b',
			7: '#676763',
		}

		this.handleClickOutside = this.handleClickOutside.bind(this);


	}


	check() {

		return axios.request({
			url: '/store/public/notice/notice/off_check',
			method: 'post',
		})

			.then(response => {
				response = response['data'];
				if (response['result']) {
					this.setState({
						new_logs: response['data'],
					})
				}
			})

			.catch(function (error) {
				console.log(error);
			})
	}

	readMore(more = 0) {

		var totalLog = this.state.logs.length + more;
		totalLog = totalLog < 10 ? 10 : totalLog;

		return axios.request({
			url: '/store/public/notice/notice/off_read_more',
			method: 'post',
			data: {
				limit: (totalLog)
			}
		})

			.then(response => {
				response = response['data'];
				if (response['result']) {

					var logs = response['data']['logs'];
					this.setState({
						logs: logs,
						new_logs: response['data']['news'],
					})
				}
			})

			.catch(function (error) {
				console.log(error);
			})
	}

	check() {

		return axios.request({
			url: '/store/public/notice/notice/off_check',
			method: 'post',
			
		})

			.then(response => {
				response = response['data'];
				if (response['result']) {
					this.setState({
						new_logs: response['data'],
					})
				}
			})

			.catch(function (error) {
				console.log(error);
			})
	}


	componentDidMount() {
		this.check();
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside(event) {
		const domNode = ReactDOM.findDOMNode(this);
		if (!domNode || !domNode.contains(event.target)) {
			this.setState({
				expand: false,
				new_logs: 0,
			});
		}
	}

	render() {
		return (
			<div>
				<style>{`
					#number_new_logs {
					    position: absolute;
					    top: -7px;
					    right: -3px;
					    background: ${this.state.new_logs > 0 ? '#ff5722' : '#4caf50'};
					    padding: 2px;
					    font-size: 12px;
					    border-radius: 3px;
					    font-weight: bold;
						color: white;
						border: solid thin white;
					}
					.syslog_frame{
						position: absolute;
					    
					    background: white;
					    top: 100%;
						right: 0;
					    color: black;
					    padding: 5px;
					    border-radius: 2px;
					    overflow: auto;
						max-height: 500px;
					    min-width: 300px;
					}
					.syslog_item {
						padding: 5px;
					    border-bottom: solid white;
					    background: #edf9ff;
					}
					.syslog_head {
						display: flex;
					    white-space: nowrap;
					    padding-bottom: 5px;
						font-weight: bold;
					    color: #607d8b;
					}
					.syslog_content {
					    color: #607D8B;
						font-size: 12px;
					}
					.syslog_readmore {
						float: right;
					    color: #00BCD4;
					    font-weight: bold;
						text-decoration: underline;
					}
					.syslog_readall{
						float: left;
					    color: #00BCD4;
					    font-weight: bold;
						text-decoration: underline;
					}
					
					
					`}</style>

				<div style={{ display: 'flex', position: 'relative' }}>

					<i style={{ position: 'relative', fontSize: 20, padding: 0 }} className="button fa fa-bell-o" onClick={() => { 
						this.setState({ expand: !this.state.expand });
						this.readMore();
						}}>
						<label id="number_new_logs">{this.state.new_logs}</label>
					</i>
					{(this.state.expand && this.state.logs.length > 0) ?
						<>

							<div className="syslog_frame box_shadow">

								{this.state.logs.map((item, i) => {

									return (
										<div key={i} className="syslog_item">

											<div className="syslog_head" style={{ color: this.levelColor[item[OFF_NOTICE_LEVEL]] }}>
												{i < this.state.new_logs ? <i className='fa fa-circle' style={{ color: 'orange', fontSize: 10, paddingTop: 2 }}></i> : ''}&nbsp;
		 										<span>{moment(item[OFF_NOTICE_TIME], 'X').format('lll')}</span>&nbsp;&nbsp;
		 									</div>

											<div className="syslog_content"><div dangerouslySetInnerHTML={{ __html: item[OFF_NOTICE_CONTENT] }}></div></div>

										</div>
									)
								})}
								<div>
									<div className="button syslog_readmore" onClick={() => { this.readMore(10) }}>{lang('Read more')}</div>
								</div>
							</div>
						</> : ''}


				</div>
			</div>
		)
	}
}






export default OffSyslog