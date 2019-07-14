const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isdev = process.env.NODE_ENV == "development";

const cssLoader = {
    loader: "css-loader",
    options: {
        sourceMap: true
    }
}

const postcssLoader = {
    loader: "postcss-loader",
    options: {
        sourceMap: true
    }
}

let cssRules = [cssLoader, postcssLoader];

if (isdev) {
    cssRules.unshift("vue-style-loader");
}else {
    cssRules = ExtractTextPlugin.extract({
        fallback: "vue-style-loader",
        use: cssRules
    })
}

function addLoaders(obj) {
    const keys = Object.keys(obj);
    const key = keys[0];
    let tempRules = [cssLoader, postcssLoader];
    if(isdev) {
        tempRules.unshift("vue-style-loader");
        tempRules.push({
            loader: key + "-loader",
            options: Object.assign({
                sourceMap: true
            }, obj[key])
        })
    }else {
        tempRules.push({
            loader: key + "-loader",
            options: Object.assign({
                sourceMap: true
            }, obj[key])
        })
        tempRules = ExtractTextPlugin.extract({
            fallback: "vue-style-loader",
            use: tempRules
        })
    }
    return {
        test: new RegExp("\." + key + "$"),
        use: tempRules
    }
}

exports.resolveStyle = function(extensions) {
    let output = [];
    output.push({
        test: /\.css$/,
        use: cssRules
    })
    for(let i=0; i<extensions.length; i++) {
        output.push(addLoaders(extensions[i]))
    }
    return output
}
