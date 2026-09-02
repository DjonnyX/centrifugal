import { MessageTypes } from "@shared/enums";
import { IMessage } from "@widgets/messages";
import { generateText, generateWord } from "../utils";
import { IVirtualListCollection } from "centrifugal";

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

export const testLinksText = () => {
  return `Test links:
  <i>⚙️ Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</i> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
Virtual list component:
ng-virtual-list.eugene-grebennikov.pro`;
};

export const testFormattedText = () => {
  return `Formated text: <h3>🚀 What is Lorem Ipsum?</h3><b>✨ Lorem Ipsum is simply dummy text of the printing and typesetting industry.</b> <br/><i>⚙️ Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</i> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
- Fixed size (fastest)
- Dynamic size (auto-measured)
- Scrolling control
`;
};

export const testFormattedTable = () => {
  return `HTML formatted text:
  https://centrifugal-chat.eugene-grebennikov.pro/assets/thumbnails/img_%20${1 + Math.round( Math.random() * 25)}.jpg
  <div class="wrapper">
    <div class="container">
        \`<div>
            <div>
              <span>HTML comment 🙃</span>
            </div>
        </div>\`
      </div>
</div>
Text \`Comment\` lorem ipsum
`;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const generateMessageCollection = (number: number, size: number) => {
  const items: IVirtualListCollection<IMessage> = [], chunkSize = size;

  for (let i = 0, l = chunkSize; i < l; i++) {
    const id = COLLECTION_PARAMS.index + 1,
      incomType = Math.random() > .5 ? 'in' : 'out';

    COLLECTION_PARAMS.index++;

    const hasImage = Boolean(Math.round(Math.random() * 0.75)),
      type = Math.random() > .35 ? MessageTypes.MESSAGE : MessageTypes.QUOTE;
    items.push({
      id,
      quoteId: type === MessageTypes.QUOTE ? i + 10 : undefined,
      version: 0,
      mailed: true,
      type,
      dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * 2000000, text: `${id}. ${id % 4 === 0 ? testLinksText() : id % 3 === 0 ? testFormattedText() : id % 5 === 0 ? testFormattedTable() : generateText()}`,
      image: hasImage ? 'https://centrifugal-chat.eugene-grebennikov.pro/media/logo.png' : undefined,
      incomType,
    });
  }
  return items;
}

export {
  generateMessageCollection,
  generateChatCollection,
};
