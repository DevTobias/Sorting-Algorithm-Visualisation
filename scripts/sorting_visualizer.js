class ArrayUtils {

    static swap(array, i, j) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    static get_random_int(max_value) {
        return Math.floor(Math.random() * Math.floor(max_value));
    }

    static shuffle(array, p) {
        let current_index = array.length;
        while (0 !== --current_index) {
            if((this.get_random_int(100) / 100) <= p) {
                this.swap(array, current_index, this.get_random_int(current_index));
            }
        }
        return array;
    }   

    static mostly_shuffle(array) {
        let current_index = array.length;
        while (1 !== --current_index) {
            this.swap(array, current_index, current_index - this.get_random_int(3));
        }
        return array;
    }

    static get_unique_array(amount_elements) {
        let array = [];
        for(let i = 1; i <= amount_elements; ++i) {
            array.push(i);
        } 
        return array;
    }

    static get_mostly_unique_array(p, amount_elements) {
        let array = [];
        for(let i = 1; i <= amount_elements; ++i) {
            let rand = this.get_random_int(p);
            for(let j = i; j <= i + rand; ++j) {
                array.push(i);
            }
            i += rand;
        }
        array[array.length - 1] = array.length;
        return array;
    }

    static get_array(sorting_mode, key_mode, amount_elements) {
        let array;

        switch(key_mode) {
            case 'many_unique': array = this.get_mostly_unique_array(amount_elements / 11, amount_elements); break;
            case 'few_unique': array = this.get_mostly_unique_array(amount_elements / 5, amount_elements); break;
            default: array = this.get_unique_array(amount_elements); break;
        }

        switch(sorting_mode) {
            case 'random': this.shuffle(array, 1); break;
            case 'mostly_ascending': this.mostly_shuffle(array); break;
            case 'descending': array.reverse(); break;
            case 'mostly_descending': this.mostly_shuffle(array.reverse(), 0.2); break;
        }
    
        return array;
    }

}

class SortingVisualizer {

    constructor() {
        this.DEFAULT_COLOR = '#1E1E38';
        this.COMPARE_COLOR = '#2dad54';
        this.SWAP_COLOR = '#E0544C';

        this.amount_elements; this.sorting_mode; this.key_mode;
        this.delay; this.sound_volume; this.array;

        this.perm_queue = new Queue();
    }

    reload_settings() {
        this.amount_elements = $('#arrsize_sel').val();
        this.sorting_mode = $('#arrangement_sel').val();
        this.key_mode = $('#key_sel').val();
        this.delay = $('#interval_sel').val();
        this.sound_volume = $('#volume_slide').val();
        this.array = ArrayUtils.get_array(this.sorting_mode, this.key_mode, this.amount_elements); 
    }

    render() {

        // Import SVG and empty the old one
        var svgns = 'http://www.w3.org/2000/svg';
        $('#bar_svg').empty();
        
        // Load the Canvas and the SVG and FontSize for Calculations
        var svg_img = document.getElementById('bar_svg');
        var canvas_element = document.getElementById('svg_box');
        var canvas_font_size = parseFloat(getComputedStyle(canvas_element).fontSize);
        var svg_width = canvas_element.getBoundingClientRect().width - 2 * canvas_font_size;
        var svg_height = canvas_element.getBoundingClientRect().height - 2 * canvas_font_size;
    
        // Calculate the needed Information for the display
        var bar_width = svg_width / this.amount_elements;
        var bar_height = svg_height / this.amount_elements;
    
        // Set the Dimensions of the svg image
        svg_img.setAttribute('width', svg_width);
        svg_img.setAttribute('height', svg_height);
    
        var current_width = 0; var counter = 0;
        for(var i = 0; i < this.amount_elements; ++i) {
    
            // Create new rectangle and modify the attributes 
            var rect = document.createElementNS(svgns, 'rect');
            rect.id = "rect_" + counter++;
            rect.setAttributeNS(null, 'x', current_width);
            rect.setAttributeNS(null, 'y', 0);
            rect.setAttributeNS(null, 'height', this.array[i] * bar_height);
            rect.setAttributeNS(null, 'width', bar_width);
            current_width += bar_width;
    
            // Style of the rectangles
            rect.setAttributeNS(null, 'stroke', '#fff');

            let stroke = '1.5';
            if(this.amount_elements > 500) stroke = '0';
            else if(this.amount_elements > 300) stroke = '0.5';
            else if(this.amount_elements > 150) stroke = '1';

            rect.setAttributeNS(null, 'stroke-width', stroke);
            rect.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);
            
            // Render it on screen
            document.getElementById('bar_svg').appendChild(rect);
           
        }
    
    }

    swap(i, j) { this.perm_queue.enqueue(['swap', i, j]); }
    compare(i, j) { this.perm_queue.enqueue(['comp', i, j]); }
    compare_val(i, val) { this.perm_queue.enqueue(['comp_val', i, val]); }
    replace(i, j) { this.perm_queue.enqueue(['replace', i, j]); }
    replace_val(i, val) { this.perm_queue.enqueue(['replace_val', i, val]); }

}


var visualizer = new SortingVisualizer();

function render_new_array() {
    visualizer.reload_settings();
    visualizer.render();
}

$(function() {
    render_new_array();
})