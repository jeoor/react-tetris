import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type MusicProps = {
  data: boolean;
};

function Music({ data }: MusicProps) {
  return (
    React.createElement('div', {
      className: cn({
        bg: true,
        [style.music]: true,
        [style.c]: !data,
      }),
    })
  );
}
export default React.memo(Music);
