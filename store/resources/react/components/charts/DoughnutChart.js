import {Chart } from 'primereact/chart';
import React, { Component } from 'react'
export class DoughnutChart extends Component {
	

    render() {
    	
    	
		const data = this.props.data;
		const legend = this.props.legend;
    	
    	var labels = [];
    	var dataset = {
    			data: [],
    			backgroundColor: [],
    			hoverBackgroundColor:[],
    	};
    	
    	var total = 0;
    	for (let i in data){
    		total += Number(data[i].value);
    	}
    	
    	
    	
    	for (let i in data){
    		labels.push(i);
			dataset.data.push(data[i].value);
    		dataset.backgroundColor.push(data[i].color);
    		dataset.hoverBackgroundColor.push(data[i].color);
    		var percent = Math.round(Number(data[i].value)*100/total);
    		// legen.push(<tr style={{color:data[i].color}} key={i}><th style={{padding:5}}>{i}</th><td>:</td><td>{data[i].value +' ('+percent+'%)'}</td></tr>)
    	}
    	
        const chartData = {
            labels: labels,
            datasets: [dataset],
        }
        
        const options = {
        	cutoutPercentage: 70,
			legend: {display: false,},
			responsive: false,
			tooltips: {
				callbacks: {
					label: (tooltipItem, data)=>{
						var label = data.labels[tooltipItem.index] || '';
						console.log(tooltipItem);
						console.log(data);
						var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						label += ` ${value}${this.props.unit}`
						return ` ${label}`
					}
				}
			},
			animation: {
				duration: 0
			}
		}

        return (
        		<div style={{textAlign:'center', margin:'15px 0px'}}>
	        		{/* <h4 className='title'>{this.props.title}</h4> */}
	                <div className='box_flex' style={{justifyContent: 'center', position:'relative', margin:'15px 0px'}}>
	                
	                    <div style={{zIndex: 1, position:'relative'}}>
	                    	<Chart  height='180px' width='180px'  type="doughnut" data={chartData} options={options}/>
	                    </div>   
	                    
	                    <div className='box_flex' style={{justifyContent: 'center', position:'absolute', width:'100%', height:'100%'}}>
	                    	<div style={{textAlign:'center'}}>
	                    		<h5>{data['Used']['value'] + this.props.unit}</h5>
	                    		<div>{this.props.title}</div>
	                    	</div>
	                    </div>
	                    
	                </div>
	                
					<div>{legend}</div>
                
                </div>

        )
    }
}


export default DoughnutChart