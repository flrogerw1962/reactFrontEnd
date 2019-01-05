/* eslint-disable global-require, no-console */
import Express from 'express';
import path from 'path';

import React from 'react';
import { match, RouterContext } from 'react-router';
import routes from './src/routes';
import configureStore from './src/store/configureStore';

import { Provider } from 'react-redux';

import Index from './src/views/index';
import ReactDOM from 'react-dom/server';

const app = new Express();
const port = process.env.PORT || 5001;

if (app.get('env') === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack/dev.config');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, config.devServer));
}

app.use(Express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const store = configureStore();

  if (process.env.NODE_ENV === 'development') {
    global.webpackIsomorphicTools.refresh();
  }

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).send(err.message);
    }

    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (renderProps) {
      const component = (
        <Provider store={store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );

      res.status(200);

      const assets = global.webpackIsomorphicTools.assets();

      res.send(`<!doctype html>${ReactDOM.renderToStaticMarkup(<Index assets={assets} component={component} store={store} />)}`);
    } else {
      res.status(404);
    }
  });
});


app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> Server running on container port ${port}`);
  }
});
