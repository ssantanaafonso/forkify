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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            // 2) Remove parentesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // 3) Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1){
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count
                if (arrCount.length > 1){
                    //2 elements
                    count = eval(arrCount.join('+'));
                    
                }else{
                    //Just 1 element
                    count = eval(arrIng[0].replace('-', '+'));
                    
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };
                
            }else if (parseInt(arrIng[0], 10)){
                //There is NO unit, but first item is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            }else if (unitIndex === -1){
                //There is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings( type ){
        //Servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings/this.servings);
        });

        this.servings = newServings;
    }


}