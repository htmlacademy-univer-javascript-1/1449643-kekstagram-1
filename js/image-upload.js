import {isEscKey} from './utils.js';

const MAX_HASHTAGS_NUM = 5;
const MAX_COMMENT_LENGTH = 140;

const fileUploadButton = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const imageUploadForm = document.querySelector('.img-upload__form');
const textHashtags = imageUploadForm.querySelector('.text__hashtags');
const textDescription = imageUploadForm.querySelector('.text__description');
const closeFormButton = document.querySelector('#upload-cancel');

const regexValidHashtag = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)/; // корректный хештэг

const hasDuplicates = (hashtags) => new Set(hashtags).size !== hashtags.length;

const checkHashtagsInput = (value) => {
  if(value === '') {
    return true;
  }
  const separatedHashtags = value.split(' ');
  if (separatedHashtags.length > MAX_HASHTAGS_NUM) {
    return false;
  }
  const values = separatedHashtags.map((element) => element.toLowerCase());
  if (hasDuplicates(values)) {
    return false;
  }
  return separatedHashtags.every((element) => regexValidHashtag.test(element));
};

const checkHashtags = (value) => checkHashtagsInput(value);

const checkComments = (value) => value.length <= MAX_COMMENT_LENGTH;

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
}, true);

pristine.addValidator(
  textHashtags,
  checkHashtags,
  'Некорректно указаны хештэги'
);

pristine.addValidator(
  textDescription,
  checkComments,
  `Максимальная длина комментария ${MAX_COMMENT_LENGTH} символов`
);

imageUploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if(!isValid) {
    evt.preventDefault();
  }
});

const closeOverlay = () => {
  imageUploadForm.reset();
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onEscKeydown = (evt) => {
  if (isEscKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription) {
    evt.preventDefault();
    closeOverlay();
  }
};

const onCloseClick = () => {
  closeOverlay();
};

fileUploadButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscKeydown);
  closeFormButton.addEventListener('click', onCloseClick, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');
});
