import musicUrl from '../resource/music/music.mp3';

import type { RootState } from '../reducers';

type AudioContextConstructor = typeof window.AudioContext;
type StoreLike = {
  getState: () => RootState;
};

type MusicController = {
  killStart?: () => void;
  start?: () => void;
  clear?: () => void;
  fall?: () => void;
  gameover?: () => void;
  rotate?: () => void;
  move?: () => void;
};

let currentStore: StoreLike | null = null;

const AudioContextClass = (
  window.AudioContext
  || (window as Window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
) as AudioContextConstructor | undefined;

export const bindMusicStore = (store: StoreLike) => {
  currentStore = store;
};

export const hasWebAudioAPI = {
  data: !!AudioContextClass && window.location.protocol.indexOf('http') !== -1,
};

const isMusicEnabled = () => {
  if (!currentStore) {
    return false;
  }
  return currentStore.getState().get('music');
};

export const music: MusicController = {};

(() => {
  if (!hasWebAudioAPI.data) {
    return;
  }

  const context = new AudioContextClass!();
  const req = new XMLHttpRequest();
  req.open('GET', musicUrl, true);
  req.responseType = 'arraybuffer';

  req.onload = () => {
    context.decodeAudioData(
      req.response,
      (buf: AudioBuffer) => {
        const getSource = () => {
          const source = context.createBufferSource();
          source.buffer = buf;
          source.connect(context.destination);
          return source;
        };

        music.killStart = () => {
          music.start = () => {};
        };

        music.start = () => {
          music.killStart?.();
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 3.7202, 3.6224);
        };

        music.clear = () => {
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 0, 0.7675);
        };

        music.fall = () => {
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 1.2558, 0.3546);
        };

        music.gameover = () => {
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 8.1276, 1.1437);
        };

        music.rotate = () => {
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 2.2471, 0.0807);
        };

        music.move = () => {
          if (!isMusicEnabled()) {
            return;
          }
          getSource().start(0, 2.9088, 0.1437);
        };
      },
      (error) => {
        if (window.console && window.console.error) {
          window.console.error(`Audio load failed: ${musicUrl}`, error);
          hasWebAudioAPI.data = false;
        }
      },
    );
  };

  req.send();
})();

export default {
  bindMusicStore,
  hasWebAudioAPI,
  music,
};
