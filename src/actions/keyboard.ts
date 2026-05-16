import * as reducerType from '../unit/reducerType';

function drop(data: boolean) {
  return {
    type: reducerType.KEY_DROP,
    data,
  };
}

function down(data: boolean) {
  return {
    type: reducerType.KEY_DOWN,
    data,
  };
}

function left(data: boolean) {
  return {
    type: reducerType.KEY_LEFT,
    data,
  };
}

function right(data: boolean) {
  return {
    type: reducerType.KEY_RIGHT,
    data,
  };
}

function rotate(data: boolean) {
  return {
    type: reducerType.KEY_ROTATE,
    data,
  };
}

function reset(data: boolean) {
  return {
    type: reducerType.KEY_RESET,
    data,
  };
}

function music(data: boolean) {
  return {
    type: reducerType.KEY_MUSIC,
    data,
  };
}

function pause(data: boolean) {
  return {
    type: reducerType.KEY_PAUSE,
    data,
  };
}

export default {
  drop,
  down,
  left,
  right,
  rotate,
  reset,
  music,
  pause,
};
