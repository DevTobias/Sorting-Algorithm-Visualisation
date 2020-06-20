let current_lang = 'en';

function translate() {
    $("[data-translate]").each(function(){
        let key = $(this).data('translate');
        $(this).html(dictionary[key][current_lang] || "N/A");
    });
}

function clear_actives() {
    $('#drop_english').removeClass('active');   
    $('#drop_german').removeClass('active'); 
}

function english_click() {
    clear_actives();
    $('#drop_english').addClass('active');
    current_lang = 'en';
    translate();
}

function german_click() {
    clear_actives();
    $('#drop_german').addClass('active');
    current_lang = 'de';
    translate();
}