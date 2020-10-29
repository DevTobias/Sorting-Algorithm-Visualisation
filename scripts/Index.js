// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//      Main function / global var
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var visualizer = new SortingVisualizer();


$(function() 
{
    $('#swap_ani_cb').prop('checked', true);
    $('#color_ani_cb').prop('checked', true);
    RenderNewArray();
});


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//      User input
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function Render() 
{
    visualizer.RenderArray();
}

function RenderNewArray() 
{
    $("#resume_btn").addClass('btn_disabled');
    $("#stop_btn").addClass('btn_disabled');
    visualizer.ReloadSettings();
    visualizer.RenderArray();
}

function ReloadAnimationSettings()
{
    visualizer.ReloadAnimationSettings();
}

function ReloadFPSSettings()
{
    visualizer.ReloadFPSSettings();
}

function StartSorting() 
{
    $("#stop_btn").removeClass('btn_disabled');
    $("#resume_btn").addClass('btn_disabled');
    $("#create_btn").addClass('btn_disabled');
    visualizer.StartAnimation();
}

function StopSorting() 
{
    $("#resume_btn").removeClass('btn_disabled');
    $("#create_btn").removeClass('btn_disabled');
    $("#stop_btn").addClass('btn_disabled');
    visualizer.StopAnimation();
}

function ResetButtons()
{
    $("#create_btn").removeClass('btn_disabled');
    $("#resume_btn").addClass('btn_disabled');
    $("#stop_btn").addClass('btn_disabled');
}

function ResumeAnimation() 
{
    $("#resume_btn").addClass('btn_disabled');
    $("#create_btn").addClass('btn_disabled');
    $("#stop_btn").removeClass('btn_disabled');
    visualizer.ResumeAnimation();
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––
//      Sorting algorithm selection
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function ClearActiveNavbar() 
{
    StopSorting();
    $('#bubble_btn').removeClass('active');
    $('#insert_btn').removeClass('active');
    $('#select_btn').removeClass('active');   
    $('#cocktail_btn').removeClass('active');   
    $('#comb_btn').removeClass('active');   

    visualizer.StopAnimation(); 
    $("#resume_btn").addClass('btn_disabled');
}

function SelectBubblesort() 
{
    visualizer.sorting_algorithm = SORTING_ALGORITHMS.BUBBLESORT;
    ClearActiveNavbar();
    $('#bubble_sort').addClass('active');
    $('#sort_header').html("BUBBLE SORT");   
}

function SelectInsertionsort() 
{   
    visualizer.sorting_algorithm = SORTING_ALGORITHMS.INSERTIONSORT;
    ClearActiveNavbar();
    $('#insert_btn').addClass('active');
    $('#sort_header').html("INSERTION SORT");  
}

function SelectSelectionsort() 
{
    visualizer.sorting_algorithm = SORTING_ALGORITHMS.SELECTIONSORT;
    ClearActiveNavbar();
    $('#select_btn').addClass('active');
    $('#sort_header').html("SELECTION SORT");   
}

function SelectCocktailsort() 
{
    visualizer.sorting_algorithm = SORTING_ALGORITHMS.SHAKERSORT;
    ClearActiveNavbar();
    $('#cocktail_btn').addClass('active');
    $('#sort_header').html("COCKTAIL SORT");   
}

function SelectCombsort() 
{
    visualizer.sorting_algorithm = SORTING_ALGORITHMS.COMBSORT;
    ClearActiveNavbar();
    $('#comb_btn').addClass('active');
    $('#sort_header').html("COMB SORT");   
}