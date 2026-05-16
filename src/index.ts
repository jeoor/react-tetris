import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/store';
import type { AppStore } from '@/store';
import App from '@/containers';
import '@/unit/const';
import '@/control';
import '@/styles/global.css';
import { subscribeRecord } from '@/lib';
import { bindMusicStore } from '@/unit/music';

subscribeRecord(store);
bindMusicStore(store);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

const root = createRoot(rootElement);
const ProviderComponent = Provider as React.ComponentType<{
  store: AppStore;
  children?: React.ReactNode;
}>;

root.render(
  React.createElement(
    ProviderComponent,
    { store },
    React.createElement(App),
  ),
);
