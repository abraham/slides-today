/* SystemJS module definition */
// eslint-disable-next-line no-var
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.json' {
  const value: unknown;
  export default value;
}
