import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';

const propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
};

function Index({ component, assets }) {
  const content = component ? ReactDOM.renderToStaticMarkup(component) : '';
  const stylesExist = Object.keys(assets.styles).length === 0;

  return (
    <html lang="en">
      <head>
        <title>Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        {Object.keys(assets.styles).map((style, key) =>
          <link
            href={assets.styles[style]} key={key}
            rel="stylesheet"
          />
        )}
        <style>
          ${
            Object.keys(assets.assets).reduce((styleA, styleB) => {
              if (styleB.match(/scss$/) && stylesExist) {
                // eslint-disable-next-line
                styleA += require(styleB.replace('./src', '..'))._style;
              }
              return styleA;
            }, '')
          }
        </style>
      </head>

      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }}></div>
        <script src={assets.javascript.main} charSet="UTF-8" />
      </body>

    </html>
  );
}

Index.propTypes = propTypes;

export default Index;
