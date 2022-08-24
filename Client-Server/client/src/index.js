import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// import thunk from 'redux-thunk';

import './index.css';
import "rsuite/dist/rsuite.min.css";

import App from './App';
// import finderReducer from './store/reducers/finder';

// const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

// const rootReducer = combineReducers({
//     finder: finderReducer
// });

// const store = createStore(rootReducer, composeEnhancers(
//     applyMiddleware(thunk)
// ));

const app = (
    // <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    // </Provider>
);

ReactDOM.render( app, document.getElementById( 'root' ) );

