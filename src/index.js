import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/custom.css';
import './assets/css/tailwind.css';
import './assets/css/tailwind.output.css';
import App from './App';
import ThemeSuspense from './components/theme/ThemeSuspense';
// import * as serviceWorker from './serviceWorker';

// if (process.env.NODE_ENV !== "production") {
//   const axe = require("react-axe");
//   axe(React, ReactDOM, 1000);
// }

ReactDOM.render(
  <Suspense fallback={<ThemeSuspense />}>
    <App />
  </Suspense>,
  document.getElementById('root') // This is where your React app will be mounted
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
