import * as reducerType from '../../unit/reducerType';
import { lastRecord, maxPoint } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: number;
};

const rawPoints = typeof savedRecord?.points === 'string' || typeof savedRecord?.points === 'number'
  ? String(savedRecord.points)
  : '';

let initState = rawPoints !== '' && !Number.isNaN(parseInt(rawPoints, 10))
  ? parseInt(rawPoints, 10)
  : 0;

if (initState < 0) {
  initState = 0;
} else if (initState > maxPoint) {
  initState = maxPoint;
}

const points = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.POINTS:
      return action.data > maxPoint ? maxPoint : action.data; // 最大分数
    default:
      return state;
  }
};

export default points;
