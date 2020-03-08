module.exports = {
  default: [
    '--require ./features/support/setup.ts',
    '--require ./features/steps/**/*.ts',
    '--require-module ts-node/register',
  ].join(' '),
};
