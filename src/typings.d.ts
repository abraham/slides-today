/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface Window { BroadcastChannel: any; }
interface Navigator { share: any; }

declare module '*.json' {
    const value: any;
    export default value;
}
