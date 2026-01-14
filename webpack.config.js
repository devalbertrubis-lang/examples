const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "bundle.[contenthash].js" : "bundle.js",
      clean: true
    },
    devServer: {
      static: { directory: path.join(__dirname, "dist") },
      port: 3000,
      hot: true
    },
    module: {
      rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: /\.css$/i,
            use: [
                isProd ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader"
            ]
        },
        {
          test: /\.scss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: { sourceMap: !isProd }
            },
            {
              loader: "postcss-loader",
              options: { sourceMap: !isProd }
            },
            {
              loader: "sass-loader",
              options: { api: "modern", sassOptions: { quietDeps: true }, sourceMap: !isProd }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        inject: "body"
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "styles.[contenthash].css" })]
        : [])
    ],
    devtool: isProd ? false : "source-map"
  };
};
