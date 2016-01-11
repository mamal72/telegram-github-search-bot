'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTemplate = loadTemplate;
exports.loadInlineTemplate = loadInlineTemplate;

var _github = require('./github');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var templates = Object.keys(_github.scopes);

function loadTemplate(tpl, data) {
  if (!templates.includes(tpl)) {
    throw new Error('Template not found. Use one of these: ' + Object.keys(templates).join(', '));
  }
  if (data.total_count === 0) {
    return 'No ' + tpl + ' found!\nYou can try with some other keywords.';
  }
  var rendered = undefined;
  var typeName = undefined;
  var itemsTemplate = undefined;
  var renderData = undefined;
  switch (tpl) {
    case 'users':
      typeName = data.total_count !== 1 ? 'users' : 'user';
      renderData = _extends({}, data, { typeName: typeName });
      itemsTemplate = renderData.items.reduce(function (prev, curr, index) {
        return prev + '\n' + (index + 1) + '.\n👤 [' + curr.login + '](' + curr.html_url + ')\n[Repos](https://github.com/' + curr.login + '?tab=repositories) | ' + ('[Activity](https://github.com/' + curr.login + '?tab=activity) | [Avatar](' + curr.avatar_url + ')\n');
      }, '');
      break;

    case 'repos':
      typeName = data.total_count !== 1 ? 'repos' : 'repo';
      renderData = _extends({}, data, { typeName: typeName });
      itemsTemplate = renderData.items.reduce(function (prev, curr, index) {
        return prev + '\n' + (index + 1) + '.\n🗄 [' + curr.name + '](' + curr.html_url + ') by [' + curr.owner.login + '](' + curr.owner.html_url + ')' + (' in #' + curr.language + '\n⭐️ ' + curr.stargazers_count + ' Stars\n📥 [Clone](' + curr.clone_url + ')\n');
      }, '');
      break;

    case 'issues':
      typeName = data.total_count !== 1 ? 'issues' : 'issue';
      renderData = _extends({}, data, { typeName: typeName });
      itemsTemplate = renderData.items.reduce(function (prev, curr, index) {
        return prev + '\n' + (index + 1) + '.\n🗄 [' + curr.title + '](' + curr.html_url + ') by [' + curr.user.login + '](' + curr.user.html_url + ')' + (' ' + (curr.state === 'open' ? '⚪️' : '⚫️') + '\n👤 Assigned to ' + (curr.assignee ? '[' + curr.assignee.login + '](' + curr.assignee.html_url + ')' : 'nobody') + '\n💬 ' + curr.comments + ' ' + (curr.comments === 1 ? 'Comments' : 'Comment') + '\n');
      }, '');
      break;

    default:
      break;
  }

  rendered = 'I found *' + renderData.total_count + '* ' + renderData.typeName + '.\n' + (renderData.total_count > 10 ? 'Here is top *10* ' + renderData.typeName + ':\n' : '') + itemsTemplate;

  return rendered;
}

function loadInlineTemplate(tpl, data) {
  if (!templates.includes(tpl)) {
    throw new Error('Template not found. Use one of these: ' + Object.keys(templates).join(', '));
  }
  if (data.total_count === 0) {
    return [{
      id: '1',
      type: 'article',
      title: 'No results!',
      parse_mode: 'Markdown',
      description: 'No ' + tpl + ' found!',
      message_text: 'No ' + tpl + ' found!\n    You can try with some other keywords.'
    }];
  }

  var typeName = undefined;
  var renderData = undefined;
  var rendered = undefined;

  switch (tpl) {
    case 'users':
      typeName = data.total_count === 1 ? 'users' : 'user';
      renderData = _extends({}, data, { typeName: typeName });
      rendered = renderData.items.reduce(function (prev, curr, index) {
        return [].concat(_toConsumableArray(prev), [{
          id: index.toString(),
          type: 'article',
          title: '' + curr.login,
          url: '' + curr.html_url,
          thumb_url: '' + curr.avatar_url,
          message_text: '👤 [' + curr.login + '](' + curr.html_url + ')\n[Repos](https://github.com/' + curr.login + '?tab=repositories) | ' + ('[Activity](https://github.com/' + curr.login + '?tab=activity) | [Avatar](' + curr.avatar_url + ')\n'),
          parse_mode: 'Markdown'
        }]);
      }, []);
      return rendered;

    case 'repos':
      typeName = data.total_count !== 1 ? 'repos' : 'repo';
      renderData = _extends({}, data, { typeName: typeName });
      rendered = renderData.items.reduce(function (prev, curr, index) {
        return [].concat(_toConsumableArray(prev), [{
          id: index.toString(),
          type: 'article',
          title: curr.name + ' by ' + curr.owner.login,
          description: '#' + curr.language,
          url: '' + curr.html_url,
          thumb_url: '' + curr.owner.avatar_url,
          message_text: '🗄 [' + curr.name + '](' + curr.html_url + ') by ' + ('[' + curr.owner.login + '](' + curr.owner.html_url + ')') + (' in #' + curr.language + '\n⭐️ ' + curr.stargazers_count + ' Stars\n📥 [Clone](' + curr.clone_url + ')\n'),
          parse_mode: 'Markdown'
        }]);
      }, []);
      return rendered;

    case 'issues':
      typeName = data.total_count !== 1 ? 'issues' : 'issue';
      renderData = _extends({}, data, { typeName: typeName });
      rendered = renderData.items.reduce(function (prev, curr, index) {
        return [].concat(_toConsumableArray(prev), [{
          id: index.toString(),
          type: 'article',
          title: (curr.state === 'open' ? '⚪️' : '⚫️') + ' ' + curr.title + ' by ' + curr.user.login,
          description: '👤 Assigned to ' + (curr.assignee ? curr.assignee.login : 'nobody'),
          url: '' + curr.html_url,
          thumb_url: '' + (curr.assignee ? curr.assignee.avatar_url : ''),
          message_text: '🗄 [' + curr.title + '](' + curr.html_url + ') ' + ('by [' + curr.user.login + '](' + curr.user.html_url + ')') + (' ' + (curr.state === 'open' ? '⚪️' : '⚫️') + '\n👤 Assigned to ' + (curr.assignee ? '[' + curr.assignee.login + '](' + curr.assignee.html_url + ')' : 'nobody') + '\n💬 ' + curr.comments + ' ' + (curr.comments !== 1 ? 'Comments' : 'Comment') + '\n'),
          parse_mode: 'Markdown'
        }]);
      }, []);
      return rendered;

    default:
      break;
  }
}
//# sourceMappingURL=templates.js.map
