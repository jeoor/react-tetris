/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module 'qrcode' {
  const QRCode: {
    toDataURL(text: string, options: { margin?: number }): Promise<string>;
    toDataURL(text: string, callback: (error: Error | null, url: string) => void): void;
  };
  export default QRCode;
}

declare module 'redux-immutable' {
  import type { Reducer } from 'redux';

  function combineReducers<S>(reducers: Record<string, Reducer>): Reducer<S>;
  export { combineReducers };
}
