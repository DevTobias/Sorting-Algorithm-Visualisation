// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//      Language Changer
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

const LANGUAGES = {
    EN: 'en',
    DE: 'de',
};

let current_lang = LANGUAGES.EN;

function TranslateForm() 
{
    $("[data-translate]").each(function() 
    {
        let key = $(this).data('translate');
        $(this).html(dictionary[key][current_lang] || "N/A");
    });
}   

function ClearActiveDropdown() 
{
    $('#drop_english').removeClass('active');   
    $('#drop_german').removeClass('active'); 
}

function TranslateEnglish() 
{
    ClearActiveDropdown();
    $('#drop_english').addClass('active');
    current_lang = LANGUAGES.EN;
    TranslateForm();
}

function TranslateGerman() 
{
    ClearActiveDropdown();
    $('#drop_german').addClass('active');
    current_lang = LANGUAGES.DE;
    TranslateForm();
}