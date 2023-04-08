import React, { Component } from 'react';
import "./responsive/store.scss";
import SelectFolder from '../../components/func/FuncSelectFolder';

class SystemView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			
		}
		
	}

	render() {
		
		return (
			<>
				<div className='box_padding container'>

					<SelectFolder default={0} ref={c => this.selectFolder = c} link="/store/public/admin/default/folder" folder='/opt/unetlab/labs'></SelectFolder>
					<button onClick={()=>{
						this.selected = this.selectFolder.getSelectPath();
						console.log(this.selected);
					}}>tets</button>
					<button onClick={()=>{
						this.selectFolder.setSelectPath(get(this.selected, []));
					}}>tets2</button>

				</div>

			</>
		);
	}


	componentDidMount() {
		
	}


}

export default SystemView