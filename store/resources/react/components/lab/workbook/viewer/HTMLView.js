import React, { Component } from 'react'
import '../ckeditor.css'

class HTMLView extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            workbook: this.props.workbook,
            showMenu: false,
            page: 0,
        }


    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
        } else {
            $("#" + this.id).modal();
        }
    }

    setWorkbook(workbook){
        this.setState({workbook});
    }

    drawMenu() {
        var menuHtml = [];
        var menu = get(this.state.workbook.menu, []);
        var lv1 = menu.filter(item => item['parent'] == '');
        lv1.map((item, key) => {
            menuHtml.push(this.drawMenuItem(item, key))
        });
        return menuHtml;
    }

    drawMenuItem(item, key) {
        var id = 'collapse'+makeId();
        var menu = get(this.state.workbook.menu, []);
        var children = menu.filter(child => child['parent'] == item['id']);
        var childrenComp = [];
        children.map((child,index) => {
            childrenComp.push(this.drawMenuItem(child, index))
        })
        return <div key={item.id} className={`button wb_menu_item ${item.parent==''?'lv1':''}`}>    
            <div className='box_flex' data-toggle="collapse" data-target={`#${id}`} aria-expanded='false' onClick={()=>{
                this.setPage(item.page, ()=>{
                    this.scroll_menu(item.id);
                    // var elmnt = document.querySelector(`[menu_id='${item['id']}']`);
                    // if(elmnt) elmnt.scrollIntoView({behavior: 'smooth'});
                })
            }}>
                {
                    children.length == 0
                    ? <>&bull;</>
                    : <i className="fa icon"></i>
                }
                
                &nbsp;<div title={item.title} className='box_line'>{item.title}</div>
            </div>
            <div id={id} className="collapse" style={{paddingRight:7}}>
                {childrenComp}
            </div>
        </div>

    }


    changePage(vector = 'up') {
        var page = this.state.page;
        if (vector == 'up') {
            var new_page = page + 1;
        } else {
            var new_page = page - 1;
        }
        this.setPage(new_page)
    }

    setPage(page, callback = null) {
        var content = get(this.state.workbook.content, []);
        if(page == this.state.page){
            if(callback) callback();
            return;
        }
        if (page < 0) page = 0;
        if (page >= content.length) page = content.length - 1;

        this.setState({
            page: page
        }, ()=>{
            if(callback) callback();
        });
    }

    scroll_menu(menu_item){
        try {
            var scrollObj = $(`#${this.id}`);
            var scroll = $(`[menu_id='${menu_item}']`).offset().top - scrollObj.offset().top;
            scrollObj.animate({scrollTop:  scrollObj.scrollTop() + scroll}, 100, 'swing');
        } catch (error) {
            console.log(error);
        }
    }



    render() {

        var content = get(this.state.workbook.content, []);
        var pageContent = get(content[this.state.page], '');
           

        return <>
            <style>{`
                .question-menu{
                    position: absolute;
                    display: flex;
                    left: 0px;
                    top: 25px;
                    bottom: 0px;
                    z-index: 5;
                }
                .menu-body{
                    display: inline-block;
                    height: 100%;
                    transition: all 0.3s ease-in-out 0s;
                    overflow-x: hidden;
                    background: rgb(253, 251, 247);
                }
                .menu-button{
                    height: 100%;
                    width: 23px;
                    text-align: center;
                    display: flex;
                    background: #0066a9;
                    padding: 0px;
                    position: relative;
                    overflow: inherit;
                }

                .menu-button-text{
                    transform: rotate(90deg);
                    color: white;
                    font-weight: bold;
                    position: absolute;
                    top: 40px;
                    left: -40px;
                    width: 100px;
                }
                .wb-body {
                    height:0px;
                    overflow: auto;
                    overflow-x: hidden;
                    transition: all 0.3s ease-in-out 0s;
                }

                [aria-expanded=false] .icon::before{
                    content: "\\f0da";
                }
                [aria-expanded=true] .icon::before{
                    content: "\\f0d7";
                }

                .wb_menu_item{
                    min-width: 200px;
                    padding: 0px 12px;
                    color: #03A9F4;
                    font-size: 13px;
                    margin: 2px;
                }
                .wb_menu_item.lv1{
                    min-width: 200px;
                    padding: 0px 12px;
                    font-size: 14px;
                    color: #333;
                    margin: 2px;
                }
                
                
            `}</style>

            <div className="question-menu"

                onMouseLeave={() => {
                    setTimeout(function () {
                        $(".modal-body .ck-content").css('width', 'auto');
                    }, 500);
                    this.setState({showMenu:false})
                }}

                onMouseEnter={() => {
                    $(".modal-body .ck-content").css('width', $(".modal-body .ck-content").width());
                    this.setState({showMenu:true})
                }}

            >
                <div className="menu-body" style={{ width: (this.state.showMenu ? 300 : 0) }}>
                    <div style={{ padding: 10 }} className="menu-content">
                        <label>MENU</label>
                        {this.drawMenu()}
                    </div>
                </div>
                <div className="menu-button" onClick={() => { this.setState({ showMenu: !this.state.showMenu }) }}>
                    <div className="menu-button-text">
                        CONTENTS <i className="fa fa-caret-up" style={{ color: 'orange', fontSize: 18 }}></i>
                    </div>
                </div>
            </div>

            <div id={this.id} className="wb-body" style={{marginLeft: (this.state.showMenu ? 323 : 23), flexGrow:1}}>
                <div className='ck-content box_padding' dangerouslySetInnerHTML={{ __html: output_secure(unescape(atob(pageContent))) }}></div>
            </div>



            <div className='box_flex' style={{padding: '2px 25px', borderTop: 'solid thin darkgray'}}>


                <div className='box_flex'>
                    <i className='fa fa-angle-left button box_border box_shadow' style={{ fontSize: 16, padding: '0px 7px', borderRadius: 2 }} onClick={() => this.changePage('down')}></i>&nbsp;
                    <i className='fa fa-angle-right button box_border box_shadow' style={{ fontSize: 16, padding: '0px 7px', borderRadius: 2 }} onClick={() => this.changePage('up')}></i>
                </div>

                <div className='box_flex' style={{ margin: 'auto 0px auto auto', color: '#337ab7' }}>
                    <input min={0} value={this.state.page + 1} onChange={event => {
                        var page = Number(event.target.value) - 1;
                        this.setPage(page)
                    }} style={{ width: 20, textAlign: 'center', color: '#337ab7', borderRadius: 3, border: 'none' }}></input>
                    /&nbsp;
                    <b>{content.length}</b>
                </div>

                

            </div>

        </>;
    }
}

export default HTMLView;
