import {
  legacy_createStore as createStore,
  type Reducer,
  type Store,
  type StoreEnhancer,
} from 'redux';
import rootReducer from '../reducers';
import type { AppAction } from '../actions';
import type { RootState } from '../reducers';

type ReduxDevtoolsWindow = Window & {
  __REDUX_DEVTOOLS_EXTENSION__?: () => unknown;
};

const devtoolsWindow = window as ReduxDevtoolsWindow;

const devtools = (
  typeof window !== 'undefined' && devtoolsWindow.__REDUX_DEVTOOLS_EXTENSION__
    ? devtoolsWindow.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
) as StoreEnhancer | undefined;

const store: Store<RootState, AppAction> = createStore(
  rootReducer as Reducer<RootState, AppAction>,
  devtools,
);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

export default store;
