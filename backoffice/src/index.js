import React from "react";
import { BrowserRouter } from "react-router-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { render } from "react-dom";
import App from "./layout/App";
import reducer from "./store/reducer";
import config from "./config";
import "./assets/scss/style.scss";
import { SENTRY_DNS } from './store/constant';
import * as serviceWorker from "./serviceWorker";
// import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";

const store = createStore(reducer);

const rootElement = document.getElementById("root");

// Observability with sentry

// Sentry.init({
//   dsn: SENTRY_DNS,
//   integrations: [new BrowserTracing()],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

render(
  <Provider store={store}>
    <BrowserRouter basename={config.basename}>
      <App />
    </BrowserRouter>
  </Provider>,
  rootElement
);

serviceWorker.unregister();
