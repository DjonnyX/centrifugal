import { Id } from 'centrifugal';
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IStoreItemData {
  id: Id;
  dateTime: number;
  price: number;
  isBanner?: boolean;
  text: string;
  type?: MessageTypes,
}