class moveControl {
    constructor(onStop) {
        this.centerPoint = {x:0, y:0};
        this.object = null;
        this.transform = {x: 0, y:0};

        this.moving = this.moving.bind(this);
        this.stop = this.stop.bind(this);
        this.onStop = onStop;
    }

    setObject(object){
        this.object = object;
        if(this.object == null) return;
        var transformCss = this.object.style.transform;
        var match = /.*translate\(([\d\+\-]+)px, ([\d\+\-]+)px\).*/.exec(transformCss);
        if(match){
            this.transform = {x: Number(match[1]), y: Number(match[2])};
        }else{
            this.transform = {x: 0, y: 0};
        }
       
        var currentPos = this.getPos(object.offsetParent);
        this.centerPoint = {x: currentPos.x, y: currentPos.y};

        document.addEventListener('mousemove', this.moving);
        document.addEventListener('mouseup', this.stop);
    }

    moving(event){
        if(this.object == null) return;
        var zoom = 1;
        if(typeof getZoomLab == 'function'){
            zoom = getZoomLab()/100;
        } 
        
        var newPos = {x: event.clientX/zoom, y: event.clientY/zoom};
        var newTransform = {x: (newPos.x - this.centerPoint.x), y: (newPos.y - this.centerPoint.y)};
        this.object.style.transform = `translate(${newTransform.x}px, ${newTransform.y}px)`;
        this.transform = newTransform;
    }

    stop(event){
        document.removeEventListener('mousemove', this.moving);
        document.removeEventListener('mouseup', this.stop);
        if(this.onStop) this.onStop(this.object, this.transform);
        this.object = null;
    }

    

    getPos(el) {
        // yay readability
        for (var lx=0, ly=0;
             el != null;
             lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return {x: lx,y: ly};
    }
}

export default moveControl