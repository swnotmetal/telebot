const { version } = require('../package.json');

module.exports = {
  timeout: 60,
  protocol: 'https',
  host: 'ws.detectlanguage.com',
  apiVersion: '0.2',
  userAgent: `detectlanguage-node/${version}`,
};
