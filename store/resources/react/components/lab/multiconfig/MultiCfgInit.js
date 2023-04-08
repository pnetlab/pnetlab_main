import React from 'react';
import { render } from 'react-dom'
import MultiConfig from './MultiConfig';

$(document).off('click', '.action-configsget');
$(document).on('click', '.action-configsget', function (e) {
    //overide function of startup config menu to add multi config
    event.stopPropagation();
    event.preventDefault();
    console.log('DEBUG: action = configsget');

    addModalWide(lang('Startup config'), new EJS({ url: '/themes/default/ejs/action_configsget.ejs' }).render({ configs: window.nodes }), '', null, () => {
        var multiconfig = document.createElement("div");
        var rowConfigList = document.getElementsByClassName('row-config-list')[0];
        if (!rowConfigList) return;
        rowConfigList.prepend(multiconfig)
        render(<MultiConfig></MultiConfig>, multiconfig);
    });
});

