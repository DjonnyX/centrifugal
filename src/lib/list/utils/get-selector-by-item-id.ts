import { Id } from "../../common";
import { ITEM_ID } from "../const";

export const getSelectorByItemId = (id: Id) => {
    return `[${ITEM_ID}="${id}"]`;
};
