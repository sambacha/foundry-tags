const cp = require('child_process');
const core = require('@actions/core');
const fs = require('fs');
const dateFormat = require('dateformat');
const { context } = require('@actions/github');

const isGitHubTag = ref => ref && ref.includes('refs/tags/');

const isBranch = ref => ref && ref.includes('refs/heads/');

const timestamp = () => dateFormat(new Date(), 'yyyy-mm-dd.HHMMss');

const createTags = () => {
  core.info('Creating Foundry image tags...');
  const { sha } = context;
  const addLatest = core.getInput('addLatest') === 'true';
  const addTimestamp = core.getInput('addTimestamp') === 'true';
  const ref = context.ref.toLowerCase();
  const shortSha = sha.substring(0, 7);
  const foundryTags = [];

  if (isGitHubTag(ref)) {
    // If GitHub tag exists, use it as the Foundry tag
    const tag = ref.replace('refs/tags/', '');
    foundryTags.push(tag);
  } else if (isBranch(ref)) {
    // If we're not building a tag, use branch-prefix-{GIT_SHORT_SHA) as the Foundry tag
    // refs/heads/jira-123/feature/something
    const branchName = ref.replace('refs/heads/', '');
    const safeBranchName = branchName
      .replace(/[^\w.-]+/g, '-')
      .replace(/^[^\w]+/, '')
      .substring(0, 120);
    const baseTag = `${safeBranchName}-${shortSha}`;
    const tag = addTimestamp ? `${baseTag}-${timestamp()}` : baseTag;
    foundryTags.push(tag);
  } else {
    core.setFailed(
      'Unsupported GitHub event - only supports push https://help.github.com/en/articles/events-that-trigger-workflows#push-event-push'
    );
  }

  if (addLatest) {
    foundryTags.push('latest');
  }

  core.info(`Foundry tags created: ${foundryTags}`);
  return foundryTags;
};