import { isEscKey } from './utils.js';

const pictureModalElement =  document.querySelector('.big-picture');
const commentCountLement = document.querySelector('.comments-count');
const imageElement = document.querySelector('.big-picture__img img');
const likesCountElement = document.querySelector('.likes-count');
const descriptionElement = document.querySelector('.social__caption');
const buttonCloseElement = document.querySelector('#picture-cancel');
const commentListElement = document.querySelector('.social__comments');
const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

const renderComments = (comments) => {
  commentListElement.innerHTML = '';
  const commentsFrament = document.createDocumentFragment();
  comments.forEach(({avatar, name, message}) => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = avatar;
    commentElement.querySelector('.social__picture').alt = name;
    commentElement.querySelector('.social__text').textContent = message;
    commentsFrament.appendChild(commentElement);
  });
  commentListElement.appendChild(commentsFrament);
};

const closePictureModal =  () => {
  pictureModalElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onPictureModalKeydown = (evt) => {
  if(isEscKey(evt.key)) {
    closePictureModal();
  }
};

const onPictureModalCloseClick = () => {
  closePictureModal();
};

const openPictureModal = ({url, likes,comments, description}) => {
  document.body.classList.add('modal-open');
  pictureModalElement.classList.remove('hidden');
  imageElement.src = url;
  commentCountLement.textContent = comments.length;
  likesCountElement.textContent = likes;
  descriptionElement.textContent = description;
  renderComments(comments);
  document.addEventListener('keydown', onPictureModalKeydown);
  buttonCloseElement.addEventListener('click', onPictureModalCloseClick, {once: true});
};

export {openPictureModal};

