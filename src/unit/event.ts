type EventController = {
  key: string;
  once?: boolean;
  begin?: number;
  interval?: number;
  callback?: (_clear?: () => void) => void;
};

const eventName: Record<string, ReturnType<typeof setTimeout> | null> = {};

const down = (o: EventController) => { // 键盘、手指按下
  const keys = Object.keys(eventName);
  keys.forEach((i) => {
    if (eventName[i]) {
      clearTimeout(eventName[i]);
    }
    eventName[i] = null;
  });
  if (!o.callback) {
    return;
  }
  const clear = () => {
    if (eventName[o.key]) {
      clearTimeout(eventName[o.key]!);
    }
  };
  o.callback(clear);
  if (o.once === true) {
    return;
  }
  let begin: number | null = o.begin || 100;
  const interval = o.interval || 50;
  const loop = () => {
    eventName[o.key] = setTimeout(() => {
      begin = null;
      loop();
      o.callback?.(clear);
    }, begin || interval);
  };
  loop();
};

const up = (o: EventController) => { // 键盘、手指松开
  if (eventName[o.key]) {
    clearTimeout(eventName[o.key]!);
  }
  eventName[o.key] = null;
  if (!o.callback) {
    return;
  }
  o.callback();
};

const clearAll = () => {
  const keys = Object.keys(eventName);
  keys.forEach(i => {
    if (eventName[i]) {
      clearTimeout(eventName[i]);
    }
    eventName[i] = null;
  });
};

export default {
  down,
  up,
  clearAll,
};
