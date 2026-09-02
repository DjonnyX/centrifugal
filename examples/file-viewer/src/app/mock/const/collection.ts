import { IVirtualListCollection } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { IFileViewerItem } from "@widgets/file-viewer";
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
  https://centrifugal-file-viewer.eugene-grebennikov.pro/assets/thumbnails/img_%20${1 + Math.round(Math.random() * 25)}.jpg
  ${id}. ${generateText(10)}. 
  `;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IFileViewerItem> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1;

    COLLECTION_PARAMS.index++;

    items.push({
      id,
      version: 0,
      type: MessageTypes.ITEM,
      dateTime: COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 2000000,
      text: textWithImage(id),
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
