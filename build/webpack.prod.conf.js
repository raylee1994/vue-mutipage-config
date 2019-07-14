const config = require("./config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const UglifyPlugin = require("uglifyjs-webpack-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConf = require("./webpack.base.conf");
const glob = require("glob");

const entries = glob.sync("./src/pages/**/index.js");
const cssPlugins = [];

entries.forEach(function(entry) {
  cssPlugins.push(
    new ExtractTextPlugin({
      filename: getPath => {
        return getPath("[name].[md5:contenthash:hex:8].css").replace(
          "js",
          "css"
        );
      }
    })
  );
});

module.exports = merge(baseConf, {
  mode: "production",
  devtool: config.build.devtool,
  plugins: [
    ...cssPlugins,
    new webpack.NamedChunksPlugin(), // 根据文件名来稳定你的chunkid
    new webpack.HashedModuleIdsPlugin() //生成稳定ModuleId,新增模块后,其他模块的构建后的文件Hash没有变化，提高缓存命中率
  ],
  /* optimization: {
    minimizer: [
      new UglifyPlugin({
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  } */
});
