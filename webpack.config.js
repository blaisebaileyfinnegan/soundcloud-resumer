const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

let isProd = false;
if (process.env.NODE_ENV === "production") {
  isProd = true;
}

const cfg = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? "cheap-module-source-map" : false,
  entry: {
    "srp-content": path.join(__dirname, "./src/extension/main.js"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src/manifest.json" }],
    }),
  ],
};

module.exports = cfg;
