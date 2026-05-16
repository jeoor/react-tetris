import * as reducerType from '../../unit/reducerType';
import { lastRecord, maxPoint } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawMax = typeof savedRecord?.max === 'string' || typeof savedRecord?.max === 'number'
  ? String(savedRecord.max)
  : '';

let initState = rawMax !== '' && !Number.isNaN(parseInt(rawMax, 10))
  ? parseInt(rawMax, 10)
  : 0;

if (initState < 0) {
  initState = 0;
} else if (initState > maxPoint) {
  initState = maxPoint;
}

const parse = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.MAX:
      return action.data > 999999 ? 999999 : action.data; // 最大分数
    default:
      return state;
  }
};

export default parse;
