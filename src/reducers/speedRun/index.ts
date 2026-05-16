import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawSpeedRun = typeof savedRecord?.speedRun === 'string' || typeof savedRecord?.speedRun === 'number'
  ? String(savedRecord.speedRun)
  : '';

let initState = rawSpeedRun !== '' && !Number.isNaN(parseInt(rawSpeedRun, 10))
  ? parseInt(rawSpeedRun, 10)
  : 1;
if (initState < 1 || initState > 6) {
  initState = 1;
}

const speedRun = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.SPEED_RUN:
      return action.data;
    default:
      return state;
  }
};

export default speedRun;
