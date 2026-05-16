import React from 'react';
import cn from 'classnames';

import style from './index.module.css';
import { transform } from '../../../unit/const';

export type ButtonProps = {
  color: string;
  size: string;
  top: number;
  left: number;
  label: string;
  position?: boolean;
  arrow?: string;
  active: boolean;
};

export default class Button extends React.Component<ButtonProps> {
  dom: HTMLElement | null = null;

  shouldComponentUpdate(nextProps: ButtonProps) {
    return nextProps.active !== this.props.active;
  }

  render() {
    const {
      active, color, size, top, left, label, position = false, arrow = '',
    } = this.props;
    return (
      <div
        className={cn({ [style.button]: true, [style[color]]: true, [style[size]]: true })}
        style={{ top, left }}
      >
        <i
          className={cn({ [style.active]: active })}
          ref={(c) => { this.dom = c; }}
        />
        {size === 's1' && (
          <em
            style={{
              [transform]: `${arrow} scale(1,2)`,
            }}
          />
        )}
        <span className={cn({ [style.position]: position })}>{label}</span>
      </div>
    );
  }
}
