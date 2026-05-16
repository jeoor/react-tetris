import React from 'react';
import cn from 'classnames';

import style from './index.module.css';

type NumberCell = string;

const renderNumber = (data: NumberCell[]) => (
  <div className={style.number}>
    {data.map((e, k: number) => (
      <span className={cn(['bg', style[`s_${e}`]])} key={k} />
    ))}
  </div>
);

const format = (num: number): NumberCell[] => (
  num < 10 ? `0${num}`.split('') : `${num}`.split('')
);

type NumberProps = {
  number?: number;
  length?: number;
  time?: boolean;
};

type NumberState = {
  timeCount: false | number;
  time: Date;
};

export default class Number extends React.Component<NumberProps, NumberState> {
  static timeInterval: ReturnType<typeof setTimeout> | null = null;

  static timeCount: false | number | null = null;

  constructor(props: NumberProps) {
    super(props);
    this.state = {
      timeCount: false,
      time: new Date(),
    };
  }

  componentDidMount() {
    if (!this.props.time) {
      return;
    }

    const clock = () => {
      const count = Number.timeInterval ? +Number.timeInterval : 0;
      Number.timeInterval = setTimeout(() => {
        this.setState({
          time: new Date(),
          timeCount: count,
        });
        clock();
      }, 1000);
    };

    clock();
  }

  componentWillUnmount() {
    if (this.props.time && Number.timeInterval) {
      clearTimeout(Number.timeInterval);
    }
  }

  shouldComponentUpdate(nextProps: NumberProps) {
    if (this.props.time) {
      if (this.state.timeCount !== Number.timeCount) {
        if (this.state.timeCount !== false) {
          Number.timeCount = this.state.timeCount;
        }
        return true;
      }
      return false;
    }

    return (this.props.number ?? 0) !== (nextProps.number ?? 0);
  }

  render() {
    if (this.props.time) {
      const now = this.state.time;
      const hour = format(now.getHours());
      const min = format(now.getMinutes());
      const sec = now.getSeconds() % 2;
      const timeData = hour.concat(sec ? 'd' : 'd_c', min);
      return renderNumber(timeData);
    }

    const currentNumber = this.props.number ?? 0;
    const length = this.props.length ?? 6;
    const num = `${currentNumber}`.split('');
    for (let i = 0, len = length - num.length; i < len; i += 1) {
      num.unshift('n');
    }
    return renderNumber(num);
  }
}
