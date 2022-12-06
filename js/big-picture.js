import { isEscKey } from './utils.js';

const NUMBER_OF_INITIAL_COMMENTS = 5;
const NUMBER_OF_COMMENTS_TO_RENDER = 5;

const pictureModalElement =  document.querySelector('.big-picture');
const commentCountLement = document.querySelector('.comments-count');
const imageElement = document.querySelector('.big-picture__img img');
const likesCountElement = document.querySelector('.likes-count');
const descriptionElement = document.querySelector('.social__caption');
const buttonCloseElement = document.querySelector('#picture-cancel');
const commentListElement = document.querySelector('.social__comments');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
const currentCommentsCountElement = pictureModalElement.querySelector('.social__comment-count');
const commentsLoaderElement = pictureModalElement.querySelector('.social__comments-loader');

let currentComments; // массив для комментариев под текущей фотографией
let currentCommentsNumber; // число комментариев под текущей фотографией
let commentsRendered = 0; // число показанных комментариев

const renderComment = (comment) => {
  const commentElement = commentTemplate.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__picture').alt = comment.name;
  commentElement.querySelector('.social__text').textContent = comment.message;
  commentListElement.appendChild(commentElement);
};

const renderComments = (number) => {
  let numberOfComments = typeof number === 'undefined' ? NUMBER_OF_COMMENTS_TO_RENDER : number;
  do  {
    renderComment(currentComments[commentsRendered]);
    commentsRendered++;
    numberOfComments--;
  } while (numberOfComments > 0 && commentsRendered !== currentCommentsNumber);
  if (commentsRendered === currentCommentsNumber) {commentsLoaderElement.classList.add('hidden');}
  currentCommentsCountElement.textContent = `Показано ${commentsRendered} из ${currentCommentsNumber} комментариев`;
};

const onLoadClick = () => {
  renderComments();
};

const closePictureModal =  () => {
  pictureModalElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  currentCommentsCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  commentsLoaderElement.removeEventListener('click', renderComments);
  document.removeEventListener('keydown', onPictureModalKeydown);
};

const onPictureModalCloseClick = () => {
  closePictureModal();
};

function onPictureModalKeydown (evt) {
  if(isEscKey(evt.key)) {
    evt.preventDefault();
    closePictureModal();
  }
}

const openPictureModal = ({url, likes, comments, description}) => {
  document.body.classList.add('modal-open');
  pictureModalElement.classList.remove('hidden');
  imageElement.src = url;
  commentCountLement.textContent = comments.length;
  likesCountElement.textContent = likes;
  descriptionElement.textContent = description;
  currentCommentsCountElement.classList.remove('hidden');
  commentListElement.textContent = '';
  commentsRendered = 0;
  currentComments = comments;
  currentCommentsNumber = currentComments.length;
  if (comments.length <= NUMBER_OF_INITIAL_COMMENTS) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
    commentsLoaderElement.addEventListener('click', onLoadClick);
  }
  const initialCommentsNumber = currentCommentsNumber <= NUMBER_OF_INITIAL_COMMENTS ? currentCommentsNumber : NUMBER_OF_INITIAL_COMMENTS;
  renderComments(initialCommentsNumber);
  document.addEventListener('keydown', onPictureModalKeydown);
  buttonCloseElement.addEventListener('click', onPictureModalCloseClick, {once: true});
};

export {openPictureModal};
