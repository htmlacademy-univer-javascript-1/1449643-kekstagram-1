import {openPictureModal} from './big-picture.js';
import { debounce } from './utils.js';
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const DELAY_VALUE = 500;
const NUMBER_OF_RANDOM_PICTURES = 10;

const picturesListElement = document.querySelector('.pictures');
const picturesFragment = document.createDocumentFragment();
const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

const buttonFilterDefault = document.querySelector('#filter-default');
const buttonFilterRandom = document.querySelector('#filter-random');
const buttonFilterDiscussed = document.querySelector('#filter-discussed');
// const imgFiltersForm = document.querySelector('.img-filters__form');

// const FILTERS = {
// 'filter-default': buttonFilterDefault,
// 'filter-random': buttonFilterRandom,
// 'filter-discussed': buttonFilterDiscussed,
// };

let renderedPictures = [];

const removePicture = (picture) => {
  picturesListElement.removeChild(picture);
};

const clearPictures = () => {
  renderedPictures.forEach((picture) => removePicture(picture));
  renderedPictures = [];
};

const appendPicture = (picture) => {
  const {id, url, likes, comments} = picture;
  const pictureElement = photoTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.dataset.id = id;
  picturesFragment.appendChild(pictureElement);
  renderedPictures.push(pictureElement);
};

const renderPictures = (pictures) => {
  clearPictures();
  pictures.forEach(appendPicture);
  picturesListElement.appendChild(picturesFragment);
  picturesListElement.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const clickedPicture = pictures.find(({id}) => Number(pictureElement.dataset.id) === id);
      openPictureModal(clickedPicture);
    }
  });
};

const setFilterDefault = (pictures) => {
  buttonFilterRandom.classList.remove('img-filters__button--active');
  buttonFilterDiscussed.classList.remove('img-filters__button--active');
  buttonFilterDefault.classList.add('img-filters__button--active');
  debounce(renderPictures(pictures), DELAY_VALUE);
};

const setFilterRandom = (pictures) => {
  buttonFilterDefault.classList.remove('img-filters__button--active');
  buttonFilterDiscussed.classList.remove('img-filters__button--active');
  buttonFilterRandom.classList.add('img-filters__button--active');
  let picturesToRender = faker.helpers.shuffle(pictures);
  picturesToRender = picturesToRender.slice(0, NUMBER_OF_RANDOM_PICTURES);
  debounce(renderPictures(picturesToRender), DELAY_VALUE);
};

const setFilterDiscussed = (pictures) => {
  buttonFilterDefault.classList.remove('img-filters__button--active');
  buttonFilterRandom.classList.remove('img-filters__button--active');
  buttonFilterDiscussed.classList.add('img-filters__button--active');
  const picturesToRender = pictures.sort((a, b) => b.comments.length - a.comments.length);
  debounce(renderPictures(picturesToRender), DELAY_VALUE);
};

const switchFilter = (pictures) => {
  buttonFilterDefault.addEventListener('click', setFilterDefault(pictures));
  buttonFilterRandom.addEventListener('click', setFilterRandom(pictures));
  buttonFilterDiscussed.addEventListener('click', setFilterDiscussed(pictures));
};

export {renderPictures, switchFilter, setFilterDefault};
