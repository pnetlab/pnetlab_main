export default class mnf {
	
	static toggleClass(element, className, event) {
			event.stopPropagation();
	        var classes = element.className.split(" ");
	        var i = classes.indexOf(className);
	        if (i >= 0){
	            classes.splice(i, 1);
	        } else {
	            classes.push(className);
	        }
	       
	        element.className = classes.join(" "); 
	}
	
	static closeAllExpandButton(){
		let menuGrBtns = document.getElementsByClassName("menu_group_button")
		let leng = menuGrBtns.length;
		for(let i = 0; i < leng; i++){
			this.rmClass(menuGrBtns[i], 'expand');
		}
	}
	
	static addClass(element, className) {
		
	        var classes = element.className.split(" ");
	        var i = classes.indexOf(className);
	        if (i < 0){
	            classes.push(className);
	        }
	        element.className = classes.join(" "); 
	    
	}
	
	static rmClass(element, className) {
	        var classes = element.className.split(" ");
	        var i = classes.indexOf(className);
	        if (i >= 0) {
	            classes.splice(i, 1);
	        }
	        element.className = classes.join(" "); 
	    
	}
}



/* menu cover */



