import React, { Component } from 'react';
import ZoomBar from '../zoom/ZoomBar';

class Topo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: {},
            image_id: '',
        }
    }

    render() {
        return <>
            <div className='topo_frame' style={{ overflow: 'auto' }}>
                <div className='box_flex'>

                    {Object.keys(this.state.images).map(key => {
                        var image = this.state.images[key];
                        return <div key={image['id']} style={{ margin: 2 }} className='button btn btn-xs btn-primary' onClick={() => { $('.modal').modal('hide'); this.printPictureInScreen(image['id']) }}>{image['name']}</div>
                    })}

                    <div className='button btn btn-xs btn-info' style={{ margin: 2 }} onClick={() => { this.showPhysical() }}>{lang("Physical")}</div>
                    <div className='zoom_frame' style={{ position: 'fixed', right: '15%', left: '15%', top: 5, display: (this.state.image_id == '' ? 'none' : 'block') }}>
                        <ZoomBar orient='hz' onChange={value => this.zoomImage(value)}></ZoomBar></div>
                    <div className='zoom_frame' style={{ position: 'fixed', right: '15%', left: '15%', top: 5, display: (this.state.image_id == '' ? 'block' : 'none') }}>
                        <ZoomBar orient='hz' max='200' value='100' ref={c => this.zoomLabBar = c} onChange={value => {
                            zoomlab(value);
                            saveZoomLab(value);
                        }} autofit={() => this.autoFitLab()}></ZoomBar>
                    </div>

                </div>
            </div>
            <style>{`
                    .zoom_frame{
                        opacity: 0;
                    }
                    .zoom_frame:hover{
                        opacity:1;
                    }
                `}</style>

        </>
    }

    componentDidMount() {
        this.getImages()
        global.getZoomLab = () => {
            return this.zoomLabBar.getValue();
        }
        global.setZoomLab = (value) => {
            return this.zoomLabBar.setValue(value);
        }
        global.recoverZoomLab = () => {
            var labZoomData = localStorage.getItem('labZoomData');
            if (labZoomData == null) {
                labZoomData = {};
            } else {
                try { labZoomData = JSON.parse(labZoomData) } catch (error) { labZoomData = {} }
            }
            
            var zoom = get(labZoomData[App.topology.labinfo.id], 100);
            this.zoomLabBar.setValue(zoom);
            $('#lab-viewport').width(($(window).width())*100 / zoom)
            $('#lab-viewport').height($(window).height()*100 / zoom);
        }

        global.saveZoomLab = (value)=>{
            var labZoomData = localStorage.getItem('labZoomData');
            if (labZoomData == null) {
                labZoomData = {};
            } else {
                try { labZoomData = JSON.parse(labZoomData) } catch (error) { labZoomData = {} }
            }
            labZoomData[App.topology.labinfo.id] = value;
            localStorage.setItem('labZoomData', JSON.stringify(labZoomData));
        }


    }

    

    getImages() {
        getPictures().then((data) => { this.setState({ images: data }) })
    }

    zoomImage(value) {
        var zoomValue = value;
        var piczoomVal = zoomValue / 50;
        $("#lab_screen_image").find('img').css(
            'transform',
            'scale(' + piczoomVal + ')');
    }


    printPictureInScreen(id) {

        this.setState({ image_id: id });
        var picture_id = id;
        var picture_url = `/api/labs/session/picturedata?id=${id}`

        $.when(getPictures(picture_id))
            .done(
                (picture) => {
                    var picture_map = picture['map'];
                    picture_map = picture_map
                        .replace(
                            /href='telnet:..{{IP}}:{{NODE([0-9]+)}}/g,
                            function (a, b, c, d, e) {
                                var nodeId = b;
                                if (window.nodes[nodeId]) {
                                    return `href="#" data-name="${window.nodes[nodeId]['name']}" onmousedown="nodehtmlconsoledown()" class='node_frame nodehtmlconsole context-menu' nid="${nodeId}" data-path="${nodeId}"`;

                                }
                                return 'href="#"';
                            });

                    var body = `<div id="lab_picture_screen" style="width:100%; height:100%; display: flex;">
                        <img style="margin: auto;" class="" usemap="#picture_map" 
                        src="${picture_url}"/>
                        <map name="picture_map">${picture_map}</map></div>`

                    this.printNodesMapToScreen({
                        name: picture['name'],
                        body: body,
                        footer: ''
                    }, function () {
                        setTimeout(function () {
                            $('map').imageMapResize();
                        }, 500);
                    });
                    window.lab_picture = jsPlumb.getInstance()
                    lab_picture.setContainer($('#lab_picture'))

                    setTimeout(function () {

                        var imgH = $("#lab_screen_image").find('img')
                            .height();
                        var imgW = $("#lab_screen_image").find('img')
                            .width();
                        var screenH = $(window).height();
                        var screenW = $(window).width();

                        console.log(imgH + " " + imgW + " " + screenH + " "
                            + screenW);

                        if ((imgW / screenW) > (imgH / screenH)) {
                            $("#lab_screen_image").find('img').css('width',
                                '99%');
                        } else {
                            $("#lab_screen_image").find('img').css(
                                'height', '99%');
                        }

                        $("#lab_screen_image").find('img').draggable();
                    }, 200);

                    // =======================================================

                }).fail(function (message) {
                    error_handle(message)
                });

    }


    autoFitLab() {
        
        var screenH = $(window).height();
        var screenW = $(window).width();

        var children = $("#lab-viewport .node_frame, #lab-viewport .network-farme, #lab-viewport .customShape");

        var maxH = 0;
        var maxW = 0;

        for (let i in children) {
            var newW = children[i].clientWidth + children[i].offsetLeft;
            var newH = children[i].clientHeight + children[i].offsetTop;

            if (newW > maxW) maxW = newW;
            if (newH > maxH) maxH = newH;


        }

        maxH += 30;
        maxW += 30;

        var zoom = screenH * 100 / maxH;
        if (zoom > screenW * 100 / maxW) zoom = screenW * 100 / maxW;

        zoomlab(zoom);
        saveZoomLab(zoom);
        this.zoomLabBar.setValue(zoom);

    }



    printNodesMapToScreen(values, cb) {
        $("#lab_screen_image").remove();
        var html = '<div id="lab_screen_image" class="" style ="position: absolute;z-index: 100;top: 0px; bottom:0px; left:0px; right:0px; background: #fff;">'
            + values.body
            + '</div>';
        $('body').append(html);
        cb && cb();
    }

    showPhysical() {
        this.setState({ image_id: '' });
        $("#lab_screen_image").remove();
        $('.modal').modal('hide');
    }

}

export default Topo

