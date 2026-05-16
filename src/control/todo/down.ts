import { want } from '../../unit/';
import event from '../../unit/event';
import actions from '../../actions';
import states from '../states';
import { music } from '../../unit/music';
import type { AppStore } from '../../store';

type StoreLike = Pick<AppStore, 'dispatch' | 'getState'>;

const down = (store: StoreLike) => {
  store.dispatch(actions.keyboard.down(true));
  if (store.getState().get('cur') !== null) {
    event.down({
      key: 'down',
      begin: 40,
      interval: 40,
      callback: (stopDownTrigger) => {
        const state = store.getState();
        if (state.get('lock')) {
          return;
        }
        if (music.move) {
          music.move();
        }
        const cur = state.get('cur');
        if (cur === null) {
          return;
        }
        if (state.get('pause')) {
          states.pause(false);
          return;
        }
        const next = cur.fall();
        if (want(next, state.get('matrix'))) {
          store.dispatch(actions.moveBlock(next));
          states.auto();
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
          states.nextAround(matrix, stopDownTrigger);
        }
      },
    });
  } else {
    event.down({
      key: 'down',
      begin: 200,
      interval: 100,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        const state = store.getState();
        const cur = state.get('cur');
        if (cur) {
          return;
        }
        if (music.move) {
          music.move();
        }
        let startLines = state.get('startLines');
        startLines = startLines - 1 < 0 ? 10 : startLines - 1;
        store.dispatch(actions.startLines(startLines));
      },
    });
  }
};

const up = (store: StoreLike) => {
  store.dispatch(actions.keyboard.down(false));
  event.up({
    key: 'down',
  });
};


export default {
  down,
  up,
};
