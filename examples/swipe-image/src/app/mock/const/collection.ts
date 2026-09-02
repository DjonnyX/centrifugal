import { IVirtualListCollection } from 'centrifugal';
import { ISwipeImage } from "@widgets/swipe-image";
import { generateWord } from "../utils";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateChatCollection = () => {
  const items: IVirtualListCollection = [];

  for (let i = 0, l = 10 + Math.random() * 200; i < l; i++) {
    const id = i + 1;
    items.push({ id, text: `${generateWord(30, true)}` });
  }
  return items;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const COLLECTION_PARAMS = {
  maxDate: Date.now(),
  index: 0,
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<ISwipeImage> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1;

    COLLECTION_PARAMS.index++;

    items.push({
      id,
      version: 0,
      img: `https://centrifugal-swipe-image.eugene-grebennikov.pro/assets/img_%20${1 + Math.round( Math.random() * 25)}.jpg`,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
