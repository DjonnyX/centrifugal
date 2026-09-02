declare const ComponentClass: FunctionConstructor;

export interface ComponentClass<T> extends Function {
    new(...args: any[]): T;
}
