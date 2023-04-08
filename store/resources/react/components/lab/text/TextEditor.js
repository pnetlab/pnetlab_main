import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class TextEditor extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();
        this.labPath = $('#lab-viewport').attr('data-path');
        this.state = {
            show: false,
            transform: 1,
        }

        this.inner = false;

    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            this.setState({
                show: false
            })
        } else {
            var transform = getZoomLab()/100;
            this.setState({
                show: true,
                transform: transform,
            })
        }
    }



    setPostion(left, top) {
        this.modalView.css({ left: (left), top: (top - 16) });
    }

    getPostion() {
        const {top, left} = this.modalView.offset();
        return {
            left: left,
            top: top + 16,
        }
    }

    setContent(content) {
        this.editor.editor.setData(content);
    }

    getContent() {
        return this.editor.editor.getData();
    }

    setSize(width, height){
        this.resizeObject.css({width, height});
    }

    getSize(){
        console.log('tesat');
        return {
            width: this.resizeObject.width(),
            height: this.resizeObject.height()


        }
    }

    onLabViewClick() {
        if (this.inner) return;
        if(!this.state.show) return;
        if(this.props.onSave) this.props.onSave();
    }

    componentDidMount() {
        this.modalView = $(`#${this.id}`);
        this.modalView.draggable({ handle: '.evenglab_text_move' });
        document.getElementById("lab-viewport").addEventListener("click", this.onLabViewClick.bind(this));
    }

    componentWillUnmount() {
        document.getElementById("lab-viewport").removeEventListener("click", this.onLabViewClick.bind(this));
    }


    render() {
        return <div
            onMouseLeave={() => { this.inner = false; }}
            onMouseOver={() => { this.inner = true; }}
            id={this.id} className='evenglab_text_editor'
            style={{ position: 'fixed', top: this.state.top, left: this.state.left, display: (this.state.show ? 'block' : 'none') }}>
            <span className="evenglab_text_move glyphicon glyphicon-move" style={{ cursor: 'move', color: 'rgba(0, 0, 0, 0.5)' }}></span>
            <style>{`
                .evenglab_text_editor .ck.ck-editor__main>.ck-editor__editable {
                    background: none;
                }
                .evenglab_text_editor .ck.ck-editor__top{
                    position: fixed;
                    top: 0;
                    left: 0px;
                    right: 0px;
                    z-index: 2000;
                }

                .evenglab_text_editor .ck.ck-editor__main{
                    height:100%;
                    transform: scale(${this.state.transform});
                    transform-origin: 0 0;
                }

                .evenglab_text_editor .ck.ck-content{
                    height:100%;
                }

                

                .customShape.customText .ui-resizable-handle{
                    display:none !important
                }
            `}</style>
            <CKEditor

                ref={editor => this.editor = editor}
                editor={ClassicEditor}
                data=""
                onInit={editor => {
                    // this.resizeObject = $(`#${this.id} .ck.ck-editor`);
                    this.resizeObject = $(`#${this.id} .ck.ck-editor__main`);
                    this.resizeObject.resizable()
                    // if (isset(this.state.content[this.state.page])) {
                    //     // editor.setData(unescape(atob(this.state.content[this.state.page])));

                    // }
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
                            'squareButton',
                            'ovalButton',
                            'iconsButton'
                            // 'insertGrid',
                            // 'paddingButton',
                            // 'marginButton',
                            // 'borderButton',
                            // 'backgroundButton',
                            // 'positionButton',
                            // '|',
                            //'menuButton'


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

            />
        </div>
    }




}

export default TextEditor;
