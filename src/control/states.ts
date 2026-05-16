import { List } from 'immutable';
import store from '../store';
import { want, isClear, isOver } from '../unit/';
import actions from '../actions';
import { speeds, blankLine, blankMatrix, clearPoints, eachLines } from '../unit/const';
import { music } from '../unit/music';
import type { RootState } from '../reducers';

type MatrixState = List<List<number>>;
const getState = (): RootState => store.getState();

const getStartMatrix = (startLines: number): MatrixState => { // 生成startLines
  const getLine = (min: number, max: number): List<number> => { // 返回标亮个数在min~max之间一行方块, (包含边界)
    const count = Math.trunc((((max - min) + 1) * Math.random()) + min);
    const line = [];
    for (let i = 0; i < count; i++) { // 插入高亮
      line.push(1);
    }
    for (let i = 0, len = 10 - count; i < len; i++) { // 在随机位置插入灰色
      const index = Math.trunc((line.length + 1) * Math.random());
      line.splice(index, 0, 0);
    }

    return List(line);
  };
  let startMatrix = List<List<number>>([]);

  for (let i = 0; i < startLines; i++) {
    if (i <= 2) { // 0-3
      startMatrix = startMatrix.push(getLine(5, 8));
    } else if (i <= 6) { // 4-6
      startMatrix = startMatrix.push(getLine(4, 9));
    } else { // 7-9
      startMatrix = startMatrix.push(getLine(3, 9));
    }
  }
  for (let i = 0, len = 20 - startLines; i < len; i++) { // 插入上部分的灰色
    startMatrix = startMatrix.unshift(List(blankLine));
  }
  return startMatrix;
};

const states = {
  // 自动下落setTimeout变量
  fallInterval: null as ReturnType<typeof setTimeout> | null,

  // 游戏开始
  start: () => {
    if (music.start) {
      music.start();
    }
    const state = getState();
    states.dispatchPoints(0);
    store.dispatch(actions.speedRun(state.get('speedStart')));
    const startLines = state.get('startLines');
    const startMatrix = getStartMatrix(startLines);
    store.dispatch(actions.matrix(startMatrix));
    store.dispatch(actions.moveBlock({ type: state.get('next') }));
    store.dispatch(actions.nextBlock());
    states.auto();
  },

  // 自动下落
  auto: (timeout?: number) => {
    let out: number | undefined;
    if (timeout !== undefined) {
      out = timeout < 0 ? 0 : timeout;
    }
    let state = getState();
    let cur = state.get('cur');
    const fall = () => {
      state = getState();
      cur = state.get('cur');
      if (!cur) {
        return;
      }
      const next = cur.fall();
      if (want(next, state.get('matrix'))) {
        store.dispatch(actions.moveBlock(next));
        states.fallInterval = setTimeout(fall, speeds[state.get('speedRun') - 1]);
      } else {
        let matrix = state.get('matrix');
        const shape = cur.shape;
        const xy = cur.xy;
        shape.forEach((m, k1) => (
          m.forEach((n, k2) => {
            const row = xy.get(0);
            const column = xy.get(1);
            if (n && row !== undefined && column !== undefined && row + k1 >= 0) { // 竖坐标可以为负
              let line = matrix.get(row + k1);
              if (!line) {
                return;
              }
              line = line.set(column + k2, 1);
              matrix = matrix.set(row + k1, line);
            }
          })
        ));
        states.nextAround(matrix);
      }
    };
    if (states.fallInterval) {
      clearTimeout(states.fallInterval);
    }
    states.fallInterval = setTimeout(fall,
      out === undefined ? speeds[state.get('speedRun') - 1] : out);
  },

  // 一个方块结束, 触发下一个
  nextAround: (matrix: MatrixState, stopDownTrigger?: (() => void) | null) => {
    if (states.fallInterval) {
      clearTimeout(states.fallInterval);
    }
    store.dispatch(actions.lock(true));
    store.dispatch(actions.matrix(matrix));
    if (typeof stopDownTrigger === 'function') {
      stopDownTrigger();
    }

    const currentState = getState();
    const addPoints = (currentState.get('points') + 10) +
      ((currentState.get('speedRun') - 1) * 2); // 速度越快, 得分越高

    states.dispatchPoints(addPoints);

    if (isClear(matrix)) {
      if (music.clear) {
        music.clear();
      }
      return;
    }
    if (isOver(matrix)) {
      if (music.gameover) {
        music.gameover();
      }
      states.overStart();
      return;
    }
    setTimeout(() => {
      store.dispatch(actions.lock(false));
      store.dispatch(actions.moveBlock({ type: getState().get('next') }));
      store.dispatch(actions.nextBlock());
      states.auto();
    }, 100);
  },

  // 页面焦点变换
  focus: (focusFlag: boolean) => {
    store.dispatch(actions.focus(focusFlag));
    if (!focusFlag) {
      if (states.fallInterval) {
        clearTimeout(states.fallInterval);
      }
      return;
    }
    const state = getState();
    if (state.get('cur') && !state.get('reset') && !state.get('pause')) {
      states.auto();
    }
  },

  // 暂停
  pause: (isPause: boolean) => {
    store.dispatch(actions.pause(isPause));
    if (isPause) {
      if (states.fallInterval) {
        clearTimeout(states.fallInterval);
      }
      return;
    }
    states.auto();
  },

  // 消除行
  clearLines: (matrix: MatrixState, lines: number[]) => {
    const state = getState();
    let newMatrix = matrix;
    lines.forEach(n => {
      newMatrix = newMatrix.splice(n, 1);
      newMatrix = newMatrix.unshift(List(blankLine));
    });
    store.dispatch(actions.matrix(newMatrix));
    store.dispatch(actions.moveBlock({ type: state.get('next') }));
    store.dispatch(actions.nextBlock());
    states.auto();
    store.dispatch(actions.lock(false));
    const clearLines = state.get('clearLines') + lines.length;
    store.dispatch(actions.clearLines(clearLines)); // 更新消除行

    const addPoints = getState().get('points') +
      clearPoints[lines.length - 1]; // 一次消除的行越多, 加分越多
    states.dispatchPoints(addPoints);

    const speedAdd = Math.floor(clearLines / eachLines); // 消除行数, 增加对应速度
    let speedNow = state.get('speedStart') + speedAdd;
    speedNow = speedNow > 6 ? 6 : speedNow;
    store.dispatch(actions.speedRun(speedNow));
  },

  // 游戏结束, 触发动画
  overStart: () => {
    if (states.fallInterval) {
      clearTimeout(states.fallInterval);
    }
    store.dispatch(actions.lock(true));
    store.dispatch(actions.reset(true));
    store.dispatch(actions.pause(false));
  },

  // 游戏结束动画完成
  overEnd: () => {
    store.dispatch(actions.matrix(blankMatrix));
    store.dispatch(actions.moveBlock({ reset: true }));
    store.dispatch(actions.reset(false));
    store.dispatch(actions.lock(false));
    store.dispatch(actions.clearLines(0));
  },

  // 写入分数
  dispatchPoints: (point: number) => { // 写入分数, 同时判断是否创造最高分
    store.dispatch(actions.points(point));
    if (point > 0 && point > getState().get('max')) {
      store.dispatch(actions.max(point));
    }
  },
};

export default states;
