import event from '../../unit/event';
import states from '../states';
import actions from '../../actions';
import type { AppStore } from '../../store';

type StoreLike = Pick<AppStore, 'dispatch' | 'getState'>;

const down = (store: StoreLike) => {
  store.dispatch(actions.keyboard.reset(true));
  if (store.getState().get('lock')) {
    return;
  }
  if (store.getState().get('cur') !== null) {
    event.down({
      key: 'r',
      once: true,
      callback: () => {
        states.overStart();
      },
    });
  } else {
    event.down({
      key: 'r',
      once: true,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        states.start();
      },
    });
  }
};

const up = (store: StoreLike) => {
  store.dispatch(actions.keyboard.reset(false));
  event.up({
    key: 'r',
  });
};

export default {
  down,
  up,
};
