// The constructor requires the parameters signature to be of type any
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type Constructor<T = Record<string, unknown>> = new (...args: any[]) => T;

export type ParameterlessVoidFunction = () => void;