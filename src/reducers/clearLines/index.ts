import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawClearLines = typeof savedRecord?.clearLines === 'string' || typeof savedRecord?.clearLines === 'number'
  ? String(savedRecord.clearLines)
  : '';

let initState = rawClearLines !== '' && !Number.isNaN(parseInt(rawClearLines, 10))
  ? parseInt(rawClearLines, 10)
  : 0;
if (initState < 0) {
  initState = 0;
}

const clearLines = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.CLEAR_LINES:
      return action.data;
    default:
      return state;
  }
};

export default clearLines;
