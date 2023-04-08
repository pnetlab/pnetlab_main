class interfc {
    constructor($p, type){
        for(let i in $p){
            this[i] = $p[i];
        }

        this.type = type;

        this.quality_class = ''
        if(isset(this.quality)){
            if (Object.values(this.quality).findIndex(item => item != '') !== -1) this.quality_class = 'quality_applied';
        }
    }

    get(key, df = ''){
        if(typeof(this[key]) != 'undefined') return this[key];
        return df;
    }
}

export default interfc