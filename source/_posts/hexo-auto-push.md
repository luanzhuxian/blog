---
title: 自动备份 Hexo 博客文件
comments: true
categories: Hexo
tags: Hexo
abbrlink: a433710c
date: 2018-12-09 17:46:34
---

# 前言
每次更新博文都需要输入两三行重复的Git命令比较麻烦，下面介绍一种自动备份 Hexo 博客源文件的方法。

# 原理
通过通过监听 Hexo 的事件来完成自动执行Git命令完成自动备份。通过查阅 [Hexo文档](https://hexo.io/zh-cn/api/events.html)，找到了 Hexo 的主要事件，见下表：

事件名|事件发生时间
---|---
deployBefore|在部署完成前发布
deployAfter|在部署成功后发布
exit|在 Hexo 结束前发布
generateBefore|在静态文件生成前发布
generateAfter|在静态文件生成后发布
new|在文章文件建立后发布

于是我们就可以通过监听 Hexo 的`deployAfter`事件，待上传完成之后自动运行 Git 备份命令，从而达到自动备份的目的。

# 实现

## 删除 Next 主题的 .git 缓存文件夹
我们如果要将项目上传到远程仓库，先要`git add .`添加到暂存区，然后`git commit`，这时会出现如下报错：
```
  Changes not staged for commit:
          modified:   themes/xxx
```
并且提交后会发现远程仓库主题文件夹都是空的。因为位于`themes`文件夹下的主题是从另一个 git 仓库上 clone 过来的，由于你 clone 下来的文件夹也是一个 git 仓库，因此正常的`git add .`是无法提交该文件夹下的文件的，会和 Hexo 仓库冲突，每次提交只会提交 Hexo 项目的修改，而不会提交 Next 主题的修改。  所以我们要先删除`.git缓存文件`。  

**解决方案：**
- 1、先强行删除 clone 来的主题目录下的 .git 文件夹：
在`themes/next`目录下打开命令行工具，执行`rd/s/q .git`命令，删除成功后执行`ls .git`命令提示如下内容说明删除成功：
```
  $ ls .git
  ls: cannot access '.git': No such file or directory
```
- 2、回到仓库根目录删除已经托管的空主题文件夹：
```
  git rm -rf --cached "themes/next"
  git commit -m "remove empty folder"
  git push origin master
```
使名为主题目录不再接受版本控制，所以就没有子模块的冲突了。之后上传不会报上面的错。  


## 将 Hexo 博客源文件上传 Git 仓库
上传后也可以随时拉取代码，方便更新管理项目。  
在 Github 下创建一个新的`repository`，命名与本地的源码文件夹同名即可。
进入本地的源码根目录，执行以下命令创建仓库:
```
  git init
```
设置远程仓库地址，并更新：
```
  git remote add origin git@github.com:用户名/版本库名(xxx/hexo.git)
  git pull origin master
```

修改`.gitignore`文件（如果没有请手动创建一个）。如果想忽略掉某个文件，不让这个文件提交到版本库中，可以使用修改 .gitignore 文件的方法。 .gitignore 的匹配规则：
```
  *.a       # 忽略所有 .a 结尾的文件
  !lib.a    # 但 lib.a 除外
  /TODO     # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
  build/    # 忽略 build/ 目录下的所有文件
  doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```
**注意：若有不该提交的文件已经提交后，仅仅在 .gitignore 中加入忽略是不行的。这个时候需要执行：`git rm -r --cached 文件/文件夹名字`。**  

在 .gitignore 文件里面加入`*.log`和 `public/`以及`.deploy*/`。因为每次执行`hexo generate`命令时，上述目录都会被重写更新。因此忽略这两个目录下的文件更新，加快 push 速度。

执行命令以下命令，完成 Hexo 源码在本地的提交，并将本地的仓库文件推送到 Github。
```
  git add .
  git commit -m "xxx"
  git push origin master
```
这样就可以从其他计算机拉取项目了。

## 安装 shelljs 模块
要实现这个自动备份功能，需要依赖 NodeJs 的一个 shelljs 模块，该模块重新包装了`child_process`，调用系统命令更加的方便。  
在命令中键入以下命令，完成 shelljs 模块的安装：
```
  npm install --save shelljs
```

## 编写自动备份脚本
模块安装完成，在 Hexo 根目录的`scripts`文件夹下新建一个 js 文件，文件名随意取。（如果没有`scripts`目录，请新建一个。）  
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
- `cd('/Users/666/Desktop/code/project/Blog')`路径为本地 Hexo 的根目录路径。
- 如果你的 Git 远程仓库名称不为 origin 的话，还需要修改执行的 push 命令，修改成自己的远程仓库名和相应的分支名。

保存脚本并退出，然后执行`hexo deploy`命令，将会得到类似以下结果：
```
  INFO  Deploy done: git
  INFO  Deploying: baidu_url_submitter
  INFO  Submitting urls
  ...省略
  INFO  Deploy done: baidu_url_submitter
  [master 3db66ca] Form auto backup script's commit
   4 files changed, 93 insertions(+), 8 deletions(-)
   create mode 100644 source/_posts/hexo-compress.md
  To https://github.com/luanzhuxian/Blog.git
     f7e5190..3db66ca  master -> master
  ==================Auto Backup Complete============================
```
这样子，每次更新博文并`deploy`到服务器上之后，备份就自动启动并完成备份啦~
