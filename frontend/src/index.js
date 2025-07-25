import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "react-redux"
import rootReducer from './reducer';
import {configureStore} from "@reduxjs/toolkit"
import {Toaster} from "react-hot-toast"
//import 'react-rating-stars-component/dist/index.css';
import './fontawesome'; 

const store=configureStore({
  reducer:rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter> 
  </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
