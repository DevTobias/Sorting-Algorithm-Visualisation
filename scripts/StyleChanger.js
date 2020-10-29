// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//      Style changer
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

let current_state = 0;

function ChangeStyle() 
{
    current_state = (current_state + 1) % themes.length;
    var colors = color_palette[themes[current_state]];

    for(var key in colors) 
    {
        document.documentElement.style.setProperty(key, colors[key]);
    }
}