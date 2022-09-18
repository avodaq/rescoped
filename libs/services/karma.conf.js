// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      // TODO: Probably need to change path, because its automatically generated but I edited it manually!
      dir: join(__dirname, '../../reports/coverage/libs/services'),
      file: 'summary.json',
    },
    junitReporter: {
      ...baseConfig.junitReporter,
      outputFile: 'services.xml',
    },
  });
};
