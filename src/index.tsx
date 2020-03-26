import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons/css/tachyons.min.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/';
import defaultActors from './data/actors.json';
import { getEvents, Actor } from './data/';
import _ from 'lodash';

const events = _.flatMap((defaultActors as any) as Actor[], getEvents);

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    events
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// todo: Pointer cursor on hover/selectable elements, aria-labels, stop propagation
