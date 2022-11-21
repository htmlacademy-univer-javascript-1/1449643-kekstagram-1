import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
import {getRandomPositiveInteger} from './utils.js';

const PHOTOS_NUMBER = 25;
const MIN_LIKES_NUMBER  = 15;
const MAX_LIKES_NUMBER  = 200;
const MAX_COMMENTS_NUMBER  = 100;
const MAX_AVATAR_NUM = 6;

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

let commentIndex = 0;
let photoDescriptionIndex = 0;

const getCommentId = () => commentIndex++;

const getPhotoDescriptionId = () => photoDescriptionIndex++;

const createComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomPositiveInteger(1, MAX_AVATAR_NUM)}.svg`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length-1)],
  name: faker.name.firstName()
});

const createPhotoDescription = () => ({
  id: getPhotoDescriptionId(),
  url: `photos/${photoDescriptionIndex}.jpg`,
  description: faker.lorem.paragraph(),
  likes: getRandomPositiveInteger(MIN_LIKES_NUMBER, MAX_LIKES_NUMBER),
  comments: Array.from({length: getRandomPositiveInteger(1,MAX_COMMENTS_NUMBER)}, createComment)
});

const arrayOfPhotos = Array.from({length: PHOTOS_NUMBER}, createPhotoDescription);

export{arrayOfPhotos};
