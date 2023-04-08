import React, { Component } from 'react'

class ZoomBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : Number(get(this.props.value, 50))
        }
        this.max = Number(get(this.props.max, 100));
        this.min = Number(get(this.props.min, 0));
        this.orient = get(this.props.orient, 'vertical');
        this.step = (this.max-this.min)/10;
    }

    onChange(){
        if(this.props.onChange) this.props.onChange(this.state.value);
    }

    getValue(){
        return this.state.value;
    }

    setValue(value, apply=false){
        this.setState({value: Number(value)}, ()=>{if(apply) this.onChange()});
    }

    render(){
        return <div style={{height:'100%', width:'100%', display: 'flex', flexDirection:(this.orient == 'vertical' ? 'column': 'row-reverse'), alignItems: 'center', justifyContent:'center'}}>
            <i className="button fa fa-undo" title={lang('Reset')} style={{margin:5, color:'#17a2b8'}} onClick={()=>{this.setValue((this.max -this.min)/2, true)}}></i>
            <i className='button fa fa-search-plus' style={{margin:5, color:'#17a2b8'}} onClick={()=>{ 
                if(Number(this.state.value) <= (this.max - this.step)){
                    this.setValue(this.state.value + this.step, true);
                }else{
                    this.setValue(this.max, true);
                }
            }}></i>
            <input style={{height:'100%', width:'100%'}} orient={this.orient} type="range" min={this.min} max={this.max} value={this.state.value} onChange={(e)=>{ this.setValue(e.target.value, true)}}/>
            <i className='button fa fa-search-minus' style={{margin:5, color:'#17a2b8'}} onClick={()=>{ 
                if(Number(this.state.value) >= (this.min + this.step)){
                    this.setValue(this.state.value - this.step, true);
                }else{
                    this.setValue(this.min, true);
                }
            }}></i>
            
            {this.props.autofit && <i title={lang('Autofit')} className='button fa fa-crosshairs' style={{margin:5, color:'#17a2b8'}} onClick={()=>this.props.autofit()}></i>}
            
        </div>
    }
}

export default ZoomBar