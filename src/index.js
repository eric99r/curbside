import React from 'react';
import ReactDOM from 'react-dom';
import "./index.scss"; // Standard version
import store, { persistor } from "./app/store/store";
import App from './App';
ReactDOM.render(
  <App
    store={store}
    persistor={persistor}
  />,
  document.getElementById("root")
);
