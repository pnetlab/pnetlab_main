import React, { Component } from 'react'
import Loading from '../../common/Loading';
import Status from '../../admin/status/StatusLabView';
import Input from '../../input/Input';


class NodeForm extends Component {

    constructor(props) {
        super(props);
        this.id = makeId();

        this.state = {
            action: 'edit',
            templates: {},
            showAll: false,
            node_id: '',

            values: {},
            template: null,
            node: {},
            original: {},
            
            changed: {},

        }
    }

    modal(cmd = 'show') {
        if (cmd == 'hide') {
            $("#" + this.id).modal('hide');

        } else {
            $("#" + this.id).modal();
            this.setPostion('0px', '0px');

        }
    }

    setPostion(left, top){
        var modalView = $(`#${this.id} .modal-dialog`);
        modalView.css({left, top});
       
    }

    caculateIdlePc(image, template) {

        App.loading(true)
        axios({
            method: 'post',
            url: '/store/public/admin/default/idlepc',
            data: {
                ios: image,
                template: template
            }
        })
            .then(response => {
                App.loading(false);
                response = response['data'];
                if (response['result']) {
                    this.state.node['idlepc'] = response['data']['idlepc'];
                    this.setState({node: this.state.node});
                    showLog(lang(response['message'], response['data']), 'success');
                    return true;
                }
                error_handle(response)
    
            })
    
            .catch((error)=>{
                console.log(error);
                App.loading(false);
                error_handle(error);
                return false;
            })
            ;
    
    }
    

    render() {

        var zoom = (this.state.action == "add") ? getZoomLab() / 100 : 1;
        var left = (this.state.values == null || this.state.values['left'] == null) ? 100 : Math.trunc(this.state.values['left'] / zoom);
        var top = (this.state.values == null || this.state.values['top'] == null) ? 100 : Math.trunc(this.state.values['top'] / zoom);

        var templateSort = Object.keys(this.state.templates);
        templateSort = templateSort.sort((a, b) => this.state.templates[a] > this.state.templates[b] ? 1 : -1);

        return <div
            className="modal fade"
            id={this.id}
            style={{ zIndex: 1048 }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <span style={{ color: 'white' }}>
                            <i className="fa fa-add"></i>&nbsp;{this.state.action == 'add' ? lang("Add a new node") : lang("Edit node")}
                        </span>
                        <i type="button" className="close" onClick={() => { this.modal('hide') }} aria-hidden="true">×</i>
                        <i title={lang("Make transparent")} className="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>
                    </div>
                    <div className="modal-body">

                        <div className="form-group" style={{ padding: '0px 15px' }}>
                            <label className="control-label box_flex">{lang('Template')}</label>
                            <label id="form-node-showall" className="pull-right box_flex"><input disabled={this.state.action != 'add'} name="show" type="checkbox" onChange={(e) => {
                                this.setState({ showAll: e.target.checked }, () => { $('#form-node-template').selectpicker('refresh') })
                                $('#form-node-template ~ .bootstrap-select').addClass('open')
                            }}>
                            </input>&nbsp; {lang('Show all unsupport')}</label>

                            <select onChange={() => {

                                var templ = $('#form-node-template').selectpicker('val');
                                if (!templ || templ == '') return;
            
                                getTemplates(templ).then(template => {
                                    template = get(template['options'], {});
                                    this.state.node = {};
                                    this.state.node['template'] = templ;
                                    this.state.node['type'] = template['type']['value'];
                                    this.setState({ template, node: this.state.node, node_id: ''});
                                })
                                
                            }} id="form-node-template" disabled={this.state.action != 'add'} className="selectpicker form-control" data-live-search="true" data-size="auto" data-style="selectpicker-button">
                                <option value="">{lang("Nothing selected")}</option>
                                {templateSort.map(key => {
                                    var isMiss = /missing/i.test(this.state.templates[key]);
                                    if (!this.state.showAll && isMiss) return;
                                    return <option key={key} value={key} disabled={isMiss} >{this.state.templates[key].replace('.missing', '')}</option>
                                })}
                            </select>

                        </div>

                        {this.state.template != null && <>

                            <div id="form-node-data" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {this.state.action == 'add'
                                    ? <div className="form-group col-xs-12 col-sm-4">
                                        <label className=" control-label">{lang('Number of nodes to add')}</label>
                                        <Input ref={c => this.numberNodes = c} className="form-control input" max='50' value="1" struct={{
                                            [INPUT_TYPE]: 'number',
                                            [INPUT_NULL]: false,
                                            [INPUT_DEFAULT]: 1,
                                        }} />
                                    </div>
                                    : <div className="form-group col-xs-12 col-sm-4">
                                        <label className="control-label">{lang('ID')}</label>
                                        <input className='form-control input' value={this.state.node_id} disabled={true} readOnly></input>
                                    </div>
                                }




                                {Object.keys(this.state.template).map(key => {

                                    var disable = LOCK ? true : false;

                                    var value = this.state.template[key];
                                    if (value['show'] == 0) return;

                                    var value_set = (this.state.node != null && this.state.node[key] != null) ? this.state.node[key] : value['value'];
                                    if (value_set === '') value_set = value['value'];


                                    if (key == 'left' && value_set == '') value_set = left;
                                    if (key == 'top' && value_set == '') value_set = top;

                                    this.state.node[key] = value_set;

                                    var condition = '';
                                    if (value['wipe'] && this.state.action == 'edit') {
                                        condition = <div style={{ color: 'red', fontSize: 12 }}>{lang('wipe_get_effect_alert')}</div>
                                    }
                                    if (value['restart'] && this.state.action == 'edit') {
                                        condition = <div style={{ color: 'red', fontSize: 12 }}>{lang('restart_get_effect_alert')}</div>
                                    }

                                    var widthClass = ' col-xs-12 col-sm-12 '
                                    if (typeof value['width'] != 'undefined') widthClass = ` col-xs-12 col-sm-${value['width']} `

                                    var unit = '';
                                    if (typeof value['unit'] != 'undefined') unit = value['unit']


                                    if (value['type'] == 'list') {
                                        var options = get(value['options'], {});
                                        var optionsHtml = [];
                                        
                                        if(!isset(options[value_set])){
                                            optionsHtml.push(<option key={-1} value={value_set}>({lang('INVALID')}) {value_set}</option>)
                                        }
                                        
                                        for (let i in options) {
                                            optionsHtml.push(<option key={i} value={i}>{lang(options[i])}</option>)
                                        }
                                        if (key != 'icon') {
                                            return <div key={key} className={`form-group ${widthClass}`}>
                                                <label className=" control-label box_flex">{lang(key)} {unit}

                                                    {value_set != value['value'] && <i title={lang('Reset to Default')} className='button fa fa-undo' style={{ color: '#00bcd4', marginLeft: 5 }} onClick={() => {
                                                        this.state.node[key] = value['value'];
                                                        this.setState({ node: this.state.node });
                                                    }}></i>}

                                                </label>

                                                <select disabled={disable} className='input' style={{ width: '100%' }} value={value_set} onChange={(e)=>{
                                                    this.state.node[key] = e.target.value;
                                                    this.state.changed[key] = true;
                                                    this.setState({ node: this.state.node, changed: this.state.changed });
                                                }}>
                                                    {optionsHtml}
                                                </select>

                                                {value_set != this.state.original[key] && condition}

                                            </div>;
                                        } else {
                                            return <div key={key} className={`form-group ${widthClass}`}>
                                                <label className=" control-label box_flex">{lang(key)} {unit}

                                                    {value_set != value['value'] && <i title={lang('Reset to Default')} className='button fa fa-undo' style={{ color: '#00bcd4', marginLeft: 5 }} onClick={() => {
                                                        this.state.node[key] = value['value'];
                                                        this.setState({ node: this.state.node });
                                                    }}></i>}

                                                </label>

                                                <div className="form-control input box_flex button" onClick={(e) => LOCK == 0 && selectImage((imageValue) => {
                                                    this.state.node[key] = imageValue;
                                                    this.state.changed[key] = true;
                                                    this.setState({ node: this.state.node, changed: this.state.changed });
                                                })}>
                                                    <img src={`/images/icons/${value_set}`} height='15' width='15' style={{ marginRight: 20 }} />{value_set}
                                                </div>

                                            </div>;
                                        }


                                    } else if (value['type'] == 'checkbox') {
                                       
                                        return <div key={key} className={`form-group ${widthClass}`}>
                                            <label className="control-label box_flex" style={{ height: 34, marginTop: 8, marginBottom: 0 }}>{lang(key)} {unit}
                                                <input disabled={disable} type="checkbox" style={{width: 30, marginLeft:15}} className="form-control" checked={value_set == '1'} onChange={(e) => {
                                                    this.state.node[key] = e.target.checked ? '1' : '0';
                                                    this.state.changed[key] = true;
                                                    this.setState({ node: this.state.node, changed: this.state.changed });
                                                }} /></label>
                                            {value_set != this.state.original[key] && condition}
                                        </div>

                                    } else {

                                        if (key == 'ethernet') {
                                            var numberSerial = (this.state.node != null && this.state.node['serial'] != null) ? this.state.node['serial'] : 0;
                                            if (numberSerial > 0) disable = true;
                                        }

                                        var type = (typeof (value['type']) == 'string' && value['type'] != '') ? value['type'] : 'text';
                                        

                                        return <div key={key} className={`form-group ${widthClass}`}>
                                            <label className=" control-label box_flex">{lang(key)} {unit}

                                                {key!='left' && key!='uuid' && key!='firstmac' && key != 'top' && value_set != value['value'] && <i title={lang('Reset to Default')} className='button fa fa-undo' style={{ color: '#00bcd4', marginLeft: 5 }} onClick={() => {
                                                    this.state.node[key] = value['value'];
                                                    this.setState({ node: this.state.node });
                                                }}></i>}

                                            </label>
                                            <div className="box_flex">
                                                <input disabled={disable} style={{ flexGrow: 1 }} className="form-control" value={value_set} type={type} onChange={(e) => {
                                                    this.state.node[key] = e.target.value === '' ?  ' ' : e.target.value.trimStart();
                                                    this.state.changed[key] = true;
                                                    this.setState({ node: this.state.node, changed: this.state.changed });
                                                }} />
                                                {key == 'idlepc' ? <i onClick={()=>this.caculateIdlePc(this.state.node['image'], this.state.node['template'])} className="fa fa-calculator button" style={{ padding: '0px 5px', fontSize: 24, color: '#00bcd4' }} title={lang('Calculate Idle-PC')}></i> : ''}
                                            </div>
                                            {value_set != this.state.original[key] && this.state.changed[key] && condition}
                                        </div>;


                                    }
                                })}




                            </div>
                            <div style={{textAlign:'center'}} id="form-node-buttons">
                                <button style={{marginRight:15}} type="submit" className="btn btn-success" onClick={()=>this.saveNode()}>{lang("Save")}</button>
                                <button type="button" className="btn" data-dismiss="modal">{lang('Cancel')}</button>
                            </div>

                        </>
                        }

                    </div>

                </div>
            </div>

        </div >;
    }


    componentDidMount() {
        var modalView = $(`#${this.id}`);

        modalView.on('hidden.bs.modal', (e) => {
            e.preventDefault();
            e.stopPropagation();
        })

        $(`#${this.id} .modal-dialog`).draggable({});

        getTemplates(null).then(templates => {

            this.setState({ templates }, () => {
                $('#form-node-template').selectpicker('refresh');
            })
        })

        global.addFormNode = (values = {}) => {
            this.modal();
            this.setState({ action: 'add', values, node: {}, node_id: '', template: null, changed: {} }, () => {
                $('#form-node-template').selectpicker('refresh');
                $('#form-node-template').selectpicker('val', '');
                $('#form-node-template ~ .bootstrap-select').addClass('open');
            })

        }
        global.editFormNode = (node_id, values = {}) => {


            if (!window.topology.nodes[node_id]) return;
            var node = { ...window.topology.nodes[node_id] };
            var original = { ...window.topology.nodes[node_id] };

            var templ = node['template'];

            if (!templ || templ == '') return;

            getTemplates(templ).then(template => {
                template = get(template['options'], {});
                this.setState({ template });
            })

            this.modal();

            this.setState({ action: 'edit', values, node_id, node, original, template: null, changed:{} }, () => {
                $('#form-node-template').selectpicker('refresh');
                $('#form-node-template').selectpicker('val', templ);
            })

        }




    }


    saveNode() {
        var form_data = this.state.node;

        if (form_data['template'] == "") {
            return false;
        }

        if(this.state.action == 'add'){
            var url = '/api/labs/session/nodes/add';
            var numberNodes = this.numberNodes.getValue();
            if (numberNodes === null) return false;
            if (numberNodes > 1) {
                form_data['count'] = numberNodes;
                form_data['postfix'] = 1;
                form_data['numberNodes'] = numberNodes
            } else {
                form_data['count'] = numberNodes;
                form_data['postfix'] = 0;
            }
        }else{
            var url = '/api/labs/session/nodes/edit';
            form_data['count'] = 1;
            form_data['postfix'] = 0;
        }

        App.loading(true);
        return $.ajax({
            cache: false,
            type: 'POST',
            url: encodeURI(url),
            dataType: 'json',
            data: form_data,
            success: (data)=>{
                App.loading(false)
                if (data['status'] == 'success') {
                    console.log('DEBUG: node "' + form_data['name'] + '" saved.');
                    this.modal('hide');
                    addMessage(data['status'], lang(data['message'], data['data']));
                    App.topology.updateData(data['update']);
                    App.topology.printTopology();
                } else {
                    error_handle(data);
                }
            },
            error: (data)=>{
                // Server error
                App.loading(false)
                error_handle(data);
            }
        });

    }

}

export default NodeForm;
