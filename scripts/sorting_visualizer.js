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
        this.COMPARE_COLOR = '#373768'; //2dad54
        this.SWAP_COLOR = '#E0544C';

        this.amount_elements; this.sorting_mode; this.key_mode;
        this.fps; this.sound_volume; this.array;

        this.max_frequency = 1000; 

        this.sorting_algorithm = "bubble_sort";

        this.amount_accesses = 0;
        this.amount_comparisons = 0;

        this.bar_height; this.bar_width; this.distance = 2;

        this.perm_queue = new Queue();

        this.fpsInterval; this.startTime;
        this.now; this.then; this.elapsed; this.stop;
    }

    reload_settings() {
        this.amount_elements = $('#arrsize_sel').val();
        this.sorting_mode = $('#arrangement_sel').val();
        this.key_mode = $('#key_sel').val();
        this.fps = $('#interval_sel').val();
        this.sound_volume = $('#volume_slide').val();
        this.array = ArrayUtils.get_array(this.sorting_mode, this.key_mode, this.amount_elements); 
    }

    render_array() {

        // Import SVG and empty the old one
        var svgns = 'http://www.w3.org/2000/svg';
        $('#bar_svg').empty();
        
        // Load the Canvas and the SVG and FontSize for Calculations
        let svg_img = document.getElementById('bar_svg');
        let canvas_element = document.getElementById('svg_box');
        let canvas_font_size = parseFloat(getComputedStyle(canvas_element).fontSize);
        let svg_width = canvas_element.getBoundingClientRect().width - 2 * canvas_font_size;
        let svg_height = canvas_element.getBoundingClientRect().height - 2 * canvas_font_size;
           
        // Style of the rectangles
        this.distance = 1.5;
        if(this.amount_elements > 500) this.distance = 0;
        else if(this.amount_elements > 300) this.distance = 1;
        else if(this.amount_elements > 150) this.distance = 0.5;

        // Calculate the needed Information for the display
        this.bar_width = (svg_width - this.distance * (this.amount_elements - 2) ) / this.amount_elements;
        this.bar_height = svg_height / this.amount_elements;
    
        // Set the Dimensions of the svg image
        svg_img.setAttribute('width', svg_width);
        svg_img.setAttribute('height', svg_height);
    
        let current_width = 0; let counter = 0;
        for(let i = 0; i < this.amount_elements; ++i) {
    
            // Create new rectangle and modify the attributes 
            let rect = document.createElementNS(svgns, 'rect');
            rect.id = "rect_" + counter++;
            rect.setAttributeNS(null, 'x', current_width);
            rect.setAttributeNS(null, 'y', 0);
            rect.setAttributeNS(null, 'height', this.array[i] *  this.bar_height);
            rect.setAttributeNS(null, 'width', this.bar_width);
            current_width += this.bar_width + this.distance;

            rect.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);
            
            // Render it on screen
            document.getElementById('bar_svg').appendChild(rect);
           
        }
    
    }

    stop_animation() {
        this.stop = true;         
        
        if(!this.perm_queue.isEmpty) {
            let perm = this.perm_queue.peek();
            if(perm[0] == 'reset') {
                let rect1 = document.getElementById('rect_' + perm[1]);
                let rect2 = document.getElementById('rect_' + perm[2]);
                rect1.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);
                rect2.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);
                this.perm_queue.dequeue();
            }
        }
    }

    start_animation() {
        this.fps = $('#interval_sel').val();
        this.perm_queue.clear();
        this.amount_accesses = 0; this.amount_comparisons = 0;

        switch(this.sorting_algorithm) {
            case "bubble_sort": SortingAlgorithms.bubble_sort(); break;
            case "insertion_sort": SortingAlgorithms.insertion_sort(); break;
            case "selection_sort": SortingAlgorithms.selection_sort(); break;
            case "cocktail_sort": SortingAlgorithms.cocktail_sort(); break;
            default: SortingAlgorithms.bubble_sort();
        }

        this.resume_sorting();
    }

    resume_sorting() {
        this.stop = false;
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }

    animate() {
        
        if(!this.stop) {
            requestAnimationFrame(()=>this.animate());

            this.now = Date.now();
            this.elapsed = this.now - this.then;

            if (this.elapsed > this.fpsInterval) {
                this.then = this.now - (this.elapsed % this.fpsInterval);
                this.evaluate_permutation();
            }

            if(this.perm_queue.isEmpty()) {
                this.stop = true;
            }
        }
    }

    print_information() {
        if(current_lang == 'de') {
            $('#comp_label').html('Anzahl der Vergleiche: &thinsp;&thinsp;&thinsp; ' + this.amount_comparisons);
            $('#acc_label').html('Anzahl der Feldzugriffe : ' + this.amount_accesses);
        } else if(current_lang == 'en') {
            $('#comp_label').html('Amount comparisons:  &thinsp;&thinsp;&thinsp;&thinsp; ' + this.amount_comparisons);
            $('#acc_label').html('Amount array accesses: ' + this.amount_accesses);
        }
    }

    
    play_sound(value) {
        this.sound_volume = 5;
        if(this.sound_volume != 0) {
            let percent = value / this.amount_elements;
            let frequency = percent * this.max_frequency;
            playTone(frequency, 'sine', this.fpsInterval / 1000, this.sound_volume); 
        }
    } 


    evaluate_permutation() {
        let perm = this.perm_queue.dequeue();
        let operation = perm[0]; let i = perm[1]; let j = perm[2];

        switch(operation) {

            case "swap": {

                let rect1 = document.getElementById('rect_' + i);
                let rect2 = document.getElementById('rect_' + j);

                rect1.setAttributeNS(null, 'fill', this.SWAP_COLOR);
                rect2.setAttributeNS(null, 'fill', this.SWAP_COLOR);
                $('#rect_' + i).remove().appendTo('#bar_svg');
                $('#rect_' + j).remove().appendTo('#bar_svg');

                $(rect1).animate({ x: j * this.bar_width + this.distance * j}, this.fpsInterval);
                $(rect2).animate({ x: i * this.bar_width + this.distance * i}, this.fpsInterval);
                rect1.id = "rect_" + j; rect2.id = "rect_" + i;

                // this.play_sound(this.array[i]);
                // this.play_sound(this.array[j]);

                this.amount_accesses += 4;
                this.print_information();

                ArrayUtils.swap(this.array, i, j);

                break;

            } case "comp": {

                let rect1 = document.getElementById('rect_' + i);
                let rect2 = document.getElementById('rect_' + j);
                rect1.setAttributeNS(null, 'fill', this.COMPARE_COLOR);
                rect2.setAttributeNS(null, 'fill', this.COMPARE_COLOR);

                this.amount_accesses += 2; this.amount_comparisons += 1;
                this.print_information();

                break;

            } case "comp_val": {

                let rect1 = document.getElementById('rect_' + i);
                rect1.setAttributeNS(null, 'fill', this.COMPARE_COLOR);

                this.amount_accesses += 1; this.amount_comparisons += 1;
                this.print_information();

                break;

            } case "replace": {

                let rect1 = document.getElementById('rect_' + i);
                let rect2 = document.getElementById('rect_' + j);
                rect1.setAttributeNS(null, 'fill', this.SWAP_COLOR);
                rect2.setAttributeNS(null, 'fill', this.COMPARE_COLOR);

                //$(rect1).animate({ height: rect2.getAttribute('height')}, 1);
                rect1.setAttribute('height', rect2.getAttribute('height'));

                this.amount_accesses += 2;
                this.print_information();

                this.array[i] = this.array[j];

                break;
 

            } case "replace_val": {

                let rect1 = document.getElementById('rect_' + i);
                rect1.setAttributeNS(null, 'fill', this.SWAP_COLOR);

                // $(rect1).animate({ height: j * this.bar_height}, this.fpsInterval);
                rect1.setAttribute('height', j * this.bar_height);

                this.amount_accesses += 1;
                this.print_information();

                this.array[i] = j;

                break;

            } case "reset": {

                let rect1 = document.getElementById('rect_' + i);
                let rect2 = document.getElementById('rect_' + j);
                rect1.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);
                rect2.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);

                break;

            } case "reset_i": {

                let rect1 = document.getElementById('rect_' + i);
                rect1.setAttributeNS(null, 'fill', this.DEFAULT_COLOR);

                break;

            }

        }
    }


    swap(array, i, j) { 
        this.perm_queue.enqueue(['swap', i, j]); 
        this.perm_queue.enqueue(['reset', i, j]); 
        ArrayUtils.swap(array, i, j);
    }

    compare(array, i, j) { 
        this.perm_queue.enqueue(['comp', i, j]); 
        this.perm_queue.enqueue(['reset', i, j]); 

        if(array[i] > array[j]) return 1;
        else if(array[i] < array[j]) return -1;
        else return 0;
    }

    compare_val(array, i, val) { 
        this.perm_queue.enqueue(['comp_val', i, val]); 
        this.perm_queue.enqueue(['reset_i', i, 0]); 

        if(array[i] > val) return 1;
        else if(array[i] < val) return -1;
        else return 0;
    }
    
    replace(array, i, j) { 
        this.perm_queue.enqueue(['replace', i, j]); 
        this.perm_queue.enqueue(['reset', i, j]); 
        array[i] = array[j];
    }
    
    replace_val(array, i, val) { 
        this.perm_queue.enqueue(['replace_val', i, val]); 
        this.perm_queue.enqueue(['reset_i', i, 0]); 
        array[i] = val;
    }

}


var visualizer = new SortingVisualizer();

function render() {
    visualizer.render_array();
}

function render_new_array() {
    $("#resume_btn").addClass('btn_disabled');
    $("#stop_btn").addClass('btn_disabled');
    visualizer.reload_settings();
    visualizer.render_array();
}

function start_sorting() {
    $("#stop_btn").removeClass('btn_disabled');
    $("#resume_btn").addClass('btn_disabled');
    $("#create_btn").addClass('btn_disabled');
    visualizer.start_animation();
}

function stop_sorting() {
    $("#resume_btn").removeClass('btn_disabled');
    $("#create_btn").removeClass('btn_disabled');
    $("#stop_btn").addClass('btn_disabled');
    visualizer.stop_animation();
}

function resume_sorting() {
    $("#resume_btn").addClass('btn_disabled');
    $("#create_btn").addClass('btn_disabled');
    $("#stop_btn").removeClass('btn_disabled');
    visualizer.resume_sorting();
}

function clear_actives() {
    stop_sorting();
    $('#bubble_btn').removeClass('active');
    $('#insert_btn').removeClass('active');
    $('#select_btn').removeClass('active');   
    $('#cocktail_btn').removeClass('active');   

    visualizer.stop_animation(); 
    $("#resume_btn").addClass('btn_disabled');
}

function select_bubblesort() {
    visualizer.sorting_algorithm = "bubble_sort";
    clear_actives();
    $('#bubble_sort').addClass('active');
    $('#sort_header').html("BUBBLE SORT");   
}

function select_insertionsort() {   
    visualizer.sorting_algorithm = "insertion_sort";
    clear_actives();
    $('#insert_btn').addClass('active');
    $('#sort_header').html("INSERTION SORT");  
}

function select_selectionsort() {
    visualizer.sorting_algorithm = "selection_sort";
    clear_actives();
    $('#select_btn').addClass('active');
    $('#sort_header').html("SELECTION SORT");   
}

function select_cocktailsort() {
    visualizer.sorting_algorithm = "cocktail_sort";
    clear_actives();
    $('#cocktail_btn').addClass('active');
    $('#sort_header').html("COCKTAIL SORT");   
}


$(function() {
    render_new_array();
})