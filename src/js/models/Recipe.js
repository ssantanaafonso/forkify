import axios from 'axios';

export default class Recipe {

    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const answer = await axios(`http://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.publisher = answer.data.recipe.publisher;
            this.ingredients = answer.data.recipe.ingredients;
            this.source_url = answer.data.recipe.source_url;
            this.image = answer.data.recipe.image_url;
            this.rank = answer.data.recipe.social_rank;
            this.pub_url = answer.data.recipe.publisher_url;
            this.title = answer.data.recipe.title;

        }catch(e){
            alert(e);
        }
    }

    calcTime(){
        //Asuming 15 minutes per ingredient
        this.time = Math.ceil(this.ingredients.length/3)*15;
    }

    calcServings(){
        this.servings = 4;
    }

}