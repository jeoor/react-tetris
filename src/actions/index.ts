import { getNextType } from '../unit';
import * as reducerType from '../unit/reducerType';
import Block from '../unit/block';
import type { BlockOption, BlockSnapshot } from '../unit/block';
import type { BlockType } from '../unit/const';
import type { MatrixState } from '../reducers';
import keyboard from './keyboard';

export type MoveBlockArg = BlockOption | BlockSnapshot | Block | { reset: true };

function nextBlock(next: BlockType = getNextType()) {
  return {
    type: reducerType.NEXT_BLOCK,
    data: next,
  } as const;
}

function moveBlock(option: MoveBlockArg) {
  const block = (() => {
    if ('reset' in option) {
      return null;
    }
    if (option instanceof Block) {
      return option;
    }
    return new Block(option as BlockOption | BlockSnapshot);
  })();

  return {
    type: reducerType.MOVE_BLOCK,
    data: block,
  } as const;
}

function speedStart(n: number) {
  return {
    type: reducerType.SPEED_START,
    data: n,
  } as const;
}

function speedRun(n: number) {
  return {
    type: reducerType.SPEED_RUN,
    data: n,
  } as const;
}

function startLines(n: number) {
  return {
    type: reducerType.START_LINES,
    data: n,
  } as const;
}

function matrix(data: MatrixState) {
  return {
    type: reducerType.MATRIX,
    data,
  } as const;
}

function lock(data: boolean) {
  return {
    type: reducerType.LOCK,
    data,
  } as const;
}

function clearLines(data: number) {
  return {
    type: reducerType.CLEAR_LINES,
    data,
  } as const;
}

function points(data: number) {
  return {
    type: reducerType.POINTS,
    data,
  } as const;
}

function max(data: number) {
  return {
    type: reducerType.MAX,
    data,
  } as const;
}

function reset(data: boolean) {
  return {
    type: reducerType.RESET,
    data,
  } as const;
}

function drop(data: boolean) {
  return {
    type: reducerType.DROP,
    data,
  } as const;
}

function pause(data: boolean) {
  return {
    type: reducerType.PAUSE,
    data,
  } as const;
}

function music(data: boolean) {
  return {
    type: reducerType.MUSIC,
    data,
  } as const;
}

function focus(data: boolean) {
  return {
    type: reducerType.FOCUS,
    data,
  } as const;
}

export type AppAction =
  | ReturnType<typeof nextBlock>
  | ReturnType<typeof moveBlock>
  | ReturnType<typeof speedStart>
  | ReturnType<typeof speedRun>
  | ReturnType<typeof startLines>
  | ReturnType<typeof matrix>
  | ReturnType<typeof lock>
  | ReturnType<typeof clearLines>
  | ReturnType<typeof points>
  | ReturnType<typeof max>
  | ReturnType<typeof reset>
  | ReturnType<typeof drop>
  | ReturnType<typeof pause>
  | ReturnType<typeof music>
  | ReturnType<typeof focus>
  | ReturnType<typeof keyboard.drop>
  | ReturnType<typeof keyboard.down>
  | ReturnType<typeof keyboard.left>
  | ReturnType<typeof keyboard.right>
  | ReturnType<typeof keyboard.rotate>
  | ReturnType<typeof keyboard.reset>
  | ReturnType<typeof keyboard.music>
  | ReturnType<typeof keyboard.pause>;

export default {
  nextBlock,
  moveBlock,
  speedStart,
  speedRun,
  startLines,
  matrix,
  lock,
  clearLines,
  points,
  reset,
  max,
  drop,
  pause,
  keyboard,
  music,
  focus,
};
