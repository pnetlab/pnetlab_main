import React, { Component } from 'react'
import JSZip from 'jszip'

class MultiConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cfg_active: get(App.topology.labinfo['multi_config_active'], ''),
            cfg_selected: get(App.topology.labinfo['multi_config_active'], ''),
            cfg_list: [],
        }

        this.nodeid = null;
        this.configs = {};
    }

    render() {
        
        return <>
            <style>{`
                #notification_container {
                    z-index:10000;
                }
                .bootstrap-select button{
                    width: 100%
                }
            `}</style>
            <div className='row'>
                <div className="row" style={{ color: '#337ab7' }}>

                    <div className="col-md-6 box_flex" style={{ padding: 10 }}>

                        {lang("Select config to Edit")}:&nbsp;

                        <div className="dropdown" style={{flexGrow: 1, maxWidth:250}}>
                            <div className="button input dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'100%'}}>
                                <div className="dropdown-item box_flex" href="#" style={{fontWeight:'bold'}}><div style={{width:20}} className={this.state.cfg_active == this.state.cfg_selected ? "fa fa-check" : ''}/>&nbsp;{this.state.cfg_selected == ''? 'DEFAULT' : this.state.cfg_selected}</div>
                            </div>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{width:'100%'}}>
                                <div className="dropdown-item box_flex button" href="#" onClick={(e) => this.multiConfigSelect('')} style={{width:'100%', padding:5}}><div style={{width:20}} className={this.state.cfg_active == '' ? "fa fa-check" : ''}/>&nbsp;{lang('DEFAULT')}</div>
                                {this.state.cfg_list.map(item => {
                                    return <div key={item} className="dropdown-item box_flex button" href="#" onClick={(e) => this.multiConfigSelect(item)} style={{width:'100%', padding:5}}><div style={{width:20}} className={item == this.state.cfg_active ? "fa fa-check" : ''}/>&nbsp;{item}</div>
                                })}
                                
                            </div>
                        </div>

                        <div className='box_flex box_line button' onClick={() => { this.multiConfigActive() }} style={{ marginLeft: 15 }}>
                            <span className="glyphicon glyphicon-flash"></span>&nbsp; {lang('Set as Active')}
                        </div>

                    </div>

                    <div className="col-md-6 box_flex" style={{ padding: 10 }}>
                        <div className='button box_flex' onClick={() => { this.startConfigNameInput() }} style={{ margin: '0px 5px' }}><i className="fa fa-plus-square" title="Add"></i>&nbsp;{lang("Add")}</div>
                        <div className='button box_flex' onClick={() => { this.multiConfigEditModal() }} style={{ margin: '0px 5px' }}><i className="fa fa-pencil-square-o" title="Rename" />&nbsp;{lang("Rename")}</div>
                        <div className='button box_flex' onClick={() => { this.multiConfigDelModal() }} style={{ margin: '0px 5px' }}><i className="fa fa-trash" title="Delete" />&nbsp;{lang("Delete")}</div>
                        <div className='button box_flex' onClick={() => this.multiConfigImportModal()} style={{ margin: '0px 5px' }}><i className="fa fa-sign-in" title="Import config directory" />&nbsp;{lang("Import")}</div>
                        <div className='button box_flex' onClick={() => this.multiConfigExport()} style={{ margin: '0px 5px' }}><i className="fa fa-sign-out" title="Export" />&nbsp;{lang("Export")}</div>
                    </div>
                </div>
                <hr />

            </div>
        </>
    }

    componentDidMount() {
        

        global.multiConfigAdd = this.multiConfigAdd.bind(this);
        global.multiConfigDel = this.multiConfigDel.bind(this);
        global.multiConfigImport = this.multiConfigImport.bind(this);
        global.multiConfigExport = this.multiConfigExport.bind(this);
        global.multiConfigRename = this.multiConfigRename.bind(this);
        global.multiConfigGet = this.multiConfigGet.bind(this);

        $(document).off('submit', '#form-node-config');
        $(document).on('submit', '#form-node-config', (e) => {
            e.preventDefault();  // Prevent default behaviour
            this.saveEditorLab('form-node-config', true)
        });


        $(document).off('change', '#checkbox-slider-master');
        $(document).on('change', '#checkbox-slider-master', (e)=> {
            if(e.target.checked){
                $('.config-list .checkbox-slider-off').parent('.checkbox-switch').click();
            }else{
                $('.config-list .checkbox-slider-on').parent('.checkbox-switch').click();
            }
        });

        $(document).off('click', '.action-configget');
        $(document).on('click', '.action-configget', (e) => {

            console.log('DEBUG: action = configget');
            $(".action-configget").removeClass("selected");
            $(e.target).addClass("selected");
            var id = $(e.target).attr('data-path');

            this.nodeid = id;

            var config = get(this.configs[id], '');

            this.printFormNodeConfigs({ 'data': config, 'name': '' });

            $('#context-menu').remove();
        });

        // none or export button click #124
        $(document).off('change', '.change_config_status');
        $(document).on('change', '.change_config_status', (e)=>{
            var id = $(e.target).data('path');
            if (!$(e.target).prop('disabled')) {
                if (!$(e.target).prop('checked')) {
                    this.setStartupData(id, 0);
                } else {
                    this.setStartupData(id, 1);
                }
            }
        });

        this.multiConfigGet().then(()=>{
            this.multiConfigSelect(this.state.cfg_selected);
        });
        this.selectpicker = $('#mlt_config_select');


    }

    startConfigNameInput() {
        var js_startConfigNameModal = '<div class="modal fade" id="startConfigNameModal" style="margin-top: 100px">'
            + '<div class="modal-dialog" role="document">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '<h4 class="modal-title" id="myModalLabel">' + lang("Start-up Config Name") + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<strong>'+lang('Name')+' : <input class="input" type="text" id="startConfigNameInput"></strong>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button onclick="multiConfigAdd()" id="" type="button" class="btn btn-primary" >' + lang("Save") + '</button>'
            + '</div>' + '</div>' + '</div>' + '</div>';
        $('body').append(js_startConfigNameModal);
        $("#startConfigNameModal").modal();

    }

    multiConfigAdd() {
        let name = $("#startConfigNameInput").val();
        if (name == '') {
            return;
        }
        App.loading(true, 'Loading...');
        $.ajax({
            url: "/api/labs/session/multi_cfg/add",
            type: 'POST',
            dataType: 'JSON',
            data: {
                name: name
            },
            success: (result) => {
                if (result['status'] == 'success') {
                    addMessage('success', result['message']);
                    this.multiConfigGet();
                    $("#startConfigNameModal").modal('hide');
                } else {
                    addMessage('danger', result['message']);
                }

                App.loading(false, 'Loading...');
            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }

    multiConfigGet() {
        App.loading(true);
        return $.ajax({
            url: "/api/labs/session/multi_cfg_list",
            type: 'GET',
            dataType: 'JSON',
            success: (result) => {
                App.loading(false)
                if (result['status'] != 'success') {
                    addMessage('danger', result['message']);
                    return;
                }
                let cfg_list = result['data'];

                this.setState({
                    cfg_list
                }, () => {
                    $('#mlt_config_select').selectpicker('refresh');
                })

            }
        }).catch((error) => {
            console.log(error);
            App.loading(false);
            error_handle(error);
        });
    }

    multiConfigSelect(name) {
        App.loading(true);
        $.ajax({
            url: "/api/labs/session/multi_cfg_detail",
            type: 'GET',
            dataType: 'JSON',
            data: {
                name: name
            },
            success: (result) => {
                App.loading(false)
                if (result['status'] != 'success') {
                    addMessage('danger', result['message']);
                    return;
                }

                this.configs = result['data'];
                this.setState({ cfg_selected: name }, () => {
                    this.selectpicker.selectpicker('refresh')
                    $(".action-configget.selected").click();
                });
            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }


    multiConfigActive() {
        App.loading(true);
        $.ajax({
            url: "/api/labs/session/multi_cfg/active",
            type: 'POST',
            dataType: 'JSON',
            data: {
                name: this.state.cfg_selected
            },
            success: (result) => {
                App.loading(false);
                if (result['status'] == 'success') {
                    addMessage('success', result['message']);
                    this.setState({ cfg_active: this.state.cfg_selected }, () => {
                        this.selectpicker.selectpicker('refresh');
                        this.selectpicker.selectpicker('val', this.state.cfg_selected);
                        

                    });
                    App.topology.updateData(result['update']);
                } else {
                    addMessage('danger', result['message']);
                }
            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }

    multiConfigDelModal() {
        makeQuestion(`${lang('Do you want to delete configuration')}: ${this.state.cfg_selected}`).then(res => {
            if(res){
                this.multiConfigDel();
            }
        })

    }

    multiConfigDel() {
        let name = this.state.cfg_selected;
        if (name == '') {
            showLog(lang('You can not delete Default configuration'), 'error');
            return;
        }
        $.ajax({
            url: "/api/labs/session/multi_cfg/delete",
            type: 'POST',
            dataType: 'JSON',
            data: {
                name: name
            },
            success: (result) => {
                if (result['status'] == 'success') {
                    addMessage('success', result['message']);
                    this.multiConfigGet();
                    $("#multiConfigDelModal").modal('hide');
                } else {
                    addMessage('danger', result['message']);
                }
            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }

    multiConfigEditModal() {
        let js_startConfigModal = '<div class="modal fade" id="multiConfigEditModal" style="margin-top: 100px">'
            + '<div class="modal-dialog" role="document">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '<h4 class="modal-title" id="myModalLabel">' + lang("Edit Start-up Config Name") + '</h4>'
            + '</div>'
            + '<div class="modal-body">'
            + '<table style="border: none">'
            + `<strong>${lang('New Name')} : <input class="input" value="'+this.state.cfg_selected+'" type="text" id="multiConfigEditInput"></strong>`
            + '</table>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button onclick="multiConfigRename()" id="" type="button" class="btn btn-primary" >' + lang("Edit") + '</button>'
            + '</div>' + '</div>' + '</div>' + '</div>';
        $('body').append(js_startConfigModal);


        var cfg_list = this.state.cfg_list;
        var selectHtml = '';
        for (let i in cfg_list) {
            selectHtml += '<option value="' + cfg_list[i] + '">' + cfg_list[i] + '</option>';
        }

        $("#multiConfigEditSelect").html(selectHtml);

        $("#multiConfigEditModal").modal();

    }


    multiConfigRename() {
        let new_name = $("#multiConfigEditInput").val();
        if (new_name == '') {
            return;
        }
        let old_name = this.state.cfg_selected;
        if(old_name == ''){
            showLog(lang('You can not rename Default configuration'), 'error');
            return;
        }
       
        $.ajax({
            url: "/api/labs/session/multi_cfg/rename",
            type: 'POST',
            dataType: 'JSON',
            data: {
                new_name: new_name,
                old_name: old_name
            },
            success: (result) => {
                if (result['status'] == 'success') {
                    addMessage('success', result['message']);
                    this.multiConfigGet();
                    $("#multiConfigEditModal").modal('hide');
                } else {
                    addMessage('danger', result['message']);
                }

            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }


    multiConfigImportModal() {
        let js_startConfigModal = '<div class="modal fade" id="multiConfigImportModal" style="margin-top: 100px">'
            + '<div class="modal-dialog" role="document">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '<strong class="modal-title" id="myModalLabel">' + lang("Import Start-up Config") + '</strong>'
            + '</div>'
            + '<div class="modal-body">'
            + '<table style="border: none; width:100%">'
            + `<tr style="border: none"><td><strong>${lang('Start-up Config Name')} : </strong></td><td><input class="input" style="padding: 5px; margin:5px; width: 100%; font-size: medium;" id="multiConfigImportInput"></td></tr>`
            + `<tr style="border: none"><td><strong>${lang('Config forder')} : </strong></td><td>
                    <input class="input" style="padding: 5px; width: auto; margin:5px; width: 100%; font-size: medium;" type="file" id="multiConfigImportFiles" webkitdirectory directory multiple/>
                    <div style="color:red">(${lang('Select Folder contain all config files of Lab')})</div>
                </td></tr>`
            + '</table>'
            + '</div>'
            + '<div class="modal-footer">'
            + '<button onclick="multiConfigImport()" id="" type="button" class="btn btn-primary" >' + lang("Import") + '</button>'
            + '</div>' + '</div>' + '</div>' + '</div>';
        $('body').append(js_startConfigModal);
        $("#multiConfigImportModal").modal();
    }

    getConfigContent(config) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var data = event.target.result;
                resolve(data);
            };
            reader.readAsText(config, "UTF-8");
        });
    }

    async multiConfigImport() {
        let importName = $("#multiConfigImportInput").val();
        if (importName == '') {
            addMessage('danger', lang('Please fill Start-up config name'));
            return;
        }

        let configFiles = $("#multiConfigImportFiles")[0].files;
        if (configFiles.length == 0) {
            addMessage('danger', lang('Please select Start-up config files'));
            return;
        }

        let configs = {};

        for (let i = 0; i < configFiles.length; i++) {
            var reader = new FileReader();
            if (configFiles[i].name.split('.').pop() == 'txt') {
                let nodeid = configFiles[i].name.split('.').slice(0, -1).join('.');
                let content = await this.getConfigContent(configFiles[i]);
                configs[nodeid] = content;
            }
        }

        $.ajax({
            url: "/api/labs/session/multi_cfg/import",
            type: 'POST',
            dataType: 'JSON',
            data: {
                import_name: importName,
                import_config: configs
            },
            success: (result) => {
                if (result['status'] == 'success') {
                    addMessage('success', result['message']);
                    this.multiConfigGet();
                    $("#multiConfigImportModal").modal('hide');
                } else {
                    addMessage('danger', result['message']);
                }

            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });

    }


    // download(filename, text) {
    //     var element = document.createElement('a');
    //     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    //     element.setAttribute('download', filename);
    //     element.setAttribute('target', "_blank");
    //     element.style.display = 'none';
    //     document.body.appendChild(element);
    //     element.click();
    //     document.body.removeChild(element);
    // }

    
    multiConfigExport() {
        let exportName = this.state.cfg_selected;
        App.loading(true)
        $.ajax({
            url: "/api/labs/session/multi_cfg/export",
            type: 'POST',
            dataType: 'JSON',
            data: {
                export_name: exportName,
            },
            success: (result) => {
                App.loading(false);
                var zip = new JSZip();
                for (let i in result['message']) {
                    zip.file(i + '.txt', result['message'][i]);
                }
                zip.generateAsync({ type: "blob" })
                    .then((content) => {
                        var url = window.URL.createObjectURL(content);
                        var element = document.createElement('a');
                        element.setAttribute('href', url);
                        element.setAttribute('download', (exportName!=''?exportName: 'Default') + '.zip');
                        element.setAttribute('target', "_blank");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
                $("#multiConfigExportModal").modal('hide');
            }
        }).catch((error) => {
            App.loading(false);
            error_handle(error);
        });
    }



    // Get node startup-config
    getNodeConfigs(node_id) {
        var deferred = $.Deferred();
        var url = '/api/labs/session/configs';
        if (node_id != null) {
            var data = { id: node_id };
        } else {
            var data = {};
        }
        var type = 'GET';
        $.ajax({
            cache: false,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data['status'] == 'success') {
                    console.log('DEBUG: got sartup-config(s) from lab.');
                    deferred.resolve(data['data']);
                } else {
                    // Application error
                    console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    deferred.reject(data['message']);
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                console.log('DEBUG: ' + message);
                deferred.reject(message);
            }
        });
        return deferred.promise();
    }


    saveEditorLab() {

        if ($('#toggle_editor').is(':checked')) {
            var editor_data = ace.edit('editor').getValue();
        } else {
            var editor_data = $(document).find('#nodeconfig').val();
        }

        var form_data = {
            node_id: this.nodeid,
            name: this.state.cfg_selected,
            config: editor_data
        }
        var url = '/api/labs/session/multi_cfg/edit';
        var type = 'POST';
        App.loading(true);
        $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: form_data,
            success: (data)=>{
                App.loading(false);
                if (data['status'] == 'success') {
                    addMessage(data['status'], lang(data['message'], data['data']));
                    this.configs[this.nodeid] = editor_data;
                    console.log('DEBUG: config saved.');
                } else {
                    error_handle(data);
                }
            },
            error: function (data) {
                // Server error
                App.loading(false);
                console.log(data);
                error_handle(data);
            }
        });
        return false;  // Stop to avoid POST
    }



    printFormNodeConfigs(values, cb) {

        if (LOCK == 0) {
            var ace_themes = [
                'cobalt', 'github', 'crimson_editor', 'iplastic', 'draw', 'clouds_midnight',
                'monokai', 'ambiance', 'chaos', 'chrome', 'clouds', 'eclipse', 'dreamweaver',
                'kr_theme', 'kuroir', 'merbivore', 'idle_fingers', 'katzenmilch', 'merbivore_soft',
            ];

            var ace_themes = [
                { title: 'Dark', key: 'cobalt' },
                { title: 'Light', key: 'github' }
            ];

            var ace_languages = [
                { title: 'Cisco-IOS', key: 'cisco_ios' },
                { title: 'Juniper JunOS', key: 'juniper_jun_os' }
            ];

            var ace_font_size = [
                '12px', '13px', '14px', '16px', '18px', '20px', '24px', '28px'
            ];

            var html = new EJS({
                url: '/themes/default/ejs/form_node_configs.ejs'
            }).render({
                MESSAGES: MESSAGES,
                values: values,
                ace_themes: ace_themes,
                ace_languages: ace_languages,
                ace_font_size: ace_font_size,
                r: readCookie
            })

        } else {
            var html = new EJS({
                url: '/themes/default/ejs/locked_node_configs.ejs'
            }).render({
                values: values
            })
        }

        $('#config-data').html(html);
        if (readCookie("editor")) {
            initEditor();
        } else {
            initTextarea();
        }
        $('#nodeconfig').val(values['data']);
        ace.edit("editor").setValue(values['data'], 1)

        cb && cb();
    }



    setStartupData(id, config) {
        
        var promises = [];
        console.log('DEBUG: posting form-node-edit form.');
        var url = '/api/labs/session/nodes/edit';
        var type = 'POST';
        var request = $.ajax({
            cache: false,
            timeout: TIMEOUT,
            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: {
                id: id,
                config: config,
            },
            success: function (data) {
                if (data['status'] == 'success') {
                    console.log('DEBUG: node '+id+' saved.');
                    addMessage(data['status'], lang(data['message'], data['data']));
                    App.topology.updateData(data['update']);
                } else {
                    error_handle(data);
                }
            },
            error: function (data) {
                error_handle(data);
            }
        });

        promises.push(request);
        
        $.when.apply(null, promises).done(function () {
            console.log("data is sent");
        });
        return false;
    }





}

export default MultiConfig;