class SortingAlgorithms {

    static bubble_sort() {
        let n = visualizer.array.length;
        for(let i = 1; i < n; ++i) {
            for(let j = 0; j < n - i; ++j) {
                if(visualizer.compare(j, j + 1) > 0) {
                    visualizer.swap(j, j + 1);
                }
            }
        }
    }
    
    static selection_sort() {
        let n = visualizer.array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (visualizer.compare(i, j) > 0) {
                    visualizer.swap(i, j);
                }
            }
        }   
    }
    
    static insertion_sort() {
        let n = visualizer.array.length;
        for (let i = 1; i < n; i++) {
            let key = visualizer.array[i];
            let j = i - 1;
            while (j >= 0 && visualizer.compare_val(j, key) > 0) {
                visualizer.replace(j + 1, j);
                j = j - 1;
            }
            visualizer.replace_val(j + 1, key);
        }
    }
    
    static cocktail_sort() { 
        let swapped = true; 
        let start = 0; 
        let end = visualizer.array.length; 

        while (swapped == true) { 

            swapped = false; 
            for (let i = start; i < end - 1; ++i) { 
                if (visualizer.compare(i, i + 1) > 0) { 
                    visualizer.swap(i, i + 1);
                    swapped = true; 
                } 
            } 

            if (swapped == false) 
                break; 

            swapped = false; 
            end = end - 1; 
            for (let i = end - 1; i >= start; --i) { 
                if (visualizer.compare(i, i + 1) > 0) { 
                    visualizer.swap(i, i + 1);
                    swapped = true; 
                } 
            } 

            start = start + 1; 
        } 
    } 

}