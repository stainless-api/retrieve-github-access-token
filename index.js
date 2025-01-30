const core = require('@actions/core');

const BASE_URL = 'https://api.stainlessapi.com/api';

async function main() {
  try {
    const fullRepo = core.getInput('repo');
    const apiKey = core.getInput('stainless-api-key');

    const result = await retrieveGithubAccessToken(fullRepo, apiKey);

    core.setOutput('github_access_token', result.token);
  } catch (err) {
    core.setFailed(`retrieve-github-access-token failed: ${err.message}`);
  }
}

async function retrieveGithubAccessToken(fullRepo, apiKey) {
  const [owner, repo] = fullRepo.split('/');

  if (!owner || !repo) {
    throw new Error(`Could not resolve owner and repo name from ${fullRepo}`);
  }

  if (!apiKey) {
    throw new Error('Missing stainless-api-key input');
  }

  console.log(`Getting Github access token for`, { owner, repo });

  const url = `${BASE_URL}/github-access-token`;
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      owner,
      repo,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status > 299) {
    throw new Error(`${url} received ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  const data = safeJson(text);
  if (data instanceof Error) {
    throw new Error(`Could not process API response. text=${text} data=${data} status=${res.status}`);
  }

  console.log('API Response', data);

  if (data?.error) {
    throw new Error(`API Error ${res.status} - ${data.error}`);
  }

  if (!res.ok) {
    throw new Error(`API Error ${res.status} - ${data}`);
  }

  if (data?.token) {
    return { token: data.token };
  }
}

/**
 * Returns an `Error` object if parsing the given JSON string fails instead of throwing
 */
function safeJson(input) {
  try {
    return JSON.parse(input);
  } catch (err) {
    return new Error(err);
  }
}

main();
