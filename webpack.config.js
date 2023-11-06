const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function getHtmlViews (templateDir, files_){
    files_ = files_ || [];
    let files = fs.readdirSync(templateDir);
    for (let i in files){
        let pathname = templateDir + '/' + files[i];
        if (fs.statSync(pathname).isDirectory()){
            getHtmlViews(pathname, files_);
        } else {
            files_.push(pathname);
        }
    }
    return files_;
}
let listViews = getHtmlViews("./src/views");
//console.log(listViews);

function generateHtmlPlugins(list) {
    //const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return list.map((item) => {
        const itemIn = item.substring(12);
        const pathName = itemIn.replace(/\.[^/.]+$/, "");
        //console.log('1'+itemIn);
        //console.log('2'+pathName);
        const template = path.resolve(__dirname, `${item}`)
        //console.log('3'+template);
        return new HtmlWebpackPlugin({
            filename: `${pathName}.html`,
            template: template,
            inject: false,
            minify: {
                removeComments: false
            }
        });
    });
}
const htmlPlugins = generateHtmlPlugins(listViews);

const config = {
    entry: ["./src/js/index.js", "./src/scss/style.scss"],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "./js/bundle.js",
        publicPath : '/',
    },
    devtool: "source-map",
    mode: "production",
    devServer: {
        liveReload: false,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            }),
            new TerserPlugin({
                extractComments: true
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, "src/scss"),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src/includes"),
                //exclude: [/node_modules/, require.resolve('./index.html')],
                use: ["raw-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./css/bundle.css",
        }),
        new CopyPlugin({
            patterns: [
                /*{
                    from: "./src/fonts",
                    to: "./fonts",
                    noErrorOnMissing: true
                },*/
                {
                    from: "./src/favicon",
                    to: "./favicon",
                    noErrorOnMissing: true
                },
                {
                    from: "./src/img",
                    to: "./img",
                    noErrorOnMissing: true
                },
                {
                    from: "uploads/**/*",
                    to:"./uploads",
                    noErrorOnMissing: true
                },
                {
                    from: "static",
                    to:"./",
                    noErrorOnMissing: true
                },
            ],
        }),
    ].concat(htmlPlugins),
};

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        config.plugins.push(new CleanWebpackPlugin());
    }
    return config;
};