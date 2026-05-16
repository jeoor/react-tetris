import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
  Decorate,
  Guide,
  Keyboard,
  Logo,
  Matrix,
  Music,
  Next,
  Number,
  Pause,
  Point,
} from '@/components';
import { i18n, lan, lastRecord, speeds, transform } from '@/config';
import { isFocus, visibilityChangeEvent } from '@/lib';
import states from '@/control/states';
import type { KeyboardState, MatrixState, RootState } from '@/reducers';
import type Block from '@/unit/block';
import type { BlockType } from '@/unit/const';
import style from './index.module.css';

type AppProps = {
  music: boolean;
  pause: boolean;
  matrix: MatrixState;
  next: BlockType;
  cur: Block | null;
  speedStart: number;
  speedRun: number;
  startLines: number;
  clearLines: number;
  points: number;
  max: number;
  reset: boolean;
  drop: boolean;
  keyboard: KeyboardState;
};

type AppState = {
  w: number;
  h: number;
};

class App extends React.Component<AppProps, AppState> {
  handleResize: () => void;

  constructor(props: AppProps) {
    super(props);
    this.handleResize = this.resize.bind(this);
    this.state = {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, true);

    if (visibilityChangeEvent) {
      document.addEventListener(visibilityChangeEvent, () => {
        states.focus(isFocus());
      }, false);
    }

    if (lastRecord) {
      if (lastRecord.cur && !lastRecord.pause) {
        const speedRun = this.props.speedRun;
        let timeout = speeds[speedRun - 1] / 2;
        timeout = speedRun < speeds[speeds.length - 1] ? speeds[speeds.length - 1] : speedRun;
        states.auto(timeout);
      }
      if (!lastRecord.cur) {
        states.overStart();
      }
    } else {
      states.overStart();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, true);
  }

  resize() {
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    });
  }

  render() {
    let filling = 0;
    const size = (() => {
      const w = this.state.w;
      const h = this.state.h;
      const ratio = h / w;
      let scale;
      let css: Record<string, string | number> = {};

      if (ratio < 1.5) {
        scale = h / 960;
      } else {
        scale = w / 640;
        filling = (h - (960 * scale)) / scale / 3;
        css = {
          paddingTop: Math.floor(filling) + 42,
          paddingBottom: Math.floor(filling),
          marginTop: Math.floor(-480 - (filling * 1.5)),
        };
      }

      css[transform] = `scale(${scale})`;
      return css;
    })();

    return (
      <div
        className={style.app}
        style={size}
      >
        <div className={classnames({ [style.rect]: true, [style.drop]: this.props.drop })}>
          <Decorate />
          <div className={style.screen}>
            <div className={style.panel}>
              <Matrix
                matrix={this.props.matrix}
                cur={this.props.cur}
                reset={this.props.reset}
              />
              <Logo cur={!!this.props.cur} reset={this.props.reset} />
              <div className={style.state}>
                <Point cur={!!this.props.cur} point={this.props.points} max={this.props.max} />
                <p>{this.props.cur ? i18n.cleans[lan] : i18n.startLine[lan]}</p>
                <Number number={this.props.cur ? this.props.clearLines : this.props.startLines} />
                <p>{i18n.level[lan]}</p>
                <Number
                  number={this.props.cur ? this.props.speedRun : this.props.speedStart}
                  length={1}
                />
                <p>{i18n.next[lan]}</p>
                <Next data={this.props.next} />
                <div className={style.bottom}>
                  <Music data={this.props.music} />
                  <Pause data={this.props.pause} />
                  <Number time />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Keyboard filling={filling} keyboard={this.props.keyboard} />
        <Guide />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): AppProps => ({
  pause: state.get('pause'),
  music: state.get('music'),
  matrix: state.get('matrix'),
  next: state.get('next'),
  cur: state.get('cur'),
  speedStart: state.get('speedStart'),
  speedRun: state.get('speedRun'),
  startLines: state.get('startLines'),
  clearLines: state.get('clearLines'),
  points: state.get('points'),
  max: state.get('max'),
  reset: state.get('reset'),
  drop: state.get('drop'),
  keyboard: state.get('keyboard'),
});

export default connect(mapStateToProps)(App);
