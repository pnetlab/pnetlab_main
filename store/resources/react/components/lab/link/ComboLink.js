import React, { Component } from 'react'


class ComboLink extends Component {

    constructor(props) {
        super(props);

        this.selected = [];

    }

    render() {
        return <></>
    }


    setSelected() {
        $("#lab-viewport").addClass("freeSelectMode");
        window.freeSelectedNodes = this.selected;
        this.selected.map(select => {
            var node = $('#node' + select.path);
            node.addClass('ui-selected');
        })
    }

    updateComboLink(editData) {
        App.loading(true)
        return axios.request({
            url: `/api/labs/session/interfaces/styles`,
            method: 'post',
            data: {
                data: editData
            }
        })
            .then(response => {
                App.loading(false)
                response = response['data'];
                if (response['status'] == 'success') {
                    App.topology.updateData(response['update']);
                    App.topology.printTopology().then(() => {
                        this.setSelected();
                    });
                } else {
                    error_handle(response);
                    App.topology.printTopology();
                }

            })

            .catch(function (error) {
                App.loading(false)
                error_handle(error);
                console.log(error);
                App.topology.printTopology();
            })
    }

    componentDidMount() {


        $(document).on('change', '.action-linkwidth', (e) => {

            var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var editData = [];
            if (isFreeSelectMode) {
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach((node) => {
                    var id = node.path
                    var nodeObj = App.topology.nodes[id];
                    if (nodeObj) {
                        var interfaces = nodeObj.getInterfaces();
                        for (let if_id in interfaces) {
                            var interfc = interfaces[if_id];

                            if (interfc.get('type') == 'ethernet') {
                                var network_id = interfc.get('network_id');
                                if (network_id > 0) {
                                    var network = App.topology.networks[network_id];
                                    if (network.get('visibility') == 0) {
                                        editData.push({
                                            network_id: network_id,
                                            width: e.target.value
                                        })
                                    } else {
                                        editData.push({
                                            interface_id: if_id,
                                            node_id: id,
                                            width: e.target.value
                                        })
                                    }

                                }

                            } else {
                                if (interfc.get('remote_id') > 0) {
                                    editData.push({
                                        interface_id: if_id,
                                        node_id: id,
                                        width: e.target.value
                                    })
                                }

                            }
                        }
                    }
                })
            }

            if (editData.length > 0) {
                if (this.updateTimeout) clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => this.updateComboLink(editData), 500);
            }
        })


        $(document).on('change', '.action-labelsize', (e) => {

            var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var editData = [];
            if (isFreeSelectMode) {
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach((node) => {
                    var id = node.path
                    var nodeObj = App.topology.nodes[id];
                    if (nodeObj) {
                        var interfaces = nodeObj.getInterfaces();
                        for (let if_id in interfaces) {
                            var interfc = interfaces[if_id];

                            if (interfc.get('type') == 'ethernet') {
                                var network_id = interfc.get('network_id');
                                if (network_id > 0) {
                                    var network = App.topology.networks[network_id];
                                    if (network.get('visibility') == 0) {
                                        editData.push({
                                            network_id: network_id,
                                            fontsize: e.target.value
                                        })
                                    } else {
                                        editData.push({
                                            interface_id: if_id,
                                            node_id: id,
                                            fontsize: e.target.value
                                        })
                                    }

                                }

                            } else {
                                if (interfc.get('remote_id') > 0) {
                                    editData.push({
                                        interface_id: if_id,
                                        node_id: id,
                                        fontsize: e.target.value
                                    })
                                }

                            }
                        }
                    }
                })
            }
        })


        $(document).on('change', '.action-labelsize', (e) => {

            var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var editData = [];
            if (isFreeSelectMode) {
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach((node) => {
                    var id = node.path
                    var nodeObj = App.topology.nodes[id];
                    if (nodeObj) {
                        var interfaces = nodeObj.getInterfaces();
                        for (let if_id in interfaces) {
                            var interfc = interfaces[if_id];

                            if (interfc.get('type') == 'ethernet') {
                                var network_id = interfc.get('network_id');
                                if (network_id > 0) {
                                    var network = App.topology.networks[network_id];
                                    if (network.get('visibility') == 0) {
                                        editData.push({
                                            network_id: network_id,
                                            fontsize: e.target.value
                                        })
                                    } else {
                                        editData.push({
                                            interface_id: if_id,
                                            node_id: id,
                                            fontsize: e.target.value
                                        })
                                    }

                                }

                            } else {
                                if (interfc.get('remote_id') > 0) {
                                    editData.push({
                                        interface_id: if_id,
                                        node_id: id,
                                        fontsize: e.target.value
                                    })
                                }

                            }
                        }
                    }
                })
            }

            if (editData.length > 0) {
                if (this.updateTimeout) clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => this.updateComboLink(editData), 500);
            }
        })

        $(document).on('change', '.action-hidelabel', (e) => {

            var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var editData = [];
            if (isFreeSelectMode) {
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach((node) => {
                    var id = node.path
                    var nodeObj = App.topology.nodes[id];
                    if (nodeObj) {
                        var interfaces = nodeObj.getInterfaces();
                        for (let if_id in interfaces) {
                            var interfc = interfaces[if_id];

                            var labelpos = interfc.get('labelpos');
                            try { labelpos = JSON.parse(labelpos); } catch (error) { labelpos = {} };
                            if (!labelpos) labelpos = {}
                            labelpos['hide'] = e.target.checked

                            if (interfc.get('type') == 'ethernet') {
                                var network_id = interfc.get('network_id');
                                if (network_id > 0) {
                                    var network = App.topology.networks[network_id];
                                    if (network.get('visibility') == 0) {
                                        editData.push({
                                            network_id: network_id,
                                            labelpos: JSON.stringify(labelpos),
                                        })
                                    } else {
                                        editData.push({
                                            interface_id: if_id,
                                            node_id: id,
                                            labelpos: JSON.stringify(labelpos),
                                        })
                                    }

                                } 

                            } else {
                                if (interfc.get('remote_id') > 0) {
                                    editData.push({
                                        interface_id: if_id,
                                        node_id: id,
                                        labelpos: JSON.stringify(labelpos),
                                    })
                                }

                            }
                        }
                    }
                })
            }

            if (editData.length > 0) {
                this.updateComboLink(editData);
            }
        })


        $(document).on('change', '.action-hideportlabel', (e) => {

            var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var editData = [];
            if (isFreeSelectMode) {
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach((node) => {
                    var id = node.path
                    var nodeObj = App.topology.nodes[id];
                    if (nodeObj) {
                        var interfaces = nodeObj.getInterfaces();
                        for (let if_id in interfaces) {
                            var interfc = interfaces[if_id];

                            var srcpos = interfc.get('srcpos');
                            try { srcpos = JSON.parse(srcpos); } catch (error) { srcpos = {} };
                            if (!srcpos) srcpos = {}
                            srcpos['hide'] = e.target.checked

                            var dstpos = interfc.get('dstpos');
                            try { dstpos = JSON.parse(dstpos); } catch (error) { dstpos = {} };
                            if (!dstpos) dstpos = {}
                            dstpos['hide'] = e.target.checked

                            if (interfc.get('type') == 'ethernet') {
                                var network_id = interfc.get('network_id');
                                if (network_id > 0) {
                                    var network = App.topology.networks[network_id];
                                    if (network.get('visibility') == 0) {
                                        editData.push({
                                            network_id: network_id,
                                            srcpos: JSON.stringify(srcpos),
                                            dstpos: JSON.stringify(dstpos),
                                           
                                        })
                                    } else {
                                        editData.push({
                                            interface_id: if_id,
                                            node_id: id,
                                            srcpos: JSON.stringify(srcpos),
                                            dstpos: JSON.stringify(dstpos),
                                           
                                        })
                                    }

                                }

                            } else {
                                if (interfc.get('remote_id') > 0) {
                                    editData.push({
                                        interface_id: if_id,
                                        node_id: id,
                                        srcpos: JSON.stringify(srcpos),
                                        dstpos: JSON.stringify(dstpos),
                                       
                                    })
                                }

                            }
                        }
                    }
                })
            }

            if (editData.length > 0) {
                this.updateComboLink(editData);
            }
        })


    }

}

export default ComboLink;