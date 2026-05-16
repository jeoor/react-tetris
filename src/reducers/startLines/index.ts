import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawStartLines = typeof savedRecord?.startLines === 'string' || typeof savedRecord?.startLines === 'number'
  ? String(savedRecord.startLines)
  : '';

let initState = rawStartLines !== '' && !Number.isNaN(parseInt(rawStartLines, 10))
  ? parseInt(rawStartLines, 10)
  : 0;
if (initState < 0 || initState > 10) {
  initState = 0;
}

const startLines = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.START_LINES:
      return action.data;
    default:
      return state;
  }
};

export default startLines;
