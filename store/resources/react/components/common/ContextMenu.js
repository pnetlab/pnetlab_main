import React, { Component } from 'react'

class ContextMenu extends Component {

	constructor(props) {
		super(props);
		this.state = {
            content : '',
            show : false,
            top: null,
            bottom: null,
            right: null,
            left: null,
		}
		this.id = makeId();
    }


    show(event = null){
        if(!event){
            this.setState({show: true});
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        var x = event.clientX;     
        var y = event.clientY;
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var cor = {};
        if(x > (width/2)){
            cor.left = x;
            cor.right = null;
        }else{
            cor.right = width - x;
            cor.left = null;
        }

        if(y > (height/2)){
            cor.bottom = height - y; 
            cor.top = null;
        }else{
            cor.top = y;
            cor.bottom = null;
        }

        this.setState({...cor, show: true});
    }

    hide(){
        this.setState({show:false});
    }

    setMenu(content){
        this.setState({content})
    }

    componentDidMount(){
        App.ContextMenu = this;
        document.addEventListener('click', this.hide.bind(this));
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.hide, false);
    }

    render(){
        var style = {display: (this.state.show?'block':'none'), position:'fixed', zIndex:2000};
        if(this.state.top != null) style.top = this.state.top;
        if(this.state.bottom != null) style.bottom = this.state.bottom;
        if(this.state.right != null) style.right = this.state.right;
        if(this.state.left != null) style.left = this.state.left;
        return <div style={style}
            >
            {this.state.content}
        </div>
    }
}

export default ContextMenu
