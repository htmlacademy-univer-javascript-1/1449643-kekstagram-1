import { openPictureModal } from './big-picture.js';
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
const imgFiltersForm = document.querySelector('.img-filters__form');
const imgFilters = document.querySelector('.img-filters');

let selectedFilter = 'filter-default', picturesToRender, renderedPictures = [];

const appendPicture = (picture) => {
  const { id, url, likes, comments } = picture;
  const pictureElement = photoTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.dataset.id = id;
  picturesFragment.appendChild(pictureElement);
  renderedPictures.push(pictureElement);
};

const removePicture = (picture) => {
  picturesListElement.removeChild(picture);
};

const clearPictures = () => {
  renderedPictures.forEach((picture) => removePicture(picture));
  renderedPictures = [];
};

const renderPictures = () => {
  clearPictures();
  picturesToRender.forEach(appendPicture);
  picturesListElement.appendChild(picturesFragment);
  picturesListElement.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const clickedPicture = picturesToRender.find(({ id }) => Number(pictureElement.dataset.id) === id);
      openPictureModal(clickedPicture);
    }
  });
};

const setActive = (button) => {
  buttonFilterDefault.classList.remove('img-filters__button--active');
  buttonFilterRandom.classList.remove('img-filters__button--active');
  buttonFilterDiscussed.classList.remove('img-filters__button--active');
  button.classList.add('img-filters__button--active');
};

const initializeFilters = (pictures) => {
  imgFilters.classList.remove('img-filters--inactive');
  picturesToRender = pictures;
  renderPictures();
  imgFiltersForm.addEventListener('click', (evt) => {
    const defaultPictures = Array.from(pictures);
    const randomPictures =  Array.from(pictures);
    const discussedPictures = Array.from(pictures).sort((a, b) => b.comments.length - a.comments.length);
    const newFilter = evt.target.id;
    const renderWithDelay = debounce(renderPictures, DELAY_VALUE);
    switch(newFilter) {
      case 'filter-default':
        setActive(buttonFilterDefault);
        picturesToRender = defaultPictures;
        break;
      case 'filter-random':
        setActive(buttonFilterRandom);
        picturesToRender = faker.helpers.shuffle(randomPictures).slice(0, NUMBER_OF_RANDOM_PICTURES);
        break;
      case 'filter-discussed':
        setActive(buttonFilterDiscussed);
        picturesToRender = discussedPictures;
        break;
    }
    if(selectedFilter !== newFilter) {
      selectedFilter = newFilter;
      renderWithDelay();
    }
  });
};

export { initializeFilters };
