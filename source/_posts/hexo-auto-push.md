---
title: 自动备份Hexo博客文件
comments: true
categories: Hexo
tags: Hexo
abbrlink: a433710c
date: 2018-12-09 17:46:34
---

### 前言
每次更新博文都需要输入两三行重复的Git命令比较麻烦，下面介绍一种自动备份Hexo博客源文件的方法。

### 原理
通过通过监听`Hexo`的事件来完成自动执行Git命令完成自动备份。通过查阅[Hexo文档](https://hexo.io/zh-cn/api/events.html)，找到了`Hexo`的主要事件，见下表：

事件名|事件发生时间
---|---
deployBefore|在部署完成前发布
deployAfter|在部署成功后发布
exit|在 Hexo 结束前发布
generateBefore|在静态文件生成前发布
generateAfter|在静态文件生成后发布
new|在文章文件建立后发布

于是我们就可以通过监听`Hexo`的`deployAfter`事件，待上传完成之后自动运行`Git`备份命令，从而达到自动备份的目的。

### 实现

#### 将Hexo目录加入Git仓库

在`Github`下创建一个新的`repository`，取名为`HEXO`。(与本地的Hexo源码文件夹同名即可)  
进入本地的`Hexo`文件夹，执行以下命令创建仓库:
```
  git init
```

设置远程仓库地址，并更新：
```
  git remote add origin git@github.com:xxx/hexo.git
  git pull origin master
```

修改`.gitignore`文件（如果没有请手动创建一个），在里面加入`*.log`和 `public/`以及`.deploy*/`。因为每次执行`hexo generate`命令时，上述目录都会被重写更新。因此忽略这两个目录下的文件更新，加快push速度。

执行命令以下命令，完成`Hexo`源码在本地的提交，并将本地的仓库文件推送到`Github`。
```
  git add .
  git commit -m "添加hexo源码文件作为备份"
  git push origin master
```

#### 安装shelljs模块
要实现这个自动备份功能，需要依赖`NodeJs`的一个`shelljs`模块,该模块重新包装了`child_process`,调用系统命令更加的方便。  
在命令中键入以下命令，完成`shelljs`模块的安装：
```
  npm install --save shelljs
```

#### 编写自动备份脚本
模块安装完成，在`Hexo`根目录的`scripts`文件夹下新建一个js文件，文件名随意取。（如果没有scripts目录，请新建一个。）  
然后在脚本中，写入以下内容：
```
  require('shelljs/global');

  try {
    hexo.on('deployAfter', function() {//当deploy完成后执行备份
      run();
    });
  } catch (e) {
    console.log("Error:" + e.toString());
  }

  function run() {
    if (!which('git')) {
      echo('Sorry, this script requires git');
      exit(1);
    } else {
      echo("======================Auto Backup Begin===========================");
      cd('/Users/666/Desktop/code/project/Blog');    //此处修改为Hexo根目录路径
      if (exec('git add --all').code !== 0) {
        echo('Error: Git add failed');
        exit(1);
      }
      if (exec('git commit -am "Form auto backup script\'s commit"').code !== 0) {
        echo('Error: Git commit failed');
        exit(1);
      }
      if (exec('git push origin master').code !== 0) {
        echo('Error: Git push failed');
        exit(1);
      }
      echo("==================Auto Backup Complete============================")
    }
  }
```
- `cd('/Users/666/Desktop/code/project/Blog')`路径为本地`Hexo`的根目录路径。
- 如果你的Git远程仓库名称不为`origin`的话，还需要修改执行的`push`命令，修改成自己的远程仓库名和相应的分支名。

保存脚本并退出，然后执行`hexo deploy`命令，将会得到类似以下结果：
```
```
这样子，每次更新博文并`deploy`到服务器上之后，备份就自动启动并完成备份啦~
