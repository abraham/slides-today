export default {
  import: ['./features/support/setup.ts', './features/steps/**/*.ts'],
  tags: process.env.BROWSER === 'firefox' ? 'not @skip-firefox' : undefined,
};
