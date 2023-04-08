import React, { Component } from 'react'


class NodeSize extends Component {

    constructor(props) {
        super(props);

        this.selected = [];
       
    }

    render() {
        return <></>
    }

    setSelected(){
        if(!this.isFreeSelectMode) return;
        $("#lab-viewport").addClass("freeSelectMode");
        window.freeSelectedNodes = this.selected;
        this.selected.map(select => {
            var node = $('#node'+select.path);
            node.addClass('ui-selected');
        })
    }

    updateNodeSize(editData){
        return axios.request({
            url: `/api/labs/session/nodes/edit`,
            method: 'post',
            data: {
                data: editData
            }
        })
            .then(response => {
               
                response = response['data'];
                if (response['status']=='success') {
                    App.topology.updateData(response['update']);
                    App.topology.printTopology().then(()=>{
                        this.setSelected();
                    });
                } else {
                    error_handle(response);
                    App.topology.printTopology();
                }

            })

            .catch(function (error) {
                error_handle(error);
                console.log(error);
                App.topology.printTopology();
            })
    }

    componentDidMount() {

        // $(document).on('change', '.action-nodesize', (e)=>{

        //     var isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
        //     var id = e.target.getAttribute('data-path');

        //     if(isFreeSelectMode){
        //         window.freeSelectedNodes.forEach(function (node) {
        //             var id = node.path
        //             var object = document.getElementById('node'+id).querySelector('img');
        //             if(object){
        //                 object.style.width = `${e.target.value}px`;
        //             }
        //         })
        //     }else 

        //     if(id !== null){
        //         var object = document.getElementById('node'+id).querySelector('img');
        //         if(object){
        //             object.style.width = `${e.target.value}px`;
        //         }
        //     }
        // })

        $(document).on('change', '.action-nodesize', (e)=>{
            this.isFreeSelectMode = $("#lab-viewport").hasClass("freeSelectMode")
            var id = e.target.getAttribute('data-path');
            var editData = [];

            if(this.isFreeSelectMode){
                this.selected = window.freeSelectedNodes;
                window.freeSelectedNodes.forEach(function (node) {
                    var id = node.path
                    editData.push({id: id, size: e.target.value});
                })
            }else 

                if(id !== null){
                    editData.push({id: id, size: e.target.value});
                }
                if(editData.length > 0){
                    if(this.updateTimeout) clearTimeout(this.updateTimeout);
                    this.updateTimeout = setTimeout(()=>this.updateNodeSize(editData), 500);
                }
            })

    }

}
export default NodeSize;