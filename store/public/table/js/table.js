if(typeof render_register_after == 'undefined'){
	var render_register_after = {}
	function registerRenderAfter(tableID, func){
		if(!isset(render_register_after[tableID])){
			render_register_after[tableID] = [];
		}
		render_register_after[tableID].push(func);
	}
}

if(typeof render_register_before == 'undefined'){
	var render_register_before = {}
	function registerRenderBefore(tableID, func){
		if(!isset(render_register_before[tableID])){
			render_register_before[tableID] = [];
		}
		render_register_before[tableID].push(func);
	}
}

if(typeof initial_register == 'undefined'){
	var initial_register = {}
	function registerInitial(tableID, func){
		if(!isset(initial_register[tableID])){
			initial_register[tableID] = [];
		}
		initial_register[tableID].push(func);
	}
}



function addClass(element, className) {
	
    var classes = element.className.split(" ");
    var i = classes.indexOf(className);
    if (i < 0){
        
        classes.push(className);
    	closeAllExpandButton();
    }
    element.className = classes.join(" "); 

}

function rmClass(element, className) {


    var classes = element.className.split(" ");
    var i = classes.indexOf(className);
    if (i >= 0) {
        classes.splice(i, 1);
    }
    element.className = classes.join(" "); 

}

function clearNumber(string){
	if(!string) return 0;
	return string.toString().replace(/[^\d\-]/g,'');
}

function formatNumber(num) {
	  if(!num) return 0;
	  num = clearNumber(num);
	  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}





