import React, { Component } from 'react'
import Loading from '../../common/Loading';


class SearchLabBox extends Component {
    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            labs : [],
            search: '',
        }

        this.searchLabProccess = null;
    }

    onChangeHandle(e){
        this.setState({search: e.target.value}, ()=>{this.searchLab()})
    }

    searchLab(){
        if(this.searchLabProccess) clearTimeout(this.searchLabProccess);
        this.searchLabProccess = setTimeout(()=>{this.loadLab()}, 500);
    }

    loadLab(){
        this.loader.loading(true)
        axios({
			method: 'POST',
            url: '/store/public/admin/labs/search',
            dataType: 'json',
            data: {
               search: this.state.search,
            }
            })
			.then(response => {
                this.loader.loading(false);
                response = response.data;
                if(response['result']){
                    this.setState({labs: response['data']});
                }else{
                    error_handle(response);
                }
                
			})
			.catch(error => {
                this.loader.loading(false);
                console.log(error);
                error_handle(error.response);
		});
    }

    onSelectLab(lab){
        var labArray = lab.split('/');
        var labName = labArray.splice(-1,1);
        var path = labArray.join('/');
        if(path == '') path = '/';

        if(global.scope){
            global.scope.fullPathToFile = lab;
            global.scope.path = path;
            global.scope.$apply();
            global.scope.fileMngDraw(path);
        }
        if(global.previewLab) global.previewLab(lab);
    }

    render() {

        return <div style={{position:'relative'}}>
            
            <input id='search_lab_input' onFocus={()=>{this.loadLab()}} type='text' style={{width: '100%', padding:5, border:'solid thin #ccc', borderRadius:5}} placeholder={lang("Search Labs")} value={this.state.search} onChange={(e)=>this.onChangeHandle(e)}></input>
            
            <div id="search_lab_suggest">
                {this.state.labs.map(item => {
                    return <div key={item} className='button' onClick={()=>{this.onSelectLab(item)}}>{item}</div>
                })}
                <Loading ref={c=>this.loader=c} style={{position:'absolute'}}></Loading>
            </div>
            <style>{`
                #search_lab_input:focus ~ #search_lab_suggest{
                    display: block;
                }
                #search_lab_input ~ #search_lab_suggest:hover{
                    display: block;
                }
                #search_lab_input ~ #search_lab_suggest{
                    display: none;
                    position: absolute;
                    border-radius: 5px;
                    border: solid thin #ccc;
                    top: 100%;
                    left: 0px;
                    right:0px;
                    z-index: 1;
                    background: white;
                    min-height: 100px;
                    max-height: 500px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                #search_lab_input ~ #search_lab_suggest .button{
                    padding: 5px;
                    border-bottom: solid thin #ccc;
                }
                #search_lab_input ~ #search_lab_suggest .button:hover{
                    background: #3a4b65;
                    color: white;
                    font-weight: bold;
                }
            `}</style>

        </div>

    }
}

export default SearchLabBox;