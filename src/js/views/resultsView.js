import View from './View.js';
import previewView from './previewView.js';

// importing images for parcel 1
// import icons from '../img/icons.svg';
// importing images for parcel 2
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    // we need to call render instead of generateMarkup because we need render to set the data property
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
