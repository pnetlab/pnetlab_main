import React, { Component } from 'react'
import DragSort from '../../common/DragSort'

class Consoles extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [],
            active: '',
        }
    }

    render() {
        if(!this.props.show) return '';

        var tabs = this.state.tabs;
        tabs = tabs.sort((a, b) => (Number(a['weight']) - Number(b['weight'])));
        return <>
            <div style={{ flexDirection: 'column', flexGrow: 1, display: 'flex' }}>
                <style>{`
                    .html_bar{
                        flex-wrap:wrap;
                        border: solid thin darkgray;
                    }
                    .html_bar .html_tab{
                        background: rgba(0, 0, 0, 0.1);
                        margin: 0px 2px 0px 0px;
                        font-weight: bold;
                    }
                    .html_tab .button{
                        font-weight: 900;
                        color: rgba(0, 0, 0, 0.5);
                    }
                    .html_tab.active{
                        background: orange;
                    }

                    .html_bar .dragsort_item{
                        
                    }

                    .html_bar .dragsort_item.dragover.up::after{
                        border-radius: 1px;
                        width:50px;
                        border:none;
                        height:0px;
                    }

                    .html_bar .dragsort_item.dragover.down::before{
                        border-radius: 1px;
                        width:50px;
                        border:none;
                        height:0px;
                        
                    }
                
                `}</style>
                <div className='html_bar box_flex'>
                    {tabs.map(item => {
                        return <DragSort src_id={item['url']} src_weight={item['weight']} key={item['url']}
                            changeOrder={(src_id, dest_id) => this.changeOrder(src_id, dest_id)}
                            className={`html_tab button btn-xs box_flex ${item['url'] == this.state.active ? 'active' : ''}`}
                            onClick={() => { this.setState({ active: item['url'] }) }}
                            title={item['name']}>

                            <span className='box_line' style={{ minWidth: 30, maxWidth: 100, pointerEvents: 'none' }} >{item['name']}</span>&nbsp;

                            <div className='button' style={{ margin: 'auto 0px auto auto', padding: 0 }} onClick={(ev) => {
                                ev.stopPropagation();
                                this.deleteTab(item['url'])
                            }}>&times;</div>
                        </DragSort>
                    })}
                </div>

                <div className="html_console" style={{ flexGrow: 1, display:'flex' }}>
                    {tabs.map(item => {
                        return <div key={item['url']} style={{ width: '100%', display: (item['url'] == this.state.active ? 'block' : 'none') }}>
                            <iframe onMouseEnter={(ev) => { ev.target.focus() }} src={item['url']} height="100%" width="100%"></iframe>
                        </div>
                    })}
                </div>

            </div>
        </>;
    }

    addTab(name, url){
        var tabs = this.state.tabs;
        var tab = tabs.find(item => item['url'] == url);
        if(tab){
            tab['url'] = url;
            
        }else{
            tabs.push({
                name, url, weight:makeId()
            })

            if(this.props.onAddTab) this.props.onAddTab()
        }

        this.setState({
            tabs, active:url
        })

    }

    componentDidMount(){
        global.addTabToConsole = this.addTab.bind(this);
    }

    deleteTab(url){
        var tabs = this.state.tabs;
        var delIndex = tabs.findIndex(item=>item['url']==url);
        if(delIndex == -1) return;
        var active = '';
        if(tabs[delIndex-1]){
            active = tabs[delIndex-1]['url'];
        }else if(tabs[delIndex+1]){
            active = tabs[delIndex+1]['url'];
        }
        var tab = tabs.splice(delIndex, 1);
        this.setState({tabs, active});

        if(this.props.onDelTab) this.props.onDelTab(tab);
    }

    
    changeOrder(src_id, dest_id){
        var data = this.state.tabs;
        var srcObjIndex = data.findIndex(item => item.url == src_id);
        if (srcObjIndex == -1) return;
        var srcObj = data[srcObjIndex];
        var src_weight = Number(srcObj.weight);

        var desObjIndex = data.findIndex(item => item.url == dest_id);
        if (desObjIndex == -1) return;
        var desObj = data[desObjIndex];
        var des_weight = Number(desObj.weight);

        var effect = data.filter(item => {
            if (Number(item.weight) >= src_weight && Number(item.weight) <= des_weight) return true;
            if (Number(item.weight) <= src_weight && Number(item.weight) >= des_weight) return true;
            return false;
        })
        
        if (src_weight > des_weight) {
            effect.map((item, key) => {
                if(effect[key + 1]){
                    item.weight = effect[key + 1].weight;
                }
            })
        } else {
            var maxIndex = effect.length - 1;
            effect.map((item, key) => {
                if(effect[maxIndex - key - 1]){
                    effect[maxIndex - key].weight = effect[maxIndex - key - 1].weight
                }
            })
        }
        srcObj.weight = des_weight;
        srcObj.parent = desObj.parent;
        
        this.setState({ tabs:data });

    }

}

export default Consoles;
