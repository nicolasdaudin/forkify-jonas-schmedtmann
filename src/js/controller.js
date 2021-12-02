import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';

if (module.hot) {
  module.hot.accept();
}
const recipeContainer = document.querySelector('.recipe');

// app: https://forkify-v2.netlify.app/
// API: https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// LOADING A RECIPE FROM THE API
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Update bookmarks so that we see the right bookmark selected in the bookmark panel
    bookmarksView.update(model.state.bookmarks);

    // 2) loading the recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);

    recipeView.renderError();
  }
};

// SEARCH RECIPES
const controlSearchResults = async function () {
  try {
    // console.log('controlSearchResults query', query);
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    // we pass everything from the state search
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlServings = function (newServings) {
  // update the recipe servings in state
  model.updateServings(newServings);

  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add-remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render
    recipeView.render(model.state.recipe);

    // display success message
    addRecipeView.renderMessage();

    // render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // we don't use 'update' cause we really want to add a new bookmark and for this we need a new render

    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // change the url without reloading the page

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error('🛑', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const newFeature = function () {
  console.log('welcome to the app');
};

/* 
  1. TODO: [EASY] display number of pages between the pagination buttons
  2. TODO: [EASY] ability to sort search results by duration or number of ingrediemts (info not available in the search results by now, only title, image, key, publisher and id)
  3. TODO: [EASY] perform ingredient validation in view, before submitting the form
  4. TODO: [EASY] Improve recipe ingredient input: separate in multiple fields and allow more than 6 ingrdients
  5. TODO: [MEDIUM] Shopping lis feature: button on recipe to add ingredients to a list. And then besides the bookmarks panel an other hidden panel with the list of ingredients (and the number + unit?()
  6. TODO: [MEDIUM] Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calendar. For example a simple drow down on the recipe to select a day and then besides the bookmarks panel, another hidden panel to show the 7 meals planned
  7. TODO: [MEDIUM] get nutrition data on each ingredient from spoonacular API and calculate for example the total calories of recipe



*/
