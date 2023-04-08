import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./responsive/store.scss";
import DeviceItem from '../../components/admin/device/DeviceItem';
import device_downloader from '../../helpers/device_downloader';
import DeviceLog from '../../components/admin/device/DeviceLog';


class DevicesStore extends Component {

	constructor(props) {
		super(props);

		this.state = {
			devices : [],
			search: '',
			filter: '',
			limit: 16,
		}

		this.unit = 16;
		this.devices = [];

		this.downloader = new device_downloader((log)=>{
			if(log != '' && log != this.deviceLog.getLog()){
				this.deviceLog.modal();
				this.deviceLog.setLog(log);
			}
		});
        this.downloader.onFinish = ()=>{
            this.loadDevices();
        }
		
	}


	render() {
		var devices = this.state.devices.slice(0, this.state.limit);
		return (
			<>
				<div className='box_padding'>
					
					<div className="box_flex">
						<div className='title'>
							<i className="fa fa-cog">
							</i>&nbsp;{lang("Devices")}
						</div>
						<div style={{ margin: 'auto 15px auto auto' }}>
							<select className='box_border'
								style={{ padding: 7, borderRadius: 5, lineHeight:'14px' }}
								value={this.state.filter}
								onChange={(event) => { this.setState({ filter: event.target.value }, ()=>{this.filter()}) }}
							>
								<option value=''>{lang("All")}</option>
								<option value='1'>{lang("Added to PNET")}</option>
								<option value='0'>{lang("New Devices")}</option>
							</select>
							&nbsp;
							<input className='box_border'
								style={{ padding: 7, borderRadius: 5,  lineHeight:'14px' }}
								placeholder='Search' value={this.state.search}
								onChange={(event) => { this.setState({ search: event.target.value }) }}
								onBlur={() => { this.filter() }}
							></input>
						</div>
					</div>
					<div className='row'>

						{devices.length == 0
							? <a style={{width:'100%'}}><div style={{width:'100%'}} className="alert alert-warning" role="alert">{lang("No device available")}</div></a>
							: <>
								{devices.map(item => {
									return <DeviceItem key={item[DEVICE_ID]} device={item} onDownload={id => this.downloader.download(id)} onDelete={id => this.downloader.delete(id)}></DeviceItem>
								})}
							</>
						}
					</div>

					{this.state.limit < this.state.devices.length 
						? <div className="box_flex" style={{justifyContent: 'center'}}><div className="loadmore button" onClick={()=>{this.setState({limit: this.state.limit+this.unit})}}>Load More</div></div>
						: ''
					}

				</div>


				<DeviceLog ref={c => this.deviceLog = c}></DeviceLog>

			</>
		);
	}


	componentDidMount() {
		this.loadDevices();
	}

	filter() {

		var filterData = this.devices;
		if(this.state.search != ''){
			var search = this.state.search.toLowerCase();
			filterData = filterData.filter((item) => {
				var itemData = item[DEVICE_NAME] + item[DEVICE_DES];
				return itemData.toLowerCase().indexOf(search) !== -1
			});
		}
		if(this.state.filter !== ''){
			filterData = filterData.filter((item) => {
				return item['available'] == this.state.filter;
			});
		}
		this.setState({ devices: filterData, limit: this.unit });

	}

	loadDevices() {

		App.loading(true, 'Loading...')

		return axios.request({
			url: '/store/public/admin/devices/filter',
			method: 'post',
		})

			.then(response => {
				App.loading(false);
				response = response['data'];
				if (!response['result']) {
					error_handle(response);
					return false;
				} else {
					this.devices = response['data'];
					this.filter();
				}
			})

			.catch(function (error) {
				console.log(error);
				App.loading(false);
				error_handle(error);
				return false;
			})

	}

	

}

export default DevicesStore