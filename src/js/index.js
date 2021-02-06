//http://forkify-api.herokuapp.com/

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 const state = {};

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


        // 4) Search for recipes
        await state.search.getResults();

        clearLoader();

        // 5) Render results
        console.log(state.search.result);
        searchView.renderResults(state.search.result);
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
      searchView.clearResults();
      searchView.renderResults(state.search.result, parseInt(goToPage));
   }
   
 });
