# 学习笔记

1. 乔姆斯基谱系
    * 0型：无限制文法，产生式可以任意定义 **? ::= ?**
    * 1型：上下文相关文法，产生式在不同上下文环境可以不同 **?\<A>? ::= ?\<B>?**
    * 2型：上下文无关文法，一个非终结符由固定几种产生式定义，与上下文无关 **\<A> ::= ?**
    * 3型：正则文法，可用正则表达式表达，不支持尾递归产生式定义 **\<A> ::= \<A>?**
1. 实际的计算机语言一般都会在整体上满足一定类型的情况下，存在一些方便使用者的特例，从而不满足乔姆斯基谱系中的相应类别
1. JS中的Number类型满足IEEE 754双精度浮点数定义
1. JS中字符串使用UTF-16编码，支持迭代器语义来获取每一个unicode码点
1. JS中的对象类型采用原型对象来定义
