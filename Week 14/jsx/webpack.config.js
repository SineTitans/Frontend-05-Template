module.exports = {
    entry: "./main.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                use:  {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", {
                            pragma: "createElement",
                            pragmaFrag: "Fragment"
                        }]]
                    }
                }
            }
        ]
    },
    mode: "development",
    devServer: {
        contentBase: './dist',
        hot: true,
    },
}