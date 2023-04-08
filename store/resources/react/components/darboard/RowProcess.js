import React, { Component } from 'react'
import {Chart} from 'primereact/chart';
import Style from '../common/Style'


class RowProcess extends Component { 
	
	constructor(props) {
	    super(props);
	    
	    this.data = {};
	    
	    this.callColors = {};
	    this.typeColors = {};
	    this.typeNames = {};
	    this.callNames = {};
	    
	    
	} 
	
	processData(){
		
		var schedule = this.props.schedule;
		var datas = this.props.datas;
		var field = this.props.field;
		
		this.typeColors = get(this.props.typeColors, {});
		this.typeNames = get(this.props.typeNames, {});
		this.callNames = get(this.props.callNames, {});
		this.callColors = get(this.props.callColors, {});
		
		var dataSch = {};
		
		var timeList = Object.keys(schedule);
		
		var index = 0;
		
		for ( let i in datas){
			var data = datas[i];
			
			if(typeof data[PROCESS_CALL] == 'string') data[PROCESS_CALL] = JSON.parse(data[PROCESS_CALL]);
			if(typeof data[PROCESS_CARE] == 'string') data[PROCESS_CARE] = JSON.parse(data[PROCESS_CARE]);
			
			if(data[PROCESS_TIMEUNIT] >= schedule[timeList[index]][0] && data[PROCESS_TIMEUNIT] < schedule[timeList[index]][1]){
				if(!dataSch[timeList[index]]){
					dataSch[timeList[index]] = data
				}else{
					for (let j in data[PROCESS_CALL]){
						dataSch[timeList[index]][PROCESS_CALL][j] += Number(data[PROCESS_CALL][j])
					}
					for (let j in data[PROCESS_CARE]){
						dataSch[timeList[index]][PROCESS_CARE][j] += Number(data[PROCESS_CARE][j])
					}
				}
			} else if(schedule[timeList[index+1]] && data[PROCESS_TIMEUNIT] >= schedule[timeList[index+1]][0] && data[PROCESS_TIMEUNIT] < schedule[timeList[index+1]][1]){
				index ++;
				if(!dataSch[timeList[index]]){
					dataSch[timeList[index]] = data
				}else{
					for (let j in data[PROCESS_CALL]){
						dataSch[timeList[index]][PROCESS_CALL][j] += Number(data[PROCESS_CALL][j])
					}
					for (let j in data[PROCESS_CARE]){
						dataSch[timeList[index]][PROCESS_CARE][j] += Number(data[PROCESS_CARE][j])
					}
				}
			} else {
				for (let j in timeList){
					if(data[PROCESS_TIMEUNIT] >= schedule[timeList[j]][0] && data[PROCESS_TIMEUNIT] < schedule[timeList[j]][1]){
						index = Number(j);
						if(!dataSch[timeList[index]]){
							dataSch[timeList[index]] = data
						}else{
							for (let j in data[PROCESS_CALL]){
								dataSch[timeList[index]][PROCESS_CALL][j] += Number(data[PROCESS_CALL][j])
							}
							for (let j in data[PROCESS_CARE]){
								dataSch[timeList[index]][PROCESS_CARE][j] += Number(data[PROCESS_CARE][j])
							}
						}
						
						break;
					}
				}
			}
			
			
			
		}
		
		var labels = [];
		
		var datasets = {};
		if(field == PROCESS_CALL){
			var order = Object.values(this.callNames);
			for (let j in this.callNames){
				if(!datasets[this.callNames[j]]){
					datasets[this.callNames[j]] = {
							label : j,
							backgroundColor: get(this.callColors[this.callNames[j]], 'darkgray'),
							data : [],
					}
				}
			}
		}else{
			var order = Object.values(this.typeNames);
			for (let j in this.typeNames){
				if(!datasets[this.typeNames[j]]){
					datasets[this.typeNames[j]] = {
							label : j,
							backgroundColor: get(this.typeColors[this.typeNames[j]], 'darkgray'),
							data : [],
					}
				}
			}
		}
		
		for (let i in dataSch){
			labels.push(moment(i, 'X').format('D/M/Y'));
			
			if(field == PROCESS_CALL){
				for (let j in dataSch[i][PROCESS_CALL]){
					if(datasets[j]) datasets[j]['data'].push(dataSch[i][PROCESS_CALL][j]);
				}
			}else{
				for (let j in dataSch[i][PROCESS_CARE]){
					if(datasets[j]) datasets[j]['data'].push(dataSch[i][PROCESS_CARE][j]);
				}
			}
			
		}
		
		var data = {
	            labels: labels,
	            datasets: order.map((item)=>{return datasets[item]})
	        };
		
		return data;
		
	}
	
	
	 render () {
		 
		 const options = {
				    responsive: true,
		        	maintainAspectRatio: false,
		            scales: {
		                yAxes: [{
		                    type: 'linear',
		                    display: true,
		                    ticks: {
		                        min: 0,
		                    },
		                }],
		                
		                xAxes: [{
		                	categoryPercentage: 0.5,
		                	barPercentage: 1.0
		                }],
		                
		            }
		        }
		 
		  var data = this.processData();
		  return(<Chart height="400" width="100%" type="bar" data={data} options={options} />);
	 }
}

export default RowProcess; 





	  