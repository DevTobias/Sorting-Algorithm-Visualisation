const DEFAULT_COLOR = '#1E1E38'; 
const COMPARE_COLOR = '#373768';
const SWAP_COLOR = '#E0544C';
     
const OPERATION = {
    SWAP: 0,
    COMP: 1,
    COMP_VAL: 2,
    REPLACE: 3,
    REPLACE_VAL: 4,
    RESET: 5,
    RESET_I: 6,
    FINISH: 7,
};

class SortingVisualizer 
{

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Visualizer information
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    constructor() 
    {      
        this.amount_elements; this.sorting_mode; this.key_mode; this.fps; this.sound_volume; 
        this.array; this.max_frequency = 1000; this.sorting_algorithm = SORTING_ALGORITHMS.BUBBLESORT;
        this.bar_height; this.bar_width; this.distance = 2;
        
        this.perm_queue = new Queue();
        this.fps_interval; this.start_time;
        this.now; this.then; this.elapsed; this.stop;

        this.animate_swap = true; this.animate_color = true;
       
        this.amount_accesses = 0; this.amount_comparisons = 0;
    }

    ReloadSettings() 
    {
        this.amount_elements = $('#arrsize_sel').val();
        this.sorting_mode = $('#arrangement_sel').val();
        this.key_mode = $('#key_sel').val();
        // this.sound_volume = $('#volume_slide').val();

        this.ReloadFPSSettings();
        this.ReloadAnimationSettings();
        this.array = ArrayUtils.GetArray(this.sorting_mode, this.key_mode, this.amount_elements); 
    }

    ReloadFPSSettings() 
    {
        this.fps = $('#interval_sel').val();
        this.fps_interval = 1000 / this.fps;
    }

    ReloadAnimationSettings() {
        this.animate_swap = $('#swap_ani_cb').prop('checked');
        this.animate_color = $('#color_ani_cb').prop('checked');
    }

    PrintAlgorithmInformation() 
    {
        if(current_lang == 'de') 
        {
            $('#comp_label').html('Anzahl der Vergleiche: &thinsp;&thinsp;&thinsp; ' + this.amount_comparisons);
            $('#acc_label').html('Anzahl der Feldzugriffe : ' + this.amount_accesses);
        } 
        else if(current_lang == 'en') 
        {
            $('#comp_label').html('Amount comparisons:  &thinsp;&thinsp;&thinsp;&thinsp; ' + this.amount_comparisons);
            $('#acc_label').html('Amount array accesses: ' + this.amount_accesses);
        }
    }

    
    PlaySound(value) 
    {
        this.sound_volume = 5;
        if(this.sound_volume != 0) 
        {
            let percent = value / this.amount_elements;
            let frequency = percent * this.max_frequency;
            playTone(frequency, 'sine', this.fps_interval / 1000, this.sound_volume); 
        }
    } 


    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Main animation
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    RenderArray() 
    {
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
        for(let i = 0; i < this.amount_elements; ++i) 
        {
            // Create new rectangle and modify the attributes 
            let rect = document.createElementNS(svgns, 'rect');
            rect.id = "rect_" + counter++;
            rect.setAttributeNS(null, 'x', current_width);
            rect.setAttributeNS(null, 'y', 0);
            rect.setAttributeNS(null, 'height', this.array[i] *  this.bar_height);
            rect.setAttributeNS(null, 'width', this.bar_width);
            current_width += this.bar_width + this.distance;

            rect.setAttributeNS(null, 'fill', DEFAULT_COLOR);
            
            // Render it on screen
            document.getElementById('bar_svg').appendChild(rect);  
        } 
    }

    StopAnimation() 
    {
        this.stop = true;         
        
        if(!this.perm_queue.isEmpty()) 
        {
            let perm = this.perm_queue.peek();
            if(perm[0] == OPERATION.RESET || perm[0] == OPERATION.RESET_I) 
            {
                let rect1 = document.getElementById('rect_' + perm[1]);
                let rect2 = document.getElementById('rect_' + perm[2]);
                rect1.setAttributeNS(null, 'fill', DEFAULT_COLOR);
                rect2.setAttributeNS(null, 'fill', DEFAULT_COLOR);
                this.perm_queue.dequeue();
            }
        }
    }

    StartAnimation() 
    {
        this.fps = $('#interval_sel').val();
        this.perm_queue.clear();
        this.amount_accesses = 0; this.amount_comparisons = 0;

        SortingAlgorithms.Sort(this.sorting_algorithm);
        this.ResumeAnimation();
    }

    ResumeAnimation() 
    {
        this.stop = false;
        this.fps_interval = 1000 / this.fps;
        this.then = Date.now();
        this.start_time = this.then;
        this.StartAnimationFrameHandler();
    }

    StartAnimationFrameHandler() 
    {
        
        if(!this.stop) 
        {
            requestAnimationFrame(() => this.StartAnimationFrameHandler());

            this.now = Date.now();
            this.elapsed = this.now - this.then;

            if (this.elapsed > this.fps_interval) 
            {
                this.then = this.now - (this.elapsed % this.fps_interval);
                this.ProcessPermutationQueue();
            }

            if(this.perm_queue.isEmpty()) 
            {
                this.stop = true;
            }
        }
    }


    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Permutation
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––


    ProcessPermutationQueue() 
    {
        let perm = this.perm_queue.dequeue();
        let operation = perm[0]; let i = perm[1]; let j = perm[2];
        let rect1 = document.getElementById('rect_' + i);
        let rect2 = document.getElementById('rect_' + j);

        switch(operation) {

            case OPERATION.SWAP: 
            {
                if(this.animate_color)
                {
                    rect1.setAttributeNS(null, 'fill', SWAP_COLOR);
                    rect2.setAttributeNS(null, 'fill', SWAP_COLOR);
                }

                $('#rect_' + i).remove().appendTo('#bar_svg');
                $('#rect_' + j).remove().appendTo('#bar_svg');

                if(this.animate_swap)
                {
                    $(rect1).animate({ x: j * this.bar_width + this.distance * j}, this.fps_interval);
                    $(rect2).animate({ x: i * this.bar_width + this.distance * i}, this.fps_interval);
                } 
                else 
                {
                    $(rect1).animate({ x: j * this.bar_width + this.distance * j}, 0);
                    $(rect2).animate({ x: i * this.bar_width + this.distance * i}, 0);  
                }

                rect1.id = "rect_" + j; rect2.id = "rect_" + i;

                this.amount_accesses += 4;
                this.PrintAlgorithmInformation();

                ArrayUtils.Swap(this.array, i, j);

                break;
            } 
            case OPERATION.COMP: 
            {
                if(this.animate_color)
                {
                    rect1.setAttributeNS(null, 'fill', COMPARE_COLOR);
                    rect2.setAttributeNS(null, 'fill', COMPARE_COLOR);
                }

                this.amount_accesses += 2; this.amount_comparisons += 1;
                this.PrintAlgorithmInformation();

                break;
            } 
            case OPERATION.COMP_VAL:
            {
                if(this.animate_color)
                {
                    rect1.setAttributeNS(null, 'fill', COMPARE_COLOR);
                }

                this.amount_accesses += 1; this.amount_comparisons += 1;
                this.PrintAlgorithmInformation();

                break;
            }
            case OPERATION.REPLACE: 
            {
                if(this.animate_color)
                {
                    rect1.setAttributeNS(null, 'fill', SWAP_COLOR);
                    rect2.setAttributeNS(null, 'fill', COMPARE_COLOR);
                }

                rect1.setAttribute('height', rect2.getAttribute('height'));

                this.amount_accesses += 2;
                this.PrintAlgorithmInformation();

                this.array[i] = this.array[j];

                break;
            }
            case OPERATION.REPLACE_VAL: 
            {
                if(this.animate_color)
                {
                    rect1.setAttributeNS(null, 'fill', SWAP_COLOR);
                }
                rect1.setAttribute('height', j * this.bar_height);

                this.amount_accesses += 1;
                this.PrintAlgorithmInformation();

                this.array[i] = j;

                break;
            } 
            case OPERATION.RESET: 
            {
                rect1.setAttributeNS(null, 'fill', DEFAULT_COLOR);
                rect2.setAttributeNS(null, 'fill', DEFAULT_COLOR);

                break;

            } 
            case OPERATION.RESET_I:
            {
                rect1.setAttributeNS(null, 'fill', DEFAULT_COLOR);
                break;
            }
            case OPERATION.FINISH:
            {
                ResetButtons();
                break;
            }
        }
    }

    Swap(array, i, j) 
    { 
        this.perm_queue.enqueue([OPERATION.SWAP, i, j]); 
        this.perm_queue.enqueue([OPERATION.RESET, i, j]); 
        ArrayUtils.Swap(array, i, j);
    }

    Compare(array, i, j) 
    { 
        this.perm_queue.enqueue([OPERATION.COMP, i, j]); 
        this.perm_queue.enqueue([OPERATION.RESET, i, j]); 

        if(array[i] > array[j]) return 1;
        else if(array[i] < array[j]) return -1;
        else return 0;
    }

    CompareVal(array, i, val) 
    { 
        this.perm_queue.enqueue([OPERATION.COMP_VAL, i, val]); 
        this.perm_queue.enqueue([OPERATION.RESET_I, i, 0]); 

        if(array[i] > val) return 1;
        else if(array[i] < val) return -1;
        else return 0;
    }
    
    Replace(array, i, j) 
    { 
        this.perm_queue.enqueue([OPERATION.REPLACE, i, j]); 
        this.perm_queue.enqueue([OPERATION.RESET, i, j]); 
        array[i] = array[j];
    }
    
    ReplaceVal(array, i, val) 
    { 
        this.perm_queue.enqueue([OPERATION.REPLACE_VAL, i, val]); 
        this.perm_queue.enqueue([OPERATION.RESET_I, i, 0]); 
        array[i] = val;
    }

    Finish() 
    {
        this.perm_queue.enqueue([OPERATION.FINISH, 0, 0]);
    }

}