import interfc from "./interfc";

class network {

    constructor($p) {
        for (let i in $p) {
            this[i] = $p[i];
        }

        this.endpoints = [];

        if ($('#network' + $p['id']).length) this.component = $('#network' + $p['id']);
    }

   

    /**
     * Create links form end points
     */
    createLinks() {
        
        if (this.endpoints.length == 0 && this.get('visibility') == 0) {
            App.topology.registerUnuseNetwork(this.get('id'));
            return [];
        }

        if (this.endpoints.length == 1 && this.get('visibility') == 0) {
            App.topology.registerUnuseNetwork(this.get('id'));
            return [];
        }

        if (this.endpoints.length == 2 && this.get('visibility') == 0) {
            return [{
                source: this.endpoints[0],
                dest: this.endpoints[1],
                id: `network_id:${this.endpoints[0].interface.get('network_id')}`,
            }]
        }

        this.visibility = 1;
        var links = [];
        this.endpoints.map(item => {
            links.push({
                source: item,
                dest: {
                    node: this,
                    interface: new interfc({
                        type: 'network'
                    }),
                    type: 'ethernet'
                },
                id: `iface:node${item.node.get('id')}:${item.interface.get('id')}`,

            })
        })
        return links;

    }




    get(key, df = '') {
        if (typeof (this[key]) != 'undefined') return this[key];
        return df;
    }
}

export default network