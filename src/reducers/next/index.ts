import { getNextType } from '../../unit';
import * as reducerType from '../../unit/reducerType';
import { lastRecord, blockType, type BlockType } from '../../unit/const';

const savedRecord = lastRecord && typeof lastRecord === 'object' ? lastRecord : null;

type ReducerAction = {
  type: string;
  data: BlockType;
};

const rawNext = typeof savedRecord?.next === 'string' ? savedRecord.next : '';
const initState: BlockType = blockType.indexOf(rawNext as BlockType) !== -1
  ? rawNext as BlockType
  : getNextType();

const parse = (state = initState, action: ReducerAction) => {
  switch (action.type) {
    case reducerType.NEXT_BLOCK:
      return action.data;
    default:
      return state;
  }
};

export default parse;
