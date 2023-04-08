import React, { Component } from 'react'
import Style from '../common/Style.js'
import Group from './Group.js'

import FuncRefreshGroup from './FuncRefreshGroup.js'
import FuncDelMem from './FuncDelMem.js'
import FuncEditMem from './FuncEditMem.js'
class Member extends Component {
	
	constructor(props) {
	    super(props);
	    this.state={
	    		groups:{},
	    		expand: false,
	    		loading: false
	    };
	    this.type = 'member';
	    this.loaded = false;
	    this.onclickHandle = this.onclickHandle.bind(this);
	    this.initial();
	  }
	
	initial(){
		this.id = get(this.props.id, '');
		this.member = get(this.props.member, '');
	    this.group = get(this.props.group, '');
	}
	
	componentDidMount() {
		if(this.props.expand){
			this.refresh();
		}
		
	}
	
	createGroups(){
		let groups = this.state.groups;
		let output = [];
		if(count(groups)== 0) return output;
		
		for(let i = 0; i < count(groups); i++){
			let key = groups[i][global.GROUP_ID];
			output.push(<Group key={key} frame={this.props.frame} group={groups[i]} parent={this}></Group>)
		}
		return output;
	}
	
	drag(event){
		this.props.frame.setDragComp(this);
	}
	
	drop(event){
		event.preventDefault();
		var object = this.props.frame.getDragComp();
		if(object.type == 'group'){
			this.changeGroupOwner(this.props.member[global.AUTHEN_ID], this.props.group[global.GROUP_ID], object.props.group[global.GROUP_ID]);
		}
		
		this.setState({dragover: ''});
	}
	
	onDragEnter(event){
		event.preventDefault();
		this.setState({dragover: 'authen_bar_dragover'});
	}
	
	dragLeave(event){
		event.preventDefault();
		this.setState({dragover: ''});
	}
	
	changeGroupOwner(memberID, parentID, groupID){
		axios.request ({
		    url: '/auth/account/group_dragto_member',
		    method: 'post',
		    data:{
		    		[global.GROUP_PARENT]: parentID, 
			    	[global.GROUP_ID]: groupID,
			    	[global.AUTHEN_ID]: memberID,
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.refresh();
	    		  var object = this.props.frame.getDragComp();
	    		  object.props.parent.refresh();
	    		  
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(function (error) {
	    	  Swal('Error', error, 'error');
	      })
	}
	
	
	loadInfo(){
		
		if(!this.loaded){
			this.setState({loading: true});
			axios.request ({
			    url: '/auth/account/getMemberInfo',
			    method: 'post',
			    data: {
			    	[global.GROUP_PARENT]: this.group[global.GROUP_ID],
			    	[global.AUTHEN_ID]: this.member[global.AUTHEN_ID]
			    }})
		      .then(response => {
		    	  this.setState({loading: false});
		    	  response = response['data'];
		    	  if(response['result']){
		    		  this.setState({ 
		    			  groups : response['data']['groups'], 
		    		  });
		    		  this.loaded = true;
		    	  }else{
		    		  Swal(response['message'], response['data'], 'error');
		    	  }
		      })
		      .catch(function (error) {
		    	  this.setState({loading: false});
		    	  Swal('Error', error, 'error');
		      })
		}
		
	}
	
	refresh(){
		this.loaded = false;
		this.loadInfo();
		this.setState({expand:true});
	}
	
	refreshParent(){
		if(isset(this.props.parent)) this.props.parent.refresh();
	}
	
	onclickHandle(){
		this.loadInfo();
		this.setState({expand: !this.state.expand});
	}
	
	drawFunctionBar(){
			
			let functionBar = [];
			let functions = this.props.group['function'];
			
			functionBar.push(<FuncEditMem key={"func_edit"+this.id} id={"func_edit"+this.id} group={this.props.group} parent={this}></FuncEditMem>);
			
			functionBar.push(<FuncDelMem key={"func_delete"+this.id} id={"func_delete"+this.id} group={this.props.group} parent={this}></FuncDelMem>);
			
			if(isset(functions[global.FUNC_VIEW_GROUP])){
				functionBar.push(<FuncRefreshGroup key={"func_refresh"+this.id} id={"func_refreshgroup"+this.id} group={this.props.group} parent={this}></FuncRefreshGroup>);
			}
			
			return functionBar;
			
		}
	
	  render () {
		  this.initial();
		  
		 var current = moment().format('X');
     	 var inteval = Number(current) - Number(this.member[AUTHEN_ONLINE]);
     	 var userIcon = ''
     	 if(inteval < 300){
     		userIcon = <span className="user_icon_frame">
     						<i title={'Online: ' + moment(this.member[AUTHEN_ONLINE], 'X').format(DATE_FORMAT)} className="fa fa-user" style={{cursor:'pointer'}}></i>
     						<i className="fa fa-circle user_icon_online" style={{color:'green', cursor:'pointer'}}></i>
     					</span>
     	 }else{
     		userIcon = <span className="user_icon_frame">
							<i title={'Offline: ' + moment(this.member[AUTHEN_ONLINE], 'X').format(DATE_FORMAT)} className="fa fa-user" style={{cursor:'pointer'}}></i>
							<i className="fa fa-circle user_icon_online" style={{color:'red', cursor:'pointer'}}></i>
						</span>
     	 }
		  
		  return(
				  <div>
				  		<Style id="member_style">{`
				  			.user_icon_frame{
				  		    	position: relative;
				  			}
				  			.user_icon_online{
					  			position: absolute;
						  	    font-size: 7px;
						  	    left: -5px;
					  		}
				  			
				  		`}</Style>
					  <div className={"authen_bar " + this.state.dragover} 
					  >
				  		<div 
				  		  onClick={this.onclickHandle}
				  		  draggable={true} 
						  onDragStart={(event)=>{this.drag(event)}} 
						  onDrop={(event)=>{this.drop(event)}} 
				  		  onDragEnter={(event)=>{this.onDragEnter(event)}}
				  		  onDragOver={(event)=>{event.preventDefault()}}
					      onDragLeave={(event)=>{this.dragLeave(event)}}  
				  		>
				  		
				  		
				  		{userIcon}&nbsp;{this.member[AUTHEN_USERNAME]}</div>
				  		<div className="authen_func">
				  			{this.drawFunctionBar()} 
				  		</div>
				  	  </div>
					  
					  <div className="authen_expand member_expand" style={{height:this.state.expand?'auto':0}}>
					     {this.createGroups()}
					     {this.state.loading?(<i className="fa fa-circle-o-notch fa-spin"></i>):''}
					  </div>
				  </div>
				  );
	  }
}
export default Member
	  