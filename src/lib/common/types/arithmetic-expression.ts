import { FloatOrPersentageValue } from "./float-or-persentage-value";

type Operator = '+' | '-';

/**
 * ArithmeticExpression
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/arithmetic-expression.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type ArithmeticExpression = FloatOrPersentageValue | `${FloatOrPersentageValue}${Operator}${FloatOrPersentageValue}` | `${FloatOrPersentageValue} ${Operator} ${FloatOrPersentageValue}`;
