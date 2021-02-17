# 学习笔记

* 前端发布系统构成：
  1. 线上Web服务：对外提供服务
  1. 发布系统：接收发布内容进行发布
  1. 发布工具：向发布系统发布内容的命令行工具

* Node Steam:
  * Writable Steam:
    1. write - 写入数据
    1. end - 设置不再向流写入数据
    1. on "drain" - 流恢复了可写入状态
  * Readable Steam
    1. on "data" - 从流中读到了数据
    1. on "end" - 流中不再会读到新的数据
    1. pipe - 将从流中读到的数据直接写入一个可写入的流

* 数据压缩传输和解压缩
  * archiver - 压缩目录、文件或glob，得到一个可读取的流
  * unzipper - 从一个可读取的流中获取数据进行解压

* Github OAuth流程：
  1. 客户端 - 以Github App的client_id为参数，访问一个页面
  1. 授权页面 - 检查Github用户登陆状态和对应Github App的授权状态，要求用户授权
  1. 回调请求 - Github授权成功后将一次性的code作为参数请求回调页面
  1. 服务器 - 使用client_id, code, client_secret获取授权token，生成回调页面
  1. 客户端 - 拿到token，作为参数用于服务鉴权
