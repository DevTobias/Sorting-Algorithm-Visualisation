class SortingAlgorithms {

    static bubble_sort() {
        let n = visualizer.array.length;
        let array = visualizer.array.slice();

        for(let i = 1; i < n; ++i) {
            for(let j = 0; j < n - i; ++j) {
                if(visualizer.compare(array, j, j + 1) > 0) {
                    visualizer.swap(array, j, j + 1);
                }
            }
        }
    }
    
    static selection_sort() {
        let n = visualizer.array.length;
        let array = visualizer.array.slice();

        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (visualizer.compare(array, i, j) > 0) {
                    visualizer.swap(array, i, j);
                }
            }
        }   
    }
    
    static insertion_sort() {
        let n = visualizer.array.length;
        let array = visualizer.array.slice();

        for (let i = 1; i < n; i++) {
            let key = visualizer.array[i];
            let j = i - 1;
            while (j >= 0 && visualizer.compare_val(array, j, key) > 0) {
                visualizer.replace(array, j + 1, j);
                j = j - 1;
            }
            visualizer.replace_val(array, j + 1, key);
        }
    }
    
    static cocktail_sort() { 
        let swapped = true; 
        let start = 0; 
        let end = visualizer.array.length; 
        let array = visualizer.array.slice();

        while (swapped == true) { 

            swapped = false; 
            for (let i = start; i < end - 1; ++i) { 
                if (visualizer.compare(array, i, i + 1) > 0) { 
                    visualizer.swap(array, i, i + 1);
                    swapped = true; 
                } 
            } 

            if (swapped == false) 
                break; 

            swapped = false; 
            end = end - 1; 
            for (let i = end - 1; i >= start; --i) { 
                if (visualizer.compare(array, i, i + 1) > 0) { 
                    visualizer.swap(array, i, i + 1);
                    swapped = true; 
                } 
            } 

            start = start + 1; 
        } 
    } 

    static comb_sort() { 

        function get_next_gap(gap) { 
            gap = Math.trunc((gap * 10) / 13); 
            if (gap < 1) return 1; 
            return gap; 
        } 

        let n = visualizer.array.length;
        let array = visualizer.array.slice();
        let gap = n; 
        let swapped = true; 

        while (gap != 1 || swapped == true) { 
            gap = get_next_gap(gap); 
            swapped = false; 
  
            for (let i = 0; i < n - gap; ++i) { 
                console.log(i + gap);
                if (visualizer.compare(array, i, i + gap) > 0) { 
                    visualizer.swap(array, i, i + gap);
                    swapped = true; 
                } 
            } 
        } 

        console.log(array);
    } 

}