import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DragSort from '../../../common/DragSort';

class HTMLEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content: [],
            menu: [],
            page: 0,
            change: false,
            
        }

        this.id = makeId();
        this.workbook = this.props.workbook;
        this.checkEdit = this.checkEdit.bind(this);
    }

    isSave() {
        return !this.state.change;
    }

    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }

    b64toBlob(b64Data, contentType) {
        var byteCharacters = atob(b64Data)

        var byteArrays = []

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            var slice = byteCharacters.slice(offset, offset + 512),
                byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
            }
            var byteArray = new Uint8Array(byteNumbers)

            byteArrays.push(byteArray)
        }

        var blob = new Blob(byteArrays, { type: contentType });
        var url = URL.createObjectURL(blob);
        return url
    }

    changeContent(content) {
        if (content != '') {
            var regex = /data:([^;]+);base64,(.*)/gm;
            var m = regex.exec(content)
            if (m) {
                return this.b64toBlob(m[2], m[1])
            }
        }
        return ''
    }


    componentDidMount() {
        this.loadWorkbook();
        window.addEventListener("beforeunload", this.checkEdit);
    }

    checkEdit() {
        if (this.isSave()) {
            return undefined;
        }
        var confirmationMessage = 'If you leave before saving, your changes will be lost.';
        window.event.returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.checkEdit);
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

    setPage(page, callback) {
        if(page == this.state.page){
            if(callback) callback();
            return;
        }
        if (page < 0) page = 0;
        if (page >= this.state.content.length) page = this.state.content.length - 1;

        this.setState({
            page: page
        },()=>{
            if (this.editor && this.editor.editor) {
                this.editor.editor.setData(unescape(atob(this.state.content[page])))
                if(callback) callback();
            }
        });

       

    }

    drawMenu() {
        var menu = [];
        var lv1 = this.state.menu.filter(item => item['parent'] == '');
        lv1.map((item, key) => {
            menu.push(this.drawMenuItem(item, key))
        });
        return menu;
    }
    drawMenuItem(item, key) {
        var id = 'collapse'+makeId();
        var children = this.state.menu.filter(child => child['parent'] == item['id']);
        var childrenComp = [];
        children.map((child,index) => {
            childrenComp.push(this.drawMenuItem(child, index))
        })
        return <div key={item.id} className={'wb_menu_item' + (item.parent==''?'':' tree_item')} style={{zIndex:1000-key}}>
            <div className={' tree_control'}>
            <DragSort 
                src_id={item.id} 
                src_weight={item.weight} 
                changeOrder={(src_id, dest_id)=>{
                    this.changeOrder(src_id, dest_id);
                }}
            > 
                
            <div className='box_flex box_shadow ' style={{ padding:5 }} data-toggle="collapse" data-target={`#${id}`} onClick={()=>{
            
                this.setPage(item.page, ()=>{
                    var elmnt = document.querySelector(`[menu_id='${item['id']}']`);
                    if(elmnt) elmnt.scrollIntoView({behavior: 'smooth' });
                })
            }}>
                {
                    children.length == 0
                    ? <>&bull;</>
                    : <i className="fa icon"></i>
                }
                
                &nbsp;
                <input
                    type='text'
                    className='wb_menu_title_input'
                    value={item.title}
                    onChange={(event) => this.editMenu(item.id, event.target.value)}
                ></input>
                &nbsp;
                <div className="box_flex" style={{ margin: 'auto 7px auto auto', color:'darkgray' }}>

                    <div className="dropdown button">
                        <i type="button" className="fa fa-align-left" data-toggle="dropdown" data-display="static" aria-expanded="false"></i>
                        <div className="dropdown-menu" style={{left:-90}}>
                           <div className='box_flex button' style={{padding:5}} onClick={(event)=>{event.preventDefault(); event.stopPropagation(); this.changeLevel(item.id, 'up')}}><i className='fa fa-angle-double-up button'></i>&nbsp;{lang("Promote")}</div>
                           <div className='box_flex button' style={{padding:5}} onClick={(event)=>{event.preventDefault(); event.stopPropagation(); this.changeLevel(item.id, 'down')}}><i className='fa fa-angle-double-down button'></i>&nbsp;{lang("Demote")}</div>
                        </div>
                    </div>
                    &nbsp;
                    <div className='close' onClick={(event) => {
                        event.stopPropagation(); 
                        this.setPage(item.page, ()=>{this.delMenu(item.id)});
                    }}>&times;</div>
                </div>
            </div>
            </DragSort>
            </div>
            <div id={id} className="collapse tree_expand">
                {childrenComp}
            </div>
        </div>

    }


    editMenu(id, new_name) {
        var menu = this.state.menu;
        var item = menu.find(item => {
            return item.id == id;
        })
        if (item) item.title = new_name;
        this.setState({ menu, change:true });
    }

    addMenu(id, title) {
        var menu = this.state.menu;
        menu.push({
            id: id,
            page: this.state.page,
            title: title,
            parent: '',
            weight: makeId(),
        })
        this.setState({ menu, change:true });
        
    }

    delMenu(id) {
        var menu = this.state.menu;
        var itemIndex = menu.findIndex(item => item.id == id);
        if (itemIndex != -1) {
            var item = menu[itemIndex];
            var children = menu.filter(child => child.parent == item.id);
            children.map(child => {
                child.parent = item.parent
            });
            menu.splice(itemIndex, 1);
        }
        this.setState({ menu, change:true });
        if(this.editor){
            this.editor.editor.commands.get('removeMenu')(id);
            this.saveContent();
        }
    }

    changeOrder(src_id, dest_id){

        var data = this.state.menu;

        var srcObjIndex = data.findIndex(item => item.id == src_id);
        if (srcObjIndex == -1) return;
        var srcObj = data[srcObjIndex];
        var src_weight = Number(srcObj.weight);

        var desObjIndex = data.findIndex(item => item.id == dest_id);
        if (desObjIndex == -1) return;
        var desObj = data[desObjIndex];
        var des_weight = Number(desObj.weight);

        if(srcObj.id == desObj.parent) return;


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
        data = data.sort((a, b) => Number(a.weight) - Number(b.weight));
        this.setState({ menu: data, change:true });

    }

    changeLevel(id, vector='down'){
        
        var menu = this.state.menu;
        var affect = menu.find(item => item.id == id);
        if(!affect) return;

        if(vector=='down'){
            
            var sameParent = menu.filter(item => {
                return (item.parent == affect.parent) && (Number(item.weight)<Number(affect.weight))
            });
            if(sameParent.length == 0) return;
            affect.parent = sameParent[sameParent.length-1].id;

            
        }else{
            var parent = menu.find(item => item.id == affect.parent);
            if(!parent) return;
            affect.parent = parent.parent;

        }
        this.setState({menu});
    }

    saveContent(){
        if(!this.editor) return;
        var content = this.state.content;
        content[this.state.page] = btoa(escape(this.editor.editor.getData()))
        this.setState({ content, change:true });
    }

    
    render() {
        return <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className='box_flex box_border' style={{ padding: 7 }}>

            

                <div className='button btn btn-primary' onClick={() => {
                    this.saveWorkbook();
                }}>Save</div>
                &nbsp;
                <div className='button btn btn-info' onClick={() => {
                    if (this.state.content.length > 99) {
                        Swal(lang("Warning"), lang("wb_limit_pages"), 'warning');
                        return;
                    }
                    var content = this.state.content;
                    content.splice(this.state.page + 1, 0, '');
                    var index = this.state.page + 1;
                    if (index >= this.state.content.length) index = this.state.content.length - 1;

                    this.setState({
                        content: content,
                        change: true,
                    }, () => this.setPage(index))

                }}>Add Page</div>

                &nbsp;
                <div className='button btn btn-danger' onClick={(event) => {
                   
                    var content = this.state.content;
                    content.splice(this.state.page, 1);
                    this.setState({
                        content: content,
                        change: true,
                    }, () => this.setPage(this.state.page));
                }} title="Delete current page">{lang("Delete")}</div>


                <div className='box_flex' style={{ margin: 'auto', color: '#337ab7' }}>
                    <input min={0} value={this.state.page + 1} onChange={event => {
                        var page = Number(event.target.value) - 1;
                        this.setPage(page)
                    }} style={{ width: 20, textAlign: 'center', color: '#337ab7', borderRadius: 3, border: 'none' }}></input>
                    /&nbsp;
                    <b>{this.state.content.length}</b>
                </div>

                <div className='box_flex' style={{ margin: 'auto 0px auto auto' }}>
                    <i className='fa fa-angle-left button box_border box_shadow' style={{ fontSize: 24, padding: '0px 7px', borderRadius: 2 }} onClick={() => this.changePage('down')}></i>&nbsp;
                    &nbsp;<i className='fa fa-angle-right button box_border box_shadow' style={{ fontSize: 24, padding: '0px 7px', borderRadius: 2 }} onClick={() => this.changePage('up')}></i>
                </div>

            </div>

            <div className='preview row' style={{ flexGrow: 1, position: 'relative' }} >
                <div className='col-sm-3 box_border d-flex' style={{ padding: 0, flexDirection:'column'}}>
                    <div className='box_shadow' style={{ textAlign: 'center', fontWeight: 'bold', padding: 5, color: '#337abd'}}>{lang("Menu")}</div>
                    <div className='box_padding wb_menu_frame' style={{height:0, overflow:'auto', flexGrow:1}}>
                        <style>{`
                            .wb_menu_title_input{
                                border: none;
                                color: #337ab7;
                                font-weight: bold;
                                padding: 0px 7px;
                                background: none;
                                width:100%;
                            }

                            .wb_menu_item {
                                position: relative;
                            }
                            .tree_item{
                                position: relative;
                            }
                            .tree_control{
                                position:relative;
                                z-index:1
                            }
                            .tree_control::BEFORE{
                               content: "";
                               bottom: 50%;
                               position: absolute;
                               left: -15;
                               border-bottom: solid thin darkgray;
                               width: 15px;
                            }
                            
                            .tree_item:last-child::BEFORE {
                               content: "";
                               top: 0;
                               position: absolute;
                               left: -15;
                               border-left: solid white;
                               bottom: 0;
                            }
                            
                            .tree_item:last-child .tree_control::AFTER {
                                content: "";
                                top: 0;
                                position: absolute;
                                left: -15px;
                                border-left: solid thin darkgray;
                                height: 50%;
                            }
                            
                            .tree_expand{
                                position: relative;
                                padding-left: 15px; 
                                z-index:0;
                            }
                            .tree_expand::BEFORE{
                               content: "";
                               position: absolute;
                               height:100%;
                               top:-5;
                               left: 0;
                               border-left: solid thin darkgray;
                               z-index: 0;
                            }
                            .tree_control .icon::before{
                                content: "\\f0da";
                            }
                            .tree_control [aria-expanded=false] .icon::before{
                                content: "\\f0da";
                            }
                            .tree_control [aria-expanded=true] .icon::before{
                                content: "\\f0d7";
                            }
                        `}</style>
                        {this.drawMenu()}
                    </div>
                </div>
                <div className='col-sm-9 d-flex' style={{ paddingRight: 0 }} >

                    <style>{`
                        .ck-content{
                            height: 0px;
                            flex-grow: 1;
                        }
                        .ck-editor__main{
                            flex-grow: 1;
                            display: flex;
                            flex-direction: column;
                        }
                        .ck.ck-editor {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            flex-grow: 1;
                        }
                    `}</style>
                    {this.state.content.length == 0
                        ? <div className='alert alert-warning' style={{ width: '100%', height: 50 }}>{lang("No page")}</div>
                        : <div className='d-flex' style={{width:'100%', flexDirection:'column'}} onBlur={() => {
                                this.saveContent();
                            }}><CKEditor
                            
                            ref={editor => this.editor = editor}
                            editor={ClassicEditor}
                            data=""
                            onInit={editor => {

                                if (isset(this.state.content[this.state.page])) {
                                    editor.setData(unescape(atob(this.state.content[this.state.page])));
                                }

                            }}

                            config={{
                                //'height': '300px',
                                toolbar: {
                                    items: [
                                        'cpformatButton',
                                        'undo',
                                        'redo',
                                        '|',
                                        'heading',
                                        'paddingButton',
                                        'marginButton',
                                        'borderButton',
                                        'backgroundButton',
                                        '|',
                                        'bold',
                                        'italic',
                                        'underline',
                                        'link',
                                        'bulletedList',
                                        'numberedList',
                                        'imagemngt',
                                        'blockQuote',
                                        'mediaEmbed',
                                        '|',
                                        'insertTable', 
                                        'tableColumn',
                                        'tableRow',
                                        'mergeTableCells', 
                                        'colorTable',
                                        'lineTable',
                                        'paddingTableButton',
                                        '|',
                                        'fontSize', 
                                        'fontFamily', 
                                        'fontColor', 
                                        'fontBackgroundColor',
                                        'alignment',
                                        '|',
                                        'iconsButton',
                                        '|',

                                        // 'insertGrid',
                                        // 'paddingButton',
                                        // 'marginButton',
                                        // 'borderButton',
                                        // 'backgroundButton',
                                        // 'positionButton',
                                        // '|',
                                        'menuButton'


                                    ]
                                }
                                ,
                                link: {
                                    decorators: {
                                        addTargetToLinks: {
                                            mode: 'manual',
                                            label: 'Open in a new tab',
                                            attributes: {
                                                target: '_blank',
                                                rel: 'noopener noreferrer'
                                            }
                                        }
                                    }
                                },
                                image: {

                                    styles: ['full', 'alignLeft', 'alignRight'],
                                    imgmngt: {
                                        browser: false,
                                        type: 'base64',
                                    }
                                },

                                menu: {
                                    onCreate: (id, title) => {
                                        this.addMenu(id, title);
                                    }
                                }

                                // extraPlugins: [ (editor)=>{
                                // 	editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => new CkeditorUploadAdapter( loader, {
                                // 		column: LAB_ARTICLE,
                                // 		link: '/store/public/admin/labs/uploader',
                                // 	});
                                // } ],

                            }}

                        /></div>}
                </div>
            </div>



            <Prompt
                when={this.state.change}
                message={location => lang("wb_save_alert")}
            />

        </div >

    }

    saveWorkbook() {
        if (!isset(App.parsed['path'])) return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook/update`,
            method: 'post',
            data: {
                name: this.workbook.name,
                content: this.state.content,
                menu: this.state.menu,
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    Swal('Success', lang('Save workbook successfully'), 'success');
                    this.setState({
                        change: false,
                    });
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                error_handle(error);
            })
    }

    loadWorkbook() {
        if (!isset(App.parsed['path'])) return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook?name=${this.workbook.name}`,
            method: 'get',
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbook = response['message'];
                    var menu = get(workbook['menu'], []);
                    var content = get(workbook['content'],[]);
                    menu = menu.sort((a,b)=>Number(a.weight)-Number(b.weight));
                    this.setState({content,menu});
                } else {
                    error_handle(response);
                }

            })

            .catch(function (error) {
                console.log(error);
                App.loading(false, 'Loading...');
                error_handle(error);
            })
    }
}
export default HTMLEditor