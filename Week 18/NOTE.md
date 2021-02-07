# 学习笔记

* mocha
  1. 作用：编写和执行单元测试
  1. 安装：`mocha`
  1. 默认单元测试放在`test`目录下，被测试代码在`src`目录下
  1. 支持es6module语法的方法：添加命令行参数`--require @babel/register`
  1. 配置文件`.mocharc.json`（也支持yaml等），可默认指定`require`的模块名
* nyc (istanbuljs)
  1. 作用：执行单元测试时统计测试代码对被测试代码的覆盖率
  1. 安装`nyc`
  1. 命令`nyc mocha`
  1. 配置文件`.nycrc`，在`extends`中指定插件
  1. babel插件`@istanbuljs/nyc-config-babel`
* babel
  1. nyc插件包名`babel-plugin-istanbul`
  1. 配置文件中添加的nyc插件名`istanbul`
  1. babel和nyc互相添加插件后，`nyc mocha`命令才能使用到babel提供的支持
