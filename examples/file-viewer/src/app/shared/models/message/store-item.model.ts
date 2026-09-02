import { Id } from 'centrifugal';
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IFileViewerItemData {
  id: Id;
  dateTime: number;
  isBanner?: boolean;
  text: string;
  type?: MessageTypes,
}