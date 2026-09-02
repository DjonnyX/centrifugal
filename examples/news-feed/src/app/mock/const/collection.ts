import { IVirtualListCollection } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { IPost } from "@widgets/news-feed";
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
  groupIndex: 0,
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const textWithImage = () => {
  return `
  https://centrifugal-news-feed.eugene-grebennikov.pro/assets/img_%20${1 + Math.round( Math.random() * 25)}.jpg
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
  `;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IPost> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1;

    COLLECTION_PARAMS.index++;

    const type = MessageTypes.POST;
    items.push({
      id,
      version: 0,
      type,
      dateTime: COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 2000000, text: `${id}. ${textWithImage()}`,
      image: undefined,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
