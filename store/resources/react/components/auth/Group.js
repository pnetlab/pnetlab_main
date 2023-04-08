import React, { Component } from 'react'
import Style from '../common/Style.js'
import Member from './Member.js'
import FuncPermission from './FuncPermission.js'
import FuncAddGroup from './FuncAddGroup.js'
import FuncDelGroup from './FuncDelGroup.js'
import FuncEditGroup from './FuncEditGroup.js'
import FuncRefreshGroup from './FuncRefreshGroup.js'
import FuncAddMem from './FuncAddMem.js'
import FuncSpecial from './FuncSpecial.js'

class Group extends Component {
	
	constructor(props) {
	    super(props);
	    this.state={
	    		members:{},
	    		groups:{},
	    		expand: false,
	    		loading: false,
	    		dragover: '',
	    };
	    this.loaded = false;
	    this.type = 'group';
	    this.onclickHandle = this.onclickHandle.bind(this);
	    this.initial();
	  }
	
	initial(){
		this.id = get(this.props.group[GROUP_ID], '');
		
	}
	
	createMembers(){
		let members = this.state.members;
		let output = [];
		if(count(members) == 0) return output;
		
		for(let i = 0; i < count(members); i++ ){
			let key = members[i][AUTHEN_ID];
			output.push(<Member key={key} frame={this.props.frame} member={members[i]} group={this.props.group} parent={this} expand={true}></Member>)
		}
		return output;
	}
	
	createGroups(){
		var groups = this.state.groups;
		var output = [];
		if(count(groups)== 0) return output;
		
		for(let i = 0; i < count(groups); i++){
			let key = groups[i][GROUP_ID];
			output.push(<Group key={key} frame={this.props.frame} group={groups[i]} parent={this}></Group>)
		}
		
		return output;
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
	
	componentDidMount() {
		if(this.props.expand){
			this.refresh();
		}
		
	}
	
	loadInfo(){
		
		if(!this.loaded){
			this.setState({loading: true});
			axios.request ({
			    url: '/auth/account/getGroupInfo',
			    method: 'post',
			    data: {
			    	[GROUP_ID]: this.props.group[GROUP_ID]
			    }})
		      .then(response => { 
		    	  this.setState({loading: false});
		    	  response = response['data'];
		    	  if(response['result']){
		    		  this.setState({ 
		    			  groups : response['data']['groups'], 
		    			  members: response['data']['members'],
		    		  	  
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
	
	
	
	drawFunctionBar(){
		
		let functionBar = [];
		let functions = this.props.group['function'];
		
		if(isset(functions[FUNC_CUS_TABLE])){
			functionBar.push(<FuncSpecial key={"func_special"+this.id} id={"func_special"+this.id} group={this.props.group}></FuncSpecial>);
		}
		
		if(isset(functions[FUNC_ADD_MEMBER])){
			functionBar.push(<FuncAddMem key={"func_addmem"+this.id} id={"func_addmem"+this.id} group={this.props.group} parent={this}></FuncAddMem>);
		}
		
		if(isset(functions[FUNC_ADD_CHILD_GROUP])){
			functionBar.push(<FuncAddGroup key={"func_addgroup"+this.id} id={"func_addgroup"+this.id} group={this.props.group} parent={this}></FuncAddGroup>);
		}
		
		if(isset(functions[FUNC_EDIT_GROUP])){
			functionBar.push(<FuncEditGroup key={"func_editgroup"+this.id} id={"func_editgroup"+this.id} group={this.props.group} parent={this}></FuncEditGroup>);
		}
		
		if(isset(functions[FUNC_DEL_GROUP])){
			functionBar.push(<FuncDelGroup key={"func_delgroup"+this.id} id={"func_delgroup"+this.id} group={this.props.group} parent={this}></FuncDelGroup>);
		}
		
		if(isset(functions[FUNC_EDIT_PERMISSION])){
			functionBar.push(<FuncPermission key={"func_permission"+this.id} id={"func_permission"+this.id} group={this.props.group}></FuncPermission>);
		}
		
		if(isset(functions[FUNC_VIEW_GROUP])){
			functionBar.push(<FuncRefreshGroup key={"func_refresh"+this.id} id={"func_refreshgroup"+this.id} group={this.props.group} parent={this}></FuncRefreshGroup>);
		}
		return functionBar;
		
	}
	
	drag(event){
		this.props.frame.setDragComp(this);
	}
	
	drop(event){
		event.preventDefault();
		var object = this.props.frame.getDragComp();
		if(object.type == 'group'){
			
			if(this.props.root){
				this.changeGroupOwner(this.props.member[AUTHEN_ID], this.props.group[GROUP_ID], object.props.group[GROUP_ID])
			}else{
				this.changeGroupParent(this.props.group[GROUP_ID], object.props.group[GROUP_ID]);
			}
			
		}else{
			this.dragUserToGroup(this.props.group[GROUP_ID], object.props.group[GROUP_ID], object.props.member[AUTHEN_ID]);
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
	
	changeGroupParent(parentID, groupID){
		axios.request ({
		    url: '/auth/account/change_group_parent',
		    method: 'post',
		    data:{
		    		[GROUP_PARENT]: parentID, 
			    	[GROUP_ID]: groupID
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
	
	changeGroupOwner(memberID, parentID, groupID){
		axios.request ({
		    url: '/auth/account/group_dragto_member',
		    method: 'post',
		    data:{
		    		[GROUP_PARENT]: parentID, 
			    	[GROUP_ID]: groupID,
			    	[AUTHEN_ID]: memberID,
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
	
	dragUserToGroup(parentID, groupID, userID){
		axios.request ({
		    url: '/auth/account/member_dragto_group',
		    method: 'post',
		    data:{
		    		[GROUP_PARENT]: parentID, 
			    	[GROUP_ID]: groupID,
			    	[AUTHEN_ID]: userID,
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
	
	  render () {
		  this.initial();
		  return(
				  <React.Fragment>
					  <Style id="authen_bar">{`
						  .authen_bar{
						  		border-bottom:dashed 1px darkgray;
					  			cursor: pointer;
					  			display: flex;
					  			padding: 10px 0px 10px 10px;
					  		}
					  		.authen_expand {
					  			margin-left: 20px; 
					  			overflow: hidden;
					  		}
					  		.authen_func {
					  			margin: auto 15px auto auto;
					  			display: flex;
					  		}
					  		.authen_bar:hover{
					  			background-color: #f4f4f4;
					  		}
					  		
					  		.authen_bar_dragover{
					  			background-color: #f4f4f4;
					  		}
					  `}</Style>
					  
					  <div className={"authen_bar " + this.state.dragover}>
					  
						  		<div title={this.props.group[GROUP_NOTE]} draggable={true} id={'group_'+this.id}
						  		  onClick={this.onclickHandle} 
						  		  onDragStart={(event)=>{this.drag(event)}} 
								  onDrop={(event)=>{this.drop(event)}} 
						  		  onDragEnter={(event)=>{this.onDragEnter(event)}}
						  		  onDragOver={(event)=>{event.preventDefault()}}
							      onDragLeave={(event)=>{this.dragLeave(event)}}  
						  		>
						  		
						  		
						  		<i className="fa fa-cube"></i> {this.props.group[GROUP_NAME]}</div>
						  		
						  		<div className="authen_func">
						  			{this.drawFunctionBar()} 
						  		</div>
					  </div>
					  
					  <div className="authen_expand group_expand" style={{height:this.state.expand?'auto':0}}>
					     {this.createGroups()}
					     {this.createMembers()}
					     {this.state.loading?(<i className="fa fa-circle-o-notch fa-spin"></i>):''}
					  </div>
					  
				  </React.Fragment>
				  );
	  }
}
export default Group
	  