import {renderPictures, setFilterDefault, switchFilter} from './pictures.js';
import './image-upload.js';
import {getDataFromServer} from './network.js';

const body = document.querySelector('body');
const imgFilters = document.querySelector('.img-filters');

const showDownloadErrorMessage = () => {
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.style.alignItems = 'center';
  errorMessageDiv.style.fontSize = '22px';
  errorMessageDiv.style.lineHeight = '1.5';
  errorMessageDiv.style.textAlign = 'center';
  errorMessageDiv.style.zIndex = '50';
  errorMessageDiv.style.backgroundColor = 'rgba(65, 65, 65)';
  errorMessageDiv.style.position = 'fixed';
  errorMessageDiv.style.left = '35%';
  errorMessageDiv.style.top = '35%';
  errorMessageDiv.style.width = '30%';
  errorMessageDiv.style.height = '30%';
  errorMessageDiv.style.display = 'flex';
  errorMessageDiv.style.color = '#e9dc45';
  errorMessageDiv.style.borderRadius = '15px';
  errorMessageDiv.textContent = 'Что-то пошло не так! Проверьте подключение к Интернету и перезагрузите страницу.';
  body.appendChild(errorMessageDiv);
};

getDataFromServer((pictures) => {
  imgFilters.classList.remove('img-filters--inactive');
  renderPictures(pictures);
  switchFilter(pictures);
  setFilterDefault(pictures);
},
() => {
  showDownloadErrorMessage();
});
