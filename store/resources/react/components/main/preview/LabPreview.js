import React, { Component } from 'react'
import Loading from '../../common/Loading';


class LabPreview extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            nodes: [],
            networks: [],
            topology: [],
        }

        this.minLeft = 0;
        this.minTop = 0;
        this.maxLeft = 0;
        this.maxTop = 0;
        this.layoutWidth = 0;
        this.layoutHeight = 0;
        this.viewBoxWidth = 0;
        this.viewBoxHeight = 0;

        this.padding = 50;
        this.iconSize = 30;

        this.viewBoxPostions = {};
        this.viewBoxSize = 400;

        this.newData = true;
        
    }

    componentDidMount(){
        var path = this.props.path;
        this.loadLab(path);
    }

    loadLab(path){
        if(!isset(path) || path == '') return;
        if(this.props.onStart) this.props.onStart();
        return axios.request({
            url: `/api/labs/preview`,
            method: 'post',
            data: {path}
        })

            .then(response => {
                if(this.props.onLoad) this.props.onLoad(response);
                response = response['data'];
                if (response['status'] == 'success') {
                    var data = response['data'];
                    var nodes = Object.values(data['nodes']);
                    var networks = Object.values(data['networks']);
                    var topology = Object.values(data['topology']);

                    this.newData = true;

                    this.setState({nodes, networks, topology})
                    
                } else {
                    error_handle(response);
                }

            })

            .catch((error)=>{
                if(this.props.onLoad) this.props.onLoad(error.response);
                console.log(error);
                error_handle(error);
            })
    }

    getLayout(){
        if(!this.newData) return;

        var networks = this.state.networks;
        networks = networks.map(item => {item['network'] = true; return item});
        var allNodes = this.state.nodes.concat(networks);

        if(allNodes.length == 0) return;
        allNodes.map((item, key) => {
            var left = Number(item.left);
            var top = Number(item.top);
            if(key == 0){
                this.minLeft = left;
                this.minTop = top;
                this.maxLeft = left;
                this.maxTop = top;
            }else{
                if(left < this.minLeft){
                    this.minLeft = left
                }

                if(left > this.maxLeft){
                    this.maxLeft = left
                }

                if(top < this.minTop){
                    this.minTop = top;
                }

                if(top > this.maxTop){
                    this.maxTop = top
                }
            }
        });

        this.layoutWidth = this.maxLeft - this.minLeft;
        this.layoutHeight = this.maxTop - this.minTop;

        // this.viewBoxWidth = this.viewBoxSize;
        // this.viewBoxHeight = this.viewBoxSize * (this.layoutHeight/this.layoutWidth);\

        this.viewBoxWidth = this.layoutWidth/2;
        this.viewBoxHeight = this.layoutHeight/2;

        allNodes.map(item => {
            var left = Number(item.left);
            var top = Number(item.top);

            if(this.layoutWidth == 0 || this.layoutHeight == 0){
                var viewBoxLeft = this.padding;
                var viewBoxTop = this.padding;
            }else{
                var viewBoxLeft = (left - this.minLeft) * (this.viewBoxWidth/this.layoutWidth) + this.padding;
                var viewBoxTop = (top - this.minTop) * (this.viewBoxHeight/this.layoutHeight) + this.padding;
            }
            

            if(item.network){
                this.viewBoxPostions[`network${item.id}`] = {left: viewBoxLeft, top: viewBoxTop};
            }else{
                this.viewBoxPostions[`node${item.id}`] = {left: viewBoxLeft, top: viewBoxTop};
            }

            
        })

        console.log(this.viewBoxPostions);

        this.viewBoxWidth = this.viewBoxWidth + 2*this.padding + this.iconSize;
        this.viewBoxHeight = this.viewBoxHeight + 2*this.padding + this.iconSize;
        this.newData = false;
        
    }

    render(){
        this.getLayout();

        return <svg viewBox={`0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`} width="100%" xmlns="http://www.w3.org/2000/svg">

            {this.state.topology.map((item, key)=>{
                var srcId = item.source;
                var destId = item.destination;
                var recW = 15;
                var recH = 8;

                var srcPosition = this.viewBoxPostions[srcId];
                var destPosition = this.viewBoxPostions[destId];
                if(!srcPosition || !destPosition) return;
                var stroke = 'rgb(0, 102, 170)';
                if(item.type == 'serial'){
                    stroke = 'rgb(255, 204, 0)';
                }
                if(item.color != '') stroke = item.color;

                var alpha = Math.atan((srcPosition.top - destPosition.top)/(srcPosition.left - destPosition.left));
                var alphaDeg = alpha * 180/Math.PI;

                var sign = 1;
                if(srcPosition.left-destPosition.left != 0) sign = (srcPosition.left-destPosition.left)/Math.abs(srcPosition.left-destPosition.left);

                var rec1x = srcPosition.left + this.iconSize/2 - 30 * Math.cos(alpha)*sign
                var rec1y = srcPosition.top + this.iconSize/2 - 30 * Math.sin(alpha)*sign

                var rec2x = destPosition.left + this.iconSize/2 + 30 * Math.cos(alpha)*sign
                var rec2y = destPosition.top + this.iconSize/2 + 30 * Math.sin(alpha)*sign

                return <g key={key}>
                    <line 
                    x1={srcPosition.left + this.iconSize/2} 
                    y1={srcPosition.top + this.iconSize/2} 
                    x2={destPosition.left + this.iconSize/2} 
                    y2={destPosition.top + this.iconSize/2} 
                    style={{stroke:stroke, strokeWidth:1}} />
                    {item.source_label == '' 
                        ? '' 
                        :<g transform={`rotate(${alphaDeg} ${rec1x} ${rec1y})`}>
                            <rect x={rec1x-recW/2} y={rec1y-recH/2} width={recW} height={recH} rx="3" fill='#e6f5ff' stroke={stroke} />
                            <text x={rec1x-recW/2+2} y={rec1y+recH/2-2} fontSize='7px' fill={stroke} style={{fontWeight:'bold'}} textLength={recW-4} lengthAdjust="spacingAndGlyphs">{str_limit(item.source_label, 10)}</text>
                        </g>
                    }
                    {item.destination_label == ''
                        ? ''
                        : <g transform={`rotate(${alphaDeg} ${rec2x} ${rec2y})`}>
                            <rect x={rec2x-recW/2} y={rec2y-recH/2} width={recW} height={recH} rx="3" fill='#e6f5ff' stroke={stroke} />
                            <text x={rec2x-recW/2+2} y={rec2y+recH/2-2} fontSize='7px' fill={stroke} style={{fontWeight:'bold'}} textLength={recW-4} lengthAdjust="spacingAndGlyphs">{str_limit(item.destination_label, 10)}</text>
                        </g>
                    }
                </g> 
            })}

            {this.state.nodes.map(item => {
                var nodePostion = this.viewBoxPostions[`node${item.id}`];
                if(!nodePostion) return;
                var name = str_limit(item.name, 20);
                var length = name.length * 5;
                var textAutoX = (this.iconSize - length)/2;
                var textAutoY = (nodePostion['top'] < this.viewBoxHeight/2) ? textAutoY = -5 : this.iconSize + 7;

                return <g key={item.id}><image href={`/images/icons/${item.icon}`} height={this.iconSize} width={this.iconSize} 
                    x={nodePostion['left']} 
                    y={nodePostion['top']}/>
                    <text x={nodePostion['left'] + textAutoX} fontSize='9px' style={{fontWeight:'bold'}}
                    y={nodePostion['top'] + textAutoY} fill='rgb(0, 153, 255)'>{str_limit(item.name, 20)}</text>
                </g>
            })}

            {this.state.networks.map(item => {
                if(item.visibility == 0) return;
                var nodePostion = this.viewBoxPostions[`network${item.id}`];
                if(!nodePostion) return;
                var icon = '/images/cloud.png';
                if(item.type == 'bridge') icon = '/images/lan.png'

                return <image key={item.id} href={icon} height={this.iconSize} width={this.iconSize} x={nodePostion['left']} y={nodePostion['top']}/>
            })}

        </svg>
    }



}

export default LabPreview;