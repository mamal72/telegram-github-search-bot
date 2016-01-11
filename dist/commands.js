"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var search = {
  regex: /\/search\s(\w+)\s(.+)/,
  inlineRegex: /(\w+)\s(.+)/,
  help: ""
};

var help = {
  regex: /\/help/,
  initMessage: "I can search *users*, *repos* and *issues* for you.\n\n*users*:\n  /search u user\n  /search u mamal72\n\n*repos*:\n  /search r repo\n  /search r react-github\n\n*issues*:\n  /search i issue\n  /search i jquery\n\nNote that you can use _user_, _users_, _repo_, _repos_, " + "_issue_ or _issues_ instead of that _u_, _r_, or _i_.\nThose are just some simple shortcuts.\n\nThis bot is free and opensource. The code is published under *MIT* licence.\nIf you have any issue or suggestion, you can fill an issue " + "[here](https://github.com/mamal72/telegram-github-search-bot/issues).\n",
  help: ""
};

var start = {
  regex: /\/start/,
  initMessage: "Hello. Thanks for using me! ❤️\nI hope I can be useful and be able to save some of your precious time."
};

var commands = {
  search: search,
  help: help,
  start: start
};

exports.default = commands;
module.exports = exports['default'];
//# sourceMappingURL=commands.js.map
