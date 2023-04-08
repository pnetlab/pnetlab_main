import React, { Component } from 'react'
import Input from '../input/Input'
import Style from '../common/Style'

class EditorItem extends Component {

	constructor(props, context) {
		super(props, context);
		this.table = this.context;
	}

	initial() {
		var { id, struct, column, onChangeBlur, onDoubleClick, onClick, onChange, ...rent } = this.props;

		this.struct = get(struct, {});
		this.id = get(id, '');
		this.rent = rent;
		this.column = column;
		if (!this.struct[EDIT_ONCHANGE_BLUR]) {
			this.onChangeBlur = () => { };
		} else {
			this.onChangeBlur = this.struct[EDIT_ONCHANGE_BLUR];
		}

		this.onChangeHandle = (object, form) => {
			if (this.props.onChange) this.props.onChange(object, form);
			if (this.struct[EDIT_ONCHANGE]) this.struct[EDIT_ONCHANGE](object, form);
		}

		if (!this.struct[EDIT_ONCLICK]) {
			this.onClick = () => { };
		} else {
			this.onClick = this.struct[EDIT_ONCLICK];
		}

		if (!this.struct[EDIT_DBCLICK]) {
			this.onDbClick = () => { };
		} else {
			this.onDbClick = this.struct[EDIT_DBCLICK];
		}

		if (this.struct[EDIT_TYPE] == 'image' || this.struct[EDIT_TYPE] == 'file') {
			if (!isset(this.struct[EDIT_UPLOAD])) {
				this.struct[EDIT_UPLOAD] = this.table[STRUCT_TABLE][LINK_UPLOAD];
			}
		}

		this.input_truct = {
			[INPUT_NAME]: this.struct[EDIT_NAME],
			[INPUT_TYPE]: this.struct[EDIT_TYPE],
			[INPUT_LIMIT]: this.struct[EDIT_LIMIT],
			[INPUT_FORMAT]: this.struct[EDIT_FORMAT],
			[INPUT_OPTION]: this.struct[EDIT_OPTION],
			[INPUT_STYLE_INPUT]: this.struct[EDIT_STYLE_INPUT],
			[INPUT_DECORATOR_IN]: this.struct[EDIT_DECORATOR_IN],
			[INPUT_DECORATOR_OUT]: this.struct[EDIT_DECORATOR_OUT],
			[INPUT_DEFAULT]: this.struct[EDIT_DEFAULT],
			[INPUT_SUGGEST]: this.struct[EDIT_SUGGEST],
			[INPUT_WRITABLE]: this.struct[EDIT_WRITABLE],
			[INPUT_UPLOAD]: this.struct[EDIT_UPLOAD],
			[INPUT_NULL]: this.struct[EDIT_NULL],
			[INPUT_VALIDATION]: this.struct[EDIT_VALIDATION],
		};




	}

	setValue(value) {
		return this.input.setValue(value);
	}

	getValue() {
		return this.input.getValue();
	}

	getInput() {
		return this.input.getInput();
	}

	disable(flag) {
		this.input.disable(flag);
	}

	validate() {
		return this.input.validate();
	}


	drawInput() {

		switch (this.struct[EDIT_TYPE]) {
			case 'file': {
				return (
					<>
						<div className="editor_item">
							<div className='editor_item_text'>
								<div>{this.struct[EDIT_NAME]}</div>
								{typeof(this.struct[EDIT_NOTE]) == 'string' ? <div style={{fontSize:'small', color:'red'}}>{this.struct[EDIT_NOTE]}</div> : ''}
							</div>
							<div>
								<Input ref={input => this.input = input} struct={this.input_truct}

									onChangeBlur={() => this.onChangeBlur(this, this.props.form)}
									onChange={() => this.onChangeHandle(this, this.props.form)}
									onClick={() => this.onClick(this, this.props.form)}
									onDoubleClick={() => this.onDbClick(this, this.props.form)}

									column={this.column}

									{...this.rent}>
									<label className='button' onClick={() => {

										this.table.children['UploadModal'].modal();
										this.table.children['UploadModal'].setColumn(this.column);
										this.table.children['UploadModal'].setOnSelect((value) => {
											this.input.setValue(value);
										});
										this.table.children['UploadModal'].scand();

									}}><i className="fa fa-folder-open"></i>&nbsp;{lang("Uploaded")}</label>
								</Input>
							</div>
						</div>
					</>
				)

			}
			case 'image': {
				return (
					<>
						<div className="editor_item">
							<div className='editor_item_text'>
								<div>{this.struct[EDIT_NAME]}</div>
								{typeof(this.struct[EDIT_NOTE]) == 'string' ? <div style={{fontSize:'small', color:'red'}}>{this.struct[EDIT_NOTE]}</div> : ''}
							</div>
							<div style={{height:150}}>
								<Input ref={input => this.input = input} struct={this.input_truct}

									onChangeBlur={() => this.onChangeBlur(this, this.props.form)}
									onChange={() => this.onChangeHandle(this, this.props.form)}
									onClick={() => this.onClick(this, this.props.form)}
									onDoubleClick={() => this.onDbClick(this, this.props.form)}

									column={this.column}

									{...this.rent}>
									<div className='button box_flex' onClick={() => {

										this.table.children['UploadModal'].modal();
										this.table.children['UploadModal'].setColumn(this.column);
										this.table.children['UploadModal'].setOnSelect((value) => {
											this.input.setValue(value);
										});
										this.table.children['UploadModal'].scand();

									}}><i className="fa fa-folder-open"></i></div>
								</Input>
							</div>
						</div>
					</>
				)

			}
			default:

				return (
					<>
						<div className="editor_item">
							<div className='editor_item_text'>
								<div>{this.struct[EDIT_NAME]}</div>
								{typeof(this.struct[EDIT_NOTE]) == 'string' ? <div style={{fontSize:10, color:'red'}}>{this.struct[EDIT_NOTE]}</div> : ''}
							</div>
							<div>
								<Input ref={input => this.input = input} className="editor_item_input" struct={this.input_truct}

									onChangeBlur={() => this.onChangeBlur(this, this.props.form)}
									onChange={() => this.onChangeHandle(this, this.props.form)}
									onClick={() => this.onClick(this, this.props.form)}
									onDoubleClick={() => this.onDbClick(this, this.props.form)}

									{...this.rent}>
								</Input></div>
						</div>
					</>
				);
		}
	}

	render() {
		this.initial();
		return (
			<React.Fragment>
				{this.drawInput()}
			</React.Fragment>
		)
	}
}
EditorItem.contextType = TableContext;
export default EditorItem;