import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import Input from '../input/Input'
import Style from '../common/Style'


class RowNumber extends Component { 
	
	constructor(props) {
	    super(props);
	}
	
	processData(){
		this.total = 0;
	    this.call = {};
	    this.care = {};
	    this.freq = 0;
	    
		var datas = this.props.datas;
		for (let i in datas){
			var data = datas[i];
			this.total += Number(data[DARBOARD_TOTAL]);
			this.freq += Number(data[DARBOARD_FREQ]);
			var dataCall = JSON.parse(data[DARBOARD_CALL]);
			for (let j in dataCall){
				if(!isset(this.call[j])) this.call[j] = 0;
				this.call[j] += Number(dataCall[j])
			}
			
			var dataCare = JSON.parse(data[DARBOARD_CARE]);
			for (let j in dataCare){
				if(!isset(this.care[j])) this.care[j] = 0;
				this.care[j] += Number(dataCare[j])
			}
			
		}
		
		
		
	}
	
	render () {
		this.processData();
		
		var dataCare = [];
		for (let i in this.care){
			dataCare.push(<div key={i} className="number_box_item" title={i + ": " + this.care[i]}><div className="number_box_title">{i + ": "}</div><div className='number_box_value'>{this.care[i]}</div></div>);
		}
		var dataCall = [];
		for (let i in this.call){
			dataCall.push(<div className="number_box_item" key={i} title={i + ": " + this.call[i]}><div className="number_box_title">{i + ": "}</div><div className='number_box_value'>{this.call[i]}</div></div>);
		}
		  
		  return(
				  <div className='row'>
				  		<Style id='table_number'>{`
				  			.table_number{
				  				font-size: 14px;
				  				color: white;
				  				display: flex;
				  				flex-wrap: wrap;
				  			}
				  			.number_box_item {
				  				display: flex;
				  				width: 100%;
				  				text-align: left;
				  				
				  			}
					  		.number_box_title{
					  			overflow: hidden;
							    text-overflow: ellipsis;
							    width: 70%;
				  			}
					  		.number_box_value {
					  			overflow: hidden;
					  			text-overflow: ellipsis;
					  			font-weight: bold;
					  			width: 30%
					  		}
				  		`}</Style>
					  <div className = 'col-sm-6 col-md-3 d-flex'>
					  	<NumberItem icon='fa fa-group' color='#7E57C2' title='Tổng khách hàng'>{this.total}</NumberItem>
					  </div>
	  
					  <div className = 'col-sm-6 col-md-3 d-flex'>
					  	<NumberItem icon='fa fa-phone' color='#42A5F5' title='Cuộc gọi'>
					  		<div className='table_number'>
					  			{dataCall}
					  		</div>
					  	</NumberItem>
					  </div>
					  
					  <div className = 'col-sm-6 col-md-3 d-flex'>
					  	<NumberItem icon='	fa fa-diamond' color='#FFB300' title='Quan tâm'>
					  	<div className='table_number'>
				  			{dataCare}
				  		</div>
					  	</NumberItem>
					  </div>
					  <div className = 'col-sm-6 col-md-3 d-flex'>
					  	<NumberItem icon='fa fa-reply-all' color='#66BB6A' title='KH xuất hiện lại'>{this.freq}</NumberItem>
					  </div>
				  	
				  </div>
				  );
	}
}

export default RowNumber; 


class NumberItem extends Component {

    render() {
    	return(
    		<>
    		
    		<Style id='number_item_css'>{`
    			.number_item{
    				margin: 15px 0px;
		    	    width: 100%;
    				box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
		    	    border-radius: 2px;
    				position: relative;
    				min-height: 150px;
    			}
	    		.number_icon {
	    			padding: 15px;
	    			color: white;
	    			position: absolute;
	    		    right: 0px;
	    		    top: 0px;
	    		}
	    		.number_icon i{
	    			font-size: 50px;
		    		font-size: 36;
		    	    opacity: 0.5;
	    		}
	    		
	    		.number_content{
	    			padding: 15px;
	    		}
	    		.number_title{
		    		display: block;
	    			font-size: 18px;
		    	    white-space: nowrap;
		    	    overflow: hidden;
		    	    text-overflow: ellipsis;
	    			color: white;
	    			font-weight:bold;
	    		}
	    		.number_child{
		    	    font-weight: bold;
		    	    font-size: 30px;
		    	    margin-top: 15px;
		    	    color: white;
		    	    font-weight: bold;
		    	    white-space: nowrap;
		    	    overflow: hidden;
		    	    text-overflow: ellipsis;
		    	    text-align: center;
		    	    align-items: center;
		    	    display: flex;
		    	    justify-content: center;
			    	
	    		}
    			
    		`}</Style>
    		
    		<div className='number_item' style={{background: this.props.color}}>
    			<div className='number_icon' ><i className={this.props.icon}></i></div>
    			<div className='number_content'>
    				<div className='number_title'>{this.props.title}</div>
    				<div className='number_child'>{this.props.children}</div>
    			</div>
    		</div>
    		</>
    	);
    	
    }
}


class NumberItem1 extends Component {

    render() {
    	return(
    		<>
    		
    		<Style id='number_item_css'>{`
    			.number_item{
    				margin: 15px 0px;
		    	    width: 100%;
    				box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
		    	    border-radius: 2px;
    			}
	    		.number_icon {
	    			padding: 15px;
	    			color: white
	    		}
	    		.number_icon i{
	    			font-size: 50px;
	    			
	    			
	    		}
	    		.number_content{
	    			padding: 15px;
	    		}
	    		.number_title{
	    			text-transform: uppercase;
		    		display: block;
		    	    font-size: 18px;
		    	    white-space: nowrap;
		    	    overflow: hidden;
		    	    text-overflow: ellipsis;
	    		}
	    		.number_child{
	    			display: block;
		    	    font-weight: bold;
		    	    font-size: 18px;
		    	    margin-top: 10px;
		    	}
	    		}
    			
    		`}</Style>
    		
    		<div className='number_item' style={{display:'flex'}}>
    			<div className='number_icon' style={{background: this.props.color}}><i className={this.props.icon}></i></div>
    			<div className='number_content'>
    				<div className='number_title'>{this.props.title}</div>
    				<div className='number_child'>{this.props.children}</div>
    			</div>
    		</div>
    		</>
    	);
    	
    }
}
	  