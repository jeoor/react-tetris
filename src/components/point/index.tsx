import React, { useLayoutEffect, useRef, useState } from 'react';

import Number from '../number';
import { i18n, lan } from '../../unit/const';

const CURRENT_SCORE = i18n.point[lan];
const HIGH_SCORE = i18n.highestScore[lan];
const LAST_ROUND = i18n.lastRound[lan];

type PointProps = {
  cur?: boolean;
  max: number;
  point: number;
};

type PointState = {
  label: string;
  number: number;
};

const getViewState = ({ cur = false, point, max }: PointProps): PointState => {
  if (cur) {
    return {
      label: point >= max ? HIGH_SCORE : CURRENT_SCORE,
      number: point,
    };
  }

  if (point !== 0) {
    return {
      label: LAST_ROUND,
      number: point,
    };
  }

  return {
    label: HIGH_SCORE,
    number: max,
  };
};

function Point(props: PointProps) {
  const { cur = false, point, max } = props;
  const [viewState, setViewState] = useState<PointState>(() => getViewState(props));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    setViewState(getViewState(props));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (cur || point === 0) {
      return undefined;
    }

    const toggle = () => {
      setViewState({
        label: LAST_ROUND,
        number: point,
      });
      timeoutRef.current = setTimeout(() => {
        setViewState({
          label: HIGH_SCORE,
          number: max,
        });
        timeoutRef.current = setTimeout(toggle, 3000);
      }, 3000);
    };

    toggle();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [cur, max, point, props]);

  useLayoutEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return (
    <div>
      <p>{viewState.label}</p>
      <Number number={viewState.number} />
    </div>
  );
}

export default React.memo(Point, (prevProps, nextProps) => (
  prevProps.cur === nextProps.cur
  && prevProps.point === nextProps.point
  && prevProps.max === nextProps.max
  && !!prevProps.cur
));
