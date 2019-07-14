const glob = require("glob")
const path = require("path");
const config = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const vueLoaderConf = require("./vue-loader.conf");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {resolveStyle} = require("./utils");

const isdev = process.env.NODE_ENV == "development";

function resolve(dir) {
    return path.resolve(__dirname, "..", dir)
}

console.log(...resolveStyle([{
    less: {}
}]))

let entryFiles = glob.sync("./src/pages/**/index.js");
let entry = {};
let htmlConfs = [];
entryFiles.forEach((item) => {
    let key = item.substring("./src/pages/".length, item.length - "/index.js".length);
    let htmlTemplate = item.replace(".js", ".html");
    let chunkarr = key.split("/");
    let chunkpath = "";
    if(chunkarr.length == 1) {
        chunkpath = "js/" + chunkarr[0]
    }else {
        for(let i = 0; i < chunkarr.length - 1; i++) {
            chunkpath += chunkarr[i] + "/";
        }
        chunkpath += "js/" + chunkarr[chunkarr.length - 1];
    }
    entry[chunkpath] = item;
    // console.log(chunkpath)
    htmlConfs.push(new HtmlWebpackPlugin({
        template: htmlTemplate,
        filename: key + ".html",
        chunksSortMode: 'manual',
        minify: {
            removeComments: true
        },
        chunks: ["js/vendor", "js/manifest",  chunkpath]
    }))
})

module.exports = {
    entry: entry,
    output: {
        path: resolve("dist"),
        filename: isdev ? "[name].js" : "[name].[chunkhash:8].js",
        chunkFilename: isdev ? "[name].js" : "[name].[chunkhash:8].js",
        publicPath: isdev ? config.dev.publicPath : config.build.publicPath
    },
    module: {
        rules: [
            {
                test: /\.vue/,
                loader: "vue-loader",
                options: vueLoaderConf
            },
            ...resolveStyle([{
                less: {}
            }]),
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|gif|svg|jpe?g)$/,
                loader: "url-loader",
                options: {
                    name: isdev ? "img/[name].[ext]" : "img/[name].[hash:7].[ext]",
                    limit: 8192
                }
            }
        ]
    },
    plugins: [
        ...htmlConfs,
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([{
            from: resolve("src/static"),
            to: resolve("dist")
        }])
    ],
    resolve: {
        alias: {
          vue$: "vue/dist/vue.esm.js",
          "@": resolve("src"),
          "pages": resolve("src/pages"),
          "components": resolve("src/components")
        },
        extensions: [".js", ".json", ".vue"]
    },
    optimization: {
        namedModules: true, // 选择是否给module更有意义的名称 (true会显示路径,false直接采用索引)
        namedChunks: true, // 选择是否给chunk更有意义的名称 (true会显示路径,false直接采用索引)
        runtimeChunk: {
            name: "js/manifest"
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "js/vendor",
                    chunks: "all",
                    test: /node_modules/,
                    priority: 10
                }
            }
        }
    }
}