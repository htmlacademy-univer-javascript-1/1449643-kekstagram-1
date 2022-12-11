import {isEscKey} from './utils.js';
import {sendDataToServer} from './network.js';

const MAX_HASHTAGS_NUM = 5;
const MAX_COMMENT_LENGTH = 140;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;

const REGEX_VALID_HASHTAG = /(^#[0-9А-Яа-яЁёA-Za-z]{1,19}$)/; // корректный хештэг

const EFFECTS = {
  'chrome': {
    filterName: 'grayscale',
    valueUnit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    connect: 'lower'
  },
  'sepia': {
    filterName: 'sepia',
    valueUnit: '',
    min: 0,
    max: 1,
    start: 1,
    step: 0.1,
    connect: 'lower'
  },
  'marvin': {
    filterName: 'invert',
    valueUnit: '%',
    min: 0,
    max: 100,
    start: 100,
    step: 1,
    connect: 'lower'
  },
  'phobos': {
    filterName: 'blur',
    valueUnit: 'px',
    min: 0,
    max: 3,
    start: 3,
    step: 0.1,
    connect: 'lower'
  },
  'heat': {
    filterName: 'brightness',
    valueUnit: '',
    min: 1,
    max: 3,
    start: 3,
    step: 0.1,
    connect: 'lower'
  },
};

const body = document.querySelector('body');
const fileUploadButton = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const imageUploadForm = document.querySelector('.img-upload__form');
const textHashtags = imageUploadForm.querySelector('.text__hashtags');
const textDescription = imageUploadForm.querySelector('.text__description');
const closeFormButton = document.querySelector('#upload-cancel');
const submitButton = imageUploadForm.querySelector('.img-upload__submit');

const effectLevelSlider = overlay.querySelector('.effect-level__slider');
const effectLevelValue = overlay.querySelector('.effect-level__value');
const imageUploadEffectLevel = overlay.querySelector('.img-upload__effect-level');
const scaleControlSmaller = overlay.querySelector('.scale__control--smaller');
const scaleControlBigger = overlay.querySelector('.scale__control--bigger');
const scaleControlValue = overlay.querySelector('.scale__control--value');
const imageUploadPreview = overlay.querySelector('.img-upload__preview');

const success = document.querySelector('#success').content.querySelector('.success');
const error = document.querySelector('#error').content.querySelector('.error');
const successButton = success.querySelector('.success__button');
const errorButton = error.querySelector('.error__button');

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
  return separatedHashtags.every((element) => REGEX_VALID_HASHTAG.test(element));
};

const checkHashtags = (value) => checkHashtagsInput(value);

const checkComments = (value) => value.length <= MAX_COMMENT_LENGTH;

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-invalid__error'
}, true);

pristine.addValidator(
  textHashtags,
  (value) => checkHashtags(value),
  'Некорректно указаны хештэги'
);

pristine.addValidator(
  textDescription,
  (value) => checkComments(value),
  `Максимальная длина комментария ${MAX_COMMENT_LENGTH} символов`
);

// масштаб

const updateScale = (newValue) => {
  scaleControlValue.value = `${newValue}%`;
  imageUploadPreview.style.transform = `scale(${newValue / 100})`;
};

const removePercentage =() => scaleControlValue.value.replace('%', '');

const onScaleControlBiggerClick = () => {
  if(removePercentage() < MAX_SCALE) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) + SCALE_STEP, 100);
    updateScale(newValue);
  }
};

const onScaleControlSmallerClick = () => {
  if(removePercentage() > MIN_SCALE) {
    const newValue = Math.min(parseInt(scaleControlValue.value, 10) - SCALE_STEP, 100);
    updateScale(newValue);
  }
};

// эффекты

let currentEffect;

const onChangeEffects = (evt) => {
  currentEffect = evt.target.value;
  const effectConfig = EFFECTS[currentEffect];
  if (!effectConfig) {
    imageUploadEffectLevel.classList.add('hidden');
    imageUploadPreview.style.filter = 'none';
    return;
  }
  imageUploadEffectLevel.classList.remove('hidden');
  const {min, max, step} = effectConfig;
  effectLevelSlider.noUiSlider.updateOptions({
    range: {min, max},
    start: max,
    step,
  });
  imageUploadPreview.className = 'img-upload__preview';
  const effectsPreview = evt.target.parentNode.querySelector('.effects__preview');
  imageUploadPreview.classList.add(effectsPreview.getAttribute('class').split('  ')[1]);
};

const onSliderUpdate = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  const effectConfig = EFFECTS[currentEffect];
  imageUploadPreview.style.filter = effectConfig
    ? `${effectConfig.filterName}(${sliderValue}${effectConfig.valueUnit})`
    : '';
};

// submit

const disableSubmitButton = () => {
  submitButton.textContent = 'Подождите...';
  submitButton.disabled = true;
};

const enableSubmitButton = () => {
  submitButton.textContent = 'Опубликовать';
  submitButton.disabled = false;
};

const closeSuccessErrorMessages = () => {
  if (body.contains(error)) {
    body.removeChild(error);
    overlay.classList.remove('hidden');
  }
  if (body.contains(success)) {
    body.removeChild(success);
  }
  document.removeEventListener('keydown', onEscKeydownError);
  document.removeEventListener('click', onClickSuccess);
  successButton.removeEventListener('click', closeSuccessErrorMessages);
  document.removeEventListener('click', onClickError);
  errorButton.removeEventListener('click', closeSuccessErrorMessages);
};

function onClickSuccess (evt) {
  if (evt.target === success) {
    closeSuccessErrorMessages();
  }
}

function onClickError (evt) {
  if (evt.target === error) {
    closeSuccessErrorMessages();
  }
}

function onEscKeydownError (evt) {
  if (isEscKey(evt.key)) {
    closeSuccessErrorMessages();
  }
}

const onFormSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    disableSubmitButton();
    sendDataToServer(
      () => {
        closeOverlay();
        enableSubmitButton();
        document.addEventListener('keydown', onEscKeydownError);
        document.addEventListener('click', onClickSuccess);
        successButton.addEventListener('click', closeSuccessErrorMessages);
        body.appendChild(success);
      },
      () => {
        overlay.classList.add('hidden');
        enableSubmitButton();
        document.addEventListener('keydown', onEscKeydownError);
        document.addEventListener('click', onClickError);
        errorButton.addEventListener('click', closeSuccessErrorMessages);
        body.appendChild(error);
      },
      new FormData(evt.target),
    );
  }
};

function closeOverlay () {
  imageUploadForm.reset();
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
  imageUploadForm.removeEventListener('change', onChangeEffects);
  document.removeEventListener('keydown', onEscKeydown);
  imageUploadForm.removeEventListener('submit', onFormSubmit);
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  effectLevelSlider.noUiSlider.destroy();
  pristine.destroy();
}

imageUploadForm.addEventListener('submit', onFormSubmit);

function onEscKeydown (evt)  {
  if (isEscKey(evt.key) && evt.target !== textHashtags && evt.target !== textDescription && !body.contains(error)) {
    evt.preventDefault();
    closeOverlay();
  }
}

const onCloseClick = () => {
  closeOverlay();
};

fileUploadButton.addEventListener('change', () => {
  document.addEventListener('keydown', onEscKeydown);
  closeFormButton.addEventListener('click', onCloseClick, {once: true});
  document.body.classList.add('modal-open');
  overlay.classList.remove('hidden');

  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  scaleControlValue.value = '100%';

  noUiSlider.create(
    effectLevelSlider, {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      connect: 'lower'
    }
  );
  currentEffect = 'effect-none';
  imageUploadPreview.className = 'img-upload__preview';
  imageUploadPreview.classList.add('effects__preview--none');
  imageUploadForm.addEventListener('change', onChangeEffects);
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
  imageUploadEffectLevel.classList.add('hidden');
  imageUploadPreview.style.transform = 'scale(1)';
  imageUploadPreview.style.filter = 'none';
});
