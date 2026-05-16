import React from 'react';
import immutable, { List } from 'immutable';
import classnames from 'classnames';
import type Block from '../../unit/block';

import style from './index.module.css';
import { isClear } from '../../unit/';
import { fillLine, blankLine } from '../../unit/const';
import states from '../../control/states';

const t = setTimeout;

type MatrixList = List<List<number>>;

type MatrixProps = {
  matrix: MatrixList;
  cur?: Block | null;
  reset: boolean;
};

type MatrixState = {
  clearLines: false | number[];
  animateColor: number;
  isOver: boolean;
  overState: MatrixList | null;
};

export default class Matrix extends React.Component<MatrixProps, MatrixState> {
  animationTimers: ReturnType<typeof setTimeout>[] = [];

  static areClearLinesEqual(
    prevClearLines: MatrixState['clearLines'],
    nextClearLines: MatrixState['clearLines'],
  ) {
    if (prevClearLines === nextClearLines) {
      return true;
    }
    if (!prevClearLines || !nextClearLines) {
      return false;
    }
    if (prevClearLines.length !== nextClearLines.length) {
      return false;
    }
    return prevClearLines.every((line, index) => line === nextClearLines[index]);
  }

  static getDerivedStateFromProps(nextProps: MatrixProps, prevState: MatrixState) {
    const clearLines = isClear(nextProps.matrix);
    const isOver = nextProps.reset;
    const nextState: Partial<MatrixState> = {};

    if (!Matrix.areClearLinesEqual(prevState.clearLines, clearLines)) {
      nextState.clearLines = clearLines;
    }

    if (prevState.isOver !== isOver) {
      nextState.isOver = isOver;
    }

    if (!isOver && prevState.isOver && prevState.overState !== null) {
      nextState.overState = null;
    }

    return Object.keys(nextState).length > 0 ? nextState : null;
  }

  constructor(props: MatrixProps) {
    super(props);
    this.state = {
      clearLines: false,
      animateColor: 2,
      isOver: false,
      overState: null,
    };
  }

  componentDidUpdate(_: MatrixProps, prevState: MatrixState) {
    if (!Matrix.areClearLinesEqual(prevState.clearLines, this.state.clearLines) && this.state.clearLines && !prevState.clearLines) {
      this.clearAnimate();
    }

    if (!this.state.clearLines && this.state.isOver && !prevState.isOver) {
      this.over(this.props);
    }

    if (!this.props.reset && prevState.isOver && this.state.overState === null) {
      this.clearPendingAnimations();
    }
  }

  componentWillUnmount() {
    this.clearPendingAnimations();
  }

  shouldComponentUpdate(nextProps: MatrixProps, nextState: MatrixState) {
    const props = this.props;

    return !(
      immutable.is(nextProps.matrix, props.matrix) &&
      immutable.is(nextProps.cur && nextProps.cur.shape, props.cur && props.cur.shape) &&
      immutable.is(nextProps.cur && nextProps.cur.xy, props.cur && props.cur.xy)
    ) || !!nextState.clearLines || nextState.isOver;
  }

  getResult(props: MatrixProps = this.props): MatrixList {
    const cur = props.cur;
    const shape = cur && cur.shape;
    const xy = cur && cur.xy;

    let matrix = props.matrix;
    const clearLines = this.state.clearLines;

    if (clearLines) {
      const animateColor = this.state.animateColor;
      clearLines.forEach((index) => {
        matrix = matrix.set(index, List([
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
          animateColor,
        ]));
      });
    } else if (shape && xy) {
      shape.forEach((m, k1) => (
        m.forEach((n, k2) => {
          const row = xy.get(0);
          const column = xy.get(1);
          if (n && row !== undefined && column !== undefined && row + k1 >= 0) {
            let line = matrix.get(row + k1);
            if (!line) {
              return;
            }
            const color = line.get(column + k2) === 1 ? 2 : 1;
            line = line.set(column + k2, color);
            matrix = matrix.set(row + k1, line);
          }
        })
      ));
    }

    return matrix;
  }

  clearAnimate() {
    this.clearPendingAnimations();
    const anima = (callback?: () => void) => {
      this.pushTimer(t(() => {
        this.setState({
          animateColor: 0,
        });
        this.pushTimer(t(() => {
          this.setState({
            animateColor: 2,
          });
          if (typeof callback === 'function') {
            callback();
          }
        }, 100));
      }, 100));
    };

    anima(() => {
      anima(() => {
        anima(() => {
          this.pushTimer(t(() => {
            if (this.state.clearLines) {
              states.clearLines(this.props.matrix, this.state.clearLines);
            }
          }, 100));
        });
      });
    });
  }

  over(nextProps: MatrixProps) {
    this.clearPendingAnimations();
    let overState = this.getResult(nextProps);
    this.setState({
      overState,
    });

    const exLine = (index: number) => {
      if (index <= 19) {
        overState = overState.set(19 - index, List(fillLine));
      } else if (index >= 20 && index <= 39) {
        overState = overState.set(index - 20, List(blankLine));
      } else {
        states.overEnd();
        return;
      }

      this.setState({
        overState,
      });
    };

    for (let i = 0; i <= 40; i += 1) {
      this.pushTimer(t(exLine.bind(null, i), 40 * (i + 1)));
    }
  }

  pushTimer(timer: ReturnType<typeof setTimeout>) {
    this.animationTimers.push(timer);
    return timer;
  }

  clearPendingAnimations() {
    this.animationTimers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.animationTimers = [];
  }

  render() {
    const matrix = this.state.isOver ? this.state.overState ?? this.props.matrix : this.getResult();

    return (
      <div className={style.matrix}>
        {matrix.map((p, k1) => (
          <p key={k1}>
            {p.map((e, k2) => (
              <b
                className={classnames({
                  c: e === 1,
                  d: e === 2,
                })}
                key={k2}
              />
            ))}
          </p>
        ))}
      </div>
    );
  }
}
