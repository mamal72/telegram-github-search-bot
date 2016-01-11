import { scopes } from './github';
const templates = Object.keys(scopes);

export function loadTemplate(tpl, data) {
  if (!templates.includes(tpl)) {
    throw new Error(`Template not found. Use one of these: ${Object.keys(templates).join(', ')}`);
  }
  if (data.total_count === 0) {
    return `No ${tpl} found!
You can try with some other keywords.`;
  }
  let rendered;
  let typeName;
  let itemsTemplate;
  let renderData;
  switch (tpl) {
    case 'users':
      typeName = data.total_count !== 1 ? 'users' : 'user';
      renderData = { ...data, typeName };
      itemsTemplate = renderData.items.reduce((prev, curr, index) => {
        return `${prev}
${index + 1}.
👤 [${curr.login}](${curr.html_url})
[Repos](https://github.com/${curr.login}?tab=repositories) | ` +
`[Activity](https://github.com/${curr.login}?tab=activity) | [Avatar](${curr.avatar_url})
`;
      }, '');
      break;

    case 'repos':
      typeName = data.total_count !== 1 ? 'repos' : 'repo';
      renderData = { ...data, typeName };
      itemsTemplate = renderData.items.reduce((prev, curr, index) => {
        return `${prev}
${index + 1}.
🗄 [${curr.name}](${curr.html_url}) by [${curr.owner.login}](${curr.owner.html_url})` +
` in #${curr.language}
⭐️ ${curr.stargazers_count} Stars
📥 [Clone](${curr.clone_url})
`;
      }, '');
      break;

    case 'issues':
      typeName = data.total_count !== 1 ? 'issues' : 'issue';
      renderData = { ...data, typeName };
      itemsTemplate = renderData.items.reduce((prev, curr, index) => {
        return `${prev}
${index + 1}.
🗄 [${curr.title}](${curr.html_url}) by [${curr.user.login}](${curr.user.html_url})` +
` ${curr.state === 'open' ? '⚪️' : '⚫️'}
👤 Assigned to ${curr.assignee ?
'[' + curr.assignee.login + '](' + curr.assignee.html_url + ')' : 'nobody'}
💬 ${curr.comments} ${curr.comments === 1 ? 'Comments' : 'Comment'}
`;
      }, '');
      break;

    default:
      break;
  }

  rendered = `I found *${renderData.total_count}* ${renderData.typeName}.
${renderData.total_count > 10 ? `Here is top *10* ${renderData.typeName}:\n` : ''}${itemsTemplate}`;

  return rendered;
}


export function loadInlineTemplate(tpl, data) {
  if (!templates.includes(tpl)) {
    throw new Error(`Template not found. Use one of these: ${Object.keys(templates).join(', ')}`);
  }
  if (data.total_count === 0) {
    return [
      {
        id: '1',
        type: 'article',
        title: `No results!`,
        parse_mode: 'Markdown',
        description: `No ${tpl} found!`,
        message_text: `No ${tpl} found!
    You can try with some other keywords.`
      }
    ];
  }

  let typeName;
  let renderData;
  let rendered;

  switch (tpl) {
    case 'users':
      typeName = data.total_count === 1 ? 'users' : 'user';
      renderData = { ...data, typeName };
      rendered = renderData.items.reduce((prev, curr, index) => {
        return [
          ...prev,
          {
            id: index.toString(),
            type: 'article',
            title: `${curr.login}`,
            url: `${curr.html_url}`,
            thumb_url: `${curr.avatar_url}`,
            message_text: `👤 [${curr.login}](${curr.html_url})
[Repos](https://github.com/${curr.login}?tab=repositories) | ` +
`[Activity](https://github.com/${curr.login}?tab=activity) | [Avatar](${curr.avatar_url})
`,
            parse_mode: 'Markdown'
          }
        ];
      }, []);
      return rendered;

    case 'repos':
      typeName = data.total_count !== 1 ? 'repos' : 'repo';
      renderData = { ...data, typeName };
      rendered = renderData.items.reduce((prev, curr, index) => {
        return [
          ...prev,
          {
            id: index.toString(),
            type: 'article',
            title: `${curr.name} by ${curr.owner.login}`,
            description: `#${curr.language}`,
            url: `${curr.html_url}`,
            thumb_url: `${curr.owner.avatar_url}`,
            message_text: `🗄 [${curr.name}](${curr.html_url}) by ` +
`[${curr.owner.login}](${curr.owner.html_url})` +
` in #${curr.language}
⭐️ ${curr.stargazers_count} Stars
📥 [Clone](${curr.clone_url})
`,
            parse_mode: 'Markdown'
          }
        ];
      }, []);
      return rendered;

    case 'issues':
      typeName = data.total_count !== 1 ? 'issues' : 'issue';
      renderData = { ...data, typeName };
      rendered = renderData.items.reduce((prev, curr, index) => {
        return [
          ...prev,
          {
            id: index.toString(),
            type: 'article',
            title: `${curr.state === 'open' ? '⚪️' : '⚫️'} ${curr.title} by ${curr.user.login}`,
            description: `👤 Assigned to ${curr.assignee ? curr.assignee.login : 'nobody'}`,
            url: `${curr.html_url}`,
            thumb_url: `${curr.assignee ? curr.assignee.avatar_url : ''}`,
            message_text: `🗄 [${curr.title}](${curr.html_url}) ` +
`by [${curr.user.login}](${curr.user.html_url})` +
` ${curr.state === 'open' ? '⚪️' : '⚫️'}
👤 Assigned to ${curr.assignee ?
'[' + curr.assignee.login + '](' + curr.assignee.html_url + ')' : 'nobody'}
💬 ${curr.comments} ${curr.comments !== 1 ? 'Comments' : 'Comment'}
`,
            parse_mode: 'Markdown'
          }
        ];
      }, []);
      return rendered;

    default:
      break;
  }
}
