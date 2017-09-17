import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import axios from 'axios';
import reducers from './reducers';
import App from './components/App';
import Signin from './components/Signin';
import Invites from './components/Invites';
import Invite from './components/Invite';

import { FETCH_INVITES } from './actions';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const user = localStorage.getItem('user');

const hash = user ? JSON.parse(user).hash : 'unauthorized';
axios.get(`/fetch/${hash}`)
    .then(response => {
      store.dispatch({
        type: FETCH_INVITES,
        payload: response.data
      });
    });

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Invites} />
        <Route path="signin" component={Signin} />
        <Route path='invite/:url' component={Invite} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('.container'));
