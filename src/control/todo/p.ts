import event from '../../unit/event';
import states from '../states';
import actions from '../../actions';
import type { AppStore } from '../../store';

type StoreLike = Pick<AppStore, 'dispatch' | 'getState'>;

const down = (store: StoreLike) => {
  store.dispatch(actions.keyboard.pause(true));
  event.down({
    key: 'p',
    once: true,
    callback: () => {
      const state = store.getState();
      if (state.get('lock')) {
        return;
      }
      const cur = state.get('cur');
      const isPause = state.get('pause');
      if (cur !== null) { // 暂停
        states.pause(!isPause);
      } else { // 新的开始
        states.start();
      }
    },
  });
};

const up = (store: StoreLike) => {
  store.dispatch(actions.keyboard.pause(false));
  event.up({
    key: 'p',
  });
};


export default {
  down,
  up,
};
