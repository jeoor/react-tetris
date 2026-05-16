import React, { useLayoutEffect, useState } from 'react';
import QRCode from 'qrcode';
import style from './index.module.css';
import { transform, i18n, lan } from '../../unit/const';
import { isMobile } from '../../unit';

type GuideState = {
  isMobile: boolean;
  QRCode: string;
};

function Guide() {
  const [state, setState] = useState<GuideState>(() => ({
    isMobile: isMobile(),
    QRCode: '',
  }));

  useLayoutEffect(() => {
    if (state.isMobile) {
      return undefined;
    }

    let isActive = true;
    QRCode.toDataURL(window.location.href, { margin: 1 })
      .then((dataUrl) => {
        if (isActive) {
          setState((current) => ({ ...current, QRCode: dataUrl }));
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, [state.isMobile]);

  if (state.isMobile) {
    return null;
  }

  return (
    <div style={{ display: state.isMobile ? 'none' : 'block' }}>
      <div className={`${style.guide} ${style.right}`}>
        <div className={style.up}>
          <em style={{ [transform]: 'translate(0,-3px) scale(1,2)' }} />
        </div>
        <div className={style.left}>
          <em style={{ [transform]: 'translate(-7px,3px) rotate(-90deg) scale(1,2)' }} />
        </div>
        <div className={style.down}>
          <em style={{ [transform]: 'translate(0,9px) rotate(180deg) scale(1,2)' }} />
        </div>
        <div className={style.right}>
          <em style={{ [transform]: 'translate(7px,3px)rotate(90deg) scale(1,2)' }} />
        </div>
      </div>
      <div className={`${style.guide} ${style.left}`}>
        <p>
          <a href="https://github.com/chvin/react-tetris" rel="noopener noreferrer" target="_blank" title={i18n.linkTitle[lan]}>
            {`${i18n.github[lan]}:`}
          </a>
          <br />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=chvin&repo=react-tetris&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="170px"
            height="20px"
            style={{ [transform]: 'scale(1.68)', [`${transform}Origin`]: 'center left' }}
            title="GitHub stars"
          />
          <br />
          <iframe
            src="https://ghbtns.com/github-btn.html?user=chvin&repo=react-tetris&type=fork&count=true"
            frameBorder="0"
            scrolling="0"
            width="170px"
            height="20px"
            style={{ [transform]: 'scale(1.68)', [`${transform}Origin`]: 'center left' }}
            title="GitHub forks"
          />
        </p>
        <div className={style.space}>SPACE</div>
      </div>
      {state.QRCode !== '' ? (
        <div className={`${style.guide} ${style.qr}`}>
          <img
            src={state.QRCode}
            alt={i18n.QRCode[lan]}
          />
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(Guide);
