import { DialogPresets } from "@shared/theming/themes/presets";
import { IDialogAction } from "./dialog-action";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDialogData {
  title?: string;
  message?: string;
  content?: any;
  actions?: Array<IDialogAction>;
  preset?: DialogPresets | string | undefined;
}
