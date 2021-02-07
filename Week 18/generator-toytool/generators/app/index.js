var Generator = require("yeoman-generator");

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
    }

    async initPackage() {
        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname, // Default to current folder name
            },
        ]);

        const pkgJson = {
            "name": answers.name.replace(" ", "-"),
            "version": "1.0.0",
            "main": "index.js",
            "license": "ISC",
            "scripts": {
                "build": "webpack",
                "test": "mocha",
                "coverage": "nyc mocha"
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
        this.yarnInstall(["vue"], { dev: false });
        this.yarnInstall(
            [
                "webpack",
                "webpack-cli",
                "copy-webpack-plugin",
                "@babel/core",
                "@babel/preset-env",
                "@babel/register",
                "babel-loader",
                "vue-loader",
                "vue-template-compiler",
                "css-loader",
                "vue-style-loader",
                "mocha",
                "@types/mocha",
                "nyc",
                "babel-plugin-istanbul",
                "@istanbuljs/nyc-config-babel",
            ],
            { dev: true }
        );

        this.fs.copyTpl(
            this.templatePath("HelloWorld.vue"),
            this.destinationPath("src/HelloWorld.vue")
        );
        this.fs.copyTpl(
            this.templatePath("main.js"),
            this.destinationPath("src/main.js")
        );
        this.fs.copyTpl(
            this.templatePath("index.html"),
            this.destinationPath("src/index.html"),
            {
                title: answers.name,
            }
        );
        this.fs.copyTpl(
            this.templatePath("sample.test.js"),
            this.destinationPath("test/sample.test.js")
        );
        this.fs.copyTpl(
            this.templatePath("webpack.config.js"),
            this.destinationPath("webpack.config.js")
        );
        this.fs.copyTpl(
            this.templatePath(".babelrc"),
            this.destinationPath(".babelrc")
        );
        this.fs.copyTpl(
            this.templatePath(".nycrc"),
            this.destinationPath(".nycrc")
        );
        this.fs.copyTpl(
            this.templatePath(".mocharc.json"),
            this.destinationPath(".mocharc.json")
        );
    }
};
