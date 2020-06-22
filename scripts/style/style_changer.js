
current_state = 0;
themes = ['light', 'dark']

color_palette = {
    'light' : {
        '--body-background-color': '#F4F4F8',
        '--h2-color': '#000000',
        '--label_color' : '#000000',
        '--box-background-color' : '#ffffff',
        '--sorting_nav-background-color' : '#177e89',
        '--style_btn-color' : '#ffffff',
        '--style_btn-border-color' : '#ffffff',
        '--style_btn_hover-background-color' : '#ffffff',
        '--style_btn_hover-color' : '#000000', 
        '--btn_override-background-color' : '#177e89',
        '--btn_override-border-color' : '#177e89',
        '--btn_override_hover-background-color' : '#5bc0be',
        '--btn_override_hover-border-color' : '#5bc0be',
        '--dropdown_item_active-background-color' : '#5bc0be',
        '--dropdown_menu-background-color' : '#ffffff',
    },
    'dark' : {
        '--body-background-color': '#F4F4F8',
        '--h2-color': '#000000',
        '--label_color' : '#000000',
        '--box-background-color' : '#ffffff',
        '--sorting_nav-background-color' : '#177e89',
        '--style_btn-color' : '#ffffff',
        '--style_btn-border-color' : '#ffffff',
        '--style_btn_hover-background-color' : '#ffffff',
        '--style_btn_hover-color' : '#000000', 
        '--btn_override-background-color' : '#177e89',
        '--btn_override-border-color' : '#177e89',
        '--btn_override_hover-background-color' : '#5bc0be',
        '--btn_override_hover-border-color' : '#5bc0be',
        '--dropdown_item_active-background-color' : '#5bc0be',
        '--dropdown_menu-background-color' : '#ffffff',
    },
}

function style_btn_click() {
    current_state = (current_state + 1) % themes.length;
    var colors = color_palette[themes[current_state]];
    for(var key in colors) {
        document.documentElement.style.setProperty(key, colors[key]);
    }
}
