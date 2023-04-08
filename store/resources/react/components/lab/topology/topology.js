
import node from './node';
import network from './network';
import textobject from './textobject';
import line from './line';

class topology {

    constructor(preview = false) {
        App.topology = this;
        this.labview = $('#lab-viewport');
        this.nodes = {};
        this.networks = {};
        this.lines = {};
        this.textobjects = {};
        this.labinfo = {};
        this.links = {};
        this.preview = preview;


        this.loadingbar = $('#loading-lab');
        this.unuseNetwork = [];

        this.histories = [];
        this.historyIndex = 0;

    }

    getTopoData() {

        this.loadingbar.show();

        return axios.request({
            url: '/api/labs/session/topology',
            method: 'get',
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total > 0) {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    $(".loading-lab .progress-bar").css("width", percentCompleted + "%");
                }
            }
        })

            .then(response => {
                this.loadingbar.hide();
                var data = response['data']['data'];
                this.setData(data);
                if(typeof(recoverZoomLab) == 'function') recoverZoomLab();
                return true;
            })

            .catch((error) => {
                this.loadingbar.hide();
                error_handle(error)
                return false;
            })

    }





    setData(response) {

        this.nodes = {};
        this.networks = {};
        this.lines = {};
        this.textobjects = {};
        this.labinfo = {};


        var networks = get(response['networks'], {});
        global.networks = networks;
        for (let network_id in networks) {
            this.networks[network_id] = new network(networks[network_id])
        }

        var lines = get(response['lines'], {});
        global.lines = lines;
        for (let id in lines) {
            this.lines[id] = new line(lines[id])
        }

        var textobjects = get(response['textObjects'], {});
        global.textobjects = textobjects;
        for (let id in textobjects) {
            this.textobjects[id] = new textobject(textobjects[id])
        }

        var nodes = get(response['nodes'], {});
        global.nodes = nodes;
        for (let nodeId in nodes) {
            this.nodes[nodeId] = new node(nodes[nodeId])
        }

        this.labinfo = get(response['labinfo'], {});
        global.lab = this.labinfo;
        global.LOCK = global.lab.lock;

        global.topology = {
            networks: global.networks,
            nodes: global.nodes,
            lines: global.lines,
            textobjects: global.textobjects,
            labinfo: global.lab
        }

        this.createLinks();
        this.deleteUnuseNetworks();

    }

    updateData(data) {
        if (!data) return;

        if (isset(data['networks'])) {
            this.networks = {};
            var networks = data['networks'];
            global.networks = networks;
            global.topology.networks = networks;
            for (let network_id in networks) {
                this.networks[network_id] = new network(networks[network_id])
            }
        }

        if (isset(data['nodes'])) {
            this.nodes = {};
            var nodes = data['nodes'];
            global.nodes = nodes;
            global.topology.nodes = nodes;
            for (let node_id in nodes) {
                this.nodes[node_id] = new node(nodes[node_id])
            }
        }

        if (isset(data['lines'])) {
            this.lines = {};
            var lines = data['lines'];
            global.lines = lines;
            global.topology.lines = lines;
            for (let line_id in lines) {
                this.lines[line_id] = new line(lines[line_id])
            }
        }

        if (isset(data['textobjects'])) {
            this.textobjects = {};
            var textobjects = data['textobjects'];
            global.textobjects = textobjects;
            global.topology.textobjects = textobjects;

            for (let textobject_id in textobjects) {
                this.textobjects[textobject_id] = new textobject(textobjects[textobject_id])
            }
        }

        if (isset(data['labinfo'])) {
            this.labinfo = data['labinfo'];
            global.lab = this.labinfo;
            global.topology.lab = this.labinfo;
            global.LOCK = this.labinfo.lock;
            console.log('atat')

        }

        this.createLinks();
        this.deleteUnuseNetworks();
    }



    deleteUnuseNetwork(id) {
        return axios.request({
            url: '/api/labs/session/networks/delete',
            method: 'post',
            data: {
                id: id
            }
        })

            .then(response => {
                this.updateData(response['update']);
                return true;
            })

            .catch(function (error) {
                error_handle(error);
                return false;
            })

    }

    deleteUnuseNetworks() {
        if (this.unuseNetwork.length <= 0) return;
        var promises = [];
        for (let i in this.unuseNetwork) {
            promises.push(this.deleteUnuseNetwork(this.unuseNetwork[i]));
        }
        this.unuseNetwork = [];

    }

    registerUnuseNetwork(id) {
        this.unuseNetwork.push(id);
    }





    /**
     * 
     * Find enpoint for a network instance
     */
    findEndpoint() {

        for (let network_id in this.networks) {
            var network = this.networks[network_id];
            network.endpoints = [];
        }

        for (let node_id in this.nodes) {
            var node = this.nodes[node_id];
            var ethernets = node.get('ethernets', {});

            for (let interface_id in ethernets) {
                var interfc = ethernets[interface_id];
                var network_id = interfc.get('network_id');
                if (network_id !== '' && this.networks[network_id]) {
                    this.networks[network_id].endpoints.push({
                        node: node,
                        interface: interfc,
                        type: 'ethernet',
                    })
                }
            }
        }
    }

    /** Create link for topology */

    createLinks() {

        this.links = {};
        this.findEndpoint();

        for (let network_id in this.networks) {
            var links = this.networks[network_id].createLinks();
            links.map(link => this.links[link.id] = link);
        }

        for (let node_id in this.nodes) {
            var node = this.nodes[node_id];
            var serials = node.get('serials', {});
            for (let interfc_id in serials) {
                var interfc = serials[interfc_id];
                var remoteId = interfc.get('remote_id');
                if (Number(remoteId) < Number(node_id)) continue;
                var remoteIf = interfc.get('remote_if');
                if (isset(this.nodes[remoteId])) {
                    var remoteInterfc = this.nodes[remoteId].get('serials', {})[remoteIf]
                    if (remoteInterfc) {
                        var id = `iface:node${node_id}:${interfc.get('id')}`;
                        this.links[id] = {
                            source: {
                                node: node,
                                interface: interfc,
                                type: 'serial'
                            },

                            dest: {
                                node: this.nodes[remoteId],
                                interface: remoteInterfc,
                                type: 'serial'
                            },
                            id: id,
                        }
                    }
                }

            }
        }
    }


    applyLinkStyle(cn, p) {

        /** set pain style */
        var painStyle = cn.getPaintStyle();
        if (isset(p['color']) && p['color'] != '') {
            painStyle.stroke = p['color'];

        }

        if (isset(p['width']) && p['width'] != '') {
            if (p['width'] == '') p['width'] = 2;
            var painStyle = cn.getPaintStyle();
            painStyle.strokeWidth = p['width'];
        }

        cn.setPaintStyle(painStyle);

        /**===== */

        if (isset(p['label'])) {
            var label = $('<div class="link_label"/>');
            if (isset(p['color']) && p['color'] != '') {
                label.css('color', p['color']);
                label.css('border-color', p['color']);
            }

            if (isset(p['fontsize']) && p['fontsize'] != '') {
                label.css('font-size', p['fontsize'] + 'px');
                cn.fontsize = p['fontsize'];
            }

            try {
                var transformStyle = '';
                var hideClass = '';
                if (p['labelpos'] && p['labelpos'] != '') {
                    var labelpos = JSON.parse(p['labelpos']);
                    if (labelpos == null) labelpos = {};
                    if (typeof (labelpos.x) != 'undefined' && typeof (labelpos.y) != 'undefined') transformStyle = `translate(${labelpos.x}px, ${labelpos.y}px)`;
                    if (labelpos.hide == true) hideClass = 'label_hide';
                    if (typeof (labelpos.rotate) != 'undefined') transformStyle += ` rotate(${labelpos.rotate}deg)`;
                }
                if (transformStyle != '') label.css('transform', transformStyle);
                if (hideClass != '') label.addClass(hideClass);


            } catch (error) { console.log(error) }

            if (p['label'] == '') label.addClass('label_hide');
            label.text(p['label']);
            label.attr('connect_id', cn.id);

            cn.setLabel(label[0].outerHTML);
        }

        if (isset(p['style']) && p['style'] != '') {
            var className = cn.getClass();
            var newClassName = className.replace(/\s?border_style_([a-z]+)/g, '');
            newClassName = newClassName + ' ' + `border_style_${p['style']}`;
            cn.removeClass(className);
            cn.addClass(newClassName);
        }



        if (isset(p['linkcfg']) && p['linkcfg'] != '') {
            try {
                var linkcfg = JSON.parse(p['linkcfg']);
                cn.setConnector([p.linkstyle, linkcfg]);
                if (p.linkstyle == 'Flowchart' || p.linkstyle == 'Straight') cn.connector.stub = linkcfg.stub;
                if (p.linkstyle == 'Flowchart') cn.connector.midpoint = linkcfg.midpoint;
                if (p.linkstyle == 'StateMachine') cn.connector.curviness = linkcfg.curviness;
            } catch (error) { console.log(error) }
        }

        var overlays = cn.getOverlays();
        for (let id in overlays) {
            if (id == '__label') continue;
            var overlay = overlays[id];
            var label = $(`<div>${overlay.getLabel()}</div>`).text();
            var labelObj = $('<div class="node_interface"/>')
            label = label.split(':');
            if (label.length < 2) continue;
            if (label[1] != '') {
                try {
                    var transformStyle = '';
                    var hideClass = '';
                    if (label[0] == 'src') {
                        var positionData = p['srcpos'];
                    } else {
                        var positionData = p['dstpos'];
                    }
                    if (positionData && positionData != '') {
                        var labelpos = JSON.parse(positionData);
                        if (labelpos == null) labelpos = {};
                        if (typeof (labelpos.x) != 'undefined' && typeof (labelpos.y) != 'undefined') transformStyle = `translate(${labelpos.x}px, ${labelpos.y}px)`;
                        if (labelpos.hide == true) hideClass = 'label_hide';
                        if (typeof (labelpos.rotate) != 'undefined') transformStyle += ` rotate(${labelpos.rotate}deg)`
                    }

                    labelObj.text(label[1]);
                    labelObj.attr('position', label[0]);
                    labelObj.attr('connect_id', cn.id);

                    if (transformStyle != '') labelObj.css('transform', transformStyle);
                    if (hideClass != '') labelObj.addClass(hideClass);
                    if (isset(p['color']) && p['color'] != '') {
                        labelObj.css('color', p['color']);
                        labelObj.css('border-color', p['color']);
                    }
                    if (isset(p['fontsize']) && p['fontsize'] != '') {
                        labelObj.css('font-size', p['fontsize'] + 'px');
                        cn.fontsize = p['fontsize']
                    }

                } catch (error) { console.log(error) }

                overlay.setLabel(labelObj[0].outerHTML);

            }
        }

    }


    printTopology(loading = false) {

        if (App.topControl) {
            showLog(lang('Apply your change first'), 'error');
            return;
        }
        console.log('Starting Print Topology')
        window.topoChange = false;

        var finishResolve;
        const finish = new Promise((callback) => { finishResolve = callback })

        if (loading) App.loading(true);

        this.labview.empty();
        this.labview.selectable();
        this.labview.selectable("destroy");
        this.labview.selectable({
            filter: ".customShape, .network, .node",
            start: () => { },
            stop: (event, ui) => {
                if (typeof (updateFreeSelect) == 'function') updateFreeSelect(event, ui)
            },
            distance: 1
        });

        this.labview.removeClass("freeSelectMode");

        window.lab_topology = undefined;
        var imagePromise = [];

        /** Show visible network to the topology */
        for (let network_id in this.networks) {
            var network = this.networks[network_id];
            if (network.get('visibility') == 0) continue;

            var icon;

            if (network.get('type') == 'bridge' || network.get('type') == 'ovs') {
                icon = 'lan.png';
            } else {
                icon = 'cloud.png';
            }

            icon = network.get('icon', icon);

            network.component = $(`
                    <div id="network${network_id}" 
                        class="context-menu  network network${network_id} network_frame " 
                        style="top: ${network.get('top')}px; left:${network.get('left')}px" 
                        data-path="${network_id}" 
                        data-name="${network.get('name')}">
                        <div class="network_name">${network.get('name')}</div>
                        <div class="tag hidden" title="${lang('Connect to another node')}">
                            <i class="fa fa-plug plug-icon dropdown-toggle ep"></i>
                        </div>
                        <div class='quickset tag hidden box_flex'>
                            <i data-path="${network_id}" title="${lang('Delete')}" class='action-networkdelete button node_stop fa fa-trash '></i>
                            <i data-path="${network_id}" title="${lang('Edit')}" class='action-networkedit control button node_edit fa fa fa-pencil-square'></i>
                        </div>
                    </div>
                `)

            this.labview.append(network.component);

            imagePromise.push(new Promise((resolve) => {
                var img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.onabort = resolve;
                img.src = `/images/icons/${icon}`
                if (network.get('size') != '') img.style.width = `${network.get('size')}px`
                $(img).prependTo(network.component);
            }))

        }

        /** Show node to the topology */
        for (let node_id in this.nodes) {
            var node = this.nodes[node_id];

            var hrefbuf = `<i title="${lang(node.get('console')==''?'telnet':node.get('console'))}: ${node.get('port')}" onmousedown="nodehtmlconsoledown()" class='node_icon nodehtmlconsole' nid="${node_id}"></i>`;

            if (node.get('url_2nd') != '') {
                var hrefbuf2nd = `<i title="${lang(node.get('console_2nd')==''?'telnet':node.get('console_2nd'))}: ${10000 + Number(node.get('port'))}" onmousedown="nodehtmlconsoledown()" class='nodehtmlconsole2nd button fa fa-terminal' nid="${node_id}"></i>`;
            } else {
                var hrefbuf2nd = '';
            }

            node.component = $(`
                    <div id="node${node_id}" 
                        class="context-menu node node${node_id} node_frame "
                        style="top: ${node.get('top')}px; left: ${node.get('left')}px" 
                        data-path="${node_id}" 
                        data-status="${node.get('status')}" 
                        data-name="${node.get('name')}">
                        <div class="tag hidden" title="${lang('Connect to another node')}">
                            <i class="fa fa-plug plug-icon dropdown-toggle ep"></i>
                        </div>
                        <div class='quickset tag hidden box_flex'>
                            <i data-path="${node_id}" title="${lang('Start')}" class='action-nodestart button node_start fa fa-play'></i>
                            <i data-path="${node_id}" title="${lang('Stop')}" class='action-nodestop button node_stop fa fa-stop '></i>
                            <i data-path="${node_id}" title="${lang('Edit')}" class='action-nodeedit control button node_edit fa fa fa-pencil-square'></i>
                            <i data-path="${node_id}" title="${lang('Wipe')}" class='action-nodewipe button node_wipe fa fa fa-eraser'></i>
                            ${hrefbuf2nd}
                        </div>
                        ${hrefbuf}
                        <div class="node_name"><i class="node_status fa"></i>&nbsp;${node.get('name')}</div>
                    </div>`
            )

            this.labview.append(node.component);

            imagePromise.push(new Promise((resolve) => {
                var img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.onabort = resolve;
                img.src = `/images/icons/${node.get('icon', 'Router.png')}`
                if (node.get('size') != '') img.style.width = `${node.get('size')}px`
                if (node.get('status') == 0) img.className = 'node_image';
                $(img).appendTo(`#node${node_id} .node_icon`);
            }))

        }


        /** Show textobject to the topology */
        for (let textobject_id in this.textobjects) {
            var textObject = this.textobjects[textobject_id];
            var textDe64 = atob(textObject['data']);
            try { textDe64 = decodeURIComponent(textDe64) } catch (e) { }
            var $newTextObject = $(textDe64);

            if (textObject.get('type') == 'text') {
                $newTextObject.attr("id", "customText" + textObject.get('id'));
                $newTextObject.attr("data-path", textObject.get('id'));
                this.labview.prepend($newTextObject);
            } else {
                this.labview.prepend($newTextObject);
            }

            $newTextObject.removeClass('ui-selected');
            $newTextObject.removeClass('move-selected');
            $newTextObject.removeClass('dragstopped');
        }

        /** Create jsplumb instance */

        Promise.all(imagePromise).then(() => {

            jsPlumb.ready(() => {

                // Create jsPlumb topology
                try { window.lab_topology.reset() } catch (ex) { window.lab_topology = jsPlumb.getInstance() };
                window.moveCount = 0
                lab_topology.setContainer(this.labview);
                lab_topology.importDefaults({
                    Anchor: 'Continuous',
                    Connector: ['Straight'],
                    Endpoint: 'Blank',
                    PaintStyle: { strokeWidth: 2, stroke: '#c00001' },
                    cssClass: 'link',
                });
                // Read privileges and set specific actions/elements

                for (let node_id in this.nodes) {
                    var node = this.nodes[node_id];

                    lab_topology.makeSource('node' + node_id, {
                        filter: ".ep",
                        Anchor: "Continuous",
                        extract: {
                            "action": "the-action"
                        },
                        maxConnections: 50,
                        onMaxConnections: function (info, e) {
                            alert("Maximum connections (" + info.maxConnections + ") reached");
                        }
                    });

                    lab_topology.makeTarget($('#node' + node_id), {
                        dropOptions: { hoverClass: "dragHover" },
                        anchor: "Continuous",
                        allowLoopback: false
                    });
                    if (typeof (adjustZoom) == 'function') adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
                }

                for (let network_id in this.networks) {
                    var network = this.networks[network_id];
                    if (network.get('visibility') == 1) {
                        lab_topology.makeSource('network' + network_id, {
                            filter: ".ep",
                            Anchor: "Continuous",
                            //connectionType: "basic",
                            extract: {
                                "action": "the-action"
                            },
                            maxConnections: 50,
                            onMaxConnections: function (info, e) {
                                alert("Maximum connections (" + info.maxConnections + ") reached");
                            }
                        })

                        lab_topology.makeTarget($('#network' + network_id), {
                            dropOptions: { hoverClass: "dragHover" },
                            anchor: "Continuous",
                            allowLoopback: false
                        })
                    }
                    if (typeof (adjustZoom) == 'function') adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)
                }


                for (let i in this.links) {
                    var link = this.links[i];
                    var linkType = link.source.type;

                    var src_label = ["Label"];
                    var dst_label = ["Label"];
                    var source = link.source.node.component.attr('id')
                    var source_label = link.source.interface.get('name');
                    var destination = link.dest.node.component.attr('id')
                    var destination_label = '';
                    if (link.dest.interface) {
                        destination_label = link.dest.interface.get('name');
                    }

                    if (linkType == 'ethernet') {
                        var src_quality_class = ''
                        if (link.source.interface != null) {
                            src_quality_class = ' ' + link.source.interface.get('quality_class');
                        }
                        var dest_quality_class = ''
                        if (link.dest.interface != null) {
                            dest_quality_class = ' ' + link.dest.interface.get('quality_class');
                        }

                        var src_suspend_class = ''
                        if(link.source.interface.get('suspend') == '1') src_suspend_class = ' suspended'

                        var dest_suspend_class = ''
                        if(link.dest.interface.get('suspend') == '1') dest_suspend_class = ' suspended'

                        if (source_label != '') {
                            src_label.push({
                                label: 'src:' + source_label,
                                location: 0.15,
                                cssClass: source + ' ' + destination + src_quality_class + src_suspend_class
                            });
                        } else {
                            src_label.push(Object());
                        }
                        if (destination_label != '') {
                            dst_label.push({
                                label: 'dst:' + destination_label,
                                location: 0.85,
                                cssClass: source + ' ' + destination + dest_quality_class + dest_suspend_class
                            });
                        } else {
                            dst_label.push(Object());
                        }
                        var tmp_conn = lab_topology.connect({
                            source: source,
                            target: destination,
                            cssClass: source + ' ' + destination + ' frame_ethernet',
                            paintStyle: { strokeWidth: 2, stroke: '#0066aa' },
                            overlays: [src_label, dst_label]
                        });

                        tmp_conn.id = i



                    }

                    if (linkType == 'serial') {
                        src_label.push({
                            label: 'src:' + source_label,
                            location: 0.15,
                            cssClass: source + ' ' + destination
                        });
                        dst_label.push({
                            label: 'dst:' + destination_label,
                            location: 0.85,
                            cssClass: source + ' ' + destination
                        });

                        var tmp_conn = lab_topology.connect({
                            source: source,
                            target: destination,
                            cssClass: source + " " + destination + ' frame_serial',
                            paintStyle: { strokeWidth: 2, stroke: "#ffcc00" },
                            overlays: [src_label, dst_label]
                        });

                        tmp_conn.id = i;

                    }

                    this.applyLinkStyle(tmp_conn, link.source.interface.get('style', {}));

                }


                /** Show line to the topology */
                for (let line_id in this.lines) {
                    var line = this.lines[line_id];
                    if (App.lineControl) App.lineControl.drawline(line.get('params', {}));
                }

                if (LOCK == 0 && !this.preview) {

                    lab_topology.draggable($('.node_frame, .network_frame, .customShape'), {
                        filter: ".ep",
                        containment: false,
                        grid: [3, 3],
                        start: ObjectStartDrag,
                        stop: ObjectPosUpdate
                    });

                    if (typeof (adjustZoom) == 'function') adjustZoom(lab_topology, window.scroll_top || 0, window.scroll_left || 0)

                };


                // if (typeof (hideLinkControl) == 'function') hideLinkControl();
                // if (typeof (hideLineControl) == 'function') hideLineControl();

                if (typeof (printLabStatus) == 'function') printLabStatus();

                if (!this.preview) {
                    lab_topology.unbind('connection');
                    lab_topology.bind("connection", function (info, oe) {
                        newConnModal(info, oe);
                    });
                    // Bind contextmenu to connections
                    lab_topology.unbind('contextmenu');
                    lab_topology.bind("contextmenu", function (info) {
                        connContextMenu(info);
                    });
                }

                if (LOCK == 1) $('.action-labobjectadd-li').hide();


                App.loading(false);
                finishResolve();
            })

        })


        return finish;


    }


    createContextMenu(e) {
        var object = $(e.currentTarget);
        console.log('contextmenu');
        e.stopPropagation();
        e.preventDefault();
        var body = '';
        if (this.labview.data("prevent-contextmenu")) {
            return;
        }
        var isFreeSelectMode = this.labview.hasClass("freeSelectMode");

        console.log("context menu called");

        this.labview.data('contextMenuClickXY', { 'x': e.pageX, 'y': e.pageY })

        if (object.hasClass('node_frame')) {
            console.log('DEBUG: opening node context menu');

            var node_id = object.attr('data-path');
            var node = this.nodes[node_id];
            if(!node){
                console.log('DEBUG: Can not find node ' + node_id);
                return;
            }
            var isNodeRunning = object.attr('data-status') > 1;
            var title = object.attr('data-name') + " (" + node_id + ")";

            var size = '';
            var type = '';

            if (window.nodes[node_id]) {
                size = window.nodes[node_id]['size'];
                type = window.nodes[node_id]['type'];

            }

            // Adding interfaces

            var ethernets = node.get('ethernets', {});
            var interfaces = '';
            var eth_sortable = []
            for (var eth in ethernets) {
                eth_sortable.push(ethernets[eth])
            }

            eth_sortable.sort(function (as, bs) {
                var a, b, a1, b1, i = 0, L, rx = /(\d+)|(\D+)/g, rd = /\d/;
                if (isFinite(as.get('name')) && isFinite(bs.get('name'))) return as - bs;
                a = String(as.get('name')).toLowerCase();
                b = String(bs.get('name')).toLowerCase();
                if (a === b) return 0;
                if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
                a = a.match(rx);
                b = b.match(rx);
                L = a.length > b.length ? b.length : a.length;
                while (i < L) {
                    a1 = a[i];
                    b1 = b[i++];
                    if (a1 !== b1) {
                        if (isFinite(a1) && isFinite(b1)) {
                            if (a1.charAt(0) === "0") a1 = "." + a1;
                            if (b1.charAt(0) === "0") b1 = "." + b1;
                            return a1 - b1;
                        }
                        else return a1 > b1 ? 1 : -1;
                    }
                }
                return a.length - b.length;
            })

            $.each(eth_sortable, (id, object) => {
                if (server.user.html5 == '1' || server.common.ctrl_docker_wireshark == '1') {
                    interfaces += `<li><a class="action-nodecapture context-collapsible menu-interface" href="#" onclick="wireshark_capture(${node_id}, ${object.get('id')})" style="display: none;"><i class="glyphicon glyphicon-search"></i> ${object.get('name')}</a></li>`;
                } else {
                    interfaces += '<li><a class="action-nodecapture context-collapsible menu-interface" href="capture://' + window.location.hostname + '/vunl' + node.session + '_' + object.get('id') + '" style="display: none;"><i class="glyphicon glyphicon-search"></i> ' + object.get('name') + '</a></li>';
                }
            });


            var body = `<li>
                        <a class="action-nodestart menu-manage" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                            <i class="glyphicon glyphicon-play"></i> ${lang('Start')}
                        </a>
                    </li>
                    <li>
                        <a class="action-nodestop  menu-manage" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                            <i class="glyphicon glyphicon-stop"></i> ${lang('Stop')}
                        </a>
                    </li>
                    <li>
                        <a class="action-nodewipe menu-manage" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                            <i class="glyphicon glyphicon-erase"></i> ${lang('Wipe')}
                        </a>
                    </li>
                    <li>
                        <a class="action-nodeunlock menu-manage" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                            <i class="fa fa-unlock-alt"></i> ${lang('Unlock')}
                        </a>
                    </li>
                
                    `

            if (node.get('url_2nd') != '') {

                body += `
                            <li>
                                <a href="javascript:void(0)" class="menu-manage nodehtmlconsole2nd button" title="${lang('Secondary Console')}: ${10000 + Number(node.get('port'))}" onmousedown="nodehtmlconsoledown()" nid="${node_id}">
                                    <i class="fa fa-terminal"></i> ${lang('Secondary Console')}
                                </a>
                            </li>
                            `

            }

            if (LOCK == 0) {
                body += `<li>
                            <a class="action-nodeexport" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-save"></i> ${lang('Export CFG')}
                            </a>
                        </li>`;

                body += `<li>
                            <a class="context-collapsible box_flex" href="javascript:void(0)">
                                <span class="fa fa-expand" title="${lang("Node Size")}"></span>&nbsp;
                                <input placeholder="${lang('Node Size')}" min="15" step=1 value="${size}" data-path="${node_id}" style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-nodesize" type="number"></input>
                                &nbsp;<span>(px)</span>
                            </a>
                        </li>`;


                if (isAdmin()) {

                    body += `<li>
                                <a class="action-nodefolder" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                                    <i class="fa fa-folder-open"></i> ${lang('Node Folder')}
                                </a>
                            </li>`;

                    if (type == 'docker' || type == 'qemu') {

                        body += `<li>
                                    <a class="action-nodecommit" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                                        <i class="fa fa-thumb-tack"></i> ${lang('Node Commit')}
                                    </a>
                                </li>`;
                    }

                }

            }
            // capture section
            body += `<li role="separator" class="divider"></li>`
            body += `<li id="menu-node-interfaces">
                        <a class="menu-appear" data-path="menu-interface" href="javascript:void(0)">
                            <i class="glyphicon glyphicon-chevron-right"></i> ${lang('Capture')}
                        </a>
                        <div id="capture-menu">
                            <ul>${interfaces}</ul>
                        </div>
                    </li>`
            // Read privileges and set specific actions/elements

            if (LOCK == 0) {

                body += `<li role="separator" class="divider"><li>`;
                body += `<li>
                            <a class="action-nodeedit control" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-edit"></i> ${lang('Edit')} 
                            </a>
                        </li>`

                if (!isNodeRunning) {
                    body += `<li>
                                <a class="action-nodedelete" data-path="${node_id}" data-name="${title}" href="javascript:void(0)">
                                    <i class="glyphicon glyphicon-trash"></i> ${lang('Delete')}
                                </a>
                            </li>`;
                }

            };






            if (isFreeSelectMode) {
                window.contextclick = 1

                var firstNode = window.freeSelectedNodes[0];
                var size = '';
                var fontsize = '';
                var width = '';
                var hidelabels = false;
                var hideportlabels = false;

                if (firstNode && App.topology.nodes[firstNode.path]) {
                    var nodeObj = App.topology.nodes[firstNode.path];
                    size = nodeObj.get('size');

                    var interfcs = Object.values(nodeObj.getInterfaces());

                    for (let i in interfcs) {

                        var interfc = interfcs[i];
                        var style = interfc.get('style', {});

                        if (fontsize == '') fontsize = style['fontsize'];
                        if (width == '') width = style['width'];

                        var srcpos = style['srcpos'];
                        var labelpos = style['labelpos'];

                        try { srcpos = JSON.parse(srcpos); } catch (error) { srcpos = null };
                        try { labelpos = JSON.parse(labelpos); } catch (error) { labelpos = null };

                        if(!srcpos) srcpos = {}; if(!labelpos) labelpos = {};

                        if (!hidelabels) hidelabels = labelpos['hide'] == '1' ? true : false;
                        if (!hideportlabels) hideportlabels = srcpos['hide'] == '1' ? true : false;

                    }


                }

                body = `<li>
                            <a class="action-nodestart-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-play"></i>  ${lang('Start Selected')}</a>
                        </li>
                        <li>
                            <a class="action-nodestop-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-stop"></i>  ${lang("Stop Selected")}</a>
                        </li>
                        <li>
                            <a class="action-nodewipe-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-erase"></i>  ${lang("Wipe Selected")}</a>
                        </li>
                        <li>
                            <a class="action-openconsole-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-console"></i>  ${lang("Console To Selected Nodes")}</a>
                        </li>`;
                if (LOCK == 0) {

                    body += `<li role="separator" class="divider"></li>
                            <li>
                                <a class="action-nodeexport-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-save"></i> ${lang("Export all CFGs")}</a>
                            </li>
                            <li>
                                <a class="action-nodesbootsaved-group" href="javascript:void(0)"><i class="glyphicon glyphicon-floppy-saved"></i> ${lang("Set nodes startup-cfg to exported")}</a>
                            </li>
                            <li>
                                <a class="action-nodesbootscratch-group" href="javascript:void(0)"><i class="glyphicon glyphicon-floppy-save"></i> ${lang("Set nodes startup-cfg to none")}</a>
                            </li>`;

                    body += `<li>
                                <a class="context-collapsible" href="javascript:void(0)">
                                    <span class="fa fa-expand" title="Node Size"></span>&nbsp;
                                    <input placeholder="${lang("Node Size")}" value="${size}" step=1 min=15 style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-nodesize" type="number"></input>
                                    &nbsp;<span>Node Size (px)</span>
                                </a>
                            </li>
                            
                            <li>
                                <a class="context-collapsible" href="javascript:void(0)">
                                    <span class="fa fa-arrows-h" title="Link Width"></span>&nbsp;
                                    <input placeholder="${lang("Link Width")}" value="${width}" step=1 min=0 style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-linkwidth" type="number"></input>
                                    &nbsp;<span>Link Width (px)</span>
                                </a>
                            </li>


                            <li>
                                <a class="context-collapsible" href="javascript:void(0)">
                                    <span class="fa fa-text-height" title="Label Size"></span>&nbsp;
                                    <input placeholder="${lang("Label Size")}" value="${fontsize}" step=1 min=5 style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-labelsize" type="number"></input>
                                    &nbsp;<span>Label Size (px)</span>
                                </a>
                            </li>

                            <li>
                                <a class="context-collapsible box_flex" href="javascript:void(0)" style="display:flex">
                                    <span class="fa fa-low-vision" title="Hide Labels"></span>&nbsp; <span>Hide Labels : </span>
                                    <input placeholder="${lang("Hide Labels")}" ${hidelabels ? 'checked' : ''}  style="padding: 0px 5px; margin: auto 5px auto auto; border-radius: 2px; border: solid thin;" class="action-hidelabel" type="checkbox"></input>
                                </a>
                            </li>

                            <li>
                                <a class="context-collapsible box_flex" href="javascript:void(0)" style="display:flex">
                                    <span class="fa fa-low-vision" title="Hide Port Labels"></span>&nbsp; <span>Hide Port Labels : </span>
                                    <input placeholder="${lang("Hide Port Labels")}" ${hideportlabels ? 'checked' : ''}  style="padding: 0px 5px; margin: auto 5px auto auto; border-radius: 2px; border: solid thin;" class="action-hideportlabel" type="checkbox"></input>
                                </a>
                            </li>
                            
                            
                            `;

                    body += `<li role="separator" class="divider">
                        <li>
                            <a class="action-halign-group" data-path="node${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-object-align-horizontal"></i> ${lang("Horizontal Align")}
                            </a>
                        </li>
                        <li>
                            <a class="action-valign-group" data-path="node${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-object-align-vertical"></i> ${lang("Vertical Align")}
                            </a>
                        </li>
                        <li>
                            <a class="action-calign-group" data-path="node${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-record"></i> ${lang("Circular Align")}
                            </a>
                        </li>
                        <li>
                            <a class="action-autoalign-group" data-path="node${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-th"></i> ${lang("Auto Align")}
                            </a>
                        </li>
                        `;

                    body += `<li role="separator" class="divider"></li>
                        <li>
                            <a class="action-nodesbootdelete-group" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ${lang("Delete nodes startup-cfg")}</a>
                        </li>
                        <li>
                            <a class="action-nodedelete-group context-collapsible menu-manage" href="javascript:void(0)"><i class="glyphicon glyphicon-trash"></i> ${lang("Delete Selected")}</a>
                        </li>`;
                }

                title = 'Group of ' + window.freeSelectedNodes.map(function (item) {
                    if (item.type == 'node') return item.name;
                }).join(", ").replace(', ,', ', ').replace(/^,/, '').slice(0, 16);

                title += title.length > 24 ? "..." : "";
            }

        }

        if (object.hasClass('network_frame')) {
            if (LOCK == 0) {
                if (!isFreeSelectMode) {
                    console.log('DEBUG: opening network context menu');
                    var network_id = object.attr('data-path');

                    var title = object.attr('data-name');
                    var body = `<li>
                            <a class="context-collapsible  action-networkedit" data-path="${network_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-edit"></i> ${lang("Edit")}
                            </a>    
                        </li>

                        <li>
                            <a class="context-collapsible action-networkdelete" data-path="${network_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-trash"></i> ${lang("Delete")}
                            </a>
                        </li>`;
                }
                if (isFreeSelectMode) {
                    var title = lang('Edit selected Networks');
                    var network_id = object.attr('data-path');
                    body += ` <li>
                                <a class="context-collapsible action-networkdelete" data-path="${network_id}" data-name="${title}" href="javascript:void(0)">
                                    <i class="glyphicon glyphicon-trash"></i> ${lang("Delete")}
                                </a>
                            </li>
                    
                        <li role="separator" class="divider">

                        <li>
                            <a class="action-halign-group" data-path="network${network_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-object-align-horizontal"></i> ${lang("Horizontal Align")}
                            </a>
                        </li>

                        <li>
                            <a class="action-valign-group" data-path="network${network_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-object-align-vertical"></i> ${lang("Vertical Align")}
                            </a>
                        </li>

                        <li>
                            <a class="action-calign-group" data-path="network${network_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-record"></i> ${lang("Circular Align")}
                            </a>
                        </li>
                        <li>
                            <a class="action-autoalign-group" data-path="node${node_id}" data-name="${title}" href="javascript:void(0)">
                                <i class="glyphicon glyphicon-th"></i> ${lang("Auto Align")}
                            </a>
                        </li>
                        `;
                }
            }
        }

        if (object.hasClass('customText') || object.hasClass('customShape')) {
            if (LOCK == 0) {

                if (!isFreeSelectMode) {
                    console.log('DEBUG: opening text object context menu');

                    var textObject_id = object.attr('data-path')
                    var title = 'Edit: ' + object.attr('data-path')
                    var textClass = object.hasClass('customText') ? ' customText ' : ''

                    var matches = /rotate\(([\+\-\d]+)deg\).*skew\(([\+\-\d]+)deg\).*/.exec(e.currentTarget.style.transform);
                    var rotate = 0;
                    var skew = 0;
                    if (matches) {
                        rotate = matches[1];
                        skew = matches[2];
                    }


                    var body = `<li>
                                    <a class="context-collapsible  action-textobjectduplicate" href="javascript:void(0)" data-path="${textObject_id}">
                                        <i class="glyphicon glyphicon-duplicate"></i> ${lang("Duplicate")}
                                    </a>
                                </li>
                                <li>
                                    <a class="context-collapsible  action-textobjecttoback" href="javascript:void(0)" data-path="${textObject_id}">
                                        <i class="glyphicon glyphicon-save"></i> ${lang("Send To Back")}
                                    </a>
                                </li>
                                <li>
                                    <a class="context-collapsible  action-textobjecttofront" href="javascript:void(0)" data-path="${textObject_id}">
                                        <i class="glyphicon glyphicon-open"></i> ${lang("Send To Front")}
                                    </a>
                                </li>

                                <li>
                                    <a class="context-collapsible" href="javascript:void(0)" data-path="${textObject_id}">
                                        <span style="width:20px; display:inline-block" class="glyphicon glyphicon-refresh" title="${lang("Rotate")}"></span>&nbsp;
                                        <input placeholder="${lang("Rotate")}" step=1 value="${rotate}" style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-textrotate" data-path="${textObject_id}" type="number"></input>
                                    </a>
                                </li>

                                <li>
                                    <a class="context-collapsible" href="javascript:void(0)" data-path="${textObject_id}">
                                        <span style="width:20px; display:inline-block"><b title="${lang("3D Rotate")}">3D</b></span>&nbsp;
                                        <input placeholder="${lang("3D Rotate")}" step=1 value="${skew}" style="padding: 0px 5px; width: 100px; border-radius: 2px; border: solid thin;" class="action-textskew" data-path="${textObject_id}" type="number"></input>
                                    </a>
                                </li>

                                <li>
                                    <a class="context-collapsible ${textClass} action-textobjectdelete" href="javascript:void(0)" data-path="${textObject_id}">
                                        <i class="glyphicon glyphicon-trash"></i> ${lang("Delete")}
                                    </a>
                                </li>`;
                }
                if (isFreeSelectMode) {
                    var title = lang('Edit selected Texts');
                    var textObject_id = object.attr('data-path');
                    var body = `<li>
                                    <a class="context-collapsible ${textClass} action-textobjectdelete" href="javascript:void(0)" data-path="${textObject_id}">
                                        <i class="glyphicon glyphicon-trash"></i> ${lang("Delete")}
                                    </a>
                                </li>
                                <li role="separator" class="divider"></li>
                                <li>
                                    <a class="action-halign-group" data-path="customText${textObject_id}" data-name="${title}" href="javascript:void(0)">
                                        <i class="glyphicon glyphicon-object-align-horizontal"></i> ${lang("Horizontal Align")}
                                    </a>
                                </li>
                                <li>
                                    <a class="action-valign-group" data-path="customText${textObject_id}" data-name="${title}" href="javascript:void(0)">
                                        <i class="glyphicon glyphicon-object-align-vertical"></i> ${lang("Vertical Align")}
                                    </a>
                                </li>
                                <li>
                                    <a class="action-calign-group" data-path="customText${textObject_id}" data-name="${title}" href="javascript:void(0)">
                                        <i class="glyphicon glyphicon-record"></i> ${lang("Circular Align")}
                                    </a>
                                </li>`;
                }

            }
        }

        if (body.length) {
            printContextMenu(title, body, e);
        }

    }


    ObjectPosUpdateExec(event, moveObjects) {

        var groupMove = []

        if (moveObjects.length == 0) {
            groupMove.push(event.el)
        } else {
            moveObjects.each(function (id, node) {
                groupMove.push(node)
            });
        }
        console.log('DEBUG: moving objects...0');
        window.dragstop = 0;
        var zoom = getZoomLab() / 100;
        if (groupMove.length > 1) window.dragstop = 1
        if (event.metaKey || (event.e != undefined && event.e.metaKey) || event.ctrlKey || (event.e != undefined && event.e.ctrlKey)) return
        console.log('DEBUG: moving objects...1');
        var tmp_nodes = [],
            tmp_shapes = [],
            tmp_networks = [],
            tmp_line = [];
        $.each(groupMove, function (id, node) {

            var eLeft = Math.round($('#' + node.id).position().left / zoom + $('#lab-viewport').scrollLeft());

            var eTop = Math.round($('#' + node.id).position().top / zoom + $('#lab-viewport').scrollTop());
            var id = node.id
            $('#' + id).addClass('dragstopped')
            if (id.search('node') != -1) {
                console.log('DEBUG: setting' + id + ' position.');
                tmp_nodes.push({ id: id.replace('node', ''), left: eLeft, top: eTop })
            } else if (id.search('network') != -1) {
                console.log('DEBUG: setting ' + id + ' position.');
                tmp_networks.push({ id: id.replace('network', ''), left: eLeft, top: eTop })
            } else if (id.search('custom') != -1) {
                console.log('DEBUG: setting ' + id + ' position.');
                var objectData = node.outerHTML;
                objectData = fromByteArray(new TextEncoderLite('utf-8').encode(encodeURIComponent(objectData)));
                tmp_shapes.push({ id: id.replace(/customShape/, '').replace(/customText/, ''), data: objectData })
            } else if (id.search('startLine') != -1) { /** EVE_STORE */
                tmp_line.push({
                    id: id.replace(/\D/g, ''),
                    x1: eLeft,
                    y1: eTop,
                })
            } else if (id.search('endLine') != -1) {
                tmp_line.push({
                    id: id.replace(/\D/g, ''),
                    x2: eLeft,
                    y2: eTop,
                })
            }
        });


        var saveNodes = {};
        var saveNetworks = {};
        var saveTexts = {};
        var saveLines = {};

        var newNodes = {};
        var newNetworks = {};
        var newTexts = {};
        var newLines = {};

        var latestHistory = get(this.histories[this.historyIndex], {});
        var lastHisNodes = get(latestHistory['nodes'], {});
        var lastHisNetworks = get(latestHistory['networks'], {});
        var lastHisTexts = get(latestHistory['texts'], {});
        var lastHisLines = get(latestHistory['lines'], {});
        var isContain = true;

        tmp_nodes.map(item => {
            var id = item['id'];
            newNodes[id] = item;
            var node = this.nodes[id];
            if (!node) return;
            if (!isset(lastHisNodes[id])) isContain = false;
            saveNodes[id] = {
                id: node.get('id'),
                left: node.get('left'),
                top: node.get('top'),
            }
        })

        tmp_networks.map(item => {
            var id = item['id'];
            newNetworks[id] = item;
            var network = this.networks[id];
            if (!network) return;
            if (!isset(lastHisNetworks[id])) isContain = false;
            saveNetworks[id] = {
                id: network.get('id'),
                left: network.get('left'),
                top: network.get('top'),
            }
        })

        tmp_shapes.map(item => {
            var id = item['id'];
            newTexts[id] = item;
            var text = this.textobjects[id];
            if (!text) return;
            if (!isset(lastHisTexts[id])) isContain = false;
            saveTexts[id] = {
                id: text.get('id'),
                data: text.get('data'),
            }
        })

        tmp_line.map(item => {
            var id = item['id'];
            newLines[id] = item;
            var line = this.lines[item['id']];
            if (!line) return;
            if (!isset(lastHisLines[id])) isContain = false;
            saveLines[id] = {
                id: line.get('id'),
                x1: line.get('x1'),
                x2: line.get('x2'),
                y1: line.get('y1'),
                y2: line.get('y2'),
            }
        })


        this.histories.splice(this.historyIndex + 1);

        if (!isContain) {

            this.histories.push({
                nodes: saveNodes,
                networks: saveNetworks,
                texts: saveTexts,
                lines: saveLines
            })

            if (this.histories.length > 50) this.histories.splice(0, 1);
            this.historyIndex = this.histories.length - 1;
        }

        var deferred = $.Deferred();
        $.when(setNodesPosition(tmp_nodes)).done(() => {
            console.log('DEBUG: all selected node position saved.');
            $.when(editTextObjects(tmp_shapes)).done(() => {
                console.log('DEBUG: all selected shape position saved.');
                $.when(setNetworksPosition(tmp_networks)).done(() => {
                    console.log('DEBUG: all selected networks position saved.');
                    if (typeof (setLinePosition) == 'function')
                        setLinePosition(tmp_line).then(() => {

                            this.histories.push({
                                nodes: newNodes,
                                networks: newNetworks,
                                texts: newTexts,
                                lines: newLines
                            })
                            if (this.histories.length > 50) this.histories.splice(0, 1);
                            this.historyIndex = this.histories.length - 1;
                            console.log(this.histories);

                            deferred.resolve()
                        });
                }).fail((message) => { addModalError(message); });
            }).fail((message) => { addModalError(message); });
        }).fail((message) => { addModalError(message); });

        return deferred;
    }


    undoPosition() {

        this.historyIndex--;

        if (this.historyIndex < 0) {
            this.historyIndex = 0;
            return;
        }

        if (!isset(this.histories[this.historyIndex])) {
            this.historyIndex = this.histories.length - 1;
        }

        var history = this.histories[this.historyIndex];

        var tmp_nodes = Object.values(get(history['nodes'], {}));
        var tmp_shapes = Object.values(get(history['texts'], {}));
        var tmp_networks = Object.values(get(history['networks'], {}));
        var tmp_line = Object.values(get(history['lines'], {}));
        App.loading(true)
        var deferred = $.Deferred();
        $.when(setNodesPosition(tmp_nodes)).done(() => {
            console.log('DEBUG: all selected node position saved.');
            $.when(editTextObjects(tmp_shapes)).done(() => {
                console.log('DEBUG: all selected shape position saved.');
                $.when(setNetworksPosition(tmp_networks)).done(() => {
                    console.log('DEBUG: all selected networks position saved.');
                    if (typeof (setLinePosition) == 'function') setLinePosition(tmp_line).then(() => {
                        this.printTopology().then(() => App.loading(false));
                    });
                }).fail((message) => { addModalError(message); });
            }).fail((message) => { addModalError(message); });
        }).fail((message) => { addModalError(message); });

        return deferred;

    }

    redoPosition() {

        this.historyIndex++;

        if (!isset(this.histories[this.historyIndex])) {
            this.historyIndex = this.histories.length - 1;
            return;
        }

        var history = this.histories[this.historyIndex];

        var tmp_nodes = Object.values(get(history['nodes'], {}));
        var tmp_shapes = Object.values(get(history['texts'], {}));
        var tmp_networks = Object.values(get(history['networks'], {}));
        var tmp_line = Object.values(get(history['lines'], {}));
        App.loading(true)
        var deferred = $.Deferred();
        $.when(setNodesPosition(tmp_nodes)).done(() => {
            console.log('DEBUG: all selected node position saved.');
            $.when(editTextObjects(tmp_shapes)).done(() => {
                console.log('DEBUG: all selected shape position saved.');
                $.when(setNetworksPosition(tmp_networks)).done(() => {
                    console.log('DEBUG: all selected networks position saved.');
                    if (typeof (setLinePosition) == 'function') setLinePosition(tmp_line).then(() => {
                        this.printTopology().then(() => App.loading(false));
                    });
                }).fail((message) => { addModalError(message); });
            }).fail((message) => { addModalError(message); });
        }).fail((message) => { addModalError(message); });

        return deferred;

    }

}

export default topology