import React, { Component } from 'react'
import LabPreviewNew from './LabPreviewNew';
import Loading from '../../common/Loading';
import './preview.scss'
import LinkControl from '../../lab/link/LinkControl';
import LineControl from '../../lab/line/LineControl';
import Script from '../../common/Script';

class PreviewFrame extends Component {

    constructor(props) {
        super(props);
        this.id = 'comp'+makeId();
        this.state = {
            path : '',
            zoom : 100,
            lab : {},
            width: 'max-content',
            height: 'max-content'
        }
    }

    render(){

        var backgroundcss = '';

        if(this.state.lab.nogrid == 0){
            if(this.state.lab.darkmode == 1 && this.state.lab.mode3d == 1) backgroundcss += 'dark3d'; 
            if(this.state.lab.darkmode == 1 && this.state.lab.mode3d == 0) backgroundcss += 'dark2d'; 
            if(this.state.lab.darkmode == 0 && this.state.lab.mode3d == 1) backgroundcss += 'light3d'; 
            if(this.state.lab.darkmode == 0 && this.state.lab.mode3d == 0) backgroundcss += 'light2d'; 
        }else{
            if(this.state.lab.darkmode == 1 ) backgroundcss += 'dark'; 
            if(this.state.lab.darkmode == 0 ) backgroundcss += 'light'; 
        }

        if(backgroundcss == '') backgroundcss = 'light2d';
        this.backgroundcss = backgroundcss;
        
        return <div style={{width:'100%'}}>
            
            <div className='box_flex lab_preview_title'><i className='fa fa-mortar-board'></i>&nbsp;{lang("Lab Preview")}</div>
            <div id="lab_preview_frame" className={backgroundcss}>

                <div style={{position:'absolute', top:5, bottom:5, right:5, zIndex:5, display: 'flex', flexDirection: 'column'}}>
                    <i className='button fa fa-search-plus' style={{marginBottom:5, color:'#17a2b8'}} onClick={()=>{ if(Number(this.state.zoom) < 200) this.setState({zoom: Number(this.state.zoom) + 10})}}></i>
                    <input style={{height:'100%', width:15}} orient='vertical' type="range" min="10" max="200" value={this.state.zoom} onChange={(e)=>{ this.setState({zoom : Number(e.target.value)})}}/>
                    <i className='button fa fa-search-minus' style={{marginTop:5, color:'#17a2b8'}} onClick={()=>{ if(Number(this.state.zoom) > 10) this.setState({zoom: Number(this.state.zoom) - 10})}}></i>
                </div>

                <div className='box_flex' style={{position:'absolute', bottom:5, left:5, zIndex:5}}>
                    <i style={{padding:5}} title={lang('Print')} className='button fa fa-print' onClick={()=>this.printTopology()}></i>
                    <i style={{padding:5}} title={lang('Snapshot')} className='button fa fa-image' onClick={()=>this.snapshotTopology()}></i>
                </div>

                <Loading ref={loading => this.loading = loading} style={{position:'absolute'}}></Loading>

                <div id='lab_dragable' style={{
                        overflow:"hidden", 
                        display:'block', 
                        width:this.state.width, 
                        height:this.state.height, 
                        transformOrigin:'0 0', 
                        transform:`scale(${this.state.zoom/100})`
                    }}>
                    {/* <LabPreview key={this.state.path} path={this.state.path} onStart={()=>{this.loading.loading(true)}} onLoad={()=>{this.loading.loading(false)}}></LabPreview> */}
                    <LabPreviewNew backgroundcss={backgroundcss} key={this.state.path} path={this.state.path} onStart={()=>{this.loading.loading(true)}} onLoad={()=>{this.loading.loading(false);}} onResize={(width, height)=>{
                        this.resetZoom(width, height);
                    }}></LabPreviewNew> 
                </div>

            </div>
            {this.state.path == ''
                ? ''
                : <>
                <div className='box_flex' style={{marginTop: 5}}>
                        <div className='btn btn-sm btn-info' onClick={()=>{openLab(this.state.path)}}><i className='fa fa-folder-open'></i>&nbsp;{lang("Open")}</div>&nbsp;
                        <div className='btn btn-sm btn-info' onClick={()=>{editLab(this.state.path)}}><i className='fa fa-edit'></i>&nbsp;{lang("Edit")}</div>&nbsp;
                        <div className='btn btn-sm btn-danger' onClick={()=>{this.delLab(this.state.path)}}><i className='fa fa-trash'></i>&nbsp;{lang("Delete")}</div>&nbsp;
                </div>
                <br/>
                <div>
                    <table id="lab_info_table">
                        <tbody>
                            <tr><td><i className="fa fa-circle"></i></td><td>{lang("Lab Name")}</td><td>:</td><th>{this.state.lab.name}</th></tr>
                            <tr><td><i className="fa fa-circle"></i></td><td>{lang("Author")}</td><td>:</td><th>{this.state.lab.author}</th></tr>
                            <tr><td><i className="fa fa-circle"></i></td><td>{lang("Version")}</td><td>:</td><th>{this.state.lab.version}</th></tr>
                            <tr><td><i className="fa fa-circle"></i></td><td>{lang("Lab ID")}</td><td>:</td><th>{this.state.lab.id}</th></tr>
                            <tr><td><i className="fa fa-circle"></i></td><td>{lang("Desciption")}</td><td>:</td><td>{this.state.lab.description}</td></tr>
                        </tbody>
                    </table>

                </div>
                </>
            }
            <LinkControl></LinkControl>
            <LineControl ref={c => App.lineControl = c}></LineControl>
            <Script src="/store/public/extensions/domtoimg/domtoimg.js"></Script>
            
        </div>
    }

    printTopology(){
       
        if(!document.getElementById(`lab-viewport`)) return;

        var mywindow = window.open('', '_blank');
        mywindow.document.outerHTML='';
        mywindow.document.write(`<html>${document.getElementsByTagName('head')[0].outerHTML}<body>`);
        mywindow.document.write(`<div style="height:100%; justify-content: center; align-items: center; display: flex;" class='${this.backgroundcss}'>
            <div style="width:${this.state.width}; height:${this.state.height}; position:relative">
            ${document.getElementById(`lab-viewport`).outerHTML}
            </div>
        </div>`);
        var styles = document.getElementsByTagName('style');
        for(let i in styles){
            if(styles[i].outerHTML) mywindow.document.write(styles[i].outerHTML)
        }

        mywindow.document.write(`<style media="print">
                                @page { 
                                    size: ${this.state.width} ${this.state.height};
                                    margin: 0;
                                }
                            </style>`);
        
        mywindow.document.write('</body></html>');
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.addEventListener('load', ()=>{
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
        })
        
        return true;
        
    }

    snapshotTopology(){
        
        var labViewport = document.getElementById(`lab-viewport`)
        if(!labViewport) return;

        App.loading(true);
        labViewport.classList.add(this.backgroundcss);
        domtoimage.toPng(labViewport)
        .then((dataUrl)=>{
            labViewport.classList.remove(this.backgroundcss);
            // var img = new Image();
            // img.src = dataUrl;
            var a = document.createElement('a');
            a.href = dataUrl;
            a.download = this.state.lab.name + ".png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            App.loading(false);
        })
        
        return true;
        
    }

    componentDidMount(){
        global.previewLab = (path)=>{
            this.setState({path});
            if(path != ''){
                this.loadLab(path);
            }
        }
        
        $("#lab_dragable").draggable();

    }

    resetZoom(width, height){
        
        var width1 = document.getElementById('lab_preview_frame').clientWidth;
        var height1 = document.getElementById('lab_preview_frame').clientHeight;
        var drag = document.getElementById('lab_dragable');

        drag.style.top = '0px';
        drag.style.left = '0px';

        var zoomWidth = Number(width1)*100/Number(width);
        var zoomHeight = Number(height1)*100/Number(height);

        var zoom = zoomWidth > zoomHeight ? zoomHeight : zoomWidth;
        

        if(width1 > 0 && width > 0){
            this.setState({
                zoom: zoom,
                width: width + 'px',
                height: height + 'px',
            })
        }
        
    }

   

    loadLab(path){
        if(!isset(path) || path == '') return;
        return axios.request({
            url: `/api/labs/get`,
            method: 'post',
            data: {path}
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    var data = response['data'];
                    this.setState({
                        lab : data
                    })
                    
                } else {
                    error_handle(response);
                }
            })

            .catch((error)=>{
                console.log(error);
                error_handle(error);
            })
    }

    delLab(path){
        if(!isset(path) || path == '') return;
        if (!confirm('Are you sure you want to delete this lab: ' + path)) return;
        if(global.delLab) global.delLab(path, ()=>{
            this.setState({path: ''});
            if(global.scope){
                global.scope.fileMngDraw(global.scope.path);
            }
        });
    }


}

export default PreviewFrame;