import {createPhotos} from './data.js';

const picturesListElement = document.querySelector('.pictures');
const picturesFragment = document.createDocumentFragment();
const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');

const appendPicture = (picture) => {
  const {img, likes, comments} = picture;
  const pictureElement = photoTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = img;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  picturesFragment.appendChild(pictureElement);
};

const renderPictures = () => {
  createPhotos().forEach(appendPicture);
  picturesListElement.appendChild(picturesFragment);
};

export {renderPictures};
