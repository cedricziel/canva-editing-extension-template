const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devServer: {
        contentBase: "./dist",
        https: true,
        port: 8999,
        disableHostCheck: true
    },
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    output: {
        path: __dirname + "/dist",
        publicPath: "/",
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./src/template.html", inject: false })
    ],
};