'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var token = 'YOUR_BOT_TOKEN';
var github = {
  version: '3.0.0',
  // optional
  debug: true,
  protocol: 'https',
  host: 'api.github.com',
  pathPrefix: '',
  timeout: 5000,
  headers: {
    'user-agent': 'Telegram Github Search Bot'
  }
};

exports.default = {
  token: token,
  github: github
};
module.exports = exports['default'];
//# sourceMappingURL=config.js.map
