const currentTask = process.env.npm_lifecycle_event
const path = require("path")

// to autimatically remove the old files when builing dist files
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

// to copy css files in docs folder
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// to leverage html-webpack-plugin package to make our html be able to read hashed js and css
//  files in docs folder
const HtmlWebpackPlugin = require("html-webpack-plugin")

// importing fs-extra package to make us able to work with more than 1 html
const fse = require("fs-extra")

const postCSSPlugins =[
     require("postcss-import"),
     require("postcss-mixins"),
     require("postcss-simple-vars"),
     require("postcss-nested"),
     require("postcss-hexrgba"),
     require("autoprefixer")
 ]

class RunAfterCompile{
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', ()=>{
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}
let cssConfig =  {
    test: /\.css$/i,
    use: ["css-loader?url=false", {loader: "postcss-loader", options: {plugins: postCSSPlugins}} ]
}
// this will return an array with all of the files with .html   
let pages = fse.readdirSync('./app').filter(function (files){
    return files.endsWith(".html")
}).map((page) => {
    return new HtmlWebpackPlugin({
        filename:page,
        template:`./app/${page}`
    })
})
// config var is used when we need attribute for both dev and build modes
let config = {
    entry: "./app/assets/scripts/App.js",
    plugins: pages,
    module: {
        rules: [
           cssConfig
        ]
    }
 }

 if(currentTask == "dev"){
     cssConfig.use.unshift("style-loader")
    config.output = {
        filename: "bundled.js",
        path: path.resolve(__dirname, "app")   
    }
    config.devServer =  {
        before: function(app, server){
            server._watch("./app/**/*.html")
        },
        contentBase: path.join(__dirname,"app"),
        hot: true,
        port: 3000,
        host:"0.0.0.0"
    }
    config.mode = "development"
 }

 if(currentTask == "build"){
    //  to make our javaScript files work in wider variety of browsers
     config.module.rules.push({
         test: /\.js$/,
         exclude: /(node_modules)/,
         use:{
             loader: 'babel-loader',
             options: {
                 presets:['@babel/preset-env']
             }
         }
     })
     cssConfig.use.unshift(MiniCssExtractPlugin.loader)
     postCSSPlugins.push(require("cssnano"))
    config.output = {
        filename: "[name].[chunkhash].js",
        chunkFilename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "docs")
    }
    config.mode = "production"
    config.optimization = {
        splitChunks: {chunks: "all"}
    }
    // to autimatically remove the old files when builing docs files
    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: "styles.[chunkhash].css"}),
        new RunAfterCompile()
        )
}



module.exports = config