import { IVirtualListCollection } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { IStoreItem } from "@widgets/online-store";
import { generateText, generateWord } from "../utils";

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
export const textWithImage = (id: number) => {
  return `
  https://centrifugal-online-store.eugene-grebennikov.pro/assets/img-${1 + Math.round(Math.random() * 19)}.png
  ${id}. ${generateText(3)}. 
  `;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IStoreItem> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1,
      isBanner = Math.random() > .95;

    COLLECTION_PARAMS.index++;

    const type = isBanner ? MessageTypes.BANNER : MessageTypes.ITEM;
    items.push({
      id,
      version: 0,
      type,
      isBanner,
      dateTime: COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 2000000,
      price: Math.round(Math.random() * 10),
      text: isBanner ? `BIG SALE` : textWithImage(id),
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
