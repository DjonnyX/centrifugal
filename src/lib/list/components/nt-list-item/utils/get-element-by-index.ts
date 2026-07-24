export const NTVL_INDEX = 'ntvl-index',
    /**
     * getListElementByIndex
     * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/ng-list-item/utils/get-element-by-index.ts
     * @author Evgenii Alexandrovich Grebennikov
     * @email djonnyx@gmail.com
     */
    getListElementByIndex = (index: number) => {
        return `[${NTVL_INDEX}="${index}"]`;
    },
    /**
     * getListElements
     * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/ng-list-item/utils/get-element-by-index.ts
     * @author Evgenii Alexandrovich Grebennikov
     * @email djonnyx@gmail.com
     */
    getListElements = () => {
        return `[${NTVL_INDEX}]`;
    };
