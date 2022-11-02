import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import {getRandomPositiveInteger} from './utils.js';

const PHOTOS_NUMBER = 25;
const MAX_IMAGE_URL = 25;
const MIN_LIKES_NUMBER  = 15;
const MAX_LIKES_NUMBER  = 200;
const MAX_AVATAR_NUM = 6;

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

let commentIndex = 1;
let photoDescriptionIndex = 1;

const getCommentId = () => commentIndex++;

const getPhotoDescriptionId = () => photoDescriptionIndex++;

const createComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomPositiveInteger(1, MAX_AVATAR_NUM)}`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length-1)],
  name: faker.name.firstName()
});

const createPhotoDescription = () => ({
  id: getPhotoDescriptionId(),
  url: `photos/${getRandomPositiveInteger(1, MAX_IMAGE_URL)}`,
  description: faker.lorem.paragraph(),
  likes: getRandomPositiveInteger(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
  comments: Array.from({length: getRandomPositiveInteger(1,5)}, createComment)
});

const arrayOfPhotos = Array.from({length: PHOTOS_NUMBER}, createPhotoDescription());

export{arrayOfPhotos};
