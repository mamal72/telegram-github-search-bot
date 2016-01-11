import TelegramBot from 'node-telegram-bot-api';

import * as github from './github';
import { token } from './config';
import { loadTemplate, loadInlineTemplate } from './templates';
import commands from './commands';


const bot = new TelegramBot(token, { polling: true });


// serach [repo|user|code|issue] term
bot.onText(commands.search.regex, async (msg, matches) => {
  const searchData = {
    scope: matches[1],
    term: matches[2]
  };

  const scopeKeys = Object.keys(github.scopes);
  const scope = scopeKeys.find(item => {
    return github.scopes[item].keywords.includes(searchData.scope);
  });

  // invalid scope
  if (!scope) {
    return bot.sendMessage(msg.chat.id, `I don't understand what's that "${searchData.scope}"!`);
  }

  const options = {
    ...github.scopes[scope].defaultOptions,
    q: searchData.term
  };

  const result = await github.search(scope, options);
  bot.sendMessage(msg.chat.id, loadTemplate(scope, result), {
    parse_mode: 'Markdown'
  });
});

bot.on('message', msg => {
  if (!msg.text && !msg.query) {
    return bot.sendMessage(msg.chat.id, `Sry! I only understand text stuff.
Use /help to get some help about my commands.`);
  }

  const commandNames = Object.keys(commands);
  const knownCommand = commandNames.find(item => {
    return commands[item].regex.exec(msg.text);
  });
  if (knownCommand && commands[knownCommand].initMessage) {
    return bot.sendMessage(msg.chat.id, commands[knownCommand].initMessage, {
      parse_mode: 'Markdown'
    });
  }
  if (knownCommand || msg.query) {
    return false;
  }

  bot.sendMessage(msg.chat.id, `Sry! I didn't understand that "${msg.text}".
Use /help to get some help about my commands.`);
});


bot.on('inline_query', async msg => {
  const commandNames = Object.keys(commands);
  const command = commandNames.find(item => {
    return commands[item].inlineRegex && commands[item].inlineRegex.exec(msg.query);
  });

  // if inline command not found
  if (command !== 'search') {
    return bot.answerInlineQuery(msg.id, [
      {
        id: '1',
        type: 'article',
        title: 'Not found',
        description: 'Command not found!',
        message_text: 'Command not found!'
      }
    ]);
  }

  const matches = commands[command].inlineRegex.exec(msg.query);

  const searchData = {
    scope: matches[1],
    term: matches[2]
  };

  const scopeKeys = Object.keys(github.scopes);
  const scope = scopeKeys.find(item => {
    return github.scopes[item].keywords.includes(searchData.scope);
  });

  // invalid scope
  if (!scope) {
    return bot.answerInlineQuery(msg.id, [
      {
        id: '1',
        type: 'article',
        title: 'Invalid Scope',
        description: `I don't understand what's that "${searchData.scope}"!`,
        message_text: `I don't understand what's that "${searchData.scope}"!`
      }
    ]);
  }

  const options = {
    ...github.scopes[scope].defaultOptions,
    q: searchData.term
  };
  const response = await github.search(scope, options);

  bot.answerInlineQuery(msg.id, loadInlineTemplate(scope, response));
});

export default bot;
