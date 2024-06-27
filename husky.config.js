module.exports = {
  hooks: {
    'pre-commit': `npx j1-integration document && git add docs/jupiterone.md && lint-staged && npm run document:permissions && npx prettier --write docs/jupiterone.md && git add docs/jupiterone.md`,
    'pre-push': 'npm run prepush',
  },
};
