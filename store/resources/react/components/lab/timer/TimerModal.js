import React, { Component } from 'react'

class ExpireModal extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state={
            title : '',
            content: '',
        }

        this.onFinish = null;
        this.onContinue = null;


    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');
        } else {
            $("#" + this.id).modal();
        }
    }

    setTitle(title){
        this.setState({title})
    }
    setContent(content){
        this.setState({content})
    }
    setOnFinish(callback){
        this.onFinish = callback
        this.forceUpdate();
    }
    setOnContinue(callback){
        this.onContinue = callback;
        this.forceUpdate;
    }

    componentDidMount(){
        $(`#${this.id}`).on('hidden.bs.modal', function(e){
            e.preventDefault();
            e.stopPropagation();
        })
    }


    render() {

        return <div
            className="modal fade"
            id={this.id}
            data-backdrop="static"
            data-keyboard="false"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myModalLabel">{this.state.title}</h4>
                    </div>
                    <div className="modal-body">
                        <h4>{this.state.content}</h4>
                    </div>
                    <div className="modal-footer">
                        {this.onFinish
                            ? <button onClick={() => this.onFinish()} id="close_lab_button" type="button" className="btn btn-default">
                                {lang("Finish")}
                            </button>
                            : ''
                        }
                        {this.onContinue 
                            ? <button
                                id="continue_lab_button"
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.onContinue()}
                            >{lang("Continue")}
                            </button>
                            : ''
                        }
                        
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ExpireModal;
