/* eslint import/no-extraneous-dependencies: 0 */
// https://github.com/mozilla/addons-frontend/commit/6bbf218dc3c3872cbe25654cb63ed0dfd367cf00
const chalk = require("chalk");
const { getConsoleOutput } = require("@jest/console");
const DefaultReporter = require("@jest/reporters/build/default_reporter")
  .default;
const getResultHeader = require("@jest/reporters/build/get_result_header")
  .default;

const TITLE_BULLET = chalk.bold("\u25cf ");

// This Jest reporter does not output any console.log except when the tests are
// failing, see: https://github.com/mozilla/addons-frontend/issues/2980.
class FingersCrossedReporter extends DefaultReporter {
  printTestFileHeader(testPath, config, result) {
    this.log(getResultHeader(result, this._globalConfig, config));

    const consoleBuffer = result.console;
    const testFailed = result.numFailingTests > 0;

    if (testFailed && consoleBuffer && consoleBuffer.length) {
      // prettier-ignore
      this.log(
        `  ${TITLE_BULLET}Console\n\n${getConsoleOutput(
          config.cwd,
          !!this._globalConfig.verbose,
          consoleBuffer
        )}`
      );
    }
  }
}

module.exports = FingersCrossedReporter;
