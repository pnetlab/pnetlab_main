import React, { Component } from 'react'

class Config extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    
	    this.state = {
	    		configs : [],
	    }
	    
	    this.id = Math.floor(Math.random() * 10000);
	    this.rowData = {};
	}
	
	initial(){
		 
	}
	
	loadData(rowData){
		this.rowData = rowData;
		var configs = JSON.parse(rowData[DISK_CONFIG]);
		if(isset(configs)) {
			configs = Object.keys(configs).map((item)=>{return [item, configs[item]]});
		}else{
			configs = [];
		}
		
		
		this.setState({
				configs: configs,
		})
		
		this.modal();
	}
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#edit_row_modal"+this.id).modal('hide');
		}else{
			$("#edit_row_modal"+this.id).modal();
		}
	}
	
	onSaveHandle(){
		var configs = {};
		for (let i in this.state.configs){
			if(this.state.configs[i][0] != ''){
				configs[this.state.configs[i][0]] = this.state.configs[i][1];
			}
			
		}
		
		axios.request ({
			url: '/uploader/uploader_disks/edit',
		    method: 'post',
		    data:{
		    		data: {
		    			[DATA_KEY] : [{[DISK_ID]: this.rowData[DISK_ID]}],
		    			[DATA_EDITOR] : {[DISK_CONFIG]: JSON.stringify(configs)}
		    		}
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.modal('hide'); 
	    		  this.table.filter();
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	    	  
	      })
	      .catch((error)=>{
	    	  console.log(error);
	    	  Swal('Error', error, 'error');
	      })
	}
	
	onAddHandle(){
		var configs = this.state.configs;
		configs.push(['', '']);
		this.setState({
			configs: configs
		})
	}
	
	render(){
		
		var configHtml = [];
		
		for(let i in this.state.configs){
			configHtml.push(<div style={{display:'flex'}} key={i}>
				<input style={{flex:1, padding:5}} type='text' value={this.state.configs[i][0]} onChange={(event)=>{
						var configs = this.state.configs;
						configs[i][0] = event.target.value;
						this.setState({
							configs: configs
						})
					}
				}></input> 
				<input style={{flex:1, padding:5}}type='text' value={this.state.configs[i][1]} onChange={(event)=>{
					var configs = this.state.configs;
					configs[i][1] = event.target.value;
					this.setState({
						configs: configs
					})
				}
				}></input>
				
			</div>)
		}
		
		
		return (<div className="modal fade" id={"edit_row_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
			
							<div className="modal-header">
								<h4 className="modal-title">{"Disk configuration"}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
								{configHtml}
							</div>
							
							<div  className="modal-footer"> 
								<button type="button" className="btn btn-danger" onClick = {() => {this.onAddHandle()}}>Add</button>
							  	<button type="button" className="btn btn-primary" onClick = {() => {this.onSaveHandle()}}>Save</button>
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					        </div>
			
						</div>
					</div>
				</div>)
	}
}
Config.contextType = TableContext;
export default Config