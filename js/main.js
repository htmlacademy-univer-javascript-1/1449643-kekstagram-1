/* eslint-disable no-alert */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable no-console */
function randInt(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

randInt(0, 1);

function checkLength(string, maxLenght) {
    return string.length <= maxLenght;
}

checkLength('1', 1);