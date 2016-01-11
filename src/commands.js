const search = {
  regex: /\/search\s(\w+)\s(.+)/,
  inlineRegex: /(\w+)\s(.+)/,
  help: ``
};

const help = {
  regex: /\/help/,
  initMessage: `I can search *users*, *repos* and *issues* for you.

*users*:
  /search u user
  /search u mamal72

*repos*:
  /search r repo
  /search r react-github

*issues*:
  /search i issue
  /search i jquery

Note that you can use _user_, _users_, _repo_, _repos_, ` +
`_issue_ or _issues_ instead of that _u_, _r_, or _i_.
Those are just some simple shortcuts.

This bot is free and opensource. The code is published under *MIT* licence.
If you have any issue or suggestion, you can fill an issue ` +
`[here](https://github.com/mamal72/telegram-github-search-bot/issues).
`,
  help: ``
};

const start = {
  regex: /\/start/,
  initMessage: `Hello. Thanks for using me! ❤️
I hope I can be useful and be able to save some of your precious time.`
};


const commands = {
  search,
  help,
  start
};

export default commands;
