import React, { Component } from 'react'
import ReactDOM from 'react-dom';
class Syslog extends Component{
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    		new_logs : 0,
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
	
	readMore(more = 0){
		
		var totalLog = this.state.logs.length + more;
		totalLog = totalLog < 10 ? 10 : totalLog;
		
		return axios.request ({
		    url: '/store/public/notice/notice/read_more',
		    method: 'post',
		    data: {
		    	inteval: (totalLog)
		    }
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  
	    		 var logs = response['data']['logs'];
	    		 this.setState({
	    			 logs: logs,
	    			 new_logs: response['data']['new_logs'],
	    		 })
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	      })
	}
	
	
	readAllLog(){
		
		return axios.request ({
			url: '/store/public/notice/notice/edit',
			method: 'post',
			data: {
				data:{
					[DATA_KEY]:[{[NOTICE_SEEN]: 0}],
					[DATA_EDITOR]: {[NOTICE_SEEN]: 1}
				}
			}
		})
		
		.then(response => {
			response = response['data'];
			if(response['result']){
				var logs = this.state.logs;
				for(let i in logs){
					logs[i][NOTICE_SEEN] = 1;
				}
				
				var new_logs = 0;
				
				this.setState({
					logs: logs,
					new_logs: new_logs,
				})
			}
		})
		
		.catch(function (error) {
			console.log(error);
		})
	}
	
	
	readLog(index){
		if (this.state.logs[index][NOTICE_SEEN] == 1) return;
		return axios.request ({
			url: '/store/public/notice/notice/edit',
			method: 'post',
			data: {
				data:{
					[DATA_KEY]:[{[NOTICE_ID]: this.state.logs[index][NOTICE_ID]}],
					[DATA_EDITOR]: {[NOTICE_SEEN]: 1}
				}
			}
		})
		
		.then(response => {
			response = response['data'];
			if(response['result']){
				var logs = this.state.logs;
				logs[index][NOTICE_SEEN] = 1;
				var new_logs = this.state.new_logs - 1;
				
				this.setState({
					logs: logs,
					new_logs: new_logs,
				})
			}
		})
		
		.catch(function (error) {
			console.log(error);
		})
	}
	
	
	componentDidMount() {
		this.readMore(10);
	    document.addEventListener('mousedown', this.handleClickOutside);
	    this.checklogInterval = setInterval(()=>{this.readMore()}, 120000);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		clearInterval(this.checklogInterval);
    }
  
    handleClickOutside(event) {
    	const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.setState({
            	expand: false
            });
        }
	}
	
	render(){
		return (
				<div>
				<style>{`
					#number_new_logs {
					    position: absolute;
					    top: -7px;
					    right: -3px;
					    background: ${this.state.new_logs > 0? '#ff5722': '#4caf50'};
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
					
				 <div style={{display: 'flex', position:'relative'}}>
				 
			 		<i style={{position: 'relative', fontSize: 20, padding:0}} className="button fa fa-bell-o" onClick={()=>{this.setState({expand: !this.state.expand})}}>
			 			<label id="number_new_logs">{this.state.new_logs}</label>
			 		</i>
			 		{(this.state.expand && this.state.logs.length > 0)?
			 		<>
				 		
				 		<div className="syslog_frame box_shadow">
				 			
		 					{this.state.logs.map((item, i)=>{
								var variable = {};
								try { variable = JSON.parse(item[NOTICE_VARIABLE])} catch(error){};
		 						return (
		 								<div key={i} className="syslog_item" onClick={()=>{this.readLog(i)}}>
		 									<div className="syslog_head" style={{color:this.levelColor[item[NOTICE_LEVEL]]}}>
		 										{item[NOTICE_SEEN]==0 ? <i className='fa fa-circle' style={{color:'orange', fontSize:10, paddingTop:2}}></i> : ''}&nbsp;
		 										<span>{moment(item[NOTICE_TIME], 'X').format('lll')}</span>&nbsp;&nbsp;
		 									</div>
		 									 
		 									<div className="syslog_content"><a href={get(item[NOTICE_ACTION], '#')}>
												 <div dangerouslySetInnerHTML={{__html:lang(HtmlDecode(item[NOTICE_CONTENT]), {
													 [NOTICE_UNAME]: item[NOTICE_UNAME],
													 [NOTICE_FIRE_UNAME]: item[NOTICE_FIRE_UNAME],
													  ...variable
													  } )}}></div></a></div>
		 								</div>
		 						)
		 					})}
							<div>
								<div className="button syslog_readall" onClick={()=>{this.readAllLog()}}>{lang('Mark as read')}</div>
								<div className="button syslog_readmore" onClick={()=>{this.readMore(10)}}>{lang('Read more')}</div>
							</div>		
				 		</div>
			 		</>:''}
			 		
			 		
			 	</div>
			 	</div>
		)
	}
}






export default Syslog