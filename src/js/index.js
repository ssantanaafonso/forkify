//http://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 const state = {};

/** 
  * SEARCH CONTROLLER
*/

 const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if( query ){
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare user interface for catching the result
        searchView.clearInput();

        searchView.clearResults();

        renderLoader(elements.searchResultsDiv);

         try{
            // 4) Search for recipes
            await state.search.getResults();

            clearLoader();

            // 5) Render results
            console.log(state.search.result);
            searchView.renderResults(state.search.result);
         }catch(e){
            alert('Something went wrong with the search...');
         }
        
    }
 }

 

 document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
 });

 elements.searchButtonDiv.addEventListener('click', e => {
   const btn = (e.target.closest('button'));
   if(btn){
      const goToPage = btn.dataset.goto;
      searchView.clearButtons();
      searchView.clearResults();
      searchView.renderResults(state.search.result, parseInt(goToPage));
   }
   
 });

/** 
* RECIPE CONTROLLER
*/

const controlRecipe = async () => {
   
   //GET ID from url
   const id = window.location.hash.substring(1);

   if(id){
      //Prepare UI for changes
      //recipeView.clearRecipe();

      //Create new recipe object
      state.recipe = new Recipe(id);

      try{
         //Get recipe Data
         await state.recipe.getRecipe();

         //Calculate servings and time
         state.recipe.calcTime();
         state.recipe.calcServings();

         //Render recipe
         console.log(state.recipe);

         //recipeView.renderRecipe();
      }catch(e){
         alert('Error processing recipe');
      }
      
      
   }
   
 };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


