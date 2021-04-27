export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchResultsList: document.querySelector('.results__list'),
    searchResultsDiv: document.querySelector('.results'),
    searchButtonDiv: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')


};

export const elementStrings = {
    loader: 'loader',
    prevButton: 'results__btn--prev',
    nextButton: 'results__btn--next'
};

export const renderLoader = parent => {
     const loader = `
         <div class = "${elementStrings.loader}">
             <svg>
                 <use href= "img/icons.svg#icon-cw"></use> 
             </svg>
         </div>
     `; 
     parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {

    const loader = document.querySelector(`.${elementStrings.loader}`);
    if( loader ) loader.parentElement.removeChild(loader);

}