import { List } from 'immutable';
import * as reducerType from '../../unit/reducerType';
import { blankMatrix, lastRecord } from '../../unit/const';
import type { MatrixState } from '../';

const initState: MatrixState = lastRecord && Array.isArray(lastRecord.matrix) ?
  List(lastRecord.matrix.map((e) => List(e as number[]))) as MatrixState : blankMatrix;

const matrix = (state: MatrixState = initState, action: { type: string; data: MatrixState }) => {
  switch (action.type) {
    case reducerType.MATRIX:
      return action.data;
    default:
      return state;
  }
};

export default matrix;
