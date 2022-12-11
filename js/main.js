import {renderPictures} from './pictures.js';
import './image-upload.js';
import {getDataFromServer} from './network.js';

const body = document.querySelector('body');

const showDownloadErrorMessage = () => {
  const errorDiv = document.createElement('div');
  errorDiv.style.zIndex = '50';
  errorDiv.style.backgroundColor = 'rgba(65, 65, 65)';
  errorDiv.style.position = 'fixed';
  errorDiv.style.left = '35%';
  errorDiv.style.top = '35%';
  errorDiv.style.width = '30%';
  errorDiv.style.height = '30%';
  errorDiv.style.display = 'flex';
  errorDiv.style.alignItems = 'center';
  errorDiv.style.fontSize = '22px';
  errorDiv.style.lineHeight = '1.5';
  errorDiv.style.textAlign = 'center';
  errorDiv.style.color = '#e9dc45';
  errorDiv.style.borderRadius = '15px';
  errorDiv.textContent = 'Что-то пошло не так! Проверьте подключение к Интернету и перезагрузите страницу.';
  body.appendChild(errorDiv);
};

getDataFromServer((pictures) => {
  renderPictures(pictures);
},
() => {
  showDownloadErrorMessage();
});
