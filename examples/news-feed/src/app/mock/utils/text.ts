const CHARS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] // ['א', 'ב', 'ג', 'ד', 'ה', 'פ', 'ג', 'ח', 'י', 'י', 'ק', 'ל', 'מ', 'נ', 'ו', 'א', 'פ', 'ק', 'ר', 'ס', 'ט', 'ו', 'ו', 'x', 'י', 'ז']; // ;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateLetter = () => {
  return CHARS[Math.round(Math.random() * CHARS.length)];
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateWord = (max = 10, firstLatterAsCap = false) => {
  const length = 5 + Math.floor(Math.random() * max), result = [];
  while (result.length < length) {
    result.push(generateLetter());
  }
  if (firstLatterAsCap && result.length) {
    result[0] = result[0]?.toUpperCase();
  }
  return `${result.join('')}`;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateText = () => {
  const length = 1 + Math.floor(Math.random() * 15), result = [];
  while (result.length < length) {
    result.push(generateWord());
  }
  let firstWord = '';
  for (let i = 0, l = result[0].length; i < l; i++) {
    const letter = result[0].charAt(i);
    firstWord += i === 0 ? letter.toUpperCase() : letter;
  }
  result[0] = firstWord;
  return `${result.join(' ')}.`;
};