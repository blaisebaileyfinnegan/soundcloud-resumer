const path = require("path");

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on("before:browser:launch", (browser, launchOptions) => {
    launchOptions.extensions.push(path.resolve("dist/"));
    return launchOptions;
  });
};
