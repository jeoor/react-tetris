import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const initState = lastRecord && lastRecord.reset ? !!lastRecord.reset : false;
const reset = (state = initState, action: { type: string; data: boolean }) => {
  switch (action.type) {
    case reducerType.RESET:
      return action.data;
    default:
      return state;
  }
};

export default reset;
