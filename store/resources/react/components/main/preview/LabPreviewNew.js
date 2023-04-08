import React, { Component } from 'react'
import Loading from '../../common/Loading';
import topology from '../../lab/topology/topology';


class LabPreview extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.minLeft = 0;
        this.minTop = 0;
        this.maxLeft = 0;
        this.maxTop = 0;

        this.padding = 15;


    }

    loadLab(path) {
        if (!isset(path) || path == '') return;
        if (this.props.onStart) this.props.onStart();
        return axios.request({
            url: `/api/labs/preview`,
            method: 'post',
            data: { path }
        })

            .then(response => {
                if (this.props.onLoad) this.props.onLoad();
                var data = response['data']['data'];
                this.setData(data);
                return true;
            })

            .catch((error) => {
                if (this.props.onLoad) this.props.onLoad();
                error_handle(error)
                return false;
            })
    }


    setData(data) {
        this.topology.setData(data);
        this.topology.printTopology().then(()=>{
        
            var children = document.getElementById('lab-viewport').querySelectorAll(['.customShape', '.node', '.network']);
            for( let i in children){
                var child = children[i];
                var top = child.offsetTop;
                var left = child.offsetLeft;
                var width = child.offsetWidth;
                var height = child.offsetHeight;

                if (i == 0) {
                    this.minLeft = left;
                    this.minTop = top;
                    this.maxLeft = left + width;
                    this.maxTop = top + height;
                } else {
                    if (left < this.minLeft) {
                        this.minLeft = left
                    }
    
                    if ((left + width) > this.maxLeft) {
                        this.maxLeft = left + width
                    }
    
                    if (top < this.minTop) {
                        this.minTop = top;
                    }
    
                    if ((top + height) > this.maxTop) {
                        this.maxTop = top+height
                    }
                }
            }

            this.minLeft = Number(this.minLeft) - this.padding;
            this.minTop = Number(this.minTop) - this.padding;

            this.maxLeft = Number(this.maxLeft) + this.padding;
            this.maxTop = Number(this.maxTop) + this.padding;

            this.forceUpdate(()=>{if (this.props.onResize) this.props.onResize(this.maxLeft - this.minLeft, this.maxTop - this.minTop)});
        });

        // var nodes = this.topology.nodes;
        // var key = 0;
        // for (let i in nodes) {
        //     var node = nodes[i];
        //     var left = Number(node.get('left', 0));
        //     var top = Number(node.get('top', 0));
        //     if (key == 0) {
        //         key++;
        //         this.minLeft = left;
        //         this.minTop = top;
        //         this.maxLeft = left;
        //         this.maxTop = top;
        //     } else {
        //         if (left < this.minLeft) {
        //             this.minLeft = left
        //         }

        //         if (left > this.maxLeft) {
        //             this.maxLeft = left
        //         }

        //         if (top < this.minTop) {
        //             this.minTop = top;
        //         }

        //         if (top > this.maxTop) {
        //             this.maxTop = top
        //         }
        //     }
        // }

        // var networks = this.topology.networks;

        // for (let i in networks) {
        //     var network = networks[i];
        //     if (network.get('visibility') == 0) continue;
        //     var left = Number(network.get('left', 0));
        //     var top = Number(network.get('top', 0));

        //     if (left < this.minLeft) {
        //         this.minLeft = left
        //     }

        //     if (left > this.maxLeft) {
        //         this.maxLeft = left
        //     }

        //     if (top < this.minTop) {
        //         this.minTop = top;
        //     }

        //     if (top > this.maxTop) {
        //         this.maxTop = top
        //     }

        // }

        // this.minLeft = Number(this.minLeft) - this.padding;
        // this.minTop = Number(this.minTop) - this.padding;

        // this.maxLeft = Number(this.maxLeft) + this.padding;
        // this.maxTop = Number(this.maxTop) + this.padding;

        // this.forceUpdate(()=>{if (this.props.onResize) this.props.onResize(this.maxLeft - this.minLeft, this.maxTop - this.minTop)});

    }

   



    render() {
        return <>
            <div id="lab-viewport" style={{overflow:'hidden', position:'relative', pointerEvents: 'none', height: this.maxTop, width: this.maxLeft, top : -this.minTop, left: -this.minLeft }}></div>
        </>

    }

    componentDidMount() {
        this.topology = new topology(true);
        var path = this.props.path;
        this.loadLab(path);
    }



}

export default LabPreview;