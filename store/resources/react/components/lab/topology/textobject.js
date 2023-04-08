class textobject {
    constructor($p){
        for(let i in $p){
            this[i] = $p[i];
        }
    }

    get(key, df = ''){
        if(typeof(this[key]) != 'undefined') return this[key];
        return df;
    }
}

export default textobject