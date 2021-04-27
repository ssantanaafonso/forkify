//http://forkify-api.herokuapp.com/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
    //const query = searchView.getInput();
    const query = 'pizza'
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
      recipeView.clearRecipe();
      

      //Highlight selected
      renderLoader(elements.recipe);
      if (state.search) searchView.highlightSelected(id);

      //Create new recipe object
      state.recipe = new Recipe(id);
      window.r = state.recipe;

      

      try{

         
         //Get recipe Data
         await state.recipe.getRecipe();
         //Calculate servings and time
         state.recipe.calcTime();
         state.recipe.calcServings();
         state.recipe.parseIngredients();
         
         clearLoader();
         //Render recipe
         recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

         //recipeView.renderRecipe();
      }catch(e){
         //alert('Error processing recipe');
         alert(e);
      }
      
      
   }
   
 };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/** 
* LIST CONTROLLER
*/

const controlList = () => {
   //Create a new list IF there is none yet
   if(!state.list) state.list = new List();

   //Add each ingredient to the list
   state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderItem(item);
   })
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.itemid;
   //Handle the delete button
   if (e.target.matches('.shopping__delete, .shopping__delete *')){
      //delete from STATE
         state.list.deleteItem(id)
      //delete from UI
         listView.deleteItem(id)
   //Handle count update
   }else if(e.target.matches('.shopping__count-value')){
      if(e.target.value > 1){
         const val = paseFloat(e.target.value, 10);
         state.list.updateCount(id, val);
      }
      
   }
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
* LIKE CONTROLLER
*/


const controlLike = () => {
   if (!state.likes) state.likes = new Likes();
   const currentId = state.recipe.id;

   //User has NOT yet liked current recipe
   if(!state.likes.isLiked(currentId)){
      //Add like to state.likes
      const newLike = state.likes.addLike(
         state.recipe.id, 
         state.recipe.title, 
         state.recipe.publisher, 
         state.recipe.image
      );
      //Toggle like buttons
      likesView.toggleLikeBtn(true);
      //Add like to UI
      likesView.renderLike(newLike);


   //User has yet liked current recipe
   }else{
      //Remove like to state.likes
      state.likes.deleteLike(state.recipe.id);
      //Toggle like buttons
      likesView.toggleLikeBtn(false);
      //Remove like to UI
      likesView.removeLike(state.recipe.id);
   }
   likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page loader
window.addEventListener('load', () => {
   state.likes = new Likes();
   //Restore likes
   state.likes.readStorage();
   //Toggle button
   likesView.toggleLikeMenu(state.likes.getNumLikes());

   //Render likes
   state.likes.likes.forEach(like => {
      likesView.renderLike(like);
   })
});



 elements.recipe.addEventListener('click', e => {
   if(e.target.matches('.btn_decrease, .btn_decrease *')){
      // Decrease button clicked
      if (state.recipe.servings > 1){
         state.recipe.updateServings('dec');
         
      }
   }else if(e.target.matches('.btn_increase, .btn_increase *')){
       // Increase button clicked
      state.recipe.updateServings('inc')

   }else if(e.target.matches('.recipe__btn--add')){
      //aDD INGREDIENT TO SHOPP LIST
      controlList();
   }else if(e.target.matches('.recipe__love, .recipe__love *')){
      //likeController
      controlLike();
   }

   recipeView.updateServingsIngredients(state.recipe)

 });

 window.l = new List();


