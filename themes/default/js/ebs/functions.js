


function initializeEditor(theme = 'cobalt', mode = 'cisco_ios', font_size = '12px', value = null)
{
    $('#editor').css('font-size', font_size)
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + theme)
    editor.getSession().setMode("ace/mode/" + mode)
    editor.setHighlightActiveLine(true);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false
    });
    editor.$blockScrolling = Infinity;
    if(value != null) {
        editor.setValue(value, 1)
    }
    editor.focus();
    editor.gotoLine(Infinity, editor.getSession().getValue().split("\n").length);
}

function initEditor () {
    var mode = readCookie('ace_mode') ? readCookie('ace_mode') : 'cisco_ios';
    var theme = readCookie('ace_theme') ? readCookie('ace_theme') : 'cobalt';
    var font_size = readCookie('ace_font_size') ? readCookie('ace_font_size') : '12px';
    var editor = $('#editor');
    var textarea = $('#nodeconfig');
    var ace_conf_panel = $('#ace-conf-panel');


    editor.show();
    console.log(textarea.val())
    textarea.hide();
    ace_conf_panel.show();
    $('#editor').css('height', $('#nodeconfig').height());
    initializeEditor(theme, mode, font_size, textarea.val());
    createCookie("editor", "ace");
}

function initTextarea() {
    var editor = $('#editor');
    var textarea = $('#nodeconfig');
    var ace_conf_panel = $('#ace-conf-panel');
    textarea.show().val(ace.edit("editor").getValue());
    textarea.focus();
    destroyEditor();
    ace_conf_panel.hide();
    editor.empty().hide().removeAttr('class');
    eraseCookie("editor");
}

function destroyEditor()
{
    var editor = ace.edit("editor");
    editor.destroy();
}

function createCookie(name, value, days = 30)
{
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++)
    {
        var c = ca[i];
        while (c.charAt(0)==' ')
        {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0)
        {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}

function eraseCookie(name)
{
    createCookie(name,"",-1);
}



function adjustZoom(lab_topology, scroll_top = null, scroll_left = null)
{
    
    var zoomvalue = typeof(getZoomLab) == 'function'? getZoomLab()/100 : 1;
    var viewport =  $('#lab-viewport');
   
    if(zoomvalue) {
        setZoom(zoomvalue, lab_topology, [0.0, 0.0], $('#context-menu')[0])
        viewport.scrollTop(scroll_top || $('#lab-viewport').scrollTop());
        viewport.scrollLeft(scroll_left || $('#lab-viewport').scrollLeft());
    }
    delete window.scroll_left;
    delete window.scroll_top;
}

function hideContextmenu()
{
    if(contextMenuOpen){
        $("#context-menu").remove();
        adjustZoom(lab_topology, $('#lab-viewport').scrollTop(), $('#lab-viewport').scrollLeft());
        console.log("DEBUG: Drop Down menu closed");
    }
    contextMenuOpen = false;
}

function resolveZoom(value, scroll)
{
    window.scroll_left = $('#lab-viewport').scrollLeft();
    window.scroll_top = $('#lab-viewport').scrollTop();

    if(scroll == 'left') {
        return Math.round(parseInt(value) * (100/getZoomLab())) + window.scroll_left;
    } else if(scroll == 'top') {
        return Math.round(parseInt(value) * (100/getZoomLab())) + window.scroll_top;
    }

    return Math.round(parseInt(value) * (100/getZoomLab()))
}
