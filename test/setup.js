const noop = () => {};

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.ico'] = noop;
require.extensions['.svg'] = noop;

/* eslint-disable no-underscore-dangle */
const m = require('module');
const originalLoader = m._load;

m._load = function hookedLoader(request, parent, isMain) {
  if (request.match(/.jpeg|.jpg|.png|.gif$/)) {
    return { uri: request };
  }
  return originalLoader(request, parent, isMain);
};
/* eslint-enable */
