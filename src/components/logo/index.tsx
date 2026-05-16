import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import style from './index.module.css';
import { i18n, lan } from '../../unit/const';

type LogoProps = {
  cur?: boolean;
  reset: boolean;
};

type LogoState = {
  style: string;
  display: 'none' | 'block';
};

function Logo({ cur = false, reset }: LogoProps) {
  const [viewState, setViewState] = useState<LogoState>({
    style: style.r1,
    display: 'none',
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousRef = useRef<LogoProps>({ cur, reset });
  const initializedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const animate = useCallback((nextProps: LogoProps) => {
    clearTimer();
    setViewState({
      style: style.r1,
      display: 'none',
    });

    if (nextProps.cur || nextProps.reset) {
      return;
    }

    let direction = 'r';
    let count = 0;

    const set = (func?: (() => void) | null, delay = 0) => {
      if (func) {
        timeoutRef.current = setTimeout(func, delay);
      }
    };

    const show = (func?: (() => void) | null) => {
      set(() => {
        setViewState((current) => ({ ...current, display: 'block' }));
        if (func) {
          func();
        }
      }, 150);
    };

    const hide = (func?: (() => void) | null) => {
      set(() => {
        setViewState((current) => ({ ...current, display: 'none' }));
        if (func) {
          func();
        }
      }, 150);
    };

    const blink = (func?: (() => void) | null, delay1 = 0, delay2 = 0) => {
      set(() => {
        setViewState((current) => ({ ...current, style: style[`${direction}2`] }));
        set(() => {
          setViewState((current) => ({ ...current, style: style[`${direction}1`] }));
          if (func) {
            func();
          }
        }, delay2);
      }, delay1);
    };

    const run = (func?: (() => void) | null) => {
      set(() => {
        setViewState((current) => ({ ...current, style: style[`${direction}4`] }));
        set(() => {
          setViewState((current) => ({ ...current, style: style[`${direction}3`] }));
          count += 1;
          if (count === 10 || count === 20 || count === 30) {
            direction = direction === 'r' ? 'l' : 'r';
          }
          if (count < 40) {
            run(func);
            return;
          }
          setViewState((current) => ({ ...current, style: style[`${direction}1`] }));
          if (func) {
            set(func, 4000);
          }
        }, 100);
      }, 100);
    };

    const loop = () => {
      count = 0;
      blink(() => {
        blink(() => {
          blink(() => {
            setViewState((current) => ({ ...current, style: style[`${direction}2`] }));
            run(loop);
          }, 150, 150);
        }, 150, 150);
      }, 1000, 1500);
    };

    show(() => {
      hide(() => {
        show(() => {
          hide(() => {
            show(() => {
              loop();
            });
          });
        });
      });
    });
  }, [clearTimer]);

  useLayoutEffect(() => {
    const previousProps = previousRef.current;
    const shouldAnimate = (
      [previousProps.cur, cur].indexOf(false) !== -1
      && previousProps.cur !== cur
    ) || previousProps.reset !== reset;

    if (!initializedRef.current) {
      initializedRef.current = true;
      animate({ cur, reset });
    } else if (shouldAnimate) {
      animate({ cur, reset });
    }

    previousRef.current = { cur, reset };
  }, [animate, cur, reset]);

  useLayoutEffect(() => () => {
    clearTimer();
  }, [clearTimer]);

  if (cur) {
    return null;
  }

  return (
    <div className={style.logo} style={{ display: viewState.display }}>
      <div className={cn({ bg: true, [style.dragon]: true, [viewState.style]: true })} />
      <p dangerouslySetInnerHTML={{ __html: i18n.titleCenter[lan] }} />
    </div>
  );
}

export default React.memo(Logo);
