import axios from 'axios';

export default class Search{

    constructor(query){
        this.query = query;
        
    }

    async getResults(){
        try{
            const answer = await axios(`http://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = answer.data.recipes;
        }catch(e){
            alert(e);
        }
    }

}