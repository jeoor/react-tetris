import type { List } from 'immutable';
import { blockType, StorageKey, type BlockType } from './const';
import type { RootState } from '../reducers';

type Matrix = List<List<number>>;
type MovableBlock = {
  xy: number[];
  shape: List<List<number>>;
};

const hiddenProperty = (() => {
  let names: string[] = [
    'hidden',
    'webkitHidden',
    'mozHidden',
    'msHidden',
  ];
  names = names.filter((e) => e in document);
  return names.length > 0 ? names[0] : false;
})();

export const visibilityChangeEvent = (() => {
  if (!hiddenProperty) {
    return false;
  }
  return hiddenProperty.replace(/hidden/i, 'visibilitychange');
})();

export const isFocus = () => {
  if (!hiddenProperty) {
    return true;
  }
  return !document[hiddenProperty as keyof Document];
};

export const getNextType = (): BlockType => {
  const len = blockType.length;
  return blockType[Math.floor(Math.random() * len)];
};

export const want = (next: MovableBlock, matrix: Matrix): boolean => {
  const { xy, shape } = next;
  const horizontal = shape.get(0)?.size ?? 0;

  return shape.every((m, k1) => (
    m.every((n, k2) => {
      if (xy[1] < 0) {
        return false;
      }
      if (xy[1] + horizontal > 10) {
        return false;
      }
      if (xy[0] + k1 < 0) {
        return true;
      }
      if (xy[0] + k1 >= 20) {
        return false;
      }
      if (n) {
        return !matrix.get(xy[0] + k1)?.get(xy[1] + k2);
      }
      return true;
    })
  ));
};

export const isClear = (matrix: Matrix): false | number[] => {
  const clearLines: number[] = [];
  matrix.forEach((m, k) => {
    if (m.every((n) => !!n)) {
      clearLines.push(k);
    }
  });
  return clearLines.length === 0 ? false : clearLines;
};

export const isOver = (matrix: Matrix): boolean => matrix.get(0)?.some((n) => !!n) ?? false;

type StoreLike = {
  subscribe: (_listener: () => void) => void;
  getState: () => RootState;
};

export const subscribeRecord = (store: StoreLike) => {
  store.subscribe(() => {
    const data = store.getState().toJS() as Record<string, unknown>;
    if (data.lock) {
      return;
    }
    let serialized = JSON.stringify(data);
    serialized = encodeURIComponent(serialized);
    if (typeof window.btoa === 'function') {
      serialized = btoa(serialized);
    }
    localStorage.setItem(StorageKey, serialized);
  });
};

export const isMobile = () => {
  const ua = navigator.userAgent;
  const android = /Android (\d+\.\d+)/.test(ua);
  const iphone = ua.indexOf('iPhone') > -1;
  const ipod = ua.indexOf('iPod') > -1;
  const ipad = ua.indexOf('iPad') > -1;
  const nokiaN = ua.indexOf('NokiaN') > -1;
  return !!(android || iphone || ipod || ipad || nokiaN);
};

const unit = {
  getNextType,
  want,
  isClear,
  isOver,
  subscribeRecord,
  isMobile,
  visibilityChangeEvent,
  isFocus,
};

export default unit;
