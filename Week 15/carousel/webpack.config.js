module.exports = {
    entry: {
        "main": "./main.js",
        "animation-demo": "./animation-demo.js",
        "gesture": "./gesture.js",
    },
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
        contentBase: '.',
        hot: true,
    },
}