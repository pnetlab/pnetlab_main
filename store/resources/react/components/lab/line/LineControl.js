import React, { Component } from 'react'
import { SketchPicker } from 'react-color'

class LineControl extends Component {

    constructor(props) {
        super(props);

        this.type = {
            Straight: 'Straight',
            Bezier: 'Bezier',
            Flowchart: 'Flowchart',
            StateMachine: 'State Machine',
        }

        this.style = {
            solid: 'line_style_solid',
            dashed: 'line_style_dashed',
            dotted: 'line_style_dotted',
            dotdash: 'line_style_dotdash'
        }

        this.syms = {
            '':'',
            arrow : 'Arrow',
            dot: 'Dot',
            square: 'Square',
        }

        this.id = makeId();

        this.state = {
            
            linestyle: 'Straight',
            color: '#0066aa',
            paintstyle: 'solid',
            label: '',
            startsym: '',
            endsym: '',
            width: '',

            
            stub: '',
            curviness: '',
            midpoint: 0.5,
            cornerRadius: '',

            show: false, // show or hide control bar

        }

        this.original = {};
        this.lines = {};
        this.connection = null;
        this.labPath = $('#lab-viewport').attr('data-path');
        this.labViewWidth = $('#lab-viewport').width();
        this.labViewHeight = $('#lab-viewport').height();
    }

    render() {
        return <>
            <style>{`
                .line_style_solid{
                    stroke-dasharray: none;
                }

                .line_style_dashed{
                    stroke-dasharray: 5,5;
                }

                .line_style_dotted{
                    stroke-linecap: round;
                    stroke-dasharray: 1,5;
                }

                .line_style_dotdash{
                    stroke-linecap: round;
                    stroke-dasharray: 1,5,10,5;
                }

                .line_ctl_frame{
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
                .line_ctl_input{
                    height:30px;
                    width: 100px;
                    margin-top: 5px;
                    border: solid thin darkgray;
                    border-radius: 4px;
                    padding: 5px;
                    text-shadow: white -1px 0px, white 0px 1px, white 1px 0px, white 0px -1px;
                }
                .line_ctl_item{
                    margin: 5px;
                }

                .line_ctl_item .line_ctl_title{
                    color: #346789;
                    font-weight:bold;
                }
                #lab-viewport .line_label {
                    background-color: #e6f5ff;
                    border: 2px solid #346789;
                    border-radius: 2px;
                    font-family: helvetica;
                    font-size: 0.8em;
                    font-weight: bold;
                    padding: 0px 2px 0px 2px;
                }

                #lab-viewport svg:not(:root) {
                    overflow: unset;
                }

                .jtk-connector path{
                    cursor: pointer;
                }

                

                

            `}</style>

            <div ref={c => this.dom = c} className='box_shadow line_ctl_frame' style={{display:(this.state.show?'block':'none')}}>

                <div className='box_flex'>

                    

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Type")}</div>

                        <select className='line_ctl_input' value={this.state.linestyle} onChange={(ev) => {
                            this.setState({ linestyle: ev.target.value }, ()=>{
                                this.applyType(this.connection, this.state.linestyle, this.getlineCfg())
                            })
                        }}>
                            {Object.keys(this.type).map(item => {
                                return <option key={item} value={item}>{this.type[item]}</option>
                            })}
                        </select>
                    </div>

                    <div className='line_ctl_item' style={{display:((this.state.linestyle == 'Straight' || this.state.linestyle=='Flowchart')?'block':'none')}}>
                        <div className='box_line line_ctl_title'>{lang("Stub")}</div>
                        <input className='line_ctl_input' type='number' value={this.state.stub} onChange={(ev)=>{
                            this.setState({stub:ev.target.value}, ()=>{
                                this.applyType(this.connection, this.state.linestyle, this.getlineCfg());
                            })
                            }}></input>
                    </div>

                    <div className='line_ctl_item' style={{display:((this.state.linestyle == 'Bezier' || this.state.linestyle == 'StateMachine')?'block':'none')}}>
                        <div className='box_line line_ctl_title'>{lang("Curviness")}</div>
                        <input className='line_ctl_input' step='5' type='number' value={this.state.curviness} onChange={(ev)=>{
                            this.setState({curviness:ev.target.value}, ()=>{
                                this.applyType(this.connection, this.state.linestyle, this.getlineCfg())
                                })
                            }}></input>
                    </div>

                    <div className='line_ctl_item' style={{display:(this.state.linestyle == 'Flowchart'?'block':'none')}}>
                        <div className='box_line line_ctl_title'>{lang("Round")}</div>
                        <input className='line_ctl_input' type='number' value={this.state.cornerRadius} onChange={(ev)=>{
                            this.setState({cornerRadius:ev.target.value}, ()=>{
                                this.applyType(this.connection, this.state.linestyle, this.getlineCfg())
                                })
                            }}></input>
                    </div>

                    <div className='line_ctl_item' style={{display:(this.state.linestyle == 'Flowchart'?'block':'none')}}>
                        <div className='box_line line_ctl_title'>{lang("Mid Point")}</div>
                        <div className='line_ctl_input box_flex' style={{width:150}}><input style={{width:'100%'}} type="range" name="vol" min="0" max="100" value={this.state.midpoint*100} onChange={(ev)=>{
                            this.setState({midpoint:(ev.target.value/100)}, ()=>{
                                this.applyType(this.connection, this.state.linestyle, this.getlineCfg())
                                })
                            }}></input></div>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Width")}</div>
                        <input className='line_ctl_input' type='number' value={this.state.width} onChange={(ev)=>{
                            this.onChangeWidth(ev.target.value);    
                        }}></input>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Color")}</div>
                        <div className="dropdown">
                            <input value={this.state.color} style={{backgroundColor:this.state.color}} onChange={(ev)=>{this.onChangeColor(ev.target.value)}} className="dropdown-toggle line_ctl_input" data-toggle="dropdown"></input>
                            <div className="dropdown-menu" id={`color${this.id}`} style={{padding:0}}>
                                <SketchPicker color={this.state.color} onChangeComplete={(color)=>{
                                    color = color.rgb;
                                    var colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
                                    this.onChangeColor(colorString);
                                }}></SketchPicker>
                            </div>
                        </div>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Style")}</div>
                        <div className="dropdown">
                            <div className="dropdown-toggle box_flex line_ctl_input" data-toggle="dropdown"><svg className={this.style[this.state.paintstyle]} width="100" height="2"><path d="M 1 1 L 100 1" strokeWidth="2" stroke="#0066aa"></path></svg></div>
                            <div className="dropdown-menu">
                               {Object.keys(this.style).map(item => {
                                   return <div key={item} style={{padding:15}}  className='button box_flex' onClick={()=>{this.onChangeStyle(item)}}><svg width="100" height="2" className={this.style[item]}><path d="M 1 1 L 100 1" strokeWidth="2" stroke="#0066aa"></path></svg></div>
                               })}
                            </div>
                        </div>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Start Symbol")}</div>
                        <div className="dropdown">
                            <div className="dropdown-toggle box_flex line_ctl_input" data-toggle="dropdown">
                                <svg width="100" height="10">
                                    <path d="M 10 5 L 80 5" strokeWidth="2" stroke="#0066aa" markerStart={`url(#${this.state.startsym}0`}></path>
                                </svg>
                            </div>
                            <div className="dropdown-menu">
                               {Object.keys(this.syms).map(item => {
                                   return <div key={item} style={{padding:15}}  className='button box_flex' onClick={()=>{this.onChangeStartSym(item)}}>
                                       <svg width="100" height="10"><path d="M 10 5 L 80 5" strokeWidth="2" stroke="#0066aa" markerStart={`url(#${item}0`}></path></svg>
                                    </div>
                               })}
                            </div>
                        </div>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("End Symbol")}</div>
                        <div className="dropdown">
                            <div className="dropdown-toggle box_flex line_ctl_input" data-toggle="dropdown">
                                <svg width="100" height="10">
                                    <path d="M 10 5 L 80 5" strokeWidth="2" stroke="#0066aa" markerEnd={`url(#${this.state.endsym}0`}></path>
                                </svg>
                            </div>
                            <div className="dropdown-menu">
                               {Object.keys(this.syms).map(item => {
                                   return <div key={item} style={{padding:15}}  className='button box_flex' onClick={()=>{this.onChangeEndSym(item)}}>
                                       <svg width="100" height="10" ><path d="M 10 5 L 80 5" stroke="#0066aa" strokeWidth="2" markerEnd={`url(#${item}0`}></path></svg>
                                    </div>
                               })}
                            </div>
                        </div>
                    </div>

                    <div className='line_ctl_item'>
                        <div className='box_line line_ctl_title'>{lang("Label")}</div>
                        <input className='line_ctl_input' type='text' value={this.state.label} onChange={(ev)=>{this.onChangeLabel(ev.target.value)}}></input>
                    </div>

                    

                    <svg height="0" width='0' fill="#0066aa">
                        <defs>
                            <marker id="dot0" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><circle cx="5" cy="5" r="5"/></marker>
                            <marker id="square0" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><rect width="10" height="10"/></marker>
                            <marker id="arrow0" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 10 L 10 5 L 0 0 L 3 5 z" /></marker>
                        </defs>
                    </svg>


                    <div style={{margin:'auto 0px auto auto'}}>
                        <button className='button btn btn-xs btn-primary' onClick={()=>{this.onApply()}} style={{margin:'5px', width:60}}>{lang("Apply")}</button>
                        <button className='button btn btn-xs btn-danger' onClick={()=>{this.onCancel()}} style={{margin:'5px', width:60}}>{lang("Cancel")}</button>
                    </div>

                </div>
            </div>


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
        id = id.replace(/\D/g, '');
        var editData = {
            id: id,
            linestyle: this.state.linestyle,
            paintstyle: this.state.paintstyle,
            color: this.state.color,
            label: this.state.label,
            width: this.state.width,
            endsym: this.state.endsym,
            startsym: this.state.startsym,
            linecfg: JSON.stringify(this.getlineCfg()),
        }
        
        this.editLine(editData);
        this.modal('hide');
       
    }

    onCancel(){
        // this.setState({...this.state, ...this.original}, ()=>{
        //     this.applyType(this.connection, this.original.linestyle, this.getlineCfg());
        //     this.applyColor(this.connection, this.original.color);
        //     this.applyLabel(this.connection, this.original.label, this.original.color);
        //     this.applyStyle(this.connection, this.original.paintstyle);
        //     this.applyWidth(this.connection, this.original.width);
        //     this.applySym(this.connection, this.original.color, this.original.endsym, this.original.startsym);
        //     this.modal('hide');
        //     this.connection = null;
        //     this.original = {};
        // })
        this.modal('hide');
        App.topology.printTopology();
        
    }

    onChangeColor(color){
        this.setState({
            color: color,
        });
        if(color == '') color = '#0066aa';
        this.applyColor(this.connection, color);
    }

    applyColor(cn, color){
        if(cn){
            var painStyle = cn.getPaintStyle();
            painStyle.stroke = color;
            cn.setPaintStyle(painStyle);

            var textColor = `color:${color}`;
            var borderColor = `border-color:${color}`;
            var overlays = cn.getOverlays();

            for (let id in overlays){
                if(id == '__label') continue;
                var overlay = overlays[id];
                var label = $(`<div>${overlay.getLabel()}</div>`).text();
                if(label != ''){
                    overlay.setLabel(`<div class="node_interface" style="${textColor};${borderColor}">${label}</div>`)
                }
                
            }

            if(this.state.label != ''){
                cn.setLabel(`<div style="${textColor}; ${borderColor}" class="line_label">${this.state.label}</div>`);
            }
            

        } 
    }


    drawsym(type, id, color){
        if(!isset(color)) color='inherit';
        switch (type) {
            case 'dot':
                return `<marker style="fill:${color}; stroke-width:0" id="dot${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><circle cx="5" cy="5" r="5"/></marker>`
            case 'square':
                return `<marker style="fill:${color}; stroke-width:0" id="square${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><rect width="10" height="10"/></marker>`
            case 'arrow':
                return `<marker style="fill:${color}; stroke-width:0" id="arrow${id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 10 L 10 5 L 0 0 L 3 5 z" /></marker>`
            default:
                return ''
        }
    }

    onChangeStartSym(startsym){
        this.setState({startsym});
        this.applySym(this.connection, this.state.color, this.state.endsym, startsym);
    }

    onChangeEndSym(endsym){
        this.setState({endsym});
        this.applySym(this.connection, this.state.color, endsym, this.state.startsym);
    }

    applySym(cn, color, endsym, startsym){
        if(!cn) return;
        var id = cn.id;
        id = id.replace(/\D/g, '');
        $(`#sym${id}`).remove();
        var newSym = `<div id="sym${id}">
        <svg height="0px"><defs>
            ${this.drawsym(startsym, id, color)}
            ${this.drawsym(endsym, id, color)}
        </defs></svg>
        <style>
            .sym_${id} path {
                marker-start: url(#${startsym + id});
                marker-end: url(#${endsym + id});
            }
        </style>
        </div>`;
        $('body').append(newSym);

        var className = cn.getClass();
        var newClassName=className.replace(/\s?sym_(\d+)/g,'');
        newClassName=newClassName + ' ' + `sym_${id}`;
        cn.removeClass(className);
        cn.addClass(newClassName);
        
    }


    onChangeWidth(width){
        if(width >= 0){
            this.setState({width});
            this.applyWidth(this.connection, width);
        }
    }

    applyWidth(cn, width) {
        if (cn) {
            if(width === '') width = 2;
            var painStyle = cn.getPaintStyle();
            painStyle.strokeWidth = width;
            cn.setPaintStyle(painStyle);
        }
    }

    onChangeStyle(style){
        this.setState({
            paintstyle: style,
        });
        this.applyStyle(this.connection, style);
    }

    applyStyle(cn, style){
        if(cn){
            var styleClassName = get(this.style[style], '');
            var className = cn.getClass();
            var newClassName=className.replace(/\s?line_style_([a-z]+)/g,'');
            newClassName=newClassName + ' ' + styleClassName;
            cn.removeClass(className);
            cn.addClass(newClassName);
        }
    }

    onChangeLabel(label){
        this.setState({label});
        this.applyLabel(this.connection, label, this.state.color)
    }

    applyLabel(cn, label, color){
        if(!color || color == ''){
            var textColor = '';
            var borderColor = '';
        }else{
            var textColor = `color:${color}`;
            var borderColor = `border-color:${color}`;
        }
         
        if(cn){
            if(label == ''){
                cn.setLabel('');
            }else{
                cn.setLabel(`<div style="${textColor}; ${borderColor}" class="line_label">${label}</div>`);
            }
        }
    }

    getlineCfg(){
        var linecfg = {};
        switch (this.state.linestyle) {
            case 'Straight': {
                if(this.state.stub!=='') linecfg.stub = Number(this.state.stub);
                break;
            }
            case 'Bezier': {
                if(this.state.curviness !=='') linecfg.curviness = Number(this.state.curviness);
                break;
            }
            case 'Flowchart': {
                if(this.state.stub!=='') linecfg.stub = Number(this.state.stub);
                if(this.state.midpoint !== '') linecfg.midpoint = Number(this.state.midpoint);
                if(this.state.cornerRadius !== '') linecfg.cornerRadius = Number(this.state.cornerRadius);
                break;
            }
            case 'StateMachine': {
                if(this.state.curviness !== '') linecfg.curviness = Number(this.state.curviness);
                break;
            }
        }
        return linecfg;
    }

    applyType(cn, type, config){
        if(cn){
            cn.setConnector([type, config]);
        }
    }

    setConnection(cn) {
        this.connection = cn;
        var id = cn.id.replace(/\D/g, '');

        var lineData = window.topology.lines[id];
        if(!lineData) {
            showLog('Line not found', 'error');
            return;
        }

        var linecfg = {
            stub: '',
            curviness: '',
            midpoint: 0.5,
            cornerRadius: '',
        };
        
        try { 
            var linecfgParse = JSON.parse(lineData.linecfg); 
            linecfg = {...linecfg, ...linecfgParse};
        } catch (error) {
           
        }
        

        var newState = {
            linestyle: get(lineData.linestyle, 'Straight'),
            paintstyle: get(lineData.paintstyle, 'solid'),
            color: get(lineData.color, ''),
            label: get(lineData.label, ''),
            width: get(lineData.width, ''),
            endsym: get(lineData.endsym, ''),
            startsym: get(lineData.startsym, ''),

            ...linecfg,
        }

        this.setState(newState);
        this.original = newState;
    }



    createLine(e){
       
        var id = makeId();

        $('#context-menu').remove();
        this.original = this.state;

        var zoom = 1;
        if(typeof getZoomLab == 'function') zoom = getZoomLab()/100;

        var addData={
            id: id,
            linestyle: this.state.linestyle,
            paintstyle: this.state.paintstyle,
            color: this.state.color,
            label: this.state.label,
            width: this.state.width,
            endsym: this.state.endsym,
            startsym: this.state.startsym,
            linecfg: JSON.stringify(this.getlineCfg()),
            x1 : e.clientX/zoom,
            x2 : e.clientX/zoom + 200,
            y1 : e.clientY/zoom,
            y2 : e.clientY/zoom,
        }

        this.connection = this.drawline(addData);
        lab_topology.draggable($('.customShape'), {
            grid: [3, 3],
            start: ObjectStartDrag,
            stop: ObjectPosUpdate
        });

        this.addLine(addData);

    }


   

    drawline(line){
        if(!isset(line.x1) || !isset(line.x2) || !isset(line.y1) || !isset(line.y2)) return;
        var labView = $("#lab-viewport");
        var id = line.id;
        var s = `<div id="startLine${id}" style="z-index:12000; position: absolute; width:20px; height: 20px; cursor: move; top: ${line.y1}px; left:${line.x1}px" class="customShape linePoint"><a href="#"></a></div>`;
        s += `<div id="endLine${id}" style="z-index:12000; position: absolute; width:20px; height: 20px; cursor: move; top: ${line.y2}px; left:${line.x2}px" class="customShape linePoint"><a href="#"></a></div>`;
       
        labView.prepend(s);
        const A = lab_topology.addEndpoint("startLine" + id);
        const Z = lab_topology.addEndpoint("endLine" + id);

        const cn = lab_topology.connect({
            source: A, 
            target: Z,
            paintStyle: {strokeWidth: 2, stroke: '#0066aa'},
        });

        cn.id = `line${id}`;
        if(line.linecfg && line.linestyle) this.applyType(cn, line.linestyle, JSON.parse(line.linecfg));
        if(line.color) this.applyColor(cn, line.color);
        if(line.label) this.applyLabel(cn, line.label, line.color);
        if(line.paintstyle) this.applyStyle(cn, line.paintstyle);
        if(isset(line.width)) this.applyWidth(cn, line.width);
        if(isset(line.width)) this.applySym(cn, line.color, line.endsym, line.startsym);
        cn.bind("click", (conn, ev)=>{
            ev.stopPropagation();
            $(`#startLine${id}, #endLine${id}`).addClass('ui-selected');
            updateFreeSelect();
        });
        return cn;
    }


    addLine(data){
        if(LOCK==1) return;
        return axios.request({
            url: `/api/labs/session/line/add`,
            method: 'post',
            data: {
                data: data,
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                } else {
                    this.onCancel();
                    App.topology.printTopology();
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })
    }

    editLine(data){
        if(LOCK==1) return;
        return axios.request({
            url: `/api/labs/session/line/edit`,
            method: 'post',
            data: {
                data: data,
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                } else {
                    this.onCancel();
                    App.topology.printTopology();
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })
    }



    getLines(draw = true){
        return axios.request({
            url: `/api/labs/session/line`,
            method: 'get',
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    this.lines = response['message'];

                    if(!draw) return;

                    for( let i in this.lines){
                        var line = this.lines[i];
                        this.drawline(line);
                    }
                    if (LOCK == 0) {
                        lab_topology.draggable($('.customShape'), {
                            grid: [3, 3],
                            start: ObjectStartDrag,
                            stop: ObjectPosUpdate
                        });
                    }

                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })
    }


    updatePostionLines(data){
        if(data.length == 0 || LOCK==1) return Promise.resolve();
        return axios.request({
            url: `/api/labs/session/line/position`,
            method: 'post',
            data: {
                data: data,
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                } else {
                    error_handle(response);
                    App.topology.printTopology()
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })
    }

    deleteLine(id){
        return axios.request({
            url: `/api/labs/session/line/delete`,
            method: 'post',
            data: { 
                id: id
            }
        })

            .then(response => {
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                    App.topology.printTopology()
                } else {
                    error_handle(response);
                    App.topology.printTopology()
                }

            })

            .catch(function (error) {
                console.log(error);
                error_handle(error);
            })
    }


    moveSelectPoint(arrow){
        if(this.moveInteval) return;
        var selectPoints = $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting,.customShape.ui-selected,.customShape.ui-selecting');
        if(selectPoints.length == 0) return;

        $('#lab-viewport').css('pointer-events', 'none');
        this.moveInteval = setInterval(()=>this.stepPoint(selectPoints, arrow), 100);
        
    }

    stopSelectPoint(ev){
        var selectPoints = $('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting,.customShape.ui-selected,.customShape.ui-selecting');
        if(selectPoints.length == 0) return;
        if(this.moveInteval){
            clearInterval(this.moveInteval);
            this.moveInteval = null;
        }
        if(this.stopTimeout){
            clearTimeout(this.stopTimeout);
            this.stopTimeout = null;
        }
        this.stopTimeout = setTimeout(()=>{
            window.moveCount = selectPoints.length - 1;
            ObjectPosUpdate(ev);
            window.dragstop = 0;
            $('#lab-viewport').css('pointer-events', 'auto');
        }, 500);
    }

    stepPoint(nodes, arrow){
        if (arrow == 39) {
            nodes.each((id, node) => {
                var left = Number(node.style.left.replace(/\D/g, ''));
                var newP = left + 1;
                if (newP > this.labViewWidth) newP = this.labViewWidth;
                node.style.left = newP + 'px';
            })
            lab_topology.repaintEverything()
        }
        if (arrow == 37) {
            nodes.each((id, node) => {
                var left = Number(node.style.left.replace(/\D/g, ''));
                var newP = left - 1;
                if (newP < 0) newP = 0;
                node.style.left = newP + 'px';
            })
            lab_topology.repaintEverything()

        }
        if (arrow == 38) {
            nodes.each((id, node) => {
                var top = Number(node.style.top.replace(/\D/g, ''));
                var newP = top - 1;
                if (newP < 0) newP = 0;
                node.style.top = newP + 'px';
            })
            lab_topology.repaintEverything()

        }
        if (arrow == 40) {
            nodes.each((id, node) => {
                var top = Number(node.style.top.replace(/\D/g, ''));
                var newP = top + 1;
                if (newP > this.labViewHeight) newP = this.labViewHeight;
                node.style.top = newP + 'px';
            })
            lab_topology.repaintEverything()

        }
    }



    componentDidMount() {

        $(document).on('contextmenu', '.linePoint', (e)=>{
            if(LOCK==1) return;
            var id = e.currentTarget.id.replace(/\D/g, '');
            window.connToDel = lab_topology.getConnections().find(item=>item.id==`line${id}`);
            if(!window.connToDel) return;

            if (ROLE == "user" || LOCK == 1) return;
            var body = ''
            body += '<li><a class="action-lineedit" href="javascript:void(0)"><i class="glyphicon glyphicon-edit"></i> Edit</a></li>';
            body += '<li><a class="action-linedelete" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> Delete</a></li>';

            printContextMenu('Connection', body, e);
            e.stopPropagation();
            e.preventDefault();
            return;
            
        });
            
        

        $(document).on('click', '.action-lineedit', (e) => {
            if(LOCK==1) return;
            if(App.topControl){
                showLog(lang('Apply your change first'), 'error');
                return;
            }
            this.setConnection(window.connToDel);
            $('#context-menu').remove();
            this.modal();
        })

        $(document).on('click', '.action-linedelete', (e) => {
            if(LOCK==1) return;
            if(App.topControl){
                showLog(lang('Apply your change first'), 'error');
                return;
            }
            var id = window.connToDel.id;
            id = id.replace(/\D/g, '');
            this.deleteLine(id);
            $('#context-menu').remove();
        })

        $(document).on('click', '.action-lineadd', (e) => {
            if(LOCK==1) return;
            if(App.topControl){
                showLog(lang('Apply your change first'), 'error');
                return;
            }
            this.createLine(e);
            $('#context-menu').remove();
            this.modal();
        })

        $(document).on('click', `#color${this.id}`, ev => {
            ev.stopPropagation();
        })

        global.hideLineControl = ()=>{
            this.connection = null;
            this.modal('hide')
        }

        global.isEdittingLine = ()=>{
            return this.state.show;
        }

        global.setLinePosition = (data)=>{
            return this.updatePostionLines(data);
        }

        global.getLines = this.getLines.bind(this);
        
        $(document).on('keydown', (e)=>{
            var key = e.keyCode; 
            if(key==37 || key==38 || key==39 || key==40){
                this.moveSelectPoint(key)
            }
        }) 

        $(document).on('keyup', (e)=>{
            var key = e.keyCode; 
            if(key==37 || key==38 || key==39 || key==40){
                this.stopSelectPoint(e)
            }
        }) 


    }

}
export default LineControl;