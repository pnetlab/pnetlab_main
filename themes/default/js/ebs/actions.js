

$(document).on('click', '.surface-hand-move', function(e){
    var el = $(this);
    el.toggleClass('activated');
    $("#lab-viewport").selectable(el.hasClass("activated") ? "disable" : "enable").toggleClass('can-move');
});

$(document).on('change', '#toggle_editor', function(e) {
    var textarea = $(document).find('#nodeconfig');
    var editor = $(document).find('#editor');
    var ace_conf_panel = $('#ace-conf-panel')
    if($(this).is(':checked'))
    {  // Initializing ACE editor
        initEditor()
        //ace.edit("editor").setValue(, 1);
    } else
    {      // initializing textarea
        initTextarea()
    }
});

$(document).on('click', '#ace_config', function () {

    if($(this).is(':checked')) {
        $('#ace-conf-panel').removeClass('invisible');
    } else {
        $('#ace-conf-panel').addClass('invisible');
    }
    console.log($('#ace-conf-panel').html());
})

$(document).on('change', '#ace_mode', function () {
    var mode = $(this).val();
    ace.edit('editor')
        .getSession().setMode("ace/mode/" + mode)
    createCookie('ace_mode', mode)
})

$(document).on('change', '#ace_themes', function () {
    var theme = $(this).val();
    ace.edit('editor')
        .setTheme("ace/theme/" + theme);
    createCookie('ace_theme', theme);
})

$(document).on('change', '#ace_font-size', function () {
    var font_size = $(this).val();
    $('#editor').css('font-size', font_size);
    createCookie('ace_font_size', font_size);
})
$(window).resize(function () {
    $('#editor').css('height', $('#nodeconfig').height());

    var viewport = $('#lab-viewport');

    viewport.width(($(window).width()) * (100/getZoomLab()));
    viewport.height($(window).height() * (100/getZoomLab()));

    // $('#lab-viewport').css({top: 0,left: 40,position: 'absolute'});
})

$(document).on('click', '#alert_container_close', function () {
    $('#alert_container').hide();
})

$(window).blur(function () {
    hideContextmenu();
})

$(document).click(function () {
    hideContextmenu();
})

$(document).on('change', 'input[type=checkbox]', function (e) {
    var title="ACE Editor"
    if ($(e.target).hasClass("change_config_status")) title="boot on exported config" 
    if($(this).siblings('.checkbox-slider-off').length > 0) {

        $(this).siblings('.checkbox-slider-off').addClass('checkbox-slider-on');
        $(this).siblings('.checkbox-slider-off').removeClass('checkbox-slider-off');

        $(this).parent('.checkbox-switch').attr('title',"Disable "+title);
    } else {

        $(this).siblings('.checkbox-slider-on').addClass('checkbox-slider-off');
        $(this).siblings('.checkbox-slider-on').removeClass('checkbox-slider-on');

        $(this).parent('.checkbox-switch').attr('title',"Enable "+title);
    }
})
