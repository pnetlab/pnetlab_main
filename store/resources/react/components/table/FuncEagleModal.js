import React, { Component } from 'react'

class FuncEdgeModal extends Component {
	
	constructor(props) {
        super(props);
        
        this.state ={
            data : {},
        }
 
	}
	
	
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#modal"+this.id).modal('hide');
		}else{
			$("#modal"+this.id).modal();
		}
	}
	
	loadData(link, key, selects=null, decorator={}){
        App.loading(true);
		axios({
            method: 'POST',
            url: link,
            dataType: 'json',
            data: {
                data: [key]
            }
        })
            .then(response => {
                App.loading(false);
                response = response.data;
                if (response['result']) {
                    if(response['data'][0]){

                        var data = response['data'][0];

                        for(let i in data){
                            if(decorator[i]){
                                data[i] = decorator[i](i, data);
                            }
                        };

                        if(selects == null){
                            var data = response['data'][0];
                        }else{
                            var data = {}
                            selects.map(item => {
                                if(response['data'][0][item]){
                                    data[item] = response['data'][0][item];
                                }
                            });
                            this.setState({data})                            
                            
                        }
                        
                    }
                } else {
                    error_handle(response);
                }

            })
            .catch(error => {
                App.loading(false);
				console.log(error);
                error_handle(error);
            });
    }
	
	render () {
		  return(
				<div className="modal fade" id={"modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
                                <table className='table table-bordernone'><tbody>
                                {Object.keys(this.state.data).map(key => {
                                    return <tr key={key}><td style={{padding:5, whiteSpace:'nowrap'}}>{lang(key)}</td><td style={{padding:5}}>:</td><td style={{padding:5}}>{this.state.data[key]}</td></tr>
                                })}
                                </tbody></table>
							</div>
							
							<div  className="modal-footer"> 
						        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					        </div>

						</div>
					</div>
                            <style>{`
                                .table.table-bordernone td, .table.table-bordernone th{
                                    border-top: none;
                                }
                            `}</style>
				</div>
		)  
	}
}

export default FuncEdgeModal
	  
