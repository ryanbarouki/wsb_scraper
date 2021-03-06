import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import mongoose 
// mongoose.connect('mongodb://localhost:27017/wsbScraper', {useNewUrlParser: true, useUnifiedTopology: true})
// .then(() => {
//     console.log("Mongo connection started!");
// })
// .catch(err => {
//     console.log("Oh no Mongo connection error!");
//     console.log(err);
// });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
