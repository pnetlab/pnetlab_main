import React, { Component } from 'react'


class FuncBar extends Component {
	
	constructor(props, context) {
	    super(props, context);
	    this.table = this.context;
	    this.table.children['FuncBar'] = this;
	}
	
	reload(){
		 
		
	}
	
	componentDidMount(){
		$(document).on('click', '.table_func_dropdown.dropdown-menu', function (e) {
			  e.stopPropagation();
		});
	}
	
	render(){
		return (
				<div style={{display: 'flex' , padding: '10px 0px', alignItems: 'center'}} className="function_bar">
					<div style= {{ marginRight: 'auto', marginLeft: 0, display:'flex'}}>
						{this.props.left}
					</div>
					<div className="table_func_right" style= {{ marginRight: 0, marginLeft: 'auto'}}>
						{
							(App.isMobile() && this.props.right) ? <div className="dropdown" id={this.id}>
							    <button className="button btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Functions<span className="caret"></span></button>
							    <ul className="table_func_dropdown dropdown-menu" style={{padding: 5, right:0, left:'auto'}}>
							      {this.props.right}
							    </ul> 
						  </div> : this.props.right
						}
					</div>
				</div>
		)
	}
}
FuncBar.contextType = TableContext;
export default FuncBar