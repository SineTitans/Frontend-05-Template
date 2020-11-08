# 学习笔记

1. 使用Proxy对象作为新的界面接管对原始对象的操作，可以更灵活的开发功能强大的底层库；
1. reactive功能原理：reactive对象会被集中保存，用于在创建effect时进行依赖关系收集。reactive对象使用Proxy作为新的界面代理对原始对象的操作，过程中即可收集到effect回调会使用的以来信息；
1. MVVM模式是通过对reactive对象和view之间建立双向绑定关系，从而封装掉复杂的view操作代码，提升开发效率；
1. 在页面中拖拽一个元素的功能基本写法：
    * 在元素上监听mousedown，mousedown发生后再监听mousemove和mouseup；
    * mouseup时取消对mousemove和mouseup的监听；
    * mousemove和mouseup监听在document上，可以防止拖动断掉，还可以在拖动到视窗外面时继续发生回调；
1. 通过设置transform将元素移动到拖拽到的位置，每次拖拽结束后要保存当前的transform以供下次使用；
1. 通过Range对象保存一个DOM元素的位置，可以方便的将DOM元素插入到指定位置；
1. 使用range.getBoundingClientRect来获取一个包围盒。由于DOM操作过程中每个元素的位置都可能发生改变，在需要使用的时候再去获取这个包围盒。
