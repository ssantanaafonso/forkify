import { elements } from './base';
import { limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart': 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //icons.svg#icon-heart-outlined
}

export const toggleLikeMenu = numLikes => {
    console.log(numLikes);
    numLikes > 0 ? elements.likesMenu.style.visibility = 'visible': elements.likesMenu.style.visibility = 'hidden';
}

export const renderLike = like => {
    const template = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${like.title}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', template);
}

export const removeLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`);
    if (el) el.closest('li').remove();
}