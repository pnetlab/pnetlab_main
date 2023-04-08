import React, { Component } from 'react'
import Style from '../common/Style'

class FuncSort extends Component {
	
	/**
	 * <FuncSort 
	 * 		  parent={this} 
		  	  onDrag={item => {}}
		  	  src_id = {this.props.rowData[SOLUTION_ID]}
		  	  src_weight = {this.props.rowData[SOLUTION_WEIGHT]}
		  	  link = {this.table[STRUCT_TABLE][LINK_SORT]}
		  	  onSuccess={(des)=>{}}
	   >children</FuncSort>
	 */
	
	constructor(props, context) {
	    super(props);
	    this.state={
	    		dragover: ''
	    }
	    
	   
	}
	
	
	drag(event){
		event.dataTransfer.setData('src_id', this.props.src_id);
		global.src_weight = this.props.src_weight;
		if(this.props.onDrag) this.props.onDrag(this)
	}
	
	drop(event){
		event.preventDefault();
		var src_id = event.dataTransfer.getData("src_id");
		this.changeOrder(src_id, this.props.src_id);
		this.setState({dragover: ''});
		delete(global.src_weight);
	}
	
	dragOver(event){
		
		event.preventDefault();
		var src_weight = global.src_weight;
		
		if(Number(src_weight) > Number(this.props.src_weight)){
			this.setState({dragover: 'dragover down'});
		}else{
			this.setState({dragover: 'dragover up'});
		}
		
	}
	
	dragLeave(event){
		event.preventDefault();
		this.setState({dragover: ''});
	}
	
	changeOrder(sourcePid, destPid){
		if(sourcePid==destPid) return;
		axios.request ({
		    url: this.props.link,
		    method: 'post',
		    data:{
		    		data:{
		    			['src_id']: sourcePid, 
		    			['dest_id']: destPid
		    		}
		    	}
			})
	      .then(response => {
	    	  response = response['data'];
	    	  if(response['result']){
	    		  this.props.onSuccess(this);
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error')
	    	  }
	    	  
	      })
	      
	      .catch(function (error) {
	    	  console.log(error);
	    	  Swal('Error', error.message, 'error');
	      })
	}
	
	
	
	render () {
		  return(
				  <>
				  <Style id='sort_dragable_css'>{`
					  .sort_item.dragover.up::before{
					  		content: ' ';
						    width: 100%;
				  			border: solid #457fca thin;
				  			position: absolute;
				    		top: 0;
				    		left: 0;
				  	  }
					  .sort_item.dragover.down::before{
					  		content: ' ';
						    width: 100%;
				  			border: solid #457fca thin;
				  			position: absolute;
				    		bottom: 0;
				    		left: 0;
				  	  }
					  .sort_item {
						  padding:5px;
					  	  cursor: pointer;
					      position: relative;
					  }
					  .sort_item * {
					      pointer-events: none;
					  }
				  `}</Style>
				  
			  		<div draggable={true} className={'sort_item '+ this.state.dragover}
					  onDragStart={(event)=>{this.drag(event)}} 
					  onDrop={(event)=>{this.drop(event)}} 
			  		  onDragOver={(event)=>{event.preventDefault()}}
			  		  onDragEnter={(event)=>{this.dragOver(event)}}
				      onDragLeave={(event)=>{this.dragLeave(event)}}
			  		>
			  		
			  			{this.props.children}
			  		
			  		</div>
			  	</>
		)  
	}
}

export default FuncSort
	  