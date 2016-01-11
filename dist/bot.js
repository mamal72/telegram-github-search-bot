'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _github = require('./github');

var github = _interopRequireWildcard(_github);

var _config = require('./config');

var _templates = require('./templates');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var bot = new _nodeTelegramBotApi2.default(_config.token, { polling: true });

// serach [repo|user|code|issue] term
bot.onText(_commands2.default.search.regex, function () {
  var _this = this;

  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(msg, matches) {
    var searchData, scopeKeys, scope, options, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            searchData = {
              scope: matches[1],
              term: matches[2]
            };
            scopeKeys = Object.keys(github.scopes);
            scope = scopeKeys.find(function (item) {
              return github.scopes[item].keywords.includes(searchData.scope);
            });

            // invalid scope

            if (scope) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', bot.sendMessage(msg.chat.id, 'I don\'t understand what\'s that "' + searchData.scope + '"!'));

          case 5:
            options = _extends({}, github.scopes[scope].defaultOptions, {
              q: searchData.term
            });
            _context.next = 8;
            return github.search(scope, options);

          case 8:
            result = _context.sent;

            bot.sendMessage(msg.chat.id, (0, _templates.loadTemplate)(scope, result), {
              parse_mode: 'Markdown'
            });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}());

bot.on('message', function (msg) {
  if (!msg.text && !msg.query) {
    return bot.sendMessage(msg.chat.id, 'Sry! I only understand text stuff.\nUse /help to get some help about my commands.');
  }

  var commandNames = Object.keys(_commands2.default);
  var knownCommand = commandNames.find(function (item) {
    return _commands2.default[item].regex.exec(msg.text);
  });
  if (knownCommand && _commands2.default[knownCommand].initMessage) {
    return bot.sendMessage(msg.chat.id, _commands2.default[knownCommand].initMessage, {
      parse_mode: 'Markdown'
    });
  }
  if (knownCommand || msg.query) {
    return false;
  }

  bot.sendMessage(msg.chat.id, 'Sry! I didn\'t understand that "' + msg.text + '".\nUse /help to get some help about my commands.');
});

bot.on('inline_query', function () {
  var _this2 = this;

  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(msg) {
    var commandNames, command, matches, searchData, scopeKeys, scope, options, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commandNames = Object.keys(_commands2.default);
            command = commandNames.find(function (item) {
              return _commands2.default[item].inlineRegex && _commands2.default[item].inlineRegex.exec(msg.query);
            });

            // if inline command not found

            if (!(command !== 'search')) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt('return', bot.answerInlineQuery(msg.id, [{
              id: '1',
              type: 'article',
              title: 'Not found',
              description: 'Command not found!',
              message_text: 'Command not found!'
            }]));

          case 4:
            matches = _commands2.default[command].inlineRegex.exec(msg.query);
            searchData = {
              scope: matches[1],
              term: matches[2]
            };
            scopeKeys = Object.keys(github.scopes);
            scope = scopeKeys.find(function (item) {
              return github.scopes[item].keywords.includes(searchData.scope);
            });

            // invalid scope

            if (scope) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt('return', bot.answerInlineQuery(msg.id, [{
              id: '1',
              type: 'article',
              title: 'Invalid Scope',
              description: 'I don\'t understand what\'s that "' + searchData.scope + '"!',
              message_text: 'I don\'t understand what\'s that "' + searchData.scope + '"!'
            }]));

          case 10:
            options = _extends({}, github.scopes[scope].defaultOptions, {
              q: searchData.term
            });
            _context2.next = 13;
            return github.search(scope, options);

          case 13:
            response = _context2.sent;

            bot.answerInlineQuery(msg.id, (0, _templates.loadInlineTemplate)(scope, response));

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this2);
  }));

  return function (_x3) {
    return ref.apply(this, arguments);
  };
}());

exports.default = bot;
module.exports = exports['default'];
//# sourceMappingURL=bot.js.map
