import View from './View.js';
import previewView from './previewView.js';

// importing images for parcel 1
// import icons from '../img/icons.svg';
// importing images for parcel 2
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = 'No bookmarks yet. Find a nice recipe and bokmarkt it ;-)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // we need to call render instead of generateMarkup because we need render to set the data property
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
