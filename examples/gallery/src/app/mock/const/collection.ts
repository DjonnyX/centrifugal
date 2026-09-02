import { IVirtualListCollection } from 'centrifugal';
import { IGalleryImage } from "@widgets/gallery";
import { generateWord, generateText } from "../utils";
import { GalleryTypes } from '@shared/enums';

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
  groupIndex: 0,
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IGalleryImage> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1;

    COLLECTION_PARAMS.index++;

    items.push({
      id,
      version: 0,
      type: GalleryTypes.PHOTOS,
      text: ``,
      img: `https://centrifugal-image-gallery.eugene-grebennikov.pro/assets/thumbnails/img_%20${1 + Math.round( Math.random() * 25)}.jpg`,
      dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * (500000 + Math.floor(500000 * Math.random())),
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
