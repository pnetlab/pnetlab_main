import React, { Component } from 'react'
import InputDate from '../input/InputDate' 
import InputHtml from '../input/InputHtml' 
import Style from '../common/Style' 
import BtnLoad from '../button/BtnLoad'
import Table from '../table/Table'
import Pagination from '../table/Pagination'
import MainTable from '../table/MainTable'
import scss from '@root/assets/css/constants'

class FuncEdit extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.id = this.props.id;
	    this.modal = this.table[this.id];
	    
	   
	}
	
	initial(){
		this.rowData = this.props.rowData;
 		try {
			this.value = JSON.parse(this.props.value);
			
			var style={};
			
			if(isset(this.rowData[CUS_TYPE])){
        		if(isset(this.table.mapping[CUS_TYPE_COLOR])){
        			var color = this.table.mapping[CUS_TYPE_COLOR][this.rowData[CUS_TYPE]];
        			if(isset(color)){
        				style={color:color, fontWeight:'bold'};
        			}
        		}
        	}
			
			var valueHtml = [];
			for (let i in this.value){
				var item = this.value[i];
				if(i == 4){
					valueHtml.push(<div key={i} style={{color: '#0032f4', fontWeight:'bold'}}>Xem thêm...</div>);
					break;
				}else{
					valueHtml.push(<div className='project_status_item' key={i}>
						<div className="project_status_header">
						<div className = "project_status_time">
							<i className="fa fa-calendar"></i>&nbsp;<span>{moment(item[CUS_UPDATE_TIME], "X").format(DATE_FORMAT)}</span>
						</div>
						<div className="project_status_uname">
							<i className="fa fa-user"></i>&nbsp;<span>{item[CUS_UPDATE_UNAME]}</span>
						</div>
							</div>
							<div className = "project_status_text">
								<span style={style} className="project_status_content" dangerouslySetInnerHTML={{__html: output_secure(HtmlDecode(item[CUS_UPDATE_NOTE]))}}></span>
							</div>
						</div>)
				}
			}
			
			this.valueComp = <>
				<Style id="project_status_css" >{`
								.project_status_item{
									margin-bottom: 10px;
								}
			  					.project_status_text{
			  					    overflow: hidden;
			  						max-height: 50px;
									text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
			  					}
			  				
			  					.project_status_uname{
			  						
			  						padding: 5px;
			  						color: ${scss.primary_color};
			  					}
			  					
			  					.project_status_time{
			  						padding: 5px;
			  					    color: ${scss.primary_color};
			  				    	white-space: nowrap;
			  					}
			  					
			  					@media only screen and (min-width: 768px) {
			  					   .project_status_header{
			  					   		display: flex;
			  					   		font-size: 12px;
			  					   }
			  					}
			  					@media only screen and (max-width: 768px) {
			  						.project_status_header{
			  					   		display: none;
			  					   }
			  					}
			  					
			  				`
					}</Style>
					
				 
					{valueHtml}
				
				
			</>
	    } catch(e) {
	    	console.log(e);
	    	this.valueComp='';
	    }
		
		
	}
	
	
	
	render () {
		  this.initial();
		  return(
				  <div>
				  
				  	 <Style id="update_project_status_css">{`
				  		 
				  		 .status_frame_add{
				  		 	background: #5f91d1;
				  	 		padding: 15px;
				  	 		border-radius: 4px;
				  	 	 }
				  	 	.status_content{
				  	 		width: 100%;
					  	    height: 100px;
					  	    background: white;
				  	 		border-radius: 4px;
				  	 		padding: 15px;
				  	 	}
				  	 	
				  	 	.status_time{
				  	 		padding: 5px;
					  	    border-radius: 4px;
					  	    border: none;
				  	 	}
				  	 	.status_table td {
				  	 		border: none;
				  	 	}
				  		 
				  	 `}</Style>
				  
					 <div style={{cursor:'pointer', minHeight: 20}} 
					 
					 onClick={() => {
						 this.modal.modal();
						 this.modal.loadData(this.rowData);
					 }
					 }> {this.valueComp} </div>
					 
				</div>
		)  
	}
}

FuncEdit.contextType = TableContext;
export default FuncEdit
	  