const token = 'YOUR_BOT_TOKEN';
const github = {
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

export default {
  token,
  github
};
