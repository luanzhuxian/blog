---
title: Linux 常用命令
comments: true
categories: linux
tags: linux
abbrlink: 817c7d82
date: 2019-05-05 15:50:12
---

`ls` 查看当前目录下的文件（或文件夹）
```
  -l：查看详细信息

  -a：查看隐藏文件

  -la：同时具备以上特点
```

`pwd` print working directory, 打印工作目录，它会显示我们当前所在的目录路径。  

`cd` 目录切换
```
  cd ../ 返回上级目录
  cd ./ 返回当前目录
  cd / 返回根目录
  cd xxx 进入到指定文件夹
  cd E 进入到指定的磁盘
```

`mkdir` 创建文件夹  

`touch` 创建一个空文件  

`rm` 删除文件  
```
  -r  # 递归删除（把当前文件夹中所有的后代元素遍历删除）
  -f  # 强制删除
  -rf # 上面两种合并到一起，没有办法还原，慎重使用
```

`vi` 向指定文件中插入内容  
```
  首先进入命令窗口模式
  按i，进入到插入内容模式
  编辑需要写的内容
  按ESC，再按:wq  # 保存并退出
  q！ # 强制退出，内容不保存
```

`echo` 文字输出
```
  echo xxx > y.txt  # 把 xxx 内容放到 y.txt 文件中，如果没有这个文件则创建这个文件，新存放的内容会替换原有文件的内容
```

`cat` 查看文件中的内容  

`cp` 拷贝文件  

`mv` 移动文件
```
  mv index.html src  # index.html 是我们要移动的文件, src 是目标文件夹
```

`exit` 可以直接退出窗口  
