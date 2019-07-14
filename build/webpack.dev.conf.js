const config = require("./config");
const portfinder = require("portfinder");
const baseConf = require("./webpack.base.conf");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const notifier = require("node-notifier");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const packageConfig = require("../package.json");

const devConf = merge(baseConf, {
    mode: "development",
    devtool: config.dev.devtool,
    devServer: {
        host: process.env.HOST || config.dev.host,
        port: process.env.PORT || config.dev.port,
        hot: true,
        open: false,
        publicPath: config.dev.publicPath,
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.publicPath, 'index.html') },
            ]
        },
        overlay: {
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = devConf.devServer.port;
    portfinder.getPortPromise()
        .then((port) => {
            devConf.devServer.port = port;
            devConf.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`You application is running here http://${devConf.devServer.host}:${port}`]
                },
                onErrors: function (severity, errors) {
                    if (severity !== 'error') return

                    const error = errors[0]
                    const filename = error.file && error.file.split('!').pop()
                
                    notifier.notify({
                      title: packageConfig.name,
                      message: severity + ': ' + error.name,
                      subtitle: filename || ''
                    })
                }
            }))
            resolve(devConf)
        })
        .catch((err) => {
            reject(err)
        })
})