import React, { Component } from 'react'
import { SketchPicker } from 'react-color'
import ComboLink from './ComboLink';
import moveControl from './moveControl';



class LinkControl extends Component {

    constructor(props) {
        super(props);

        this.type = {
            Straight: 'Straight',
            Bezier: 'Bezier',
            Flowchart: 'Flowchart',
            StateMachine: 'State Machine',
        }

        this.style = {
            solid: 'border_style_solid',
            dashed: 'border_style_dashed',
            dotted: 'border_style_dotted',
            dotdash: 'border_style_dotdash'
        }

        this.id = makeId();

        this.state = {
            
            type: 'Straight',
            color: '#0066aa',
            style: 'solid',
            label: '',
            width: '',
            fontsize: '',
            
            stub: '',
            curviness: '',
            midpoint: 0.5,
            cornerRadius: '',

            show: false, // show or hide control bar

        }

        this.original = {};
        this.connection = null;
        this.labPath = $('#lab-viewport').attr('data-path');

        this.moveControl = new moveControl((obj, transform)=>{
            if(obj.classList.contains('link_label')){
                this.labelpos = transform;
            }
            else if(obj.classList.contains('node_interface') && obj.getAttribute('position') == 'src'){
                this.srcpos = transform;
            }
            else if(obj.classList.contains('node_interface') && obj.getAttribute('position') == 'dst'){
                this.dstpos = transform;
            }
            this.applyObjectToConnection(obj);
        })

        this.labelpos = null
        this.dstpos = null
        this.srcpos = null
    }

    applyObjectToConnection(obj){
        if(obj.classList.contains('link_label')){
            this.connection.setLabel(obj.outerHTML);
        }
        else if(obj.classList.contains('node_interface') && obj.getAttribute('position') == 'src'){
            if(this.srcLabel) this.srcLabel.setLabel(obj.outerHTML);
        }
        else if(obj.classList.contains('node_interface') && obj.getAttribute('position') == 'dst'){
            if(this.dstLabel) this.dstLabel.setLabel(obj.outerHTML);
        }
    }

    render() {
        return <>
            <style>{`
                .border_style_solid{
                    stroke-dasharray: none;
                }

                .border_style_dashed{
                    stroke-dasharray: 5,5;
                }

                .border_style_dotted{
                    stroke-linecap: round;
                    stroke-dasharray: 1,5;
                }

                .border_style_dotdash{
                    stroke-linecap: round;
                    stroke-dasharray: 1,5,10,5;
                }

                .link_ctl_frame{
                    background-color: white;
                    position: fixed;
                    top: 0px;
                    left: 0px;
                    right: 0px;
                    z-index: 2000;
                    display: none;
                    padding: 5px 5px 10px 5px;
                    transition: all 0.2s ease-out;
                }
                .link_ctl_input{
                    height:30px;
                    width: 100px;
                    margin-top: 5px;
                    border: solid thin darkgray;
                    border-radius: 4px;
                    padding: 5px;
                    text-shadow: white -1px 0px, white 0px 1px, white 1px 0px, white 0px -1px;
                }
                .link_ctl_item{
                    margin: 5px;
                }

                .link_ctl_item .link_ctl_title{
                    color: #346789;
                    font-weight:bold;
                }
                #lab-viewport .link_label {
                    background-color: #e6f5ff;
                    border: 2px solid #346789;
                    border-radius: 2px;
                    font-family: helvetica;
                    font-size: 0.8em;
                    font-weight: bold;
                    padding: 0px 2px 0px 2px;
                }

                .lable_draggable{
                    cursor: move;
                    background: orange !important;
                }

                .label_hide{
                    display: none;
                }
                .lable_draggable.label_hide{
                    display: block;
                    opacity: 0.2;
                }

            `}</style>

            <div ref={c => this.dom = c} className='box_shadow link_ctl_frame' style={{display:(this.state.show?'block':'none')}}>

                <div className='box_flex'>



                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Type")}</div>

                        <select className='link_ctl_input' value={this.state.type} onChange={(ev) => {
                            this.setState({ type: ev.target.value }, ()=>this.updateType())
                        }}>
                            {Object.keys(this.type).map(item => {
                                return <option key={item} value={item}>{this.type[item]}</option>
                            })}
                        </select>
                    </div>

                    <div className='link_ctl_item' style={{display:((this.state.type == 'Straight' || this.state.type == 'Flowchart')?'block':'none')}}>
                        <div className='box_line link_ctl_title'>{lang("Stub")}</div>
                        <input className='link_ctl_input' type='number' value={this.state.stub} onChange={(ev)=>{this.setState({stub:ev.target.value}, ()=>{this.updateType()})}}></input>
                    </div>

                    <div className='link_ctl_item' style={{display:((this.state.type == 'Bezier' || this.state.type == 'StateMachine')?'block':'none')}}>
                        <div className='box_line link_ctl_title'>{lang("Curviness")}</div>
                        <input className='link_ctl_input' step='5' type='number' value={this.state.curviness} onChange={(ev)=>{this.setState({curviness:ev.target.value}, ()=>{this.updateType()})}}></input>
                    </div>

                    <div className='link_ctl_item' style={{display:(this.state.type == 'Flowchart'?'block':'none')}}>
                        <div className='box_line link_ctl_title'>{lang("Round")}</div>
                        <input className='link_ctl_input' type='number' value={this.state.cornerRadius} onChange={(ev)=>{this.setState({cornerRadius:ev.target.value}, ()=>{this.updateType()})}}></input>
                    </div>

                    <div className='link_ctl_item' style={{display:(this.state.type == 'Flowchart'?'block':'none')}}>
                        <div className='box_line link_ctl_title'>{lang("Mid Point")}</div>
                        <div className='link_ctl_input box_flex' style={{width:150}}><input style={{width:'100%'}} type="range" name="vol" min="0" max="100" value={this.state.midpoint*100} onChange={(ev)=>{this.setState({midpoint:(ev.target.value/100)}, ()=>{this.updateType()})}}></input></div>
                    </div>

                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Color")}</div>
                        <div className="dropdown">
                            <input value={this.state.color} style={{backgroundColor:this.state.color}} onChange={(ev)=>{this.onChangeColor(ev.target.value)}} className="dropdown-toggle link_ctl_input" data-toggle="dropdown"></input>
                            <div className="dropdown-menu" id={`color${this.id}`} style={{padding:0}}>
                                <SketchPicker color={this.state.color} onChangeComplete={(color)=>{
                                    color = color.rgb;
                                    var colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
                                    this.onChangeColor(colorString);
                                }}></SketchPicker>
                            </div>
                        </div>
                    </div>

                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Style")}</div>
                        <div className="dropdown">
                            <div className="dropdown-toggle box_flex link_ctl_input" data-toggle="dropdown"><svg className={this.style[this.state.style]} width="100" height="2"><path d="M 1 1 L 100 1" strokeWidth="2" stroke="#0066aa"></path></svg></div>
                            <div className="dropdown-menu">
                               {Object.keys(this.style).map(item => {
                                   return <div key={item} style={{padding:15}}  className='button box_flex' onClick={()=>{this.onChangeStyle(item)}}><svg width="100" height="2" className={this.style[item]}><path d="M 1 1 L 100 1" strokeWidth="2" stroke="#0066aa"></path></svg></div>
                               })}
                            </div>
                        </div>
                    </div>

                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Label")}</div>
                        <input className='link_ctl_input' type='text' value={this.state.label} onChange={(ev)=>{this.onChangeLabel(ev.target.value)}}></input>
                    </div>

                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Width")}</div>
                        <input className='link_ctl_input' type='number' value={this.state.width} onChange={(ev)=>{this.onChangeWidth(ev.target.value)}}></input>
                    </div>

                    <div className='link_ctl_item'>
                        <div className='box_line link_ctl_title'>{lang("Font Size")}</div>
                        <input className='link_ctl_input' type='number' value={this.state.fontsize} onChange={(ev)=>{this.onChangeFontSize(ev.target.value)}}></input>
                    </div>

                    
                    <div style={{margin:'auto 5px auto auto'}}>
                        <button className='button btn btn-xs btn-primary' onClick={()=>{this.onApply()}} style={{margin:'5px', width:60}}>{lang("Apply")}</button>
                        <button className='button btn btn-xs btn-danger' onClick={()=>{this.onCancel()}} style={{margin:'5px', width:60}}>{lang("Cancel")}</button>
                    </div>

                    
                </div>
            </div>

            <ComboLink></ComboLink>


        </>
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            this.setState({
                show: false
            }, ()=>{
                var height = 0;
                document.getElementById('alert_container').style.top = height+'px';
                document.getElementById('notification_container').style.top = (height + 30)+'px'
            })
            document.querySelectorAll('.lable_draggable').forEach(item => {
                item.classList.remove('lable_draggable')
            })

            App.topControl = false;
        } else {
            this.setState({
                show: true
            }, ()=>{
                var height = this.dom.clientHeight;
                document.getElementById('alert_container').style.top = height+'px';
                document.getElementById('notification_container').style.top = (height + 30)+'px'
            })

            App.topControl = true;
        }
    }

    onApply(){
        if (this.labPath == '') return;
        var id = this.connection.id;
        var node_id = null;
        var interface_id = null;
        var network_id = null;
        if ( id.search('iface') != -1 ){
            node_id=id.replace('iface:node','').replace(/:.*/,'');
            interface_id=id.replace(/.*:/,'');
        }else{
            network_id = id.replace('network_id:','');
        }
        

        return axios.request({
            url: `/api/labs/session/interfaces/style`,
            method: 'post',
            data: {
                node_id : node_id,
                interface_id: interface_id,
                network_id : network_id,
                path: this.labPath,
                style: this.state.style,
                linkstyle: this.state.type,
                color: this.state.color,
                label: this.state.label,
                width: this.state.width,
                fontsize: this.state.fontsize,
                linkcfg: JSON.stringify(this.getLinkCfg()),
                dstpos: JSON.stringify(this.dstpos),
                srcpos: JSON.stringify(this.srcpos),
                labelpos: JSON.stringify(this.labelpos),
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    this.connection = null;
                    this.modal('hide');
                    App.topology.updateData(response['update']);
                } else {
                    App.topology.printTopology();
                    error_handle(response);
                }

            })

            .catch(function (error) {
                App.topology.printTopology();
                console.log(error);
                error_handle(error);
            })

    }

    onCancel(){
        this.modal('hide');
        App.topology.printTopology();
       
    }

    onChangeColor(color){
        this.setState({
            color: color,
        });
        if(color == '') color = '#0066aa';
        if(this.connection){
            var painStyle = this.connection.getPaintStyle();
            painStyle.stroke = color;
            this.connection.setPaintStyle(painStyle);

            var overlays = this.connection.getOverlays();

            for (let id in overlays){
                if(id == '__label') continue;
                var overlay = overlays[id];
                var label = $(overlay.getLabel());
                
                if(label.length > 0){
                    label.css('color', color);
                    label.css('border-color', color);
                    overlay.setLabel(label[0].outerHTML)
                }
               
            }

            var lableObj = $(this.connection.getLabel());
            if(lableObj.length > 0){
                lableObj.css('color', color);
                lableObj.css('border-color', color);
                this.connection.setLabel(lableObj[0].outerHTML);
            }
            

        } 
    }

    onChangeStyle(style){
        var styleClassName = get(this.style[style], '');
        this.setState({
            style,
        });
        if(this.connection){
            var className = this.connection.getClass();
            var newClassName=className.replace(/\s?border_style_([a-z]+)/g,'');
            newClassName=newClassName + ' ' + styleClassName;
            this.connection.removeClass(className);
            this.connection.addClass(newClassName);
        }
    }

    onChangeLabel(label){
        this.setState({label});
        if(this.connection){
            var lableObj = $(this.connection.getLabel());
            if(lableObj.length > 0){
                lableObj.text(label);
                if(label == ''){
                    lableObj.addClass('label_hide');
                }else{
                    lableObj.removeClass('label_hide');
                }
            }

            this.connection.setLabel(lableObj[0].outerHTML);
        }
    }


    onChangeWidth(width){
        this.setState({width});
        if(this.connection){
            if(width == '') width = 2;
            var painStyle = this.connection.getPaintStyle();
            painStyle.strokeWidth = width;
            this.connection.setPaintStyle(painStyle);
        }
    }


    onChangeFontSize(fontsize){
        this.setState({fontsize});
       
        if(this.connection){
            var overlays = this.connection.getOverlays();

            for (let id in overlays){
                if(id == '__label') continue;
                var overlay = overlays[id];
                var label = $(overlay.getLabel());
                
                if(label.length > 0){
                    if(fontsize == '' || fontsize == 0){
                        label.css('font-size', '');
                    }else{
                        label.css('font-size', fontsize + 'px');
                    }
                    
                    overlay.setLabel(label[0].outerHTML)
                }
               
            }

            var lableObj = $(this.connection.getLabel());
            if(lableObj.length > 0){
                if(fontsize == '' || fontsize == 0){
                    lableObj.css('font-size', '');
                }else{
                    lableObj.css('font-size', fontsize + 'px');
                }
    
                this.connection.setLabel(lableObj[0].outerHTML);
            }

            this.connection.fontsize = fontsize;
            

        } 
    }

    getLinkCfg(){
        var linkcfg = {};
        switch (this.state.type) {
            case 'Straight': {
                if(this.state.stub!=='') linkcfg.stub = Number(this.state.stub);
                break;
            }
            case 'Bezier': {
                if(this.state.curviness !== '') linkcfg.curviness = Number(this.state.curviness);
                break;
            }
            case 'Flowchart': {
                if(this.state.stub!=='') linkcfg.stub = Number(this.state.stub);
                if(this.state.midpoint !== '') linkcfg.midpoint = Number(this.state.midpoint);
                if(this.state.cornerRadius !== '') linkcfg.cornerRadius = Number(this.state.cornerRadius);
                break;
            }
            case 'StateMachine': {
                if(this.state.curviness !== '') linkcfg.curviness = Number(this.state.curviness);
                break;
            }
        }
        return linkcfg;
    }

    updateType(){
        if(this.connection){
            this.connection.setConnector([this.state.type, this.getLinkCfg()]);
            if(this.state.type == 'Flowchart' || this.state.type=='Straight') this.connection.connector.stub = this.state.stub;
            if(this.state.type == 'Flowchart') this.connection.connector.midpoint = this.state.midpoint;
            if(this.state.type == 'StateMachine') this.connection.connector.curviness = this.state.curviness;
        }
    }

    setConnection(cn) {
        
        this.connection = cn;
        //get type of connection
        var type = cn.getConnector().type;
        var stub = '';
        if(type == 'Straight' || type=='Flowchart'){
           stub = cn.connector.stub? cn.connector.stub : '';
        }

        var curviness = '' 
        if(type == 'Bezier'){
            curviness = cn.connector.getCurviness();
        }

        if(type == 'StateMachine'){
            curviness = get(cn.connector.curviness, '');
        }

        var midpoint = '0.5'
        var cornerRadius = ''
        
        if(type == 'Flowchart'){
            midpoint = get(cn.connector.midpoint, 0.5);
            var segments = cn.connector.getSegments();
            var round = segments.find(item=>item.type == 'Arc');
            if(round) cornerRadius = round.radius       
        }

        //get color of connection
        var painStyle = cn.getPaintStyle();
        var color = get(painStyle.stroke, '');
        var width = get(painStyle.strokeWidth, 2);

        var fontsize = get(this.connection.fontsize, '');
 
        //get style of connection
        var className = cn.getClass();
        var match = /.*border_style_([a-z]+).*/.exec(className);
        if(!match){
            var style = '';
        }else{
            var style = match[1];
        } 

        //get label
        var label = cn.getLabel();
        if(label == null){
            label = '';
        }else{
            label = $(`<div>${label}</div>`).text();
        }

        console.log({type, color, style, label, stub, curviness, midpoint, cornerRadius});
        
        this.setState({
            type, color, style, label, stub, curviness, midpoint, cornerRadius, width, fontsize
        })

        this.original = {type, color, style, label, stub, curviness, midpoint, cornerRadius, width, fontsize};


        // set drag able all lable
        var connect_id = cn.id;

        var lableObj = $(this.connection.getLabel());
        if(lableObj.length > 0){
            lableObj.text(label);
            lableObj.addClass('lable_draggable');
            lableObj.attr('connect_id', connect_id);
            this.connection.setLabel(lableObj[0].outerHTML);
        }

        var overlays = this.connection.getOverlays();
        for (let id in overlays){
            if(id == '__label') continue;
            var overlay = overlays[id];
            var label = $(overlay.getLabel());
            
            if(label.length > 0){
                label.addClass('lable_draggable');
                label.attr('connect_id', connect_id);
                overlay.setLabel(label[0].outerHTML);
                if(label.attr('position') == 'src') this.srcLabel = overlay;
                else if(label.attr('position') == 'dst') this.dstLabel = overlay;
            }
        }


        if(isset(App.topology.links[this.connection.id])){
            var interfc = App.topology.links[this.connection.id].source.interface
            var interfaceStyle = interfc.get('style', {});
            try{ this.srcpos = JSON.parse(interfaceStyle['srcpos']) }catch(error){this.srcpos = {}};
            try{ this.dstpos = JSON.parse(interfaceStyle['dstpos']) }catch(error){this.dstpos = {}};
            try{ this.labelpos = JSON.parse(interfaceStyle['labelpos']) }catch(error){this.labelpos = {}};
            
        }

    }



    componentDidMount() {

        $(document).on('click', '.action-connectedit', (e) => {
            if(App.topControl){
                showLog(lang('Apply your change first'), 'error');
                return;
            }
            this.setConnection(window.connToDel);
            $('#context-menu').remove();
            this.modal();
        })

        $(document).on('click', `#color${this.id}`, ev => {
            ev.stopPropagation();
        })

        global.hideLinkControl = ()=>{
            this.connection = null;
            this.modal('hide')
        }

        global.isEdittingLink = ()=>{
            return this.state.show;
        }

        // drag lable
        $(document).on('mousedown', '.lable_draggable', (e) => {
            this.moveControl.setObject(e.target);
        })

        // drag lable
        $(document).on('contextmenu', '.lable_draggable', (ev) => {
            var labelObject = ev.target;
            var transformCss = labelObject.style.transform;
            var match = /.*rotate\(([\d\+\-]+)deg\).*/.exec(transformCss);
            if(match){
                var rotate = match[1];
            }else{
                var rotate = 0;
            }

            var id = makeId();

            App.ContextMenu.show(event);
            App.ContextMenu.setMenu(<div key={id}
                className='box_shadow box_border' 
                style={{background: 'white', color:'#0066aa', borderRadius:2, padding:5}}>
                <div className='button' onClick={()=>{
                    labelObject.style.transform = '';
                    if(labelObject.classList.contains('link_label')) {this.labelpos.x=0; this.labelpos.y=0; this.labelpos.rotate=0}
                    else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'src') {this.srcpos.x=0; this.srcpos.y=0, this.srcpos.rotate=0}
                    else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'dst') {this.dstpos.x=0; this.dstpos.y=0, this.dstpos.rotate=0}
                    this.applyObjectToConnection(labelObject);
                }} style={{marginBottom:10}}><b>Reset Position</b></div>

                <div className='box_flex' onClick={ev =>{App.ContextMenu.show()}} style={{marginBottom:10, fontWeight:'bold'}}>
                    
                    <div>Rotate:&nbsp;</div><input style={{padding:'0px 5px', borderRadius:3, border:'solid thin', width:100}} type='number' defaultValue={rotate} onChange={e=>{
                        var rotate = e.target.value;
                        
                        if(labelObject.classList.contains('link_label')) {this.labelpos.rotate=rotate}
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'src') {this.srcpos.rotate=rotate}
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'dst') {this.dstpos.rotate=rotate}

                        var transformCss = labelObject.style.transform;

                        var match = /.*translate\(([\d\+\-]+)px, ([\d\+\-]+)px\).*/.exec(transformCss);
                        if(match){
                            var labelpos = {x: Number(match[1]), y: Number(match[2])};
                        }else{
                            var labelpos = {x: 0, y: 0};
                        }

                        labelpos.rotate = rotate;
                        console.log(labelpos);
                        var transformStyle = '';
                        
                        if(typeof(labelpos.x) != 'undefined' && typeof(labelpos.y) != 'undefined') transformStyle = `translate(${labelpos.x}px, ${labelpos.y}px)`;
                        if(labelpos.hide == true) hideClass = 'label_hide';
                        if(typeof(labelpos.rotate) != 'undefined') transformStyle += ` rotate(${labelpos.rotate}deg)`;
                        labelObject.style.transform = transformStyle;
                        this.applyObjectToConnection(labelObject);
                    }}></input>
                      
                </div>

                {labelObject.classList.contains('label_hide')
                    ?<div className='button' onClick={()=>{
                        labelObject.classList.remove('label_hide');
                        if(labelObject.classList.contains('link_label')) this.labelpos.hide = false;
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'src') this.srcpos.hide = false;
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'dst') this.dstpos.hide = false;
                        this.applyObjectToConnection(labelObject);
                    }}><b>Show</b></div>
                    :<div className='button' onClick={()=>{
                        labelObject.classList.add('label_hide');
                        if(labelObject.classList.contains('link_label')) this.labelpos.hide = true;
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'src') this.srcpos.hide = true;
                        else if(labelObject.classList.contains('node_interface') && labelObject.getAttribute('position') == 'dst') this.dstpos.hide = true;
                        this.applyObjectToConnection(labelObject);
                    }}><b>Hide</b></div>
                }

            </div>);
            ev.stopPropagation();
            ev.preventDefault();
        })


        

    }

}
export default LinkControl;