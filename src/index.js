import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './store';

import CountryPicker from './components/CountryPicker';

ReactDOM.render(
  <Provider store={store}>
    <CountryPicker />
  </Provider>,
  document.getElementById('root')
);
