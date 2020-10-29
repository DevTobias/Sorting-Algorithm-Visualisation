const SORTING_ALGORITHMS = {
    BUBBLESORT: 0,
    INSERTIONSORT: 1,
    SELECTIONSORT: 2,
    SHAKERSORT: 3,
    COMBSORT: 4,
};

class SortingAlgorithms 
{

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Base functions
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    static Sort(sorting_algorithm) 
    {
        let n = visualizer.array.length;
        let array = visualizer.array.slice();

        switch(sorting_algorithm) 
        {
            case SORTING_ALGORITHMS.BUBBLESORT: this.Bubblesort(array, n); break;
            case SORTING_ALGORITHMS.INSERTIONSORT: this.Insertionsort(array, n); break;
            case SORTING_ALGORITHMS.SELECTIONSORT: this.Selectionsort(array, n); break;
            case SORTING_ALGORITHMS.SHAKERSORT: this.Shakersort(array, n); break;
            case SORTING_ALGORITHMS.COMBSORT: this.Combsort(array, n); break;
            default: this.Bubblesort(array, n);
        }

        visualizer.Finish();
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Bubblesort
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    static Bubblesort(array, n) 
    {
        let swapped; 

        for(let i = 1; i < n; ++i)
        {
            swapped = false;
            for(let j = 0; j < n - i; ++j) 
            {
                if(visualizer.Compare(array, j, j + 1) > 0) 
                {
                    visualizer.Swap(array, j, j + 1);
                    swapped = true;
                }
            }
            if(!swapped) break;
        }
    }

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Selectionsort
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    static Selectionsort(array, n)
    {
        for (let i = 0; i < n - 1; i++) 
        {
            for (let j = i + 1; j < n; j++) 
            {
                if (visualizer.Compare(array, i, j) > 0) 
                {
                    visualizer.Swap(array, i, j);
                }
            }
        }   
    }
   
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Selectionsort
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––– 
    static Insertionsort(array, n) 
    {
        for (let i = 1; i < n; ++i) 
        {
            let key = visualizer.array[i];
            let j = i - 1;
            while (j >= 0 && visualizer.CompareVal(array, j, key) > 0) 
            {
                visualizer.Replace(array, j + 1, j);
                j = j - 1;
            }
            visualizer.ReplaceVal(array, j + 1, key);
        }
    }
 
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Shakersort
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––    
    static Shakersort(array, n) 
    { 
        let swapped = true; 
        let l = 0, r = n;

        while (swapped) 
        { 
            swapped = false; 
            for (let i = l; i < r - 1; ++i) { 
                if (visualizer.Compare(array, i, i + 1) > 0) 
                { 
                    visualizer.Swap(array, i, i + 1);
                    swapped = true; 
                } 
            } 

            if (!swapped) break; 

            swapped = false; --r; 
            for (let i = r - 1; i >= l; --i) 
            { 
                if (visualizer.Compare(array, i, i + 1) > 0) 
                { 
                    visualizer.Swap(array, i, i + 1);
                    swapped = true; 
                } 
            } 
            ++l;
        } 
    } 

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    //      Combsort
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––  
    static Combsort(array, n) 
    { 
        let gap = n; 
        let swapped = true; 

        while (gap != 1 || swapped) 
        { 
            gap = Math.trunc((gap * 10) / 13); 
            if(gap < 1) gap = 1;
            swapped = false; 
  
            for (let i = 0; i < n - gap; ++i) 
            { 
                if (visualizer.Compare(array, i, i + gap) > 0) 
                { 
                    visualizer.Swap(array, i, i + gap);
                    swapped = true; 
                } 
            } 
        } 
    } 

}