import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import style from './index.module.css';

type PauseProps = {
  data?: boolean;
};

function Pause({ data = false }: PauseProps) {
  const [showPause, setShowPause] = useState(false);

  useEffect(() => {
    if (!data) {
      setShowPause(false);
      return undefined;
    }

    const timeout = setInterval(() => {
      setShowPause((current) => !current);
    }, 250);

    return () => {
      clearInterval(timeout);
      setShowPause(false);
    };
  }, [data]);

  return (
    <div
      className={cn({
        bg: true,
        [style.pause]: true,
        [style.c]: showPause,
      })}
    />
  );
}

export default React.memo(Pause);
