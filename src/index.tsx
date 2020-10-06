import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons/css/tachyons.min.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducers/';
// import defaultActors from './data/actors.json';
// import { getEvents } from './data';
// import { Actor } from './data/models';
// import { flatMap } from 'lodash/fp';

// const events = flatMap(getEvents, (defaultActors as any) as Actor[]);

const store = configureStore({
  reducer: rootReducer,
  // preloadedState: {
  //   events,
  // },
  middleware: getDefaultMiddleware({ immutableCheck: false }),
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
