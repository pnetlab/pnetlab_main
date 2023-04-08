global.openLab = (path)=>{
    axios.post(`/api/labs/session/factory/create`, { path: path }).then(
        function(response){
        window.location.href = "/legacy/topology";
    }, function(response){
        error_handle(response);
    });
}

global.delLab = (path, callback=null) => {
    if(!isset(path) || path == '') return;
    return axios.request({
        url: `/api/labs`,
        method: 'delete',
        data: {path}
    })

    .then(response => {
        response = response['data'];
        if (response['status'] == 'success') {
            if(callback) callback(response);
        } else {
            error_handle(response);
        }
    })

    .catch((error)=>{
        console.log(error);
        error_handle(error);
    })
}

global.makeQuestion = (question, confirmButtonText = 'Yes', cancelButtonText='No')=>{
    if(typeof Swal == 'undefined') {
        return Promise.resolve(confirm(question));
    }
    return Swal({
        title: 'Warning!',
        text: lang(question),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: lang(confirmButtonText),
        cancelButtonText: lang(cancelButtonText)
    }).then((result) => {
        return result.value;
    })
}

global.isAdmin = () => {
    if(typeof App == 'undefined') return false;
    if(!App.server || !App.server.user || !App.server.user[USER_ROLE]) return false;
    if(App.server.user[USER_ROLE] == 0) return true;
    return false;
}

global.isOffline = () => {
    if(typeof App == 'undefined') return false;
    if(!App.server || !App.server.user || !App.server.user[USER_OFFLINE]) return false;
    if(App.server.user[USER_OFFLINE] == 1) return true;
    return false;
}


global.formatName = (name) => {
    if(!name) return '';
    return str_limit(name.replace('_online_account', ''), 10);
}



global.destroyLabSession = async (lab_session) => {

    var isDestroy = await makeQuestion(`All Nodes will be wiped. If you have not executed Export CFG, the whole configuration will be lost. 
    Do you want to continue?`, 'Destroy', 'Cancel');
    if(!isDestroy) return;

    App.loading(true);
    return axios.request({
        url: '/api/labs/session/factory/destroy',
        method: 'post',
        dataType: 'json',
        data: {
            lab_session: lab_session
        }
    })

    .then(response => {
        App.loading(false);
        return true;
    })

    .catch((error)=>{
        console.log(error);
        App.loading(false);
        error_handle(error);
    })
}


global.stopNodesLabSession = async (lab_session) => {

    var isStop = await makeQuestion(`All Nodes will be stoped. If you have not executed copy running config to startup config, the configuration will be lost. 
    Do you want to continue?`, 'Stop', 'Cancel');
    if(!isStop) return;

    App.loading(true);
    return axios.request({
        url: '/api/labs/session/factory/stopNodes',
        method: 'post',
        dataType: 'json',
        data: {
            lab_session: lab_session
        }
    })

    .then(response => {
        App.loading(false);
        return true;
    })

    .catch((error)=>{
        console.log(error);
        App.loading(false);
        error_handle(error);
    })
}
