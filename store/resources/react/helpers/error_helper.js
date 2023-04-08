global.error_handle = (error)=>{
	try {
		var authenServer = null;
		var App = global.App;
		if(!App) var App = {};
		if(App.server && App.server.common) authenServer = App.server.common.APP_AUTHEN;
		if(!authenServer && server) authenServer = server.APP_AUTHEN;

		var status = 200;
		var data = error;

		if(error.name == 'Error'){
			status = error.response.status;
			data = error.response.data;
		}
		else if(isset(error.headers)){
			status = error.status;
			data = error.data;
		}else if(isset(error.responseJSON)){
			status = error.status;
			data = error.responseJSON;
		}

		if((status == 419 || status == 403 || status == 401 || status == 412)){
			window.location = `/store/public/auth/login/manager?link=${window.location.href}&error=${lang("Please login again")}`
			return;
		}

		if(data['result'] || data['status']=='success') return;
		
		if(data['message'] == 'ERROR_AUTHEN'){
			window.location = `/store/public/auth/login/manager?link=${window.location.href}&error=${lang(data['message'], data['data'])}` 
			return;
		}

		if(data['message'] == 'NO_LAB_SESSION'){
			window.location = '/';
			return;
		}

		if(data['error_code'] == 10000){
			var labId = data['data'] && data['data']['id'];
			labExpireHandle(data['message'], labId);
			return;
		}
		
		showLog( lang(data['message'], data['data']), 'error' );
		
		
	}catch(err) {
		console.log(err);
		showLog(err.message, 'error');
	}
	
	 
}

global.showLog = (message, type)=>{
	if(typeof(addMessage) != "undefined"){
		if(type == 'error') type='danger';
		addMessage(type, message);
	}
	else if(typeof(toastr) != "undefined"){
		toastr[type](message)
	}
	else if(typeof(Swal) != "undefined"){
		Swal('', message, type);
	}
	console.log(message);
}

global.labExpireHandle=(message, labId)=>{

	if(App.labExpireHandled) return;
	App.labExpireHandled = true;
	return Swal({
        title: lang('Warning')+'!',
        text: lang(message),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: lang('Go To Store'),
        cancelButtonText: lang('Cancel')
    }).then((result) => {
		App.labExpireHandled = false;
        if(result.value){
			window.open(`${App.server.common['APP_CENTER']}/store/labs/detail?id=${labId}&href=${window.location.origin}/store/public/admin/labs/store`);
		}
    })
}