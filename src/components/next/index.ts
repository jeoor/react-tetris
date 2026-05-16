import React, { useEffect, useState } from 'react';

import style from './index.module.css';
import { blockShape, type BlockType } from '../../unit/const';

type PreviewBlock = number[][];

const xy: Record<BlockType, [number, number]> = {
  I: [1, 0],
  L: [0, 0],
  J: [0, 0],
  Z: [0, 0],
  S: [0, 0],
  O: [0, 1],
  T: [0, 0],
};

const empty: PreviewBlock = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function buildBlock(type: BlockType): PreviewBlock {
  const shape = blockShape[type];
  const block = empty.map((row) => [...row]) as PreviewBlock;
  shape.forEach((m, k1) => {
    m.forEach((n, k2) => {
      if (n) {
        block[k1 + xy[type][0]][k2 + xy[type][1]] = 1;
      }
    });
  });
  return block;
}

type NextProps = {
  data?: BlockType;
};

function Next({ data = 'I' }: NextProps) {
  const [block, setBlock] = useState<PreviewBlock>(() => buildBlock(data));

  useEffect(() => {
    setBlock(buildBlock(data));
  }, [data]);

  return (
    React.createElement(
      'div',
      { className: style.next },
      ...block.map((arr, k1) => (
        React.createElement(
          'div',
          { key: k1 },
          ...arr.map((e, k2) => React.createElement('b', { className: e ? 'c' : '', key: k2 })),
        )
      )),
    )
  );
}
export default React.memo(Next);
