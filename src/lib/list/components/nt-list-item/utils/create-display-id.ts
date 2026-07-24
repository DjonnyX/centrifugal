/**
 * createDisplayId
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/ng-list-item/utils/create-display-id.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const createDisplayId = (listId: number, id: number) => {
    return `${listId}-${id}`;
};
