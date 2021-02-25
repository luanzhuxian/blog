---
title: Git 撤销与回滚
comments: true
abbrlink: 22c76f84
date: 2019-05-08 11:31:00
categories: git
tags: git
---

`git reset`、`git checkout`和`git revert`，都可以撤销代码仓库中的某些更改，前两条命令既可以用于`commit`级别，也可以用于`file`级别，也就是说可以指定撤销的文件，而`revert`不能指定文件。  

在了解这三个命令前，我们先需要了解`git`的工作区`Working Directory`、暂存区`Stage`（快照:add的缓存库）和历史记录区`History`（commit历史）的关系。  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/git-section.png)  

对应`source tree`来看：
![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/2.png)  

<br>

# Checkout
`checkout`最常用的用法莫过于切换分支，
```
    git checkout <branch>
```
其原理就是将`HEAD`指针指向另一个分支，并对当前工作区的内容进行覆盖。所以`git`会强制你提交或者缓存工作目录中的所有更改，不然在`checkout`的时候这些更改会丢失。  

除了切换分之，它也可以达到用暂存区或某一次历史提交还原工作区的效果：
未添加到暂存区的撤销，还没有`git add`：
````
    use 'git checkout -- <file>...' to discard changes in working directory
````
```
    git checkout HEAD // 用最新的一次提交覆盖工作区和暂存区
    git checkout HEAD～2 // 用上上次提交覆盖工作区和暂存区
    git checkout commit_id // 用某次提交覆盖工作区和暂存区
    git checkout -- <file>    // 撤销工作区中对文件的修改，实际上是用暂存区中的文件内容覆盖工作区中的文件内容
    git checkout -- <folder>    // 一次性撤销多个文件
```
![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/git-checkout.png)  

# Reset
`git reset`命令通过移动`HEAD`到某个提交`commit`，可以用来撤暂存区和工作区的提交。
````
    use "git reset HEAD <file>..." to unstage
````  

在`commit`级别上，一次性将所有暂存区的修改撤销：
````
    git reset HEAD  // HEAD 移动到上一次提交
    git reset HEAD～2  // HEAD 移动两步
    git reset commit_id // HEAD 移动到某个提交
    git reset [commit_id] -- <file>   // 用某个文件某次历史提交的内容覆盖暂存区中的该文件的修改
````

`reset`这个指令虽然可以用来撤销`commit`，但它的实质行为并不是撤销，而是移动`HEAD`，重置`HEAD`以及它所指向的`branch`的位置的。  
例如`reset HEAD～2`回退两步，则`HEAD`会指向第三个`commit`，而最近的两个`commit`会处于`HEAD`之后，这意味着在下一次提交时，最近的两个提交会被删掉。
![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/git-reset.png) 

# Revert
`git revert`命令是撤销某次操作，此次操作之前和之后的`commit`和`history`都会保留，并且把这次撤销作为一次最新的提交。  
`revert`撤销一个提交的同时会创建一个新的提交。相比`reset`，它不会改变现有的提交历史，可以用`revert`撤销已经提交的更改，用`reset`撤销没有提交的更改。  
```
    git revert HEAD 删除最后一次提交
    git revert [commit_id]
```
![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/git-revert.png)  


下面我们来实操一下看看。  

<br>

# reset 撤销暂存区、checkout 撤销工作区：

  
新增`index.js`，并`git add`添加到暂存区，还没有`git commit`：
```
    $ git status
    On branch dev
    Your branch is up to date with 'origin/dev'.

    Changes to be committed:
    (use 'git reset HEAD <file>...' to unstage)

            modified:   index.js

    Changes not staged for commit:
    (use 'git add <file>...' to update what will be committed)
    (use 'git checkout -- <file>...' to discard changes in working directory)

            modified:   index.js
```

用`reset`撤销清空暂存区：
```
    $ git reset HEAD index.js
    Unstaged changes after reset:
    M       index.js
```

再查看：
```
    $ git status
    On branch dev
    Your branch is up to date with 'origin/dev'.

    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

            modified:   index.js
```

再用`git checkout`清空工作区，之后再查看：
```
    $ git checkout -- index.js

    $ git status
    On branch dev
    Your branch is up to date with 'origin/dev'.

    nothing to commit, working tree clean
```

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/3.png)  

<br>

# revert 撤销历史区：

`commit`提交后想撤销，先提交修改然后再用`git log`查看提交记录。  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/4.png)  

```
    $ git log
    commit 707ffbee6b5b2f7eb7ff42e0a12992aaab43140c (HEAD -> dev, origin/dev)
    Author: lzx <luanzhuxian@hotmail.com>
    Date:   Tue Oct 27 09:19:54 2020 +0800

        third commit on dev
```

然后使用`git revert`后面跟上`git`提交的`commit_id`
```
    git revert 707ffbee6b5b2f7eb7ff42e0a12992aaab43140c

    Revert "third commit on dev"

    This reverts commit 707ffbee6b5b2f7eb7ff42e0a12992aaab43140c.

    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    #
    # On branch dev
    # Your branch is up to date with 'origin/dev'.
    #
    # Changes to be committed:
    #       modified:   index.js
```
修改后输入`esc`退出编辑模式，输入`:wq`保存编辑并退出。
```
    $ git revert 707ffbee6b5b2f7eb7ff42e0a12992aaab43140c
    [dev a137703] Revert "third commit on dev"
    1 file changed, 1 insertion(+), 3 deletions(-)
```

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/5.png)  

之后再推送到远端更新远程仓库代码，修改的文件就撤销了。  

用`source tree`操作：

回滚提交：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/6.png)  

回滚生成新的提交：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/7.png)  

提交到远程仓库：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/8.png)  

<br>

# Git Reset 三种模式：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/git-reset-mode.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/9.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/10.png)  

**reset --soft commit_id：**
保留本地`working directory工作区`，并把重置`HEAD`所带来的新的差异放进本地`stage暂存区`。

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/11.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/12.png)  

**reset --mixed commit_id：**
保留本地`working directory工作区`，并清空本地`stage`暂存区。
也就是说，工作目录的修改、暂存区的内容以及由`reset`所导致的新的文件差异，都会被放进工作目录。简而言之，就是把所有差异都混合`（mixed）`放在工作目录中。

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/13.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/14.png)  

**reset --hard  commit_id：**
强制将本地`stage`暂存区和本地`working directory`工作区都同步到你指定的提交。
会在重置`HEAD`和`branch`的同时，重置`stage`区和`working directory`里的内容。你的暂存区和工作目录里的内容会被完全重置为和`HEAD`的新位置相同的内容。没有`commit`的修改会被全部擦掉。
可以回退到某次提交 A，A 之后的提交都会回滚，覆盖是不可逆的，谨慎使用。

重置前：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/15.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/16.png)  

重置后：

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/17.png)  

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/18.png)  

之后强行推送更新远程仓库：
```
    $ git push origin dev -f
    Total 0 (delta 0), reused 0 (delta 0)
    To github.com:luanzhuxian/git-examples.git
    + def670f...707ffbe dev -> dev (forced update)
```

![Git 撤销与回滚](http://blog.luanzhuxian.com/blog/git-reset-revert/19.png)  

