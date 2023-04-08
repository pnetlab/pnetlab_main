import React, { Component } from 'react'
import HTMLConsoleModal from './HTMLConsoleModal';
import { render } from 'react-dom';
import ConsoleSwitch from './ConsoleSwitch';


class HTMLConsole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            console: 0
        }

    }

    render() {
        return <>
            <div className='box_flex button btn-xs btn btn-primary' style={{ margin: 'auto', display: this.state.console > 0 ? 'flex' : 'none' }}
                onClick={() => {
                    if (this.consoleModal.isHide) {
                        this.consoleModal.modal();
                        this.consoleModal.setPostion('25%', '250px');
                        this.consoleModal.closeNewTag();
                    } else {
                        this.consoleModal.modal('hide');
                    }
                }}>

                <i className="icon fa fa-desktop" style={{fontSize:'14px', marginTop:2}}></i>
                &nbsp;TERMINAL&nbsp;({this.state.console})

            </div>

            <HTMLConsoleModal
                ref={modal => this.consoleModal = modal}
                onAddTab={() => this.setState({ console: Number(this.state.console) + 1 })}
                onDelTab={() => {
                    var number = Number(this.state.console) - 1 ;
                    if(number <= 0){
                        this.consoleModal.modal('hide');
                        number = 0;
                    }
                    this.setState({ console: number })
                }}
            ></HTMLConsoleModal>


        </>
    }

    addTab(nid, flag = '_self'){
        
        if(window.nodes[nid]){
            var node = window.nodes[nid];
            if(node['status'] == 2 || node['status'] == 3){
                var url = node['url'];
                if(url.includes('guacamole')){
                    this.consoleModal.addTab(node['name'], nid, 1);
                }else{
                    if(node['console']=='http' || node['console']=='https') flag='_blank';
                    window.open(url, flag);
                }
            }
        }
    }

    addTab2nd(nid, flag = '_self'){
        if(window.nodes[nid]){
            var node = window.nodes[nid];
            if(node['status'] == 2 || node['status'] == 3){
                var url = node['url_2nd'];
                if(url.includes('guacamole')){
                    this.consoleModal.addTab(node['name'], nid, 2);
                }else{
                    if(node['console_2nd']=='http' || node['console_2nd']=='https') flag='_blank';
                    window.open(url, flag);
                }
                
            }
        }
    }

    componentDidMount() {
        // $(document).on('dblclick', '.nodehtmlconsole', (e)=>{
        //     var nid = e.currentTarget.getAttribute('nid');
        //     this.addTab(nid);
        // });

       global.nodehtmlconsoledown = (e, flag='_self')=>{
            console.log('mousedown');
            this.flag = flag;
            App.topology.isClick = true;
            if(this.isClickTimeout) clearTimeout(this.isClickTimeout);
            this.isClickTimeout = setTimeout(()=>{App.topology.isClick=false}, 200)
        };

        $(document).on('click', '.nodehtmlconsole', (e)=>{
            if (e.metaKey || e.ctrlKey) {
                console.log('Selecting');
                return;
            }
            if(App.topology.isClick){
                var nid = e.currentTarget.getAttribute('nid')
                this.addTab(nid, this.flag);
            }
        });

        $(document).on('click', '.nodehtmlconsole2nd', (e)=>{ 
            if(App.topology.isClick){
                var nid = e.currentTarget.getAttribute('nid')
                this.addTab2nd(nid);
            }
        });

        
        render(<ConsoleSwitch/>, document.getElementById('action_change_console'));

    }
}
export default HTMLConsole;