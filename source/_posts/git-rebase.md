---
title: Git rebase
comments: true
categories: git
tags: git
abbrlink: 7e43902c
date: 2019-05-08 13:42:00
---

**注意：不要通过 rebase 对任何已经提交到公共仓库中的 commit 进行修改**  

# 合并多个 commit 为一个完整 commit
当我们在本地仓库中提交了多次，在我们把本地提交 push 到公共仓库中之前，为了让提交记录更简洁明了，我们希望把如下分支 B、C、D 三个提交记录合并为一个完整的提交，然后再 push 到公共仓库。
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_1.png)
现在我们在测试分支上添加了四次提交，我们的目标是把最后三个提交合并为一个提交：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_2.png)
这里我们使用命令：
```
  git rebase -i [startpoint] [endpoint]
```
其中 -i 的意思是 --interactive，即弹出交互式的界面让用户编辑完成合并操作，[startpoint] [endpoint] 则指定了一个编辑区间，如果不指定 [endpoint]，则该区间的终点默认是当前分支 HEAD 所指向的 commit (注：该区间指定的是一个前开后闭的区间)。  

在查看到了 log 日志后，我们运行以下命令：
```
  git rebase -i 36224db
```
或：
```
  git rebase -i HEAD~3
```
然后我们会看到如下界面：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_3.png)
上面注释的部分列出的是我们本次 rebase 操作包含的所有提交，下面注释部分是 git 为我们提供的命令说明。每一个 commit id 前面的 pick 表示指令类型，git 为我们提供了以下几个命令：
- pick：保留该 commit
- reword：保留该 commit，但我需要修改该 commit 的注释
- edit：保留该 commit, 但我要停下来修改该提交(不仅仅修改注释)
- squash：将该 commit 和前一个 commit 合并
- fixup：将该 commit 和前一个 commit 合并，但我不要保留该提交的注释信息
- exec：执行 shell 命令
- drop：我要丢弃该 commit  

我们将 commit 内容编辑如下：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_4.png)
然后是注释修改界面：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_5.png)
编辑完保存即可完成commit的合并了。

# 将某一段 commit 粘贴到另一个分支上
当我们项目中存在多个分支，有时候我们需要将某一个分支中的一段提交同时应用到其他分支中，就像下图：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_6.png)
我们希望将 develop 分支中的 C~E 部分复制到 master 分支中，这时我们就可以通过 rebase 命令来实现。
在实际模拟中，我们创建了 master 和 develop 两个分支。
master 分支：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_7.png)
develop 分支：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_8.png)
使用命令：
```
  git rebase [startpoint] [endpoint] --onto [branchName]
```
其中，[startpoint] [endpoint] 仍然指定了一个前开后闭的编辑区间，--onto 的意思是要将该指定的提交复制到哪个分支上。  
所以，在找到 C(90bc0045b) 和 E(5de0da9f2) 的提交 id 后，我们运行以下命令：
```
  git rebase 90bc0045b^ 5de0da9f2 --onto master
```
注：因为 [startpoint] [endpoint] 指定的是一个前开后闭的区间，为了让这个区间包含 C，我们将区间起始点向后退了一步。  

运行完成后查看当前分支的日志：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_9.png)
可以看到，C~E部分的提交内容已经复制到了G的后面了。  
我们看一下当前分支的状态：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_10.png)
当前 HEAD 处于游离状态，实际上，此时所有分支的状态应该是这样：
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_11.png)
所以，git 只是将 C~E 部分的提交内容复制一份粘贴到了 master 所指向的提交后面，我们需要做的就是将 master 所指向的提交 id 设置为当前 HEAD 所指向的提交 id 就可以了，即：
```
  git checkout master
  git reset --hard  0c72e64
```
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-rebase_12.png)
