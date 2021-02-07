import { elements, elementStrings } from './base';
export const getInput = () => {
    return elements.searchInput.value;
}

const renderRecipe = recipe => {
    const markup = 
    `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
    
}

const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit){
        const newTitle = [];
        const arr = title.split(' ');
        arr.reduce((a, b) => {
            if ((a + b.length) <= limit){
                newTitle.push(b);
            }
                
            return a+b.length;
                
            
        }, 0);

        //Return result
        return `${newTitle.join(' ')} ...`;
    }

    return title;
}


export const clearInput = () => elements.searchInput.value = '';
    
export const clearResults = () => elements.searchResultsList.innerHTML = '';


const renderButtons = ( page, maxPage ) => {
    if(maxPage === 0 || maxPage === 1){
        return 0;
    }
    console.log(page);
    switch (page) {
       
        case 1:
            renderButtonNext(page+1);
            break;
        case maxPage:
            renderButtonPrev(page-1);
            break;
    
        default:
            renderButtonNext(page+1);
            renderButtonPrev(page-1);
            break;
    }
};

const renderButtonNext = (page) => {
    const button =    `<button class="btn-inline ${elementStrings.nextButton}" data-goto=${page}>
                    <span>Page ${page}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </button>`;
    elements.searchButtonDiv.insertAdjacentHTML('beforeend', button);
}

const renderButtonPrev = (page) => {
    const button =    `<button class="btn-inline ${elementStrings.prevButton}" data-goto=${page}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-left"></use>
                    </svg>
                    <span>Page ${page}</span>
                </button>`;
    elements.searchButtonDiv.insertAdjacentHTML('afterbegin', button);
}

export const clearButtons = () =>{
    elements.searchButtonDiv.innerHTML = '';
}


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, Math.round(recipes.length/10));

};