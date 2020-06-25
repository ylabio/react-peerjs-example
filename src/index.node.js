import React from 'react';
import path from 'path';
import { parentPort, workerData } from 'worker_threads';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Base64 } from 'js-base64';
import { ChunkExtractor } from '@loadable/server';
import insertText from '@utils/insert-text';
import store from '@store';
import history from '@app/history';
import peerJs from '@utils/peer-js';
import api from '@api';
import App from '@app';
import config from 'config.js';
import template from './index.html';

store.configure();
api.configure(config.api);
history.configure({ ...config.routing, initialEntries: [workerData.url] }); // with request url
peerJs.configure();

const jsx = (
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);

let initPromises = [];
global.pushInitPromise = promise => {
  initPromises.push(promise);
};

(async () => {
  global.SSR_FIRST_RENDER = true;
  const result = renderToString(jsx);
  await Promise.all(initPromises);

  const statsFile = path.resolve('./dist/node/loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile });
  const jsxExtractor = extractor.collectChunks(jsx);

  global.SSR_FIRST_RENDER = false;
  const html = renderToString(jsxExtractor);

  let preloadDataScript = '';
  if (config.ssr.preloadState) {
    const storeState = Base64.encode(JSON.stringify(store.getState()));
    preloadDataScript = `<script>window.preloadedState = '${storeState}'</script>`;
  }

  const helmetData = Helmet.renderStatic();
  const baseTag = `<base href="${config.routing.basename}">`;
  const titleTag = helmetData.title.toString();
  const metaTag = helmetData.meta.toString();
  const linkTags = helmetData.link.toString();

  const scriptTags = extractor.getScriptTags();
  const linkTags2 = extractor.getLinkTags();
  const styleTags = extractor.getStyleTags();

  let out = template;
  out = insertText.before(out, '<head>', baseTag + titleTag + metaTag);
  out = insertText.after(out, '</head>', styleTags + linkTags + linkTags2);
  out = insertText.before(out, '<div id="app">', html);
  out = insertText.after(out, '</body>', preloadDataScript + scriptTags);

  parentPort.postMessage({ out, status: 200 });
})();

process.on('unhandledRejection', function (reason /*, p*/) {
  parentPort.postMessage({ out: 'ERROR', status: 500 });
  console.error(reason);
  process.exit(1);
});
