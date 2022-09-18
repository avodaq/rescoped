// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { constants } = require('karma');

module.exports = () => {
  return {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    preprocessors: {
      'src/**/*.js': ['coverage'],
    },
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'json', subdir: '.' },
      ],
    },
    junitReporter: {
      outputDir: '../../reports/junit',
      useBrowserName: false,
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'junit'],
    port: 9876,
    colors: true,
    logLevel: constants.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: true,
    failOnEmptyTestSuite: false,
  };
};
