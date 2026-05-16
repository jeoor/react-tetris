import { List } from 'immutable';
import i18n from '../../i18n.json';

export type BlockType = 'I' | 'L' | 'J' | 'Z' | 'S' | 'O' | 'T';
export type Coordinate = [number, number];
export type BlockShape = number[][];
export type BlockShapeList = List<List<number>>;

type I18nConfig = typeof i18n;
type I18nMap = I18nConfig['data'];
type Language = keyof I18nMap['title'];
type LastRecord = Record<string, unknown> & {
  cur?: unknown;
  pause?: boolean;
  reset?: boolean;
  lock?: boolean;
  music?: boolean;
  next?: string;
};

export const blockShape: Record<BlockType, BlockShape> = {
  I: [
    [1, 1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};

export const origin: Record<BlockType, Coordinate[]> = {
  I: [[-1, 1], [1, -1]],
  L: [[0, 0]],
  J: [[0, 0]],
  Z: [[0, 0]],
  S: [[0, 0]],
  O: [[0, 0]],
  T: [[0, 0], [1, 0], [-1, 1], [0, -1]],
};

export const blockType = Object.keys(blockShape) as BlockType[];
export const speeds = [800, 650, 500, 370, 250, 160];
export const delays = [50, 60, 70, 80, 90, 100];
export const fillLine = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
export const blankLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const blankMatrix = (() => {
  const matrix: List<number>[] = [];
  for (let i = 0; i < 20; i += 1) {
    matrix.push(List(blankLine));
  }
  return List(matrix);
})();

export const clearPoints = [100, 300, 700, 1500];
export const StorageKey = 'REACT_TETRIS';

export const lastRecord = (() => {
  let data: string | LastRecord | null = localStorage.getItem(StorageKey);
  if (!data) {
    return false;
  }

  try {
    data = atob(data);
    data = decodeURIComponent(data);
    data = JSON.parse(data) as LastRecord;
  } catch (e) {
    if (window.console && window.console.error) {
      window.console.error('Failed to read saved record:', e);
    }
    return false;
  }

  return data as LastRecord;
})();

export const maxPoint = 999999;

export const transform = (() => {
  const trans = ['transform', 'webkitTransform', 'msTransform', 'mozTransform', 'oTransform'];
  const body = document.body;
  return trans.filter((e) => body.style[e as keyof CSSStyleDeclaration] !== undefined)[0] || 'transform';
})();

export const eachLines = 20;

const getParam = (param: string) => {
  const r = new RegExp(`\\?(?:.+&)?${param}=(.*?)(?:&.*)?$`);
  const m = window.location.toString().match(r);
  return m ? decodeURI(m[1]) : '';
};

export const lan: Language = (() => {
  const l = getParam('lan').toLowerCase() as Language;
  const languages = i18n.lan as Language[];
  return languages.indexOf(l) === -1 ? (i18n.default as Language) : l;
})();

export const i18nData: I18nMap = i18n.data;
export const i18nMap: I18nMap = i18n.data;
export const i18nConfig = i18n;

document.title = i18n.data.title[lan];

export { i18nMap as i18n };

export default {
  blockShape,
  origin,
  blockType,
  speeds,
  delays,
  fillLine,
  blankLine,
  blankMatrix,
  clearPoints,
  StorageKey,
  lastRecord,
  maxPoint,
  eachLines,
  transform,
  lan,
  i18n: i18nMap,
};
