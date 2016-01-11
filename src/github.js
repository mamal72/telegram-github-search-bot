import GithubAPI from 'github';

const github = new GithubAPI({
  version: '3.0.0'
});

export function search(scope, data) {
  return new Promise((resolve, reject) => {
    github.search[scope](data, (err, response) => {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
}

export function searchCode(data) {
  return search('code', data);
}

export function searchIsuues(data) {
  return search('issues', data);
}

export function searchRepos(data) {
  return search('repos', data);
}

export function searchUsers(data) {
  return search('users', data);
}

export const scopes = {
  issues: {
    keywords: ['issue', 'issues', 'i'],
    defaultOptions: {
      sort: 'comments',
      order: 'desc',
      per_page: 10
    }
  },
  repos: {
    keywords: ['repo', 'repos', 'repository', 'r'],
    defaultOptions: {
      sort: 'stars',
      order: 'desc',
      per_page: 10
    }
  },
  users: {
    keywords: ['user', 'users', 'u'],
    defaultOptions: {
      sort: 'followers',
      order: 'desc',
      per_page: 10
    }
  }
};
// export default github;
