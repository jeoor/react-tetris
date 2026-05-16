import { combineReducers as rawCombineReducers } from 'redux-immutable';
import type { List, Map as ImmutableMap } from 'immutable';
import pause from './pause';
import music from './music';
import matrix from './matrix';
import next from './next';
import cur from './cur';
import startLines from './startLines';
import max from './max';
import points from './points';
import speedStart from './speedStart';
import speedRun from './speedRun';
import lock from './lock';
import clearLines from './clearLines';
import reset from './reset';
import drop from './drop';
import keyboard from './keyboard';
import focus from './focus';
import type Block from '../unit/block';
import type { BlockType } from '../unit/const';

const combineReducers = rawCombineReducers as (reducers: Record<string, unknown>) => unknown;

export type MatrixState = List<List<number>>;
export type KeyboardState = ImmutableMap<string, boolean>;
export type RootStateShape = {
  pause: boolean;
  music: boolean;
  matrix: MatrixState;
  next: BlockType;
  cur: Block | null;
  startLines: number;
  max: number;
  points: number;
  speedStart: number;
  speedRun: number;
  lock: boolean;
  clearLines: number;
  reset: boolean;
  drop: boolean;
  keyboard: KeyboardState;
  focus: boolean;
};
type BaseRootState = ImmutableMap<string, unknown>;
export type RootState = Omit<BaseRootState, 'get' | 'toJS'> & {
  get<K extends keyof RootStateShape>(key: K): RootStateShape[K];
  toJS(): Record<string, unknown>;
};

const rootReducer = combineReducers({
  pause,
  music,
  matrix,
  next,
  cur,
  startLines,
  max,
  points,
  speedStart,
  speedRun,
  lock,
  clearLines,
  reset,
  drop,
  keyboard,
  focus,
});

export default rootReducer;
