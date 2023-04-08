
var contextMenuOpen = false;

// Basename: given /a/b/c return c
function basename(path) {
    return path.replace(/\\/g, '/').replace(/.*\//, '');
}

// Dirname: given /a/b/c return /a/b
function dirname(path) {
    var dir = path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
    if (dir == '') {
        return '/';
    } else {
        return dir;
    }
}

// Alert management
function addMessage(severity, message, notFromLabviewport) {
    // Severity can be success (green), info (blue), warning (yellow) and danger (red)
    // Param 'notFromLabviewport' is used to filter notification
    $('#alert_container').show();
    var timeout = 10000;        // by default close messages after 10 seconds
    if (severity == 'danger') timeout = 5000;
    if (severity == 'alert') timeout = 10000;
    if (severity == 'warning') timeout = 10000;

    if ($("#lab-viewport").length || (!$("#lab-viewport").length && notFromLabviewport)) {
        //if (severity == "danger" )
        if (severity != "") {
            var notification_alert = $('<div class="alert alert-' + severity.toLowerCase() + ' fade in" style="margin-bottom:5px; padding:10px">' + message + '<button type="button" class="close" data-dismiss="alert" style="font-size:18px">&times;</button></div>');

            $('#notification_container').prepend(notification_alert);
            if (timeout) {
                window.setTimeout(function () {
                    notification_alert.alert("close");
                }, timeout);
            } 
        }
    }
    $('#alert_container').next().first().slideDown();
}

/* Add Modal
@param prop - helping classes. E.g prop = "red-text capitalize-title"
*/
function addModal(title, body, footer, prop) {
    var html = $(`<div aria-hidden="false" style="display: block;z-index: 1049;" class="modal ${prop} fade in" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">${title}</h4>
                </div>
                <div class="modal-body">
                    ${body}
                </div>
               <div class="modal-footer">${footer}</div>
            </div>
        </div>
    </div>`);
    $('body').append(html);
    html.modal('show');
    html.draggable({ handle: ".modal-header" });
}

function addWaring(title, body, footer, prop) {
    var html = $(`<div aria-hidden="false" style="display: block;z-index: 9999;" class="modal ${prop} fade in" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">${title}</h4>
                </div>
                <div class="modal-body">
                    <div class="alert alert-warning" role="alert" style="margin-bottom : 0px">
                    ${body}
                    </div>  
                </div>
                ${footer != '' ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        </div>
    </div>`);
    $('body').append(html);
    html.modal('show');
    html.draggable({ handle: ".modal-header" });
}

// Add Modal
function addModalError(message) {
    var html = $(`<div aria-hidden="false" style="display: block; z-index: 99999" class="modal fade in" tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">${lang('Error')}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger" role="alert" style="margin-bottom : 0px">
                        ${lang(message)}
                        </div>
                    </div>        
                </div>
            </div>
        </div>`);
    $('body').append(html);
    html.modal('show');
}

// Add Modal
function addModalWide(title, body, footer, property, cb) {
    // avoid open wide modal twice
    //if ($('.modal.fade.in').length > 0 && property.match('/second-win/') != null) return;
    var prop = property || "";
    console.log("### title is", title);
    var addittionalHeaderBtns = "";
    if (title.toUpperCase() == "STARTUP-CONFIGS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "CONFIGURED TEXT OBJECTS" ||
        title.toUpperCase() == "CONFIGURED NETWORKS" || title.toUpperCase() == "CONFIGURED NODES" ||
        title.toUpperCase() == "STATUS" || title.toUpperCase() == "PICTURES") {
        addittionalHeaderBtns = '<i title="Make transparent" class="glyphicon glyphicon-certificate pull-right action-changeopacity"></i>'
    }
    var html = $('<div aria-hidden="false" style="display: block; z-index:1049" class="modal click active modal-wide ' + prop + ' fade in" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></i><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + addittionalHeaderBtns + '<h4 class="modal-title">' + lang(title) + '</h4></div><div class="modal-body">' + body + '</div><div class="modal-footer">' + footer + '</div></div></div></div>');
    $('body').append(html);
    html.modal('show');
    cb && cb();
}

// Export node(s) config
function cfg_export(node_id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/nodes/export';
    var data = node_id != null ? { id: node_id } : {};
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: TIMEOUT * 10,  // Takes a lot of time
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: config exported.');
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

// // Export node(s) config recursive
function recursive_cfg_export(nodes, i) {

    i = i - 1
    addMessage('info', nodes[Object.keys(nodes)[i]]['name'] + ': ' + lang('Starting export, please wait'))
    var deferred = $.Deferred();

    var data = (typeof (nodes[Object.keys(nodes)[i]]['path']) === 'undefined')
        ? { id: Object.keys(nodes)[i] }
        : { id: nodes[Object.keys(nodes)[i]]['path'] };

    var url = '/api/labs/session/nodes/export';
    console.log('DEBUG: ' + url);
    var type = 'POST';
    $.ajax({
        cache: false,
        timeout: TIMEOUT * 10 * i,  // Takes a lot of time
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: config exported.');
                addMessage('success', nodes[Object.keys(nodes)[i]]['name'] + ': ' + lang('config exported'))
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addMessage('danger', nodes[Object.keys(nodes)[i]]['name'] + ': ' + lang(data['message']));
            }
            if (i > 0) {
                recursive_cfg_export(nodes, i);
            } else {
                addMessage('info', lang('Export all') + ':' + lang('done'));
            }
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            addMessage('danger', nodes[Object.keys(nodes)[i]]['name'] + ': ' + lang(message));
            if (i > 0) {
                recursive_cfg_export(nodes, i);
            } else {
                addMessage('info', lang('Export all') + ':' + lang('done'));
            }
        }
    });
    return deferred.promise();
}

// Clone selected labs
function cloneLab(form_data) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/labs';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: created lab "' + form_data['name'] + '" from "' + form_data['source'] + '".');
                deferred.resolve();
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


// Delete network
function deleteNetwork(id) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/labs/session/networks/delete';
    var data = id != null ? { id: id } : {};

    App.loading(true)
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            App.loading(false)
            if (data['status'] == 'success') {
                console.log('DEBUG: network deleted.');
                App.topology.updateData(data['update'])
                deferred.resolve(data);
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            App.loading(false)
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Delete node
function deleteNode(id) {
    var deferred = $.Deferred();
    var type = 'POST';

    var url = '/api/labs/session/nodes/delete'
    var data = id != null ? { id } : {};

    App.loading(true);
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            App.loading(false);
            if (data['status'] == 'success') {
                console.log('DEBUG: node deleted.');
                App.topology.updateData(data['update']);
                deferred.resolve();
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            App.loading(false);
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Export selected folders and labs
function exportObjects(form_data) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/export';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: objects exported into "' + data['data'] + '".');
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

// HTML Form to array
function form2Array(form_name) {

    var form_array = {};
    $('form :input[name^="' + form_name + '["]').each(function (id, object) {
        // INPUT name is in the form of "form_name[value]", get value only
        var key = $(this).attr('name').substr(form_name.length + 1, $(this).attr('name').length - form_name.length - 2);
        if (this.type == 'checkbox') {
            form_array[key] = this.checked ? '1' : '0';
        } else {
            form_array[key] = $(this).val();
        }

    });
    console.log(form_array);
    return form_array;
}

// HTML Form to array by row
function form2ArrayByRow(form_name, id) {
    var form_array = {};

    $('form :input[name^="' + form_name + '["][data-path="' + id + '"]').each(function (id, object) {
        // INPUT name is in the form of "form_name[value]", get value only
        var key = $(this).attr('name').substr(form_name.length + 1, $(this).attr('name').length - form_name.length - 2);
        if (this.type == 'checkbox') {
            form_array[key] = this.checked ? '1' : '0';
        } else {
            form_array[key] = $(this).val();
        }
    });
    return form_array;
}

// Get JSon message from HTTP response
function getJsonMessage(response) {
    var message = '';
    try {
        message = JSON.parse(response)['message'];
        code = JSON.parse(response)['code'];
        if (code == 412) {
            // if 412 should redirect (user timed out)
            window.setTimeout(function () {
                location.reload();
            }, 2000);
        }
    } catch (e) {
        if (response != '') {
            message = response;
        } else {
            message = 'Undefined message, check if the UNetLab VM is powered on. If it is, see <a href="/Logs" target="_blank">logs</a>.';
        }
    }
    return message;
}

// Get lab info
function getLabInfo() {
    var deferred = $.Deferred();
    var url = '/api/labs/session/info';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: lab found.');
                window.lab = data['data'];
                LOCK = data['data']['lock'];
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



// Get lab endpoints
function getLabLinks() {
    var deferred = $.Deferred();
    var url = '/api/labs/session/links';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got available links(s) from lab.');
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


// Get lab networks
function getNetworks(network_id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/networks'
    var type = 'GET';
    var data = network_id != null ? { id: network_id } : {};
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got network(s) from lab ');

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


// Get available network types
function getNetworkTypes() {
    var deferred = $.Deferred();
    var url = '/api/list/networks';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got network types.');
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



function getNodesStatus() {
    var deferred = $.Deferred();
    var url = '/api/labs/session/nodestatus'
    var type = 'POST';

    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                deferred.resolve(data['data']);
            } else {
                error_handle(data);
                deferred.reject(message);
            }
        },
        error: function (data) {
            error_handle(data.responseJSON);
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}



// Get lab node interfaces
function getNodeInterfaces(node_id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/interfaces';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: { node_id: node_id },
        success: function (data) {
            if (data['status'] == 'success') {
                // console.log('DEBUG: got node(s) from lab.');
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

// Get lab pictures
function getPictures(picture_id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/pictures';
    var data = picture_id != null ? { id: picture_id } : {};
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got pictures(s) from lab');
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

// Get lab pictures
function getPicturesMapped(picture_id) {
    var deferred = $.Deferred();

    var url = '/api/labs/session/picturesmapped';
    var type = 'GET';
    var data = picture_id != null ? { id: picture_id } : {};
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got pictures(s) from lab.');
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


// Get lab topology
function getTopology(offline = false) {

    var deferred = $.Deferred();

    if (offline) {
        if (window.topology) {
            deferred.resolve(window.topology);
            return deferred.promise();
        }
    }

    var url = '/api/labs/session/topology';
    var type = 'GET';
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got topology from lab');
                window.topology = data['data'];
                window.nodes = data['data']['nodes'];
                window.lab = data['data']['labinfo'];
                LOCK = window.lab.lock;

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

// Get roles
function getRoles() {
    var deferred = $.Deferred();
    var form_data = {};
    var url = '/api/list/roles';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got roles.');
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

// Get templates
function getTemplates(template, refresh = true) {

    if(!window.templates) window.templates = {};
    if(window.templates[template] && !refresh){
        return Promise.resolve(window.templates[template])
    }

    var url = (template == null) ? '/api/list/templates/' : '/api/list/templates/' + template;
    var type = 'GET';
    window.templates[template] = $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
    }).then(function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got template(s).');
                return data['data'];
            } else {
                // Application error
               
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                return Promise.reject(lang(data['message'], data['data']));
            }
        }).catch(function (data) {
            // Server error
           
            var data = data['responseJSON'];
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            return Promise.reject(lang(data['message'], data['data']));
        })
    
    return window.templates[template];
}

// Get user info
function getUserInfo() {
    window.LANGUAGE = get(localStorage.getItem('language'), '');
    var deferred = $.Deferred();
    var url = `/api/auth?lang=${window.LANGUAGE}`;
    var type = 'GET';
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        beforeSend: function (jqXHR) {
            if (window.BASE_URL) {
                jqXHR.crossDomain = true;
            }
        },
        success: function (data) {

            if (data['status'] == 'success') {
                console.log('DEBUG: user is authenticated.');
                EMAIL = data['data']['email'];
                FOLDER = (data['data']['folder'] == null) ? '/' : data['data']['folder'];
                LAB = data['data']['lab'];
                LANG = data['data']['lang'];
                NAME = data['data']['name'];
                ROLE = data['data']['role'];
                TENANT = data['data']['tenant'];
                USERNAME = data['data']['username'];
                HTML5 = data['data']['html5'];
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

// Get users
function getUsers(user) {
    var deferred = $.Deferred();
    if (user != null) {
        var url = '/api/users/' + user;
    } else {
        var url = '/api/users/';
    }
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got user(s).');
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

// Logging
function logger(severity, message) {
    if (DEBUG >= severity) {
        console.log(message);
    }
    $('#alert_container').next().first().slideDown();
}

// Logout user
function logoutUser() {
    var deferred = $.Deferred();
    var url = '/api/auth/logout';
    var type = 'GET';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: user is logged off.');
                if (UPDATEID != null) {
                    // Stop updating node_status
                    clearInterval(UPDATEID);
                }
                deferred.resolve();
            } else {
                // Authentication error
                console.log('DEBUG: internal error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Authentication error
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: Ajax error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


// Delete picture
function deletePicture(picture_id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/pictures/delete';
    $.ajax({
        cache: false,

        type: 'POST',
        url: encodeURI(url),
        dataType: 'json',
        data: {
            id: picture_id,
        },
        success: function (data) {
            if (data['status'] == 'success') {
                // Fetching ok
                $('.picture' + picture_id).fadeOut(300, function () {
                    $(this).remove();
                });
                deferred.resolve(data);
            } else {
                // Fetching failed
                addMessage('DANGER', lang(data['status']));
                deferred.reject(data['status']);
            }
        },
        error: function (data) {
            addMessage('DANGER', lang(getJsonMessage(data['responseText'])));
            deferred.reject();
        }
    });
    return deferred.promise();
}

// Post login
function postLogin(param) {
    if (UPDATEID != null) {
        // Stop updating node_status
        clearInterval(UPDATEID);
    }
    $('body').removeClass('login');
    if (LAB == null && param == null) {
        window.location.href = "/";
        console.log('DEBUG: loading folder "' + FOLDER + '".');

    } else {
        LAB = LAB || param;
        console.log('DEBUG: loading lab "' + LAB + '".');
        printPageLabOpen(LAB);
        UPDATEID = setInterval('printLabStatus()', STATUSINTERVAL);

    }


}

function closeLab() {
    var deferred = $.Deferred();
    $.ajax({
        cache: false,

        type: 'POST',
        url: '/api/labs/session/factory/leave',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            deferred.resolve(data);
        },
        error: function (data) {
            // Server error
            var message = getJsonMessage(data['responseText']);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Post login
function newUIreturn(param) {
    if (UPDATEID != null) {
        // Stop updating node_status
        clearInterval(UPDATEID);
    }
    $('body').removeClass('login');
    window.location.href = "/";
}

//set Network

function setNetwork(nodeName, left, top) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['name'] = 'Net-' + nodeName;
    form_data['type'] = 'bridge';
    form_data['left'] = left;
    form_data['top'] = top;
    form_data['visibility'] = 1;
    form_data['postfix'] = 0;

    var url = '/api/labs/session/networks/add';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: new network created.');
                App.topology.updateData(data['update'])
                deferred.resolve(data);
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], lang(data['message']));

        },
        error: function (data) {
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// set cpulimit
function setCpuLimit(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/cpulimit';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: cpulimit updated.');
                deferred.resolve(data);
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], lang(data['message']));

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

// set uksm
function setUksm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/uksm';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: UKSM updated.');
                deferred.resolve(data);
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], lang(data['message']));

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

// set ksm
function setKsm(bool) {
    var deferred = $.Deferred();
    var form_data = {};

    form_data['state'] = bool;

    var url = '/api/ksm';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: JSON.stringify(form_data),
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: KSM updated.');
                deferred.resolve(data);
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], lang(data['message']));

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


function setNetworkiVisibility(networkId, visibility) {
    var deferred = $.Deferred();
    var form_data = {};
    form_data['id'] = networkId;
    form_data['visibility'] = visibility;
    var url = '/api/labs/session/networks/edit';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: network visibility updated.');
                App.topology.updateData(data['update'])
                deferred.resolve(data);
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            addMessage(data['status'], lang(data['message']));

        },
        error: function (data) {
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set network position
function setNetworkPosition(network_id, left, top) {
    var deferred = $.Deferred();

    form_data['left'] = left;
    form_data['top'] = top;
    form_data['id'] = network_id;
    var url = '/api/labs/session/networks/edit';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: network position updated.');
                App.topology.updateData(data['update'])
                deferred.resolve();
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            //addMessage(data['status'], lang(data['message'], data['data']));

        },
        error: function (data) {
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set multiple network position
function setNetworksPosition(networks) {
    var deferred = $.Deferred();
    if (networks.length == 0) { deferred.resolve(); return deferred.promise(); }

    var form_data = {};
    form_data.data = networks;
    var url = '/api/labs/session/networks/edit';
    var type = 'POST';
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: network position updated.');
                App.topology.updateData(data['update'])
                deferred.resolve();
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
            //addMessage(data['status'], lang(data['message'], data['data']));

        },
        error: function (data) {
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set node boot
function setNodeBoot(node_id, config) {
    var deferred = $.Deferred();

    var form_data = {};
    form_data['id'] = node_id;
    form_data['config'] = config;
    var url = '/api/labs/session/nodes/edit';
    var type = 'POST';
    App.loading(true);
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            App.loading(false)
            if (data['status'] == 'success') {
                console.log('DEBUG: node bootflag updated.');
                App.topology.updateData(data['update']);
                deferred.resolve();
            } else {
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            App.loading(false);
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set node position
function setNodePosition(node_id, left, top) {
    var deferred = $.Deferred();

    var form_data = {};
    form_data['id'] = node_id;
    form_data['left'] = left;
    form_data['top'] = top;
    var url = '/api/labs/session/nodes/edit';
    var type = 'POST';
    
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: node position updated.');
                App.topology.updateData(data['update']);
                deferred.resolve();
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Set multiple node position
function setNodesPosition(nodes) {

    var deferred = $.Deferred();
    if (nodes.length == 0) { deferred.resolve(); return deferred.promise(); }
    var form_data = {};
    form_data.data = nodes;
    var url = '/api/labs/session/nodes/edit';
    var type = 'POST';

    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: node position updated.');
                App.topology.updateData(data['update']);
                deferred.resolve();
            } else {
                // Application error
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Update node data from node list
function setNodeData(id) {

    var form_data = form2ArrayByRow('node', id);
    var promises = [];
    console.log('DEBUG: posting form-node-edit form.');
    var url = '/api/labs/session/nodes/edit';
    var type = 'POST';
    form_data['id'] = id;
    form_data['count'] = 1;
    form_data['postfix'] = 0;
    for (var i = 0; i < form_data['count']; i++) {
        form_data['left'] = parseInt(form_data['left']) + i * 10;
        form_data['top'] = parseInt(form_data['top']) + i * 10;
        var request = $.ajax({
            cache: false,

            type: type,
            url: encodeURI(url),
            dataType: 'json',
            data: form_data,
            success: function (data) {
                if (data['status'] == 'success') {
                    console.log('DEBUG: node "' + form_data['name'] + '" saved.');
                    // Close the modal
                    App.topology.updateData(data['update']);
                    App.topology.printTopology();
                    addMessage(data['status'], lang(data['message']));
                } else {
                    // Application error
                    console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                    error_handle(data)
                }
            },
            error: function (data) {
                // Server error
                var message = getJsonMessage(data['responseText']);
                console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
                console.log('DEBUG: ' + message);
                error_handle(data)
            }
        });
        promises.push(request);
    }

    $.when.apply(null, promises).done(function () {
        console.log("data is sent");
    });
    return false;
}


function updateNodeData(id, data){
    App.loading(true)
    var form_data = {...get(window.nodes[id], {}), ...data};
    $.ajax({
        cache: false,
        type: 'post',
        url: encodeURI('/api/labs/session/nodes/edit'),
        dataType: 'json',
        data: form_data,
        success: function (data) {

            App.loading(false)
            if (data['status'] == 'success') {
                // Close the modal
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                addMessage(data['status'], lang(data['message']));
            } else {
                // Application error
                error_handle(data)
            }
        },
        error: function (data) {
            // Server error
            App.loading(false)
            var message = getJsonMessage(data['responseText']);
            error_handle(data)
        }
    });
}

function updateNodePort(id, port){
    App.loading(true)
    $.ajax({
        cache: false,
        type: 'post',
        url: encodeURI('/api/labs/session/nodes/port'),
        dataType: 'json',
        data: {
            id: id,
            port: port
        },
        success: function (data) {
            console.log('atata')
            console.log(data);
            App.loading(false)
            if (data['status'] == 'success') {
                // Close the modal
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                addMessage(data['status'], lang(data['message']));
            } else {
                // Application error
                error_handle(data)
            }
        },
        error: function (data) {
            // Server error
            App.loading(false)
            var message = getJsonMessage(data['responseText']);
            error_handle(data)
        }
    });
}

//set note interface
function setNodeInterface(node_id, network_id, interface_id) {

    var deferred = $.Deferred();

    var form_data = {};
    form_data[interface_id] = network_id;

    var url = '/api/labs/session/interfaces/edit';
    var type = 'POST';
    var data = {
        node_id: node_id,
        data: form_data,
    };
    App.loading(true);
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            App.loading(false);
            if (data['status'] == 'success') {
                console.log('DEBUG: node interface updated.');
                addMessage('success', lang(data['message']));
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                deferred.resolve(data);
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            App.loading(false);
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();

}


//set note interface
function createNetworkP2P(name, src_id, src_if, dest_id, dest_if) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/networks/p2p';
    var type = 'POST';
    var data = {
        name: name,
        src_id: src_id,
        src_if: src_if,
        dest_id: dest_id,
        dest_if: dest_if
    };
    App.loading(true);
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            App.loading(false);
            
            if (data['status'] == 'success') {
                addMessage('success', lang(data['message']));
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                deferred.resolve(data);
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            App.loading(false);
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();

}

// Start node(s)
function start(node_id) {
   
    var url = '/api/labs/session/nodes/start';
    var type = 'POST';

    var node = App.topology.nodes[node_id];
    var comp = App.topology.nodes[node_id].get('component', false);
    if(comp) comp.attr('data-status', 5)

    return $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: { id: node_id },
        success: function (data) {
            
            if (data['status'] == 'success') {
                if(comp) comp.attr('data-status', 3)
                console.log('DEBUG: node(s) started.');
                addMessage('success', node.get('name') + ': ' + lang("started"));
            } else {
                if(comp) comp.attr('data-status', 0)
                addMessage('danger', node.get('name') + ': ' + lang(data['message']));
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
            }
        },
        error: function (data) {
            if(comp) comp.attr('data-status', 0)
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            error_handle(data);
        }
    });
    
}

// Stop node(s)
function stop(node_id) {
    
    var url = '/api/labs/session/nodes/stop';
    var type = 'POST';

    var node = App.topology.nodes[node_id];
    var comp = App.topology.nodes[node_id].get('component', false);
    if(comp) comp.attr('data-status', 5)

    return $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: { id: node_id },
        success: function (data) {
            if (data['status'] == 'success') {
                if(comp) comp.attr('data-status', 0)
                addMessage('success', node.get('name') + ': ' + lang("stopped"));
                console.log('DEBUG: node(s) stopped.');
                $('#node' + node_id).removeClass('jsplumb-connected');
                return true;

            } else {
                // Application error
                if(comp) comp.attr('data-status', 3)
                addMessage('danger', node.get('name') + ': ' + data['message']);
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                return false;
            }
        },
        error: function (data) {
            // Server error
            if(comp) comp.attr('data-status', 3)
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            addMessage('danger', node.get('name') + ': ' + message);
            return false;
        }
    });
}



// Wipe node(s)
function wipe(node_id) {
    
    var url = '/api/labs/session/nodes/wipe';
    var type = 'POST';

    var node = App.topology.nodes[node_id];
    var comp = App.topology.nodes[node_id].get('component', false);
    if(comp) comp.attr('data-status', 5)

    var data = node_id != null ? { id: node_id } : {};
    return $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                if(comp) comp.attr('data-status', 0)
                console.log('DEBUG: node(s) wiped.');
                addMessage('success', node.get('name') + ': ' + lang("wiped"));
            } else {
                // Application error
                if(comp) comp.attr('data-status', 3)
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addMessage('danger', node.get('name') + ': ' + data['message']);
            }
        },
        error: function (data) {
            // Server error
            if(comp) comp.attr('data-status', 3)
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            addMessage('danger', node.get('name') + ': ' + message);
        }
    });
    
}

// unlock node
function unlockNode(node_id) {
    
    var url = '/api/labs/session/nodes/unlock';
    var type = 'POST';

    var node = App.topology.nodes[node_id];
    var comp = App.topology.nodes[node_id].get('component', false);
    if(comp) comp.attr('data-status', 5)

    var data = node_id != null ? { id: node_id } : {};
    return $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                if(comp) comp.attr('data-status', 0)
                console.log('DEBUG: node(s) unlock.');
                addMessage('success', node.get('name') + ': ' + lang("unlocked"));
            } else {
                // Application error
                if(comp) comp.attr('data-status', 3)
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addMessage('danger', node.get('name') + ': ' + data['message']);
            }
        },
        error: function (data) {
            // Server error
            if(comp) comp.attr('data-status', 3)
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            addMessage('danger', node.get('name') + ': ' + message);
        }
    });
    
}

/***************************************************************************
 * Print forms and pages
 **************************************************************************/
// Context menu
function printContextMenu(title, body, e) {

    var x = e.clientX;
    var y = e.clientY;
    var pageX = x
    var pageY = y

    $("#context-menu").remove()
    var titleLine = '';
    titleLine = '<li role="presentation" class="dropdown-header">' + lang(title) + '</li>'

    var menu = $(`<div id="context-menu" class="collapse clearfix dropdown">
                    <ul class="dropdown-menu">${titleLine + body}</ul>
                </div>`);

    $('body').append(menu);
    
    var screenW = $('#body').width()
    var screenH = $('#body').height()

    var width = Number(menu.width());
    var height = Number(menu.height());

    if (pageX + width > screenW) pageX = screenW - width;
    if (pageY + height > screenH) pageY = screenH - height;

    menu.css({
        left: pageX + 'px',
        top: pageY + 'px',
        position: 'absolute'
    });


}

// Folder form
function printFormFolder(action, values) {
    var name = (values['name'] != null) ? values['name'] : '';
    var path = (values['path'] != null) ? values['path'] : '';
    var original = (path == '/') ? '/' + name : path + '/' + name;
    var submit = (action == 'add') ? lang('Add') : lang('Rename');
    var title = (action == 'add') ? lang('Add a new folder') : lang("Rename current folder");
    if (original == '/' && action == 'rename') {
        addModalError(lang("Cannot rename root folder"));
    } else {
        var html = '<form id="form-folder-' + action + '" class="form-horizontal form-folder-' + action + '"><div class="form-group"><label class="col-md-3 control-label">' + lang('Path') + '</label><div class="col-md-5"><input class="form-control" name="folder[path]" value="' + path + '" disabled type="text"/></div></div><div class="form-group"><label class="col-md-3 control-label">' + lang('Name') + '</label><div class="col-md-5"><input class="form-control autofocus" name="folder[name]" value="' + name + '" type="text"/></div></div><div class="form-group"><div class="col-md-5 col-md-offset-3"><input class="form-control" name="folder[original]" value="' + original + '" type="hidden"/><button type="submit" class="btn btn-success">' + submit + '</button> <button type="button" class="btn btn-flat" data-dismiss="modal">' + lang('Cancel') + '</button></div></div></form>';
        console.log('DEBUG: popping up the folder-' + action + ' form.');
        addModal(title, html, '');
        validateFolder();
    }
}

// Network Form
function printFormNetwork(action, values) {

    var zoom = (action == "add") ? getZoomLab() / 100 : 1;
    var id = (values == null || values['id'] == null) ? '' : values['id'];
    var left = (values == null || values['left'] == null) ? null : Math.trunc(values['left'] / zoom);
    var top = (values == null || values['top'] == null) ? null : Math.trunc(values['top'] / zoom);
    var name = (values == null || values['name'] == null) ? 'Net' : values['name'];
    var type = (values == null || values['type'] == null) ? 'bridge' : values['type'];
    var icon = (values == null || values['icon'] == null) ? '' : values['icon'];
    var size = (values == null || values['size'] == null) ? '' : values['size'];

    if(icon == ''){
        icon = type == 'bridge'?'lan.png':'cloud.png';
    }

    var title = (action == 'add') ? lang("Add a new network") : lang("Edit network");

    $.when(getNetworkTypes()).done(function (network_types) {
        // Read privileges and set specific actions/elements
        var html = `<form id="form-network-${action}" class="form-horizontal">`;
        if (action == 'add') {
            // If action == add -> print the nework count input
            html += '<div class="form-group"><label class="col-md-3 control-label">' + lang("Number of networks to add") + '</label><div class="col-md-5"><input class="form-control" name="network[count]" value="1" type="text"/></div></div>';
            html += '<input class="form-control" name="network[visibility]" type="hidden" value="1"/>';
        } else {
            // If action == edit -> print the network ID
            html += '<div class="form-group"><label class="col-md-3 control-label">' + lang("ID") + '</label><div class="col-md-5"><input class="form-control" disabled name="network[id]" value="' + id + '" type="text"/></div></div>';
        }

        html += `<div class="form-group">
                    <label class="col-md-3 control-label">${lang("Name/Prefix")}</label>
                    <div class="col-md-5">
                        <input class="form-control autofocus" name="network[name]" value="${name}" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">${lang("Type")}</label>
                    <div class="col-md-5">
                        <select ${action == 'add'? '' : 'disabled'} class="selectpicker show-tick form-control" name="network[type]" data-live-search="true" data-style="selectpicker-button" onchange="
                            changeEditNetworkIcon(event)
                        ">`;

                            $.each(network_types, function (key, value) {
                                // Print all network types
                                if (!value.startsWith('pnet') && !value.startsWith('ovs')) {
                                    var type_selected = (key == type) ? 'selected ' : '';
                                    html += '<option ' + type_selected + 'value="' + key + '">' + value + '</option>';
                                }
                            });

                            $.each(network_types, function (key, value) {
                                // Print all network types
                                if (value.startsWith('pnet')) {
                                    value = value.replace('pnet', 'Cloud')
                                    // Custom Management Port for eth0
                                    if (value.startsWith('Cloud0')) {
                                        value = value.replace('Cloud0', 'Management(Cloud0)')
                                    }
                                    var type_selected = (key == type) ? 'selected ' : '';
                                    html += '<option ' + type_selected + 'value="' + key + '">' + value + '</option>';
                                }
                            });

                html += `</select>
                    </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label">${lang("Left")}</label>
                        <div class="col-md-5">
                        <input class="form-control" name="network[left]" value="${left}" type="text"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label">${lang("Top")}</label>
                        <div class="col-md-5">
                            <input class="form-control" name="network[top]" value="${top}" type="text"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label">${lang("Size")} (px)</label>
                        <div class="col-md-5">
                            <input class="form-control" min=0 name="network[size]" value="${size}" type="number"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class=" col-md-3 control-label">${lang('Icon')}</label>
                        <div class="col-md-5">
                            <div class="selectpicker box_flex button input" onclick="selectImage(function(value){
                                $('#networkimage').val(value);
                                $('#networkimage_preview').attr('src', '/images/icons/' + value);
                                $('#networkicon_name').text(value);
                                
                            })" data-size="5">
                                <img id="networkimage_preview" src='/images/icons/${icon}' height=15 width=15 style="margin-right:20px"/> <span id='networkicon_name'>${icon}</span>
                            </div>
                            <input id="networkimage" class="form-control" type="text" style="display:none" value="${icon}" name="network[icon]"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-md-5 col-md-offset-3">
                            <button type="submit" class="btn btn-success">${lang("Save")}</button> 
                            <button type="button" class="btn" data-dismiss="modal">${lang('Cancel')}</button>
                        </div>
                    </div>

            </form>
        </form>`;

        // Show the form
        addModal(title, html, '', 'second-win');
        $('.selectpicker').selectpicker();
        $('.autofocus').focus();
    });
}

function changeEditNetworkIcon(event){
    value = event.target.value;
    icon = value == 'bridge'?'lan.png':'cloud.png';
    $('#networkimage').val(icon);
    $('#networkimage_preview').attr('src', '/images/icons/' + icon);
    $('#networkicon_name').text(icon);
}

function showTemplate(ev) {
    if (ev.currentTarget.checked) {
        $('#form-node-add .disabled').css('display', 'block');
    } else {
        $('#form-node-add .disabled').css('display', 'none');
    }
}



// Map picture
function printNodesMap(values, cb) {
    var title = values['name'] + ': ' + lang("startup-config");
    var html = '<div class="col-md-12">' + values.body + '</div><div class="text-right">' + values.footer + '</div>';
    $('#config-data').html(html);
    cb && cb();
}

//save lab handler
function saveConfig(form) {
    var form_data = form2Array('config');
    var url = '/api/labs/session/configs/edit';
    var type = 'POST';
    App.loading(true)
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: form_data,
        success: function (data) {
            App.loading(false);
            if (data['status'] == 'success') {
                console.log('DEBUG: config saved.');
                // Close the modal
                $('body').children('.modal').attr('skipRedraw', true);
                if (form) {
                    //$('body').children('.modal').modal('hide');
                    addMessage(data['status'], lang(data['message']));
                }
            } else {
                // Application error
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                addModal('ERROR', '<p>' + data['message'] + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">' + lang('Close') + '</button>');
            }
        },
        error: function (data) {
            App.loading(false);
            // Server error
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            addModal('ERROR', '<p>' + message + '</p>', '<button type="button" class="btn btn-flat" data-dismiss="modal">' + lang('Close') + '</button>');
        }
    });
    return false;  // Stop to avoid POST
}

// Node interfaces
function printFormNodeInterfaces(values) {
    var disabled = values['node_status'] == 2 ? ' disabled="disabled" ' : "";
    $.when(getLabLinks()).done(function (links) {
        var html = '<form id="form-node-connect" class="form-horizontal">';
        html += '<input name="node_id" value="' + values['node_id'] + '" type="hidden"/>';
        if (values['sort'] == 'iol') {
            // IOL nodes need to reorder interfaces
            // i = x/y with x = i % 16 and y = (i - x) / 16
            var iol_interfc = {};
            $.each(values['ethernet'], function (interfc_id, interfc) {
                var x = interfc_id % 16;
                var y = (interfc_id - x) / 16;
                iol_interfc[4 * x + y] = '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + lang('Disconnected') + '</option>';
                $.each(links['ethernet'], function (link_id, link) {
                    var link_selected = (interfc['network_id'] == link_id) ? 'selected ' : '';
                    iol_interfc[4 * x + y] += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                });
                iol_interfc[4 * x + y] += '</select></div></div>';
            });
            $.each(iol_interfc, function (key, value) {
                html += value;
            });
        } else {
            $.each(values['ethernet'], function (interfc_id, interfc) {
                html += '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + lang('Disconnected') + '</option>';
                $.each(links['ethernet'], function (link_id, link) {
                    var link_selected = (interfc['network_id'] == link_id) ? 'selected ' : '';
                    html += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                });
                html += '</select></div></div>';
            });
        }
        if (values['sort'] == 'iol') {
            // IOL nodes need to reorder interfaces
            // i = x/y with x = i % 16 and y = (i - x) / 16
            var iol_interfc = {};
            $.each(values['serial'], function (interfc_id, interfc) {
                var x = interfc_id % 16;
                var y = (interfc_id - x) / 16;
                iol_interfc[4 * x + y] = '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + lang('Disconnected') + '</option>';
                $.each(links['serial'], function (node_id, serial_link) {
                    if (values['node_id'] != node_id) {
                        $.each(serial_link, function (link_id, link) {
                            var link_selected = (interfc['remote_id'] + ':' + interfc['remote_if'] == node_id + ':' + link_id) ? 'selected ' : '';
                            iol_interfc[4 * x + y] += '<option ' + link_selected + 'value="' + node_id + ':' + link_id + '">' + link + '</option>';
                        });
                    }
                });
                iol_interfc[4 * x + y] += '</select></div></div>';
            });
            $.each(iol_interfc, function (key, value) {
                html += value;
            });
        } else {
            $.each(values['serial'], function (interfc_id, interfc) {
                html += '<div class="form-group"><label class="col-md-3 control-label">' + interfc['name'] + '</label><div class="col-md-5"><select ' + disabled + ' class="selectpicker form-control" name="interfc[' + interfc_id + ']" data-live-search="true" data-style="selectpicker-button"><option value="">' + lang('Disconnected') + '</option>';
                $.each(links['serial'], function (node_id, serial_link) {
                    if (values['node_id'] != node_id) {
                        $.each(serial_link, function (link_id, link) {
                            var link_selected = '';
                            html += '<option ' + link_selected + 'value="' + link_id + '">' + link + '</option>';
                        });
                    }
                });
                html += '</select></div></div>';
            });
        }

        html += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button ' + disabled + ' type="submit" class="btn btn-success">' + lang("Save") + '</button> <button type="button" class="btn" data-dismiss="modal">' + lang('Cancel') + '</button></div></div></form>';

        addModal(values['node_name'] + ': ' + MESSAGES[116], html, '', 'second-win');
        $('.selectpicker').selectpicker();
    }).fail(function (message) {
        // Cannot get data
        addModalError(message);
    });
}

// Display picture in form
function printPictureInForm(id) {
    var picture_id = id;
    var picture_url = `/api/labs/session/picturedata?id=${picture_id}`;

    //$.when(getPicturesMapped(picture_id)).done(function (picture) {
    $.when(getPictures(picture_id)).done(function (picture) {
        // var picture_map = picture['map'];
        // picture_map = picture_map.replace(/href='telnet:..{{IP}}:{{NODE([0-9]+)}}/g, function (a, b, c, d, e) {
        //     var nodehref = ''
        //     if ($("#node" + b).length > 0) nodehref = $("#node" + b).find('a')[0].href
        //     return "href='" + nodehref

        // });
        // Read privileges and set specific actions/elements
        var sizeClass = FOLLOW_WRAPPER_IMG_STATE == 'resized' ? 'picture-img-autosozed' : ''
        //var sizeClass = ""
        var body = '<div id="lab_picture">' +
            '<img class="' + sizeClass + '" usemap="#picture_map" ' +
            'src="' + picture_url + '" ' +
            'alt="' + picture['name'] + '" ' +
            'title="' + picture['name'] + '" ' +
            '/>' +
            '</div>';

        var footer = '';

        printNodesMap({ name: picture['name'], body: body, footer: footer }, function () {
            setTimeout(function () {
                $('map').imageMapResize();
            }, 500);
        });
        window.lab_picture = jsPlumb.getInstance()
        lab_picture.setContainer($('#lab_picture'))
        $('#picslider').slider("value", 100)
    }).fail(function (message) {
        addModalError(message);
    });
}

// Display picture form
function displayPictureForm(picture_id) {
    var deferred = $.Deferred();
    var form = '';
    var lab_file = LAB;
    if (picture_id == null) {
        // Adding a new picture
        var title = 'Add new picture';
        var action = 'picture-add';
        var button = 'Add';
        // Header
        form += '<form id="form-' + action + '" class="form-horizontal form-picture">';
        // Name
        form += '<div class="form-group"><label class="col-md-3 control-label">' + lang('Name') + '</label><div class="col-md-5"><input type="text" class="form-control-static" name="picture[name]" value=""/></div></div>';
        // File (add only)
        form += '<div class="form-group"><label class="col-md-3 control-label">' + lang('Picture') + '</label><div class="col-md-5"><input type="file" name="picture[file]" value=""/></div></div>';
        // Footer
        form += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + button + '</button><button type="button" class="btn" data-dismiss="modal">Cancel</button></div></div></form>';
        // Add the form to the HTML page
        // $('#form_frame').html(form);

        addModal("Add picture", form, '<div></div>');

        // Show the form
        // $('#modal-' + action).modal('show');
        $('.selectpicker').selectpicker();
        validateLabPicture();
        deferred.resolve();
    } else {
        // Can be lab_edit or lab_open

        $.when(getPicture(lab_file, picture_id)).done(function (picture) {
            if (picture != null) {
                var imgUrl = "/api/labs/session/picturedata?id=" + picture_id;
                if ($(location).attr('pathname') == '/lab_edit.php') {
                    var title = 'Edit picture';
                    var action = 'picture_edit';
                    var button = 'Save';

                    picture_name = picture['name'];
                    if (typeof picture['map'] != 'undefined') {
                        picture_map = picture['map'];
                    } else {
                        picture_map = '';
                    }
                    // Header
                    form += '<div class="modal fade" id="modal-' + action + '" tabindex="-1" role="dialog"><div class="modal-dialog" style="width: 100%;"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body"><form id="form-' + action + '" class="form-horizontal form-picture">';
                    // Name
                    form += '<div class="form-group"><label class="col-md-3 control-label">Name</label><div class="col-md-5"><input type="text" class="form-control" name="picture[name]" value="' + picture_name + '"/></div></div>';
                    // Picure
                    form += '<img id="lab_picture" src="' + imgUrl + '">'
                    // MAP
                    form += '<div class="form-group"><label class="col-md-3 control-label">Map</label><div class="col-md-5"><textarea type="textarea" name="picture[map]">' + picture_map + '</textarea></div></div>';
                    // Footer
                    form += '<input type="hidden" name="picture[id]" value="' + picture_id + '"/>';
                    form += '<div class="form-group"><div class="col-md-5 col-md-offset-3"><button type="submit" class="btn btn-success">' + button + '</button> <button type="button" class="btn" data-dismiss="modal">Cancel</button></div></div></form></div></div></div></div>';
                    // Add the form to the HTML page
                    $('#form_frame').html(form);

                    // Show the form
                    $('#modal-' + action).modal('show');
                    $('.selectpicker').selectpicker();
                    validateLabPicture();
                    deferred.resolve();
                } else {
                    var action = 'picture_open';
                    var title = picture['name'];
                    if (typeof picture['map'] != 'undefined') {
                        picture_map = picture['map'];
                    } else {
                        picture_map = '';
                    }
                    // Header
                    form += '<div class="modal fade" id="modal-' + action + '" tabindex="-1" role="dialog"><div class="modal-dialog" style="width: 100%;"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">' + title + '</h4></div><div class="modal-body">';
                    // Picure
                    form += '<img id="lab_picture" src="' + imgUrl + '" usemap="#picture_map">';
                    // Map
                    form += '<map name="picture_map">' + translateMap(picture_map) + '</map>';
                    // Footer
                    form += '</div></div></div></div>';
                    // Add the form to the HTML page
                    $('#form_frame').html(form);

                    // Show the form
                    $('#modal-' + action).modal('show');
                    deferred.resolve();
                }
            } else {
                // Cannot get picture
                raiseMessage('DANGER', 'Cannot get picture (picture_id = ' + picture_id + ').');
                deferred.reject();
            }
        });
    }

    return deferred.promise();
}

// Add a new picture
function printFormPicture(action, values) {
    var map = (values['map'] != null) ? values['map'] : ''
        , custommap = map.replace(/.*NODE.*/g, '').replace(/^\s*[\r\n]/gm, '').replace(/\n*$/, '\n')
        , name = (values['name'] != null) ? values['name'] : ''
        , width = (values['width'] != null) ? values['width'] : ''
        , height = (values['height'] != null) ? values['height'] : ''
        , title = (action == 'add') ? MESSAGES[135] : MESSAGES[137]
        , html = '';

    map = map.match(/.*NODE.*/g)
    if (map != '' && map != null) map = map.join().replace(/>,</g, '>\n<').replace(/\n*$/, '\n');

    $("#lab_picture").empty()
    $.when(getPictures(values['id'])).done(function (picture) {
        var picture_map = values['map'];
        picture_map = picture_map.replace(/{{IP}}/g, location.hostname);
        var nodes = window.nodes;
            if (action == 'add') {
                html += '<form id="form-picture-' + action + '" class="form-horizontal form-lab-' + action + '">' +
                    '<div class="form-group">' +
                    '<label class="col-md-3 control-label">' + lang('Name') + '</label>' +
                    '<div class="col-md-5">' +
                    '<input class="form-control" autofocus name="picture[name]" value="' + name + '" type="text"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="col-md-3 control-label">' + MESSAGES[137] + '</label>' +
                    '<div class="col-md-5">' +
                    '<textarea class="form-control" name="picture[map]">' + map + '</textarea></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="col-md-5 col-md-offset-3">' +
                    '<button type="submit" class="btn btn-success">' + lang("Save") + '</button>' +
                    '<button type="button" class="btn" data-dismiss="modal">' + lang('Cancel') + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</form>';
            } else {
                //var sizeClass = FOLLOW_WRAPPER_IMG_STATE == 'resized' ? 'picture-img-autosozed' : ''
                var sizeClass = 'resized'
                html += '<form id="form-picture-' + action + '" class="form-horizontal form-lab-' + action + '" data-path=' + values['id'] + '>' +
                    '<div class="follower-wrapper">' +
                    '<img class="' + sizeClass + '" src="/api/labs/session/picturedata?id=' + values['id'] + '" alt="' + values['name'] + '" width-val="' + values['width'] + '" height-val="' + values['height'] + '"/>' +
                    '<div id="follower">' +
                    '<map name="picture_map">' + picture_map + '</map>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="col-md-3 control-label">' + lang('Name') + '</label>' +
                    '<div class="col-md-5">' +
                    '<input class="form-control" autofocus name="picture[name]" value="' + name + '" type="text"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="col-md-3 control-label">' + lang("Nodes") + '</label>' +
                    '<div class="col-md-5">' +
                    '<select class="form-control" id="map_nodeid">';
                $.each(nodes, function (key, value) {
                    html += '<option value="' + key + '">' + value.name + ', NODE ' + key + '</option>';
                });
                html += '<option value="CUSTOM"> CUSTOM , NODE outside lab</option>';
                html += '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label class="col-md-3 control-label">' + lang('Image MAP') + '</label>' +
                    '<div class="col-md-5">' +
                    '<textarea class="form-control map hidden" name="picture[map]">' + map + '</textarea>' +
                    '<textarea class="form-control custommap" name="picture[custommap]">' + custommap + '</textarea>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="col-md-5 col-md-offset-3">' +
                    '<button type="submit" class="btn btn-success">' + lang("Save") + '</button>' +
                    '<button type="button" class="btn" data-dismiss="modal">' + lang('Cancel') + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</form>';

            }
            console.log('DEBUG: popping up the picture form.');
            addModalWide(title, html, '', 'second-win modal-ultra-wide');
            var htmlsvg = "";
            $.each($('area'), function (key, area) {
                //alert ( area.coords )
                var cX = area.coords.split(",")[0] - 30
                var cY = area.coords.split(",")[1] - 30
                //alert(cX + " " + cY )
                htmlsvg = '<div class="map_mark" id="' + area.coords + '" style="position:absolute;top:' + cY + 'px;left:' + cX + 'px;width:60px;height:60px;"><svg width="60" height="60"><g><ellipse cx="30" cy="30" rx="28" ry="28" stroke="#000000" stroke-width="2" fill="#ffffff"></ellipse><text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" stroke="#000000" stroke-width="0px" dy=".2em" font-size="12" >' + area.href.replace(/.*{{NODE/g, "NODE ").replace(/}}/g, "").replace(/.*:.*/, "CUSTOM") + '</text></g></svg></div>'
                $(".follower-wrapper").append(htmlsvg)
            });

            validateLabInfo();
    });
}


function updateFreeSelect(e, ui) {
    if ($('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting').length > 0) {
        $('#lab-viewport').addClass('freeSelectMode')
    }
    window.freeSelectedNodes = []
    if (LOCK == 0) {
        $.when(lab_topology.setDraggable($('.node_frame, .network_frame, .customShape'), false)).done(function () {
            $.when(lab_topology.clearDragSelection()).done(function () {
                lab_topology.setDraggable($('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting'), true)
                lab_topology.addToDragSelection($('.node_frame.ui-selected, node_frame.ui-selecting, .network_frame.ui-selected,.network_ui-selecting, .customShape.ui-selected, .customShape.ui-selecting'))
            });

        });
    } else {
        $('.customShape.ui-selected, .customShape.ui-selecting').removeClass('ui-selecting').removeClass('ui-selected')
    }
    $('.free-selected').removeClass('free-selected')
    $('.node_frame.ui-selected, node_frame.ui-selecting').addClass('free-selected')
    $('.node_frame.ui-selected, .node_frame.ui-selecting').each(function () {
        window.freeSelectedNodes.push({ name: $(this).data("name"), path: $(this).data("path"), type: 'node' });

    });
}




//=================

// Display lab status
function printLabStatus() {

    // console.log('DEBUG: updating node status');
    $.when(getNodesStatus(null)).done(function (nodes) {
        $.each(nodes, function (node_id, node_status) {
            if(isset(App.topology.nodes[node_id])){
                var nodeComp = App.topology.nodes[node_id].get('component', false);
                if(nodeComp){
                    if(nodeComp.attr('data-status') == 5) return;
                    nodeComp.attr('data-status', node_status);
                    if (window.nodes && window.nodes[node_id]) window.nodes[node_id]['status'] = node_status;
                }
            }
        });
    }).fail(function (message) {
        error_handle(message)
    });
}


function createNodeListRow(struct, node) {
    var defer = $.Deferred();
    var userRight = "readonly";
    var disabledAttr = 'disabled="true"';
    if (LOCK == 0) {
        userRight = "";
        disabledAttr = ""
    }
    $.when(getTemplates(node['template'], false)).done(function (template) {
        
        var template = template['options'];
        var cells = [`<td style="text-align:center"><b>${node['id']}</b></td>`];

        cells = cells.concat(struct.map(function(colid){
            
            if(!isset(node[colid])) return `<td></td>`;

            if(colid == 'port'){
                return `<td><input onblur="updateNodePort('${node['id']}', event.target.value)" style="width:100%; min-width:60px" class="input ${userRight}" data-path="${colid}" value="${node[colid]}" type="number" ${disabledAttr}/></td>`
            }

            if(!isset(template[colid])) return `<td><input style="width:100%; min-width:50px" class="input" disabled value=""></input></td>`;

            if(colid == 'icon'){
                return `<td><div class="input box_flex button box_line" style="line-height:14px" onclick="selectImage(function(value){
                        updateNodeData('${node['id']}', {${colid}:value})
                        $('#tablenode_icon_img${node['id']}').attr('src', '/images/icons/' + value)
                        $('#tablenode_icon_name${node['id']}').text(value)
                    })" data-size="5" data-style="selectpicker-button">
                    <img id="tablenode_icon_img${node['id']}" src='/images/icons/${node[colid]}' height=12 width=12 style="margin-right:20px"/><span id="tablenode_icon_name${node['id']}">${node[colid]}</span>
                    <input type="text" style="display:none" value="${node[colid]}"/>
                </div></td>`
            }

            if(colid == 'left' || colid == 'top'){
                return `<td><input onblur="updateNodeData('${node['id']}', {${colid}: event.target.value})" style="width:100%; min-width:50px" class="input" value="${node[colid]}" type='number' ${disabledAttr}></input></td>`;
            }
            
            
            if(template[colid]['type'] == 'checkbox') return `<td><input onblur="updateNodeData('${node['id']}', {${colid}: event.target.value})" style="width:100%; min-width:30px" class="input ${userRight}" data-path="${colid}" value="${node[colid]}" type="checkbox" ${disabledAttr} ${((node[colid] == 1) ? 'checked' : '')}/></td>`
            if(template[colid]['type'] == 'list'){
                var html_data = `<td><select onchange="updateNodeData('${node['id']}', {${colid}: event.target.value})" style="width:100%; min-width:100px" class="input ${userRight}" data-path="${colid}" ${disabledAttr}>`
                var options_arr = template[colid]['options'] ? template[colid]['options'] : {};
                for(let key in options_arr){
                    html_data += `<option ${node[colid] == options_arr[key] ? 'selected' : ''} value="${key}" ${colid=='icon' && `data-content="<div class='box_flex'><img src='/images/icons/${key}'></img>&nbsp;${options_arr[key]}</div>"`}>
                        ${options_arr[key]}
                    </option>`
                }
                html_data += `</select></td>`;
                return html_data;
            }
            if(template[colid]['type'] == '') template[colid]['type'] = 'text' 
            return `<td><input onblur="updateNodeData('${node['id']}', {${colid}: event.target.value})" style="width:100%; min-width:50px" class="input ${userRight}" data-path="${colid}" value="${node[colid]}" type="${template[colid]['type']}" ${disabledAttr}/></td>`
        }))

        cells.push(`<td>
        <div class="action-controls">
            <a class="action-nodestart" data-path="${node['id']}" href="javascript:void(0)" title="${lang('Start')}"><i class="glyphicon glyphicon-play"></i></a>
            <a class="action-nodestop" data-path="${node['id']}" href="javascript:void(0)" title="${lang('Stop')}"><i class="glyphicon glyphicon-stop"></i></a>
            <a class="action-nodewipe" data-path="${node['id']}" href="javascript:void(0)" title="${lang('Wipe')}"><i class="glyphicon glyphicon-erase"></i></a>
            ${(LOCK == 0) 
            && `<a class="action-nodeexport" data-path="${node['id']}" href="javascript:void(0)" title="${lang('Export CFG')}"><i class="glyphicon glyphicon-save"></i></a>
            <a class="action-nodedelete" data-path="${node['id']}" href="javascript:void(0)" title="${lang('Delete')}"><i class="glyphicon glyphicon-trash"></i></a>
            </div>
        </td>`}`)
        defer.resolve(`<tr>${cells.join('')}</tr>`);
    }).fail(function (message1, message2) {
        if (message1 != null) {
            addModalError(message1);
        } else {
            addModalError(message2)
        }
        defer.resolve('');
    });

    return defer;
}

// Display all nodes in a table
function printListNodes(nodes) {
    $('#context-menu').remove();
    App.loading(true);
    var struct = [
        'name',
        'port',
        'image',
        'icon',
        'delay',
        'left',
        'top',
        'size',
        'console',
        'ethernet',
        'serial',
        'nvram',
        'ram',
        'config',
        'idlepc',
        'cpu',
        'cpulimit',
    ]

    console.log('DEBUG: printing node list');
    
    var html_rows = [];
    var promises = [];

    var composePromise = function (key, value) {
        var defer = $.Deferred();
        $.when(createNodeListRow(struct, value)).done(function (data) {
            html_rows.push({id: key, tr: data});
            defer.resolve();
        });
        return defer;
    };

    $.each(nodes, function (key, value) {
        promises.push(composePromise(key, value));
    })

    $.when.apply($, promises).done(function () {

        var html_data = html_rows.sort(function (a, b) {
            return (Number(a.id) < Number(b.id)) ? -1 : 1;
        })

        var body = `<div class="table-responsive">
                <form id="form-node-edit-table" >
                    <table class="configured-nodes table">
                        <thead>
                            <tr>
                                <th>${lang('ID')}</th>
                                ${struct.map(function(colid){
                                    return `<th>${lang(colid)}</th>`
                                }).join('')}
                                <th>${lang('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${html_data.map(function(item){return item.tr}).join('')}
                        </tbody>
                    </table>
                </form>
                </div>
                `;

        addModalWide(lang('List of Nodes'), body, '');
        $('.selectpicker').selectpicker();
        App.loading(false);
    })
}

// Print lab open page
function printPageLabOpen(lab) {

    var gim = localStorage.getItem('left_menu_gim');
    if(gim == 1) $('body').addClass('fixed');

    var html = `
                <div id="lab-sidebar">
                    <div id="lab-sizebar-button"><i class="fa fa-chevron-right"></i></div>
                    <div id="lab-sidebar-menu">
                        <ul></ul>
                        <div style="padding:0px 7px"><hr/></div>
                        <div id="lab_members"></div>
                        <br/>
                        <div style="padding-left:11px">
                            <a class="action-logout" href="javascript:void(0)"><i class="glyphicon glyphicon-log-out" style="margin-right:7px"></i><span class="lab-sidebar-title">${lang('Logout')}</span></a>
                        </div>
                    </div>
                    <div class="logo_img">
                        <img src='/store/public/assets/auth/img/logo.png' style="max-width:90%"></img>
                    </div>

                    <i id="gim" class="button fa fa-thumb-tack" onClick="gimMenu()"></i>
                    
                </div>



                <div id="lab-viewport">

                
                </div>

                <div>
                    <div id="alert_container" style="display:none" >
                        <b>
                            <i class="fa fa-bell-o"></i> ${lang("Notifications")}&nbsp;
                            <i id="alert_container_close" class="pull-right fa fa-times" style="color: red; cursor:pointer; padding:2px"></i>
                        </b>
                        <div class="inner" style="overflow:auto; max-height:400px"></div>
                    </div>
                    <div id="notification_container"></div> 
                </div>
                
                `;

    $('#body').html(html);

    $('#lab-sidebar ul').append('<li class="action-labobjectadd-li"><a class="action-labobjectadd" href="javascript:void(0)" title="' + lang('Add an object') + '"><i class="glyphicon glyphicon-plus"></i><span class="lab-sidebar-title">' + lang('Add an object') + '</span></a></li>');
    $('#lab-sidebar ul').append('<li><a class="action-moreactions" href="javascript:void(0)" title="' + lang('Setup Nodes') + '"><i class="fa fa-cogs"></i><span class="lab-sidebar-title">' + lang('Setup Nodes') + '</span></a></li>');
    $('#lab-sidebar ul').append('<li><a class="action-configsget"  href="javascript:void(0)" title="' + lang('Startup Configs') + '"><i class="fa fa-list-alt"></i><span class="lab-sidebar-title">' + lang('Startup Configs') + '</span></a></li>');
    // $('#lab-sidebar ul').append('<li><a class="action-configobjects" href="javascript:void(0)" title="' + lang('Config Objects') + '"><i class="fa fa-cubes"></i><span class="lab-sidebar-title">' + lang('Config Objects') + '</span></a></li>');
    $('#lab-sidebar ul').append('<li class="action-picturesget-li"><a class="action-picturesget" href="javascript:void(0)" title="' + lang('Pictures') + '"><i class="glyphicon glyphicon-picture"></i><span class="lab-sidebar-title">' + lang('Pictures') + '</span></a></li>');
    $('#lab-sidebar ul').append('<li><a class="action-labtopologyrefresh" href="javascript:void(0)"><i class="glyphicon glyphicon-refresh"></i><span class="lab-sidebar-title">' + lang("Refresh topology") + '</span></a></li>');
    $('#lab-sidebar ul').append('<li id="action_lock_lab"></li>');
    $('#lab-sidebar ul').append('<div id="action-labclose"><li><a class="action-labclose" href="javascript:void(0)"><i class="glyphicon glyphicon-off"></i><span class="lab-sidebar-title">' + lang("Close Lab") + '</span></a></li></div>');
    $('#lab-sidebar ul').append('<div id="action-labdestroy"><li><a class="action-labdestroy" href="javascript:void(0)"><i class="fa fa-chain-broken"></i><span class="lab-sidebar-title">' + lang('Destroy Lab') + '</span></a></li></div>');
    $('#lab-sidebar ul').append('<div style="padding:0px 7px"><hr/></div>');
    $('#lab-sidebar ul').append('<li><a class="action-systemstatus" href="javascript:void(0)" title="' + lang("System Status") + '"><i class="fa fa-bar-chart-o"></i><span class="lab-sidebar-title">' + lang("System Status") + '</span></a></li>');
    $('#lab-sidebar ul').append('<li><a class="action-editbackground" href="javascript:void(0)" title="' + lang("Background") + '"><i class="fa fa-map-o"></i><span class="lab-sidebar-title">' + lang("Background") + '</span></a></li>');
    $('#lab-sidebar ul').append('<li><a class="lab_workbook" href="javascript:void(0)" title="' + lang("Workbook") + '"><i class="fa fa-book"></i><span class="lab-sidebar-title">' + lang("Workbook") + '</span></a></li>');
    $('#lab-sidebar ul').append('<li id="action_change_console"></li>');

    $('#body').append('<script src="/store/public/react/js/lab.js" type="text/javascript"></script>');

}


function gimMenu(){
    var gim = localStorage.getItem('left_menu_gim');
    if(gim == 0 || gim == null){
        localStorage.setItem('left_menu_gim', 1);
        $('body').addClass('fixed');
    }else{
        localStorage.setItem('left_menu_gim', 0);
        $('body').removeClass('fixed');
    }
}


/*******************************************************************************
 * Custom Shape Functions
 * *****************************************************************************/
// Get All Text Objects
function getTextObjects() {
    var deferred = $.Deferred();
    var url = '/api/labs/session/textobjects';
    var type = 'GET';
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got shape(s) from lab.');
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

// Get Text Object By Id
function getTextObject(id) {
    var deferred = $.Deferred();
    var url = '/api/labs/session/textobjects';
    var type = 'GET';
    var data = id != null ? { id: id } : {};
    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: got shape ' + id + 'from lab');

                try {
                    if (data['data'].data.indexOf('div') != -1) {
                        // nothing to do ?
                    } else {
                        data['data'].data = new TextDecoderLite('utf-8').decode(toByteArray(data['data'].data));
                        data['data'].data = output_secure(data['data'].data);
                    }
                }
                catch (e) {
                    console.warn("Compatibility issue", e);
                }

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

// Create New Text Object
function createTextObject(newData) {
    var deferred = $.Deferred()
        , url = '/api/labs/session/textobjects/add'
        , type = 'POST';

    if (newData.data) {
        newData.data = fromByteArray(new TextEncoderLite('utf-8').encode(encodeURIComponent(newData.data)));
    }

    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        data: newData,
        dataType: 'json',
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: create shape ' + 'for lab.');
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                deferred.resolve(data['result']);
            } else {
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });

    return deferred.promise();
}

// Update Text Object
function editTextObject(id, newData) {
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/labs/session/textobjects/edit';

    if (newData.data) {
        newData.data = fromByteArray(new TextEncoderLite('utf-8').encode(encodeURIComponent(newData.data)));
    }

    newData.id = id;

    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: newData, // newData is object with differences between old and new data
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: custom shape text object updated.');
                App.topology.updateData(data['update'])
                deferred.resolve(data['message']);
            } else {
                
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {

            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Update Multiple Text Object
function editTextObjects(newData) {
    var deferred = $.Deferred();
    if (newData.length == 0) { deferred.resolve(); return deferred.promise(); }
    var type = 'POST';
    var url = '/api/labs/session/textobjects/edit';
    var data = { data: newData };

    $.ajax({
        cache: false,

        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data, // newData is object with differences between old and new data
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: custom shape text object updated.');
                App.topology.updateData(data['update'])
                deferred.resolve(data['message']);
            } else {
                App.topology.printTopology();
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
// Delete Text Object By Id
function deleteTextObject(id) {
    var deferred = $.Deferred();
    var type = 'post';
    var data = id != null ? { id } : {};
    var url = '/api/labs/session/textobjects/delete';
    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data['status'] == 'success') {
                console.log('DEBUG: shape/text deleted.');
                App.topology.updateData(data['update'])
                deferred.resolve();
            } else {
                // Application error
                App.topology.printTopology();
                console.log('DEBUG: application error (' + data['status'] + ') on ' + type + ' ' + url + ' (' + data['message'] + ').');
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            // Server error
            App.topology.printTopology();
            var message = getJsonMessage(data['responseText']);
            console.log('DEBUG: server error (' + data['status'] + ') on ' + type + ' ' + url + '.');
            console.log('DEBUG: ' + message);
            deferred.reject(message);
        }
    });
    return deferred.promise();
}

// Text Object Drag Stop / Resize Stop
function textObjectDragStop(event, ui) {
    var id
        , objectData
        , shape_border_width
        ;
    if (event.target.id.indexOf("customShape") != -1) {
        id = event.target.id.slice("customShape".length);
        shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    }
    else if (event.target.id.indexOf("customText") != -1) {
        id = event.target.id.slice("customText".length);
        shape_border_width = 5;
    }

    objectData = event.target.outerHTML;


    editTextObject(id, {
        data: objectData
    });
}

function setShapePosition(shape) {
    var id
        , objectData
        , shape_border_width
        ;
    if (shape.id.indexOf("customShape") != -1) {
        id = shape.id.slice("customShape".length);
        shape_border_width = $("#customShape" + id + " svg").children().attr('stroke-width');
    }
    else if (shape.id.indexOf("customText") != -1) {
        id = shape.id.slice("customText".length);
        shape_border_width = 5;
    }

    //objectData = shape.outerHTML;
    objectData = shape.outerHTML;
    editTextObject(id, {
        data: objectData
    });
}

// Text Object Resize Event
function textObjectResize(event, ui, shape_options) {
    var newWidth = ui.size.width
        , newHeight = ui.size.height
        ;

    $("svg", ui.element).attr({
        width: newWidth,
        height: newHeight
    });
    $("svg > rect", ui.element).attr({
        width: newWidth,
        height: newHeight
    });
    $("svg > ellipse", ui.element).attr({
        rx: newWidth / 2 - shape_options['shape_border_width'] / 2,
        ry: newHeight / 2 - shape_options['shape_border_width'] / 2,
        cx: newWidth / 2,
        cy: newHeight / 2
    });
    var n = $("br", ui.element).length;
    if (n) {
        $("p", ui.element).css({
            "font-size": newHeight / (n * 1.5 + 1)
        });
    } else {
        $("p", ui.element).css({
            "font-size": newHeight / 2
        });
    }
    if ($("p", ui.element).length && $(ui.element).width() > newWidth) {
        ui.size.width = $(ui.element).width();
    }
}

// Edit Form: Custom Shape
function printFormEditCustomShape(id) {
    $('.edit-custom-shape-form').remove();
    $('.edit-custom-text-form').remove();
    $('.customShape').each(function (index) {
        $(this).removeClass('in-editing');
    });
    getTextObject(id).done(function (res) {
        var borderTypes = ['solid', 'dashed']
            , firstShapeValues = {}
            , shape
            , transparent = false
            , colorDigits
            , bgColor
            , html = new EJS({
                url: '/themes/default/ejs/form_edit_custom_shape.ejs'
            }).render({
                MESSAGES: MESSAGES,
                id: id
            })

        $('#body').append(html);

        if (isIE) {
            $('input[type="color"]').hide()
            $('input.shape_border_color').colorpicker({
                color: "#000000",
                defaultPalette: 'web'
            })
            $('input.shape_background_color').colorpicker({
                color: "#ffffff",
                defaultPalette: 'web'
            })
        }
        for (var i = 0; i < borderTypes.length; i++) {
            $('.edit-custom-shape-form .border-type-select').append($('<option></option>').val(borderTypes[i]).html(borderTypes[i]));
        }

        if ($("#customShape" + id + " svg").children().attr('stroke-dasharray')) {
            $('.edit-custom-shape-form .border-type-select').val(borderTypes[1]);
            firstShapeValues['border-types'] = borderTypes[1];
        } else {
            $('.edit-custom-shape-form .border-type-select').val(borderTypes[0]);
            firstShapeValues['border-types'] = borderTypes[0];
        }

        bgColor = $("#customShape" + id + " svg").children().attr('fill');
        colorDigits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(bgColor);
        if (colorDigits === null) {
            var ifHex = bgColor.indexOf('#');
            if (ifHex < 0) {
                transparent = true;
            }
        }

        if (transparent) {
            $('.edit-custom-shape-form .shape_background_transparent').addClass('active  btn-success').text('On');
        } else {
            $('.edit-custom-shape-form .shape_background_transparent').removeClass('active  btn-success').text('Off');
        }

        firstShapeValues['shape-name'] = res.name;
        firstShapeValues['shape-z-index'] = $('#customShape' + id).css('z-index');
        firstShapeValues['shape-background-color'] = rgb2hex($("#customShape" + id + " svg").children().attr('fill'));
        firstShapeValues['shape-border-color'] = rgb2hex($("#customShape" + id + " svg ").children().attr('stroke'));
        firstShapeValues['shape-border-width'] = $("#customShape" + id + " svg").children().attr('stroke-width');
        firstShapeValues['shape-rotation'] = getElementsAngle("#customShape" + id);
        // $("#customShape" + id ).attr('name');

        // fill inputs
        $('.edit-custom-shape-form .shape-z_index-input').val(firstShapeValues['shape-z-index'] - 1000);
        $('.edit-custom-shape-form .shape_background_color').val(firstShapeValues['shape-background-color']);
        $('.edit-custom-shape-form .shape_border_color').val(firstShapeValues['shape-border-color']);
        $('.edit-custom-shape-form .shape_border_width').val(firstShapeValues['shape-border-width']);
        $('.edit-custom-shape-form .shape-rotation-input').val(firstShapeValues['shape-rotation']);
        $('.edit-custom-shape-form .shape-name-input').val(firstShapeValues['shape-name']);

        // fill backup
        $('.edit-custom-shape-form .firstShapeValues-z_index').val(firstShapeValues['shape-z-index']);
        $('.edit-custom-shape-form .firstShapeValues-border-color').val(firstShapeValues['shape-border-color']);
        $('.edit-custom-shape-form .firstShapeValues-background-color').val(firstShapeValues['shape-background-color']);
        $('.edit-custom-shape-form .firstShapeValues-border-type').val(firstShapeValues['border-types']);
        $('.edit-custom-shape-form .firstShapeValues-border-width').val(firstShapeValues['shape-border-width']);
        $('.edit-custom-shape-form .firstShapeValues-rotation').val(firstShapeValues['shape-rotation']);

        if ($("#customShape" + id + " svg").children().attr('cx')) {
            $('.edit-custom-shape-form .shape_border_width').val(firstShapeValues['shape-border-width'] * 2);
            $('.edit-custom-shape-form .firstShapeValues-border-width').val(firstShapeValues['shape-border-width'] * 2);
        }
        $("#customShape" + id).addClass('in-editing');
    });

}

// Edit Form: Text
function printFormEditText(id) {
    $('.edit-custom-shape-form').remove();
    $('.edit-custom-text-form').remove();
    $('.customShape').each(function (index) {
        $(this).removeClass('in-editing');
    });

    var firstTextValues = {}
        , transparent = false
        , colorDigits
        , bgColor
        , html = new EJS({
            url: '/themes/default/ejs/form_edit_text.ejs'
        }).render({
            id: id,
            MESSAGES: MESSAGES
        })

    $('#body').append(html);

    if (isIE) {
        $('input[type="color"]').hide()
        $('input.shape_border_color').colorpicker({
            color: "#000000",
            defaultPalette: 'web'
        })
        $('input.shape_background_color').colorpicker({
            color: "#ffffff",
            defaultPalette: 'web'
        })
    }
    bgColor = $("#customText" + id + " p").css('background-color');
    colorDigits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(bgColor);
    if (colorDigits === null) {
        var ifHex = bgColor.indexOf('#');
        if (ifHex < 0) {
            transparent = true;
        }
    }

    if (transparent) {
        $('.edit-custom-text-form .text_background_transparent').addClass('active  btn-success').text('On');
    } else {
        $('.edit-custom-text-form .text_background_transparent').removeClass('active  btn-success').text('Off');
    }

    firstTextValues['text-z-index'] = parseInt($('#customText' + id).css('z-index'));
    firstTextValues['text-color'] = rgb2hex($("#customText" + id + " p").css('color'));
    firstTextValues['text-background-color'] = rgb2hex($("#customText" + id + " p").css('background-color'));
    firstTextValues['text-rotation'] = getElementsAngle("#customText" + id);


    $('.edit-custom-text-form .text-z_index-input').val(parseInt(firstTextValues['text-z-index']) - 1000);
    $('.edit-custom-text-form .text_color').val(firstTextValues['text-color']);
    $('.edit-custom-text-form .text_background_color').val(firstTextValues['text-background-color']);
    $('.edit-custom-text-form .text-rotation-input').val(firstTextValues['text-rotation']);

    if ($("#customText" + id + " p").css('font-style') == 'italic') {
        $('.edit-custom-text-form .btn-text-italic').addClass('active');
        firstTextValues['text-type-italic'] = 'italic'
    }
    if ($("#customText" + id + " p").css('font-weight') == 'bold') {
        $('.edit-custom-text-form .btn-text-bold').addClass('active');
        firstTextValues['text-type-bold'] = 'bold';
    }
    if ($("#customText" + id + " p").attr('align') == 'left') {
        $('.edit-custom-text-form .btn-align-left').addClass('active');
        firstTextValues['text-align'] = 'left';
    } else if ($("#customText" + id + " p").attr('align') == 'center') {
        $('.edit-custom-text-form .btn-align-center').addClass('active');
        firstTextValues['text-align'] = 'center';
    } else if ($("#customText" + id + " p").attr('align') == 'right') {
        $('.edit-custom-text-form .btn-align-right').addClass('active');
        firstTextValues['text-align'] = 'right';
    }

    $('.edit-custom-text-form .firstTextValues-z_index').val(parseInt(firstTextValues['text-z-index']));
    $('.edit-custom-text-form .firstTextValues-color').val(firstTextValues['text-color']);
    $('.edit-custom-text-form .firstTextValues-background-color').val($("#customText" + id + " p").css('background-color'));
    $('.edit-custom-text-form .firstTextValues-italic').val(firstTextValues['text-type-italic']);
    $('.edit-custom-text-form .firstTextValues-bold').val(firstTextValues['text-type-bold']);
    $('.edit-custom-text-form .firstTextValues-align').val(firstTextValues['text-align']);
    $('.edit-custom-text-form .firstTextValues-rotation').val(firstTextValues['text-rotation']);

    $("#customText" + id).addClass('in-editing');
}

// Change from RGB to Hex color
function rgb2hex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgba{0,1}\((\d+), (\d+), (\d+)\)/.exec(color);

    if (digits == null) {
        digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
    }

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + ("000000" + rgb.toString(16)).slice(-6);
}

// Change from Hex to RGB color
function hex2rgb(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}

function getElementsAngle(selector) {
    var el = document.querySelector(selector)
        , st = window.getComputedStyle(el, null)
        , tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "FAIL";

    if (tr === "FAIL" || tr === "none") {
        return 0;
    }

    // With rotate(30deg)...
    // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

    var values = tr.split('(')[1].split(')')[0].split(',')
        , a = values[0]
        , b = values[1]
        , c = values[2]
        , d = values[3]
        , scale = Math.sqrt(a * a + b * b)
        // arc sin, convert from radians to degrees, round
        , sin = b / scale
        , angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
        ;

    return angle;
}


// Add class to body
function bodyAddClass(cl) {
    $('body').attr('class', cl);
}

function autoheight() {
    if ($('#main').height() < window.innerHeight - $('#main').offset().top) {
        $('#main').height(function (index, height) {
            return window.innerHeight - $(this).offset().top;
        });
    }
}

function toogleDruggable(topology, elem) {
    return topology.toggleDraggable(elem)
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function openNodeCons(url) {
    var nw = window.open(url);
    nw.blur();
    $(nw).ready(function () { nw.close(); });
}

function natSort(as, bs) {
    var a, b, a1, b1, i = 0, L, rx = /(\d+)|(\D+)/g, rd = /\d/;
    if (isFinite(as) && isFinite(bs)) return as - bs;
    a = String(as).toLowerCase();
    b = String(bs).toLowerCase();
    if (a === b) return 0;
    if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
    a = a.match(rx);
    b = b.match(rx);
    L = a.length > b.length ? b.length : a.length;
    while (i < L) {
        a1 = a[i];
        b1 = b[i++];
        if (a1 !== b1) {
            if (isFinite(a1) && isFinite(b1)) {
                if (a1.charAt(0) === "0") a1 = "." + a1;
                if (b1.charAt(0) === "0") b1 = "." + b1;
                return a1 - b1;
            }
            else return a1 > b1 ? 1 : -1;
        }
    }
    return a.length - b.length;
}

function newConnModal(info, oe) {

    var { networks, nodes } = window.topology;
    linksourcestyle = '';
    linktargetstyle = '';
    $('#' + info.source.id).addClass("startNode")
    if (info.source.id.search('node') != -1) {
        var node = nodes[info.source.id.replace('node', '')];
        var interfaces = {
            ethernet: typeof node['ethernets'] == 'object' ? node['ethernets'] : {},
            serial: typeof node['serials'] == 'object' ? node['serials'] : {},
        };
        linksourcedata = node;
        linksourcetype = 'node';
        linksourcedata['interfaces'] = interfaces;
        if (linksourcedata['status'] == 0) linksourcestyle = 'grayscale'
    } else {
        linksourcedata = networks[info.source.id.replace('network', '')];
        linksourcetype = 'net';
        linksourcedata['icon'] = (linksourcedata['type'] == "bridge") ? "lan.png" : "cloud.png"
    }
    if (info.target.id.search('node') != -1) {

        var node = nodes[info.target.id.replace('node', '')];
        var interfaces = {
            ethernet: typeof node['ethernets'] == 'object' ? node['ethernets'] : {},
            serial: typeof node['serials'] == 'object' ? node['serials'] : {},
        };

        linktargetdata = node;
        linktargettype = 'node';
        linktargetdata['interfaces'] = interfaces;
        if (linktargetdata['status'] == 0) linktargetstyle = 'grayscale'
    } else {
        linktargetdata = networks[info.target.id.replace('network', '')];
        linktargettype = 'net';
        linktargetdata['icon'] = (linktargetdata['type'] == "bridge") ? "lan.png" : "cloud.png"
    }

    title = lang('add_connection_title', { src: linksourcedata['name'], dest: linktargetdata['name'] })
    var sourceif = linksourcedata['interfaces'];
    var targetif = linktargetdata['interfaces'];

    console.log(linksourcedata);
    console.log(linktargetdata);
    /* choose first free interface */
    if (linksourcetype == 'node') {
        console.log('DEBUG: looking interfaces... ');
        linksourcedata['selectedif'] = '';
        var tmp_interfaces = {};
        for (var key in sourceif['ethernet']) {
            console.log('DEBUG: interface id ' + key + ' named ' + sourceif['ethernet'][key]['name'] + ' ' + sourceif['ethernet'][key]['network_id'])
            tmp_interfaces[key] = sourceif['ethernet'][key]
            tmp_interfaces[key]['type'] = 'ethernet'
            if ((sourceif['ethernet'][key]['network_id'] == 0) && (linksourcedata['selectedif'] == '')) {
                linksourcedata['selectedif'] = key;
            }
        }
        for (var key in sourceif['serial']) {
            console.log('DEBUG: interface id ' + key + ' named ' + sourceif['serial'][key]['name'] + ' ' + sourceif['serial'][key]['remote_id'])
            tmp_interfaces[key] = sourceif['serial'][key]
            tmp_interfaces[key]['type'] = 'serial'
            if ((sourceif['serial'][key]['remote_id'] == 0) && (linksourcedata['selectedif'] == '')) {
                linksourcedata['selectedif'] = key;
            }
        }
        linksourcedata['interfaces'] = tmp_interfaces
    }
    if (linksourcedata['selectedif'] == '') linksourcedata['selectedif'] = 0;
    if (linktargettype == 'node') {
        console.log('DEBUG: looking interfaces... ');
        linktargetdata['selectedif'] = '';
        var tmp_interfaces = []
        for (var key in targetif['ethernet']) {
            console.log('DEBUG: interface id ' + key + ' named ' + targetif['ethernet'][key]['name'] + ' ' + targetif['ethernet'][key]['network_id'])
            tmp_interfaces[key] = targetif['ethernet'][key];
            tmp_interfaces[key]['type'] = 'ethernet'
            if ((targetif['ethernet'][key]['network_id'] == 0) && (linktargetdata['selectedif'] == '')) {
                linktargetdata['selectedif'] = key;
            }
        }
        for (var key in targetif['serial']) {
            console.log('DEBUG: interface id ' + key + ' named ' + targetif['serial'][key]['name'] + ' ' + targetif['serial'][key]['remote_id'])
            tmp_interfaces[key] = targetif['serial'][key];
            tmp_interfaces[key]['type'] = 'serial';
            if ((targetif['serial'][key]['remote_id'] == 0) && (linktargetdata['selectedif'] == '')) {
                linktargetdata['selectedif'] = key;
            }
        }
        linktargetdata['interfaces'] = tmp_interfaces
    }
    if (linktargetdata['selectedif'] == '') linktargetdata['selectedif'] = 0;
    //if ( linksourcedata['status'] == 2 || linktargetdata['status'] == 2 ) { lab_topology.detach( info.connection ) ; return }
    window.tmpconn = info.connection
    html = '<form id="addConn" class="addConn-form">' +
        '<input type="hidden" name="addConn[srcNodeId]" value="' + linksourcedata['id'] + '">' +
        '<input type="hidden" name="addConn[dstNodeId]" value="' + linktargetdata['id'] + '">' +
        '<input type="hidden" name="addConn[srcNodeType]" value="' + linksourcetype + '">' +
        '<input type="hidden" name="addConn[dstNodeType]" value="' + linktargettype + '">' +
        '<div class="row">' +
        '<div class="col-md-4">' +
        '<div style="text-align:center;" >' + linksourcedata['name'] + '</div>' +
        '<img src="' + '/images/icons/' + linksourcedata['icon'] + '" class="' + linksourcestyle + ' img-responsive" style="margin:0 auto;">' +
        '<div style="width:3px;height: ' + ((linksourcetype == 'net') ? '0' : '10') + 'px; margin: 0 auto; background-color:#444"></div>' +
        '<div style="margin: 0 auto; width:50%; text-align:center;" class="' + ((linksourcetype == 'net') ? 'hidden' : '') + '">' +
        '<text class="aLabel addConnSrc text-center" >' + ((linksourcetype == 'node') ? linksourcedata['interfaces'][linksourcedata['selectedif']]['name'] : '') + '</text>' +
        '</div>' +
        '<div style="width:3px;height:160px; margin: 0 auto; background-color:#444"></div>' +
        '<div style="margin: 0 auto; width:50%; text-align:center;" class="' + ((linktargettype == 'net') ? 'hidden' : '') + '">' +
        '<text class="aLabel addConnDst text-center" >' + ((linktargettype == 'node') ? linktargetdata['interfaces'][linktargetdata['selectedif']]['name'] : '') + '</text>' +
        '</div>' +
        '<div style="width:3px;height: ' + ((linktargettype == 'net') ? '0' : '10') + 'px; margin: 0 auto; background-color:#444"></div>' +
        '<img src="/images/icons/' + linktargetdata['icon'] + '" class="' + linktargetstyle + ' img-responsive" style="margin:0 auto;">' +
        '<div style="text-align:center;" >' + linktargetdata['name'] + '</div>' +
        ((linksourcedata['status'] == 2 || linktargetdata['status'] == 2) ? '<div style="color:red"><strong>' + lang('Note') + ':</strong> ' + lang('serial_port_unsupport_hot_plug') + '</div>' : '') + //EVE_STORE hot link
        '</div>' +
        '<div class="col-md-8">' +
        '<div class="form-group">' +
        '<label>Source ID: ' + linksourcedata['id'] + '</label>' +
        '<p style="margin:0px;"></p>' +
        '<label>Source Name: ' + linksourcedata['name'] + '</label>' +
        '<p style="">type - ' + ((linksourcetype == 'net') ? 'Network' : 'Node') + '</p>' +
        '</div>' +
        '<div class="form-group">' +
        '<div class="form-group ' + ((linksourcetype == 'net') ? 'hidden' : '') + '">' +
        '<label>Choose Interface for ' + linksourcedata['name'] + '</label>' +
        '<select name="addConn[srcConn]" class="form-control srcConn">'
    if (linksourcetype == 'node') {
        // Eth first
        var tmp_name = [];
        var reversetab = [];
        for (key in linksourcedata['interfaces']) {
            tmp_name.push(linksourcedata['interfaces'][key]['name'])
            reversetab[linksourcedata['interfaces'][key]['name']] = key
        }
        var ordered_name = tmp_name.sort(natSort)
        for (key in ordered_name) {
            okey = reversetab[ordered_name[key]];
            if (linksourcedata['interfaces'][okey]['type'] == 'ethernet') {

                var disable = false;
                var optionsText = linksourcedata['interfaces'][okey]['name'];

                if (isset(linksourcedata['interfaces'][okey]['network_id']) && networks[linksourcedata['interfaces'][okey]['network_id']]) {
                    disable = true;
                    optionsText += ` ${lang('connected to')} `
                    var links = App.topology.links;
                    for (let tkey in links) {
                        var link = links[tkey];
                        if ((link.source.node.get('id') == linksourcedata['id']) && (link.source.interface.get('name') == linksourcedata['interfaces'][okey]['name'])) {
                            
                            optionsText += link.dest.node.get('name');
                            if(link.dest.interface) optionsText += ' ' + link.dest.interface.get('name');
                        }
                        if ((link.dest.node.get('id') == linksourcedata['id']) && (link.dest.interface.get('name') == linksourcedata['interfaces'][okey]['name'])) {
                            
                            optionsText += link.source.node.get('name');
                            if(link.dest.interface) optionsText += ' ' + link.source.interface.get('name');
                        }
                    }

                };
                if (linksourcedata['type'] == 'docker' && optionsText == 'eth0') {
                    disable = true;
                    optionsText = lang('port_for_management', { port: optionsText });
                }
                html += `<option value="${okey},ethernet" ${disable == true ? 'disabled="true"' : ''}>${optionsText}`
            }
        }

        for (key in ordered_name) {
            okey = reversetab[ordered_name[key]];
            if (linksourcedata['interfaces'][okey]['type'] == 'serial') {
                html += '<option value="' + okey + ',serial' + '" ' + ((linksourcedata['interfaces'][okey]['remote_id'] != 0) ? 'disabled="true"' : '') + '>' + linksourcedata['interfaces'][okey]['name']
                if (linksourcedata['interfaces'][okey]['remote_id'] != 0) {
                    html += ` ${lang('connected to')} `
                    var remoteNode = nodes[linksourcedata['interfaces'][okey]['remote_id']];
                    var remoteInterf = remoteNode.serials[linksourcedata['interfaces'][okey]['remote_if']]
                    if(remoteNode && remoteInterf){
                        html += remoteNode['name']
                        html += ' ' + remoteInterf['name']
                    }
                    
                }
            }
        }
    }
    html += '</option>'
    html += '</select>' +
        '<div style="width:3px;height:30px;"></div>' +
        '</div>' +
        '</div>' +
        '<div style="width:3px;height:30px;"></div>' +
        '<div class="form-group">' +
        '<div class="form-group ' + ((linktargettype == 'net') ? 'hidden' : '') + '">' +
        '<label>Choose Interface for ' + linktargetdata['name'] + '</label>' +
        '<select name="addConn[dstConn]" class="form-control dstConn">'

    if (linktargettype == 'node') {
        // Eth first
        var tmp_name = [];
        var reversetab = [];
        for (key in linktargetdata['interfaces']) {
            tmp_name.push(linktargetdata['interfaces'][key]['name'])
            reversetab[linktargetdata['interfaces'][key]['name']] = key
        }
        var ordered_name = tmp_name.sort(natSort);
        for (key in ordered_name) {
            okey = reversetab[ordered_name[key]];
            if (linktargetdata['interfaces'][okey]['type'] == 'ethernet') {

                var disable = false;
                var optionsText = linktargetdata['interfaces'][okey]['name'];

                if (isset(linktargetdata['interfaces'][okey]['network_id']) && networks[linktargetdata['interfaces'][okey]['network_id']]) {
                    disable = true;
                    optionsText += ' connected to '
                    
                    var links = App.topology.links;
                    for (let tkey in links) {
                        var link = links[tkey];
                        if ((link.source.node.get('id') == linktargetdata['id']) && (link.source.interface.get('name') == linktargetdata['interfaces'][okey]['name'])) {
                            
                            optionsText += link.dest.node.get('name');
                            if(link.dest.interface) optionsText += ' ' + link.dest.interface.get('name');
                        }
                        if ((link.dest.node.get('id') == linktargetdata['id']) && (link.dest.interface.get('name') == linktargetdata['interfaces'][okey]['name'])) {
                            
                            optionsText += link.source.node.get('name');
                            if(link.dest.interface) optionsText += ' ' + link.source.interface.get('name');
                        }
                    }

                };

                if (linktargetdata['type'] == 'docker' && optionsText == 'eth0') {
                    disable = true;
                    optionsText = lang('port_for_management', { port: optionsText });
                }

                html += `<option value="${okey},ethernet" ${disable == true ? 'disabled="true"' : ''}>${optionsText}`

            }
        }
        // Serial first
        for (key in ordered_name) {
            okey = reversetab[ordered_name[key]];
            if (linktargetdata['interfaces'][okey]['type'] == 'serial') {
                html += '<option value="' + okey + ',serial' + '" ' + ((linktargetdata['interfaces'][okey]['remote_id'] != 0) ? 'disabled="true"' : '') + '>' + linktargetdata['interfaces'][okey]['name']
                if (linktargetdata['interfaces'][okey]['remote_id'] != 0) {
                    html += ' ' + lang('connected to') + ' '
                    html += nodes[linktargetdata['interfaces'][okey]['remote_id']]['name']
                    html += ' ' + linktargetdata['interfaces'][okey]['remote_if_name']
                }
            }
        }
    }
    html += '</option>'
    html += '</select>' +
        '<div style="width:3px;height:30px;"></div>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label>' + lang('Destination ID') + ': ' + linktargetdata['id'] + '</label>' +
        '<p style="margin:0px;"></p>' +
        '<label>' + lang('Destination Name') + ': ' + linktargetdata['name'] + '</label>' +
        '<p style="text-muted">type - ' + ((linktargettype == 'net') ? lang('Network') : lang('Node')) + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-8 btn-part col-md-offset-6">' +
        '<div class="form-group">' +
        '<button type="submit" class="btn btn-success addConn-form-save">' + lang("Save") + '</button>' +
        '<button type="button" class="btn cancelForm" data-dismiss="modal">' + lang('Cancel') + '</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>'

    addModal(title, html, '');
    window.topoChange = true;

    $('body').on('change', 'select.srcConn', function (e) {
        var iname = $('select.srcConn option[value="' + $('select.srcConn').val() + '"]').text();
        $('.addConnSrc').html(iname)
    });
    $('body').on('change', 'select.dstConn', function (e) {
        var iname = $('select.dstConn option[value="' + $('select.dstConn').val() + '"]').text();
        $('.addConnDst').html(iname)
    });
}

function connContextMenu(e, ui) {
    window.connContext = 1
    window.connToDel = e
}

function zoomlab(value) {
    console.log(value);
    var zoom = value / 100
    setZoom(zoom, lab_topology, [0.0, 0.0])
    $('#lab-viewport').width(($(window).width()) / zoom)
    $('#lab-viewport').height($(window).height() / zoom);
    $('#lab-viewport').css({ top: 0, left: 0, position: 'absolute' });

}

function zoompic(event, ui) {
    var zoom = ui.value / 100
    setZoom(zoom, lab_picture, [0, 0])
    $('#picslider').slider({ value: ui.value })
}

// Function from jsPlumb Doc
window.setZoom = function (zoom, instance, transformOrigin, el) {
    transformOrigin = transformOrigin || [0.5, 0.5];
    instance = instance || jsPlumb;
    el = el || instance.getContainer();
    var p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;

    instance.setZoom(zoom);
};

// Form upload node config
// Import external labs
function printFormUploadNodeConfig(path) {
    var html = '<form id="form-upload-node-config" class="form-horizontal form-upload-node-config">' +
        '<div class="form-group">' +
        '<label class="col-md-3 control-label">' + lang('File') + '</label>' +
        '<div class="col-md-5">' +
        '<input class="form-control" name="upload[path]" value="" disabled="" placeholder="' + lang("No file selected") + '" "type="text"/>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<div class="col-md-7 col-md-offset-3">' +
        '<span class="btn btn-default btn-file btn-success">' + lang("Browse") +
        '<input accept="text/plain" class="form-control" name="upload[file]" value="" type="file">' +
        '</span>' +
        '<button type="submit" class="btn btn-flat">' + lang("Upload") + '</button>' +
        '<button type="button" class="btn btn-flat" data-dismiss="modal">' + lang('Cancel') + '</button>' +
        '</div>' +
        '</div>' +
        '</form>';
    console.log('DEBUG: popping up the upload form.');
    addModal(lang("Upload Config File"), html, '', 'upload-modal');
    validateImport();
}


function updateSuspendStatus(nodeId, ifId, status) {
    $('#context-menu').remove();
    var deferred = $.Deferred();
    var type = 'POST';
    var url = '/api/labs/session/interfaces/setSuspend';

    $.ajax({
        cache: false,
        type: type,
        url: encodeURI(url),
        dataType: 'json',
        data: {
            'node_id' : nodeId,
            'interface_id' : ifId,
            'status' : status,
        },
        success: function (data) {
            if (data['status'] == 'success') {
                App.topology.updateData(data['update']);
                App.topology.printTopology();
                deferred.resolve(data['message']);
            } else {
                App.topology.printTopology();
                deferred.reject(data['message']);
            }
        },
        error: function (data) {
            App.topology.printTopology();
            deferred.reject(message);
        }
    });
    return deferred.promise();
}


