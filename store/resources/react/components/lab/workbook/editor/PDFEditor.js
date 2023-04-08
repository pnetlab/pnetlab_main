import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';

class PDFEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
           content: '',
           change: false,
        }
        this.id = makeId();
        this.workbook = this.props.workbook;

        this.checkEdit = this.checkEdit.bind(this);
    }

    isSave(){
        return !this.state.change;
    }

    toBase64(file){
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

    changeContent(content){
        if(content != ''){
            var regex = /data:([^;]+);base64,(.*)/gm;
            var m = regex.exec(content)
            if(m){
                return this.b64toBlob(m[2], m[1])
            }
            
        }
        return ''
    }

    
    componentDidMount(){
        this.loadWorkbook();
        window.addEventListener("beforeunload", this.checkEdit);
    }

    checkEdit(){
        if (this.isSave()) {
            return undefined;
        }
        var confirmationMessage = lang('wb_leave_alert');
        window.event.returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    }

    componentWillUnmount(){
        window.removeEventListener("beforeunload", this.checkEdit);
    }

    render() {
        return <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
            <div className='box_flex'>
                <div className='button btn btn-primary' onClick={()=>{
                    this.saveWorkbook();
                }}>Save</div> &nbsp;
                <label className='button btn btn-info box_flex' htmlFor={this.id} style={{margin:0}}><i className="fa fa-cloud-upload"></i>&nbsp;{lang("Upload PDF file")}</label>
                    <input id={this.id} ref={input=>this.input = input}
                        type="file"
                        accept="application/pdf"
                        style={{display: 'none'}}
                        onChange = {(event)=>{
                            if(isset(event.target.files[0])){
                                var file = event.target.files[0];
                                if(file.size > 50*1024*1024){
                                    showLog(lang("wb_size_alert"), 'warning');
                                    return;
                                }
                               
                                this.toBase64(file).then(result=>{
                                    this.setState({
                                        content : result,
                                        change: true
                                    })
                                })
                            }
                        }}
				/>
            </div>

            <div  id='pdf_preview' style={{flexGrow: 1, marginTop:15, position:'relative'}} >
                
                {this.state.content != ''
                    ?<>
                        <div style={{position:"absolute", height:50, top:0, width:200, right:70}}></div>
                        {isset(window.chrome)
                            ?<div className='box_flex box_line' style={{
                                position:"absolute", 
                                height:45, top:2, 
                                width:320, left:2, 
                                borderBottomRightRadius: 5, 
                                backgroundColor:'#343739',
                                color:'white',
                                paddingLeft:15}}>
                                {this.workbook.name}
                            </div>
                            :''
                        }
                        <iframe src={this.changeContent(this.state.content)} height="100%" width="100%"></iframe>
                    </>

                    :<div className='alert alert-warning'>{lang("No Preview")}</div>
                }

            </div>

            <Prompt
                when={this.state.change}
                message={location => lang("wb_save_alert")}
            />

        </div>

    }

    saveWorkbook(){
        if (!isset(App.parsed['path'])) return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook/update`,
            method: 'post',
            data: {
                name : this.workbook.name,
                content: this.state.content,
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    Swal('Success', 'Save is successful', 'success');
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

    loadWorkbook(){
        
        if (!isset(App.parsed['path'])) return;
        App.loading(true, 'Loading...');
        return axios.request({
            url: `/api/labs/session/workbook`,
            method: 'get',
            params: {
                name : this.workbook.name,
            }
        })

            .then(response => {
                App.loading(false, 'Loading...');
                response = response['data'];
                if (response['status'] == 'success') {
                    var workbook = response['message'];
                    this.setState({
                        content: workbook['content']
                    })
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
export default PDFEditor