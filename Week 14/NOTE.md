# 学习笔记

* 前端组件化是解决前端代码复用问题的路径
* 组件可以以树形结构来组合成UI，还具有模板化的配置能力。比起普通的对象，组件还具有以下这些概念：
  1. Attribute
  1. Config & State
  1. Event
  1. Lifecycle
  1. Children
* Attribute强调描述性，一般通过模板文件来进行配置。而Property强调从属关系，表示这是组件对象的一个部分。有的组件系统不对两者进行区分
* Config只在组件初始化时传入，而State是组件内部自治的状态，不允许外部代码操纵。
* 生命周期：至少要有onMount onUnmount onUpdate。
* children有两种设计方法：content型会把children中定义的东西置于自己的内容之中，而template型则是吧children中定义的东西用作创建自己内容的模板。

* JSX 通过配置@babel/plugin-transform-react-jsx插件，可以直接在js中用模板语法创建节点树或组件树。
* 在一个组件生命周期回调中创建和更改它的显示内容。
