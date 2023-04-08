import interfc from './interfc'
class node {
    constructor($p){
        for(let i in $p){
            this[i] = $p[i];
        }

        var ethernets = get($p['ethernets'], {});
        var serials = get($p['serials'], {});

        this.ethernets = {};
        this.serials = {};

        for(let i in ethernets){
            this.ethernets[i] = new interfc(ethernets[i], 'ethernet');
        }

        for(let i in serials){
            this.serials[i] = new interfc(serials[i], 'serial');
        }

        if($('#node' + $p['id']).length) this.component = $('#node' + $p['id']);

    }

    getInterfaces(){
        return {...this.ethernets, ...this.serials}
    }

    get(key, df = ''){
        if(typeof(this[key]) != 'undefined') return this[key];
        return df;
    }
}

export default node