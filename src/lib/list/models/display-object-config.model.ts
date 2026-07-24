import { IRenderVirtualListItemConfig } from "./render-item-config.model";

/**
 * Display object configuration.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/display-object-config.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDisplayObjectConfig extends IRenderVirtualListItemConfig {
  /**
   * Determines whether the element has focused or not.
   */
  focused: boolean;
  /**
   * Determines whether the element is selected or not.
   */
  selected: boolean;
  /**
   * Determines whether the element is collapsed or not.
   */
  collapsed: boolean;
  /**
   * True if scroll capture occurs.
   */
  grabbing: boolean;
}