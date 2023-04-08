import React, { Component } from 'react'
import TextEditor from './TextEditor';


class Text extends Component {

    constructor(props) {
        super(props);

        this.content = '';
        this.object = null;

    }

    render() {
        return <>

            <TextEditor ref={editor => this.editor = editor}
                onSave={() => {
                    this.onSave();
                }}></TextEditor>


        </>
    }

    onSave() {
        var { left, top } = this.editor.getPostion();
        var { width, height } = this.editor.getSize();

        var zoom = 1;
        if(typeof getZoomLab == 'function') zoom = getZoomLab()/100;
        left = left / zoom;
        top = top / zoom;

        if(!width) width = 300;
        if(!height) height = 100;
        var newContent = this.editor.getContent();
        
        if (this.object != null) {

           
            $(this.object).css({left, top, width, height, display:'block'});
            this.object.classList.add('ck-content');
            this.object.innerHTML = newContent;

            var id = this.object.id.slice("customText".length);
            var objectData = this.object.outerHTML;
            editTextObject(id, { data: objectData });

            this.object = null;
            this.content = '';

        } else {

            var id = makeId();
            var text_html = `<div id="customText${id}" class="customShape customText context-menu ck-content" data-path=""
            style="position:absolute; display:block; top:${top}px; left:${left}px; width:${width}px; height:${height}px; cursor:move; z-index:1001">${newContent}</div>`;
            var form_data = {};
            form_data['data'] = text_html;
            form_data['name'] = "txt " + ($(".customShape").length + 1);
            form_data['type'] = "text";

            createTextObject(form_data).done(function (data) {
                
                //editTextObject(data.id, { data: objectData });

                // lab_topology.draggable($('.customShape'), {
                //     grid: [3, 3],
                //     start: ObjectStartDrag,
                //     stop: ObjectPosUpdate
                // });

            }).fail(function (message) {
                addMessage('DANGER', getJsonMessage(message));
            });

        }

        this.editor.modal('hide');


    }

    componentDidMount() {
        $(document).off('dblclick', '.customText');
        $(document).on('dblclick', '.customText', (e) => {
            if (LOCK == 1) {
                return 0;
            }

            if (this.object) return;

            this.object = e.currentTarget;
            this.content = e.currentTarget.innerHTML;

            var zoom = 1;
            if(typeof getZoomLab == 'function') zoom = getZoomLab()/100;

            var top = e.currentTarget.offsetTop*zoom;
            var left = e.currentTarget.offsetLeft*zoom;
            var width = e.currentTarget.clientWidth;
            var height = e.currentTarget.clientHeight;

            this.editor.setPostion(left, top);
            this.editor.setSize(width, height);
            this.editor.setContent(e.currentTarget.innerHTML);
            this.editor.modal();
            this.object.style.display = 'none';
        });

        $(document).off('click', '.action-textadd');
        $(document).on('click', '.action-textadd', (e)=>{
            this.editor.setSize(300,100);
            this.editor.setPostion(e.clientX, e.clientY);
            this.editor.setContent('');
            this.editor.modal();
            //e.stopPropagation;
        })

        $(document).on('change', '.action-textrotate', (e)=>{
            var id = e.target.getAttribute('data-path');
            var object = document.getElementById('customText'+id);
            console.log(object.style.transform);
            var matches=/rotate\(([\+\-\d]+)deg\).*skew\(([\+\-\d]+)deg\).*/.exec(object.style.transform);
            var rotate = 0;
            var skew = 0;
            if(matches){
                rotate = matches[1];
                skew = matches[2];
            }

            rotate = e.target.value;

            console.log(matches);

            if(object){
                object.style.transform = `rotate(${rotate}deg) skew(${skew}deg)`;
            }
        })

        $(document).on('blur', '.action-textrotate', (e)=>{
            var id = e.target.getAttribute('data-path');
            var object = document.getElementById('customText'+id);
            if(object){
                var objectData = object.outerHTML;
                editTextObject(id, { data: objectData });
            }
        })



        $(document).on('change', '.action-textskew', (e)=>{
            var id = e.target.getAttribute('data-path');
            var object = document.getElementById('customText'+id);
            console.log(object.style.transform);
            var matches=/rotate\(([\+\-\d]+)deg\).*skew\(([\+\-\d]+)deg\).*/.exec(object.style.transform);
            var rotate = 0;
            var skew = 0;
            if(matches){
                rotate = matches[1];
                skew = matches[2];
            }

            skew = e.target.value;

            console.log(matches);

            if(object){
                object.style.transform = `rotate(${rotate}deg) skew(${skew}deg)`;
            }
        })

        

        $(document).on('blur', '.action-textskew', (e)=>{
            var id = e.target.getAttribute('data-path');
            var object = document.getElementById('customText'+id);
            if(object){
                var objectData = object.outerHTML;
                editTextObject(id, { data: objectData });
            }
        })


    }

}
export default Text;