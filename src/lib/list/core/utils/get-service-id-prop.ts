/**
 * getServiceIdProp
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/utils/get-service-id-prop.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const getServiceIdProp = (trackBy: string) => {
    return `__service-id-${trackBy}__`;
};
