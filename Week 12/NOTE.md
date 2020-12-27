# 学习笔记

* 标签 in HTML源码 => 元素 in DOM => 盒 in Layout & Rendering
* 盒模型： \[margin \[padding \[content\]\]\]
* 正常流布局：来源于印刷排版技术
  * 行内排版环境：IFC 从左往右排版
  * 行模型： line-top text-top base-line text-bottom line-bottom
  * 块级排版环境：BFC 从上往下排版
  * float属性：从正常流中抽出向指定方向浮动，正常流环绕float元素排布
    * float浮动默认会终止于容器边缘或碰到上一个float元素为止
    * clear属性：令当前浮动盒避开上一个浮动盒的位置再进行浮动
  * margin折叠：相邻块级元素的margin会发生重叠
  * BFC合并：Block Container之间会相互合并，表现和只有一个BFC一致
    * 可以令overflow属性不为visible来阻止BFC合并
* 弹性盒子：沿主轴方向排布盒子，盒子在交叉轴方向定义对齐方式
* CSS动画：@keyframes rule定义动画，在CSS样式中使用
* Transtion：定义CSS属性改变时的过渡效果，用三次贝叶斯曲线定义过渡函数
* CSS颜色：可以用RGB定义或HSL定义，使用HSL会更方便进行符合直觉的色相变换
* 技巧：可以在data uri中使用svg代码定义矢量图
