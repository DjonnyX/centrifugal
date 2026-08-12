/**
 * IAnimatorUpdateData
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/animator/interfaces/animator-update-data.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IAnimatorUpdateData {
    id: number;
    timestamp: number;
    elapsed: number;
    delta: number;
    value: number;
    complete: () => void;
}