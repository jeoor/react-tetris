import React from 'react';
import Immutable from 'immutable';
import type { Map as ImmutableMap } from 'immutable';

import style from './index.module.css';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';

type KeyboardButtons = keyof typeof todo;
type KeyboardMap = ImmutableMap<string, boolean>;
type ButtonRef = Button | null;

type KeyboardProps = {
  filling: number;
  keyboard: KeyboardMap;
};

export default class Keyboard extends React.Component<KeyboardProps> {
  dom_rotate: ButtonRef = null;

  dom_down: ButtonRef = null;

  dom_left: ButtonRef = null;

  dom_right: ButtonRef = null;

  dom_space: ButtonRef = null;

  dom_r: ButtonRef = null;

  dom_s: ButtonRef = null;

  dom_p: ButtonRef = null;

  componentDidMount() {
    const activeListener = { capture: true, passive: false };
    const captureListener = { capture: true };
    const touchEventCatch: Partial<Record<KeyboardButtons, boolean>> = {}; // 对于手机操作, 触发了touchstart, 将作出记录, 不再触发后面的mouse事件

    // 在鼠标触发mousedown时, 移除元素时可以不触发mouseup, 这里做一个兼容, 以mouseout模拟mouseup
    const mouseDownEventCatch: Partial<Record<KeyboardButtons, boolean>> = {};
    document.addEventListener('touchstart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, activeListener);

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.addEventListener('touchend', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, activeListener);

    // 阻止双指放大
    document.addEventListener('gesturestart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, activeListener);

    document.addEventListener('mousedown', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, captureListener);

    (Object.keys(todo) as KeyboardButtons[]).forEach((key) => {
      const button = this[`dom_${key}` as keyof Keyboard] as ButtonRef;
      const buttonDom = button?.dom;

      if (!buttonDom) {
        return;
      }

      buttonDom.addEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, captureListener);
      buttonDom.addEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, captureListener);
      buttonDom.addEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, captureListener);
      buttonDom.addEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, activeListener);
      buttonDom.addEventListener('touchend', () => {
        todo[key].up(store);
      }, activeListener);
    });
  }

  shouldComponentUpdate({ keyboard, filling }: KeyboardProps) {
    return !Immutable.is(keyboard, this.props.keyboard) || filling !== this.props.filling;
  }

  render() {
    const keyboard = this.props.keyboard;
    return (
      <div
        className={style.keyboard}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={0}
          left={374}
          label={i18n.rotation[lan]}
          arrow="translate(0, 63px)"
          position
          active={keyboard.get('rotate') ?? false}
          ref={(c) => { this.dom_rotate = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={180}
          left={374}
          label={i18n.down[lan]}
          arrow="translate(0,-71px) rotate(180deg)"
          active={keyboard.get('down') ?? false}
          ref={(c) => { this.dom_down = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={284}
          label={i18n.left[lan]}
          arrow="translate(60px, -12px) rotate(270deg)"
          active={keyboard.get('left') ?? false}
          ref={(c) => { this.dom_left = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={464}
          label={i18n.right[lan]}
          arrow="translate(-60px, -12px) rotate(90deg)"
          active={keyboard.get('right') ?? false}
          ref={(c) => { this.dom_right = c; }}
        />
        <Button
          color="blue"
          size="s0"
          top={100}
          left={52}
          label={`${i18n.drop[lan]} (SPACE)`}
          active={keyboard.get('drop') ?? false}
          ref={(c) => { this.dom_space = c; }}
        />
        <Button
          color="red"
          size="s2"
          top={0}
          left={196}
          label={`${i18n.reset[lan]}(R)`}
          active={keyboard.get('reset') ?? false}
          ref={(c) => { this.dom_r = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={106}
          label={`${i18n.sound[lan]}(S)`}
          active={keyboard.get('music') ?? false}
          ref={(c) => { this.dom_s = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={0}
          left={16}
          label={`${i18n.pause[lan]}(P)`}
          active={keyboard.get('pause') ?? false}
          ref={(c) => { this.dom_p = c; }}
        />
      </div>
    );
  }
}
