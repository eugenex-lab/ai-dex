const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    fs: false,
    crypto: require.resolve("crypto-browserify"),
    assert: require.resolve("assert"),
    stream: require.resolve("stream-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    path: require.resolve("path-browserify"),
    url: require.resolve("url"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};
