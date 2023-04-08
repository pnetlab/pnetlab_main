import React, { Component } from 'react'

class HTMLView extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            workbook: this.props.workbook,
        }


    }

    setWorkbook(workbook){
        this.setState({workbook});
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

    render() {

        var content = get(this.state.workbook.content, '');
        var name = get(this.state.workbook.name, '');

        return <>
            
            <div  id='pdf_preview' style={{flexGrow: 1, position:'relative'}} >
                {content != ''
                    ?<>
                        <iframe src={`/api/workbook/pdf/${name}`} height="100%" width="100%"></iframe>
                    </>
                    :<div className='alert alert-warning' style={{margin:15}}>{lang("No Preview")}</div>
                }

            </div>
            
        </>;
    }
}

export default HTMLView;
