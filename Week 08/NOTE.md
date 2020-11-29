# 学习笔记

* 浏览器的工作流程：
    1. 将传入的Url通过Http请求拿到HTML内容
    1. 对HTML进行parse得到一棵DOM树
    1. 通过CSS计算将样式属性附加到DOM树上面
    1. 进行布局计算得到每个页面元素的位置
    1. 渲染得到最终看到的图片

* 掌握了函数式的状态机定义方式，函数式的有限状态机逻辑更为清晰，因为免除了多余的状态判断因而效率更高

* HTTP协议基于TCP协议实现。在Node.js中，net模块提供了tcp协议的封装，而http模块童工了http协议的封装

* http request的组成：
    1. request line （method + path + HTTP/<版本号>）
    1. request header （以一个空白行标志结束）
    1. request body （由header中的Content-Type决定其格式，Content-Length决定其长度）

* http response的组成：
    1. status line （HTTP/<版本号> + statusCode + statusText）
    1. response header （以一个空包行标志结束）
    1. response body （由header中的Transfer-Encoding决定其格式，Chunked body格式中，每个chunk由第一行的一个16进制的值来定义其长度，最后以一个0长度的chunk作为结束）

* http协议统一用\r\n表示换行
