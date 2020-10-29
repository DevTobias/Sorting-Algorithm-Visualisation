const KEY_CONFIG = {
    MANY_UNIQUE: 0,
    FEW_UNIQUE: 1,
};

const SORTING_CONFIG = {
    RANDOM: 0,
    ASCENDING: 1,
    MAINLY_ASCENDING: 2,
    DESCENDING: 3,
    MAINLY_DESCENDING: 4,
};

class ArrayUtils 
{
    static Swap(array, i, j) 
    {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    static GetRandomInt(max_value) 
    {
        return Math.floor(Math.random() * Math.floor(max_value));
    }

    static Shuffle(array, p) 
    {
        let current_index = array.length;
        while (0 !== --current_index)
        {
            if((this.GetRandomInt(100) / 100) <= p) 
            {
                this.Swap(array, current_index, this.GetRandomInt(current_index));
            }
        }
    }   

    static MainlyShuffleArray(array) 
    {
        let current_index = array.length;
        while (1 !== --current_index) 
        {
            this.Swap(array, current_index, current_index - this.GetRandomInt(3));
        }
    }

    static GetUniqueArray(amount_elements)
    {
        let array = [];
        for(let i = 1; i <= amount_elements; ++i) 
        {
            array.push(i);
        } 
        return array;
    }

    static GetMainlyUniqueArray(p, amount_elements) 
    {
        let array = [];
        for(let i = 1; i <= amount_elements; ++i) 
        {
            let rand = this.GetRandomInt(p);
            for(let j = i; j <= i + rand; ++j) 
            {
                array.push(i);
            }
            i += rand;
        }
        array[array.length - 1] = array.length;
        return array;
    }

    static GetArray(sorting_mode, key_mode, amount_elements) 
    {
        let array;
 
        switch(eval('KEY_CONFIG.' + key_mode)) 
        {
            case KEY_CONFIG.MANY_UNIQUE: array = this.GetMainlyUniqueArray(amount_elements / 11, amount_elements); break;
            case KEY_CONFIG.FEW_UNIQUE: array = this.GetMainlyUniqueArray(amount_elements / 5, amount_elements); break;
            default: array = this.GetUniqueArray(amount_elements); break;
        }
        
        switch(eval('SORTING_CONFIG.' + sorting_mode)) 
        {
            case SORTING_CONFIG.RANDOM: this.Shuffle(array, 1); break;
            case SORTING_CONFIG.MAINLY_ASCENDING: this.MainlyShuffleArray(array); break;
            case SORTING_CONFIG.DESCENDING: array.reverse(); break;
            case SORTING_CONFIG.MAINLY_DESCENDING: this.MainlyShuffleArray(array.reverse(), 0.2); break;
        }
        
        return array;
    }

}