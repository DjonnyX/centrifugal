import { Id } from "centrifugal";
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IMessageItemData {
  id: Id;
  quoteId?: Id;
  dateTime: number;
  mailed: boolean;
  text: string;
  edited?: boolean;
  incomType?: 'in' | 'out',
  type?: MessageTypes,
}