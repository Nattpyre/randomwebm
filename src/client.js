import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ErrorReporter from 'redbox-react';
import deepForceUpdate from 'react-deep-force-update';
import FastClick from 'fastclick';
import queryString from 'query-string';
import App from './components/App';
import createFetch from './utils/createFetch';
import history from './utils/history';
import { updateMeta } from './utils/DOMUtils';

/* eslint-disable global-require */

// React Tap Event Plugin
injectTapEventPlugin();

const context = {
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  },

  // Universal HTTP client
  fetch: createFetch({
    baseUrl: window.App.apiUrl,
  }),
};

const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete() {
  const elem = document.getElementById('css');

  if (elem) elem.parentNode.removeChild(elem);

  onRenderComplete = function renderComplete(route, location) {
    document.title = route.title;

    updateMeta('description', route.description);

    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];

    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);

      if (targetHash) {
        const target = document.getElementById(targetHash);

        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    window.scrollTo(scrollX, scrollY);
  };
};

FastClick.attach(document.body);

const container = document.getElementById('app');
let appInstance;
let currentLocation = history.location;
let router = require('./utils/router').default;

async function onLocationChange(location, action) {
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };

  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }

  currentLocation = location;

  try {
    const route = await router.resolve({
      ...context,
      path: location.pathname,
      query: queryString.parse(location.search),
    });


    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    appInstance = ReactDOM.render(
      <App context={context}>{route.component}</App>,
      container,
      () => onRenderComplete(route, location),
    );
  } catch (error) {
    if (__DEV__) {
      appInstance = null;
      document.title = `Error: ${error.message}`;
      ReactDOM.render(<ErrorReporter error={error} />, container);

      throw error;
    }

    console.error(error);

    if (action && currentLocation.key === location.key) {
      window.location.reload();
    }
  }
}

history.listen(onLocationChange);
onLocationChange(currentLocation);

if (__DEV__) {
  window.addEventListener('error', (event) => {
    appInstance = null;
    document.title = `Runtime Error: ${event.error.message}`;
    ReactDOM.render(<ErrorReporter error={event.error} />, container);
  });
}

if (module.hot) {
  module.hot.accept('./router', () => {
    router = require('./utils/router').default;

    if (appInstance) {
      try {
        deepForceUpdate(appInstance);
      } catch (error) {
        appInstance = null;
        document.title = `Hot Update Error: ${error.message}`;
        ReactDOM.render(<ErrorReporter error={error} />, container);

        return;
      }
    }

    onLocationChange(currentLocation);
  });
}
