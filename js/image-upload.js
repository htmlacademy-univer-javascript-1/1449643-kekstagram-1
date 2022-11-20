import {isEscKey} from './utils.js';

const fileUploadButton = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const imageUploadForm = document.querySelector('.img-upload__form');
const textHashtags = imageUploadForm.querySelector('.text__hashtags');
const textDescription = imageUploadForm.querySelector('.text__description');
const closeFormButton = document.querySelector('#upload-cancel');
const submitButton = imageUploadForm.querySelector('.img-upload__submit');

let isHashtagInputValid = true;
let isCommentValid = true;

const regexValidHashtag = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)|(^\s*$)/; // корректный хештэг или пустая строка

const disableSubmitButton = () => {submitButton.disabled = !isHashtagInputValid || !isCommentValid;};

const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

const checkHashtagsInput = (value) => {
  const separateHashtags = value.split(' ');
  if (separateHashtags.length > 5) {return false;}
  const values = separateHashtags.map((e) => e.toLowerCase());
  if (hasDuplicates(values)) {return false;}
  return separateHashtags.every((e) => regexValidHashtag.test(e));
};

const checkHashtags = (value) => {
  isHashtagInputValid = checkHashtagsInput(value);
  disableSubmitButton();
};

const checkComments = (value) => {
  isCommentValid = value.length <= 140;
  disableSubmitButton();
};

const pristine = new Pristine(imageUploadForm, {
  classTo: 'form-group',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'form-group',
  errorTextTag: 'div',
  errorTextClass: 'text-help'
}, true);

pristine.addValidator(
  textHashtags,
  checkHashtags,
  'Некорректно указаны хештэги'
);

pristine.addValidator(
  textDescription,
  checkComments,
  'Максимальная длина комментария 140 символов'
);

imageUploadForm.addEventListener('submit', () => {
  pristine.validate();
});

const closeOverlay = () => {
  fileUploadButton.value = '';
  textDescription.value = '';
  textHashtags.value = '';
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onEscKeydown = (evt) => {
  if (isEscKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription) {closeOverlay();}
};

fileUploadButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscKeydown);
  closeFormButton.addEventListener('click', closeOverlay, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');
});
