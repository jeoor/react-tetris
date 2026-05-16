import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawSpeedStart = typeof savedRecord?.speedStart === 'string' || typeof savedRecord?.speedStart === 'number'
  ? String(savedRecord.speedStart)
  : '';

let initState = rawSpeedStart !== '' && !Number.isNaN(parseInt(rawSpeedStart, 10))
  ? parseInt(rawSpeedStart, 10)
  : 1;
if (initState < 1 || initState > 6) {
  initState = 1;
}

const speedStart = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.SPEED_START:
      return action.data;
    default:
      return state;
  }
};

export default speedStart;
