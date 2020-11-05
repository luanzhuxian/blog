---
title: Git rebase 变基
comments: true
categories: git
tags: git
abbrlink: 7e43902c
date: 2019-05-08 13:42:00
---

# 合并和变基

在`Git`中整合来自不同分支的修改主要有两种方法：`merge`以及`rebase`。 

当两个不同分支，各自提交了更新，就会形成分叉： 

![rebase](/images/git-rebase/merge-vs-reabse-1.png)

整合分支最容易的方法是`merge`命令：把两个分支的最新快照`C3`和`C4`，以及二者最近的共同祖先`C2`进行三方合并，合并的结果是生成一个新的快照。 

![rebase](/images/git-rebase/merge-vs-reabse-2.png)

还有一种方法叫做变基`rebase`：你可以提取在`C4`中引入的补丁和修改，然后在`C3`的基础上应用一次，将修改都移至`C3`上。  

我们先切换到`experiment`分支，再变基：
```
    $ git checkout experiment
    $ git rebase master
```
变基原理是，首先找到这两个分支的最近共同祖先`C2`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件，然后将当前分支指向目标基底`C3`, 最后将存为临时文件的修改依序应用。  
即将`C4`变基到`C3`，以`C3`为基础重新生成`C4`（注：此`C4`和`experiment`上的`C4`不一样，`commit id`不同）。  

![rebase](/images/git-rebase/merge-vs-reabse-3.png)

之后切回`master`进行合并。  

![rebase](/images/git-rebase/merge-vs-reabse-4.png)

这两种整合方法的最终结果没有任何区别，但是变基使得提交历史更加整洁。下面具体举例说明。  



# 模拟日常开发 - 合并

两个分支`master`和`dev`分别有了提交，现在要将`dev`合并到`master`上。  

![rebase](/images/git-rebase/start.png)

**直接 git merge：**
```
    $ git checkout master
    $ git merge dev
```
那么`git`会这么做：
1、找出`master`分支和`dev`分支的最近共同祖先`commit(357cb79)`。
2、将`master`最新一次`commit(e88ccad)`和`dev`最新一次`commit(05352ed)`合并后生成一个新的`commit(33d1a54)`，有冲突的话需要解决冲突。
3、将`master`和`dev`上，自`357cb79`之后的所有提交按照提交时间的先后顺序进行依次应用到`master`分支上。  

![rebase](/images/git-rebase/merge.png)  

**git rebase 后再 git merge：**
```
    $ git checkout dev
    $ git rebase master
    
    $ git checkout master
    $ git merge dev
```
1、`rebase`之前需要经`master`分支拉到最新。
2、切换分支到需要`rebase`的分支，这里是`dev`分支。
3、执行`git rebase master`，有冲突就解决冲突，解决后直接`git add .`再`git rebase --continue`即可。可以发现并没有多出一次`commit`，且`master`上新增提交的`commit id`值已经变了。

![rebase](/images/git-rebase/after-rebase-before-merge.png)

4、切换到`master`分支，执行`git merge dev`，可以看到`HEAD`被置为`a73089d`。

![rebase](/images/git-rebase/after-rebase-and-merge.png)

![rebase](/images/git-rebase/after-rebase-and-merge-and-push.png)

采用`rebase`的方式进行分支合并，`master`并没有多出一个新的`commit`，`dev`分支上的`commit`在`rebase`之后其`hash`值发生了变化，不再是`dev`分支上提交的时候的`hash`值了，但是提交的内容被全部复制保留了，并且整个`master`分支的`commit`记录呈线性记录。  

**总结：**
`git merge`操作合并分支，会让两个分支的每次提交都按照提交时间（并不是`push`时间）排序，并且经过对比，会将两个分支的新增的`commit`合并成一个新的`commit`，最终的`master`分支树会分叉。  

`git rebase`操作实际上是，将`dev`分支基于`master`之后的所有的`commit`打散成一个一个的`patch`，并重新生成新的`commit id`，再次基于`master`最新的`commit`上进行提交，并不依据两个分支上实际的每次提交的时间点排序，`rebase`完成后，切到`master`进行合并`dev`也不会生成一个新的`commit`，可以保持整个分支树的完美线性。  

无论是通过变基，还是通过合并，整合的最终结果所指向的快照始终是一样的，只不过提交历史不同罢了。 变基是将一系列提交按照原有次序依次应用到另一分支上，而合并是把最终结果合在一起。  



# 模拟日常开发 - 代码提交

平时提交代码，`commit`前没有`pull`其他人的提交，相当于远程仓库和本地的分支分叉了，因为`pull`相当于`fetch + merge`，所以此时拉取后会形成分支，此时对刚`pull`下来的分叉的`commit`进行`rebase`，会基于此`commit`，将之后的两个分叉的所有提交，重新生成一条新的提交线。  

![rebase](/images/git-rebase/pull-rebase-1.png)

基于他人的提交变基，会将两边的新提交重新生成，生成一条直线。

![rebase](/images/git-rebase/pull-rebase-2.png)

![rebase](/images/git-rebase/pull-rebase-3.png)



# 模拟日常开发 - 合并多个 commit 为一个完整 commit

当我们在本地仓库中提交了多次，在我们把本地提交`push`到公共仓库中前，为了让提交记录更简洁明了，我们希望把如下分支`B、C、D`三个提交记录合并为一个完整的提交，然后再`push`到公共仓库。  

![rebase](/images/git-rebase/git-rebase_1.png)

现在我们在测试分支上添加了四次提交，我们的目标是把最后三个提交合并为一个提交：  

![rebase](/images/git-rebase/git-rebase_2.png)

这里我们使用命令：
```
    git rebase -i [startpoint] [endpoint]
```

其中`-i`的意思是`--interactive`，即弹出交互式的界面让用户编辑完成合并操作，`[startpoint] [endpoint]`则指定了一个编辑区间，如果不指定 `[endpoint]`，则该区间的终点默认是当前分支`HEAD`所指向的`commit`（注：该区间指定的是一个前开后闭的区间）。  

在查看到了`log`日志后，我们运行以下命令：
```
    git rebase -i 36224db
    或：
    git rebase -i HEAD~3
```

然后我们会看到如下界面：  

![rebase](/images/git-rebase/git-rebase_3.png)

上面注释的部分列出的是我们本次`rebase`操作包含的所有提交，下面注释部分是`git`为我们提供的命令说明。每一个`commit id`前面的`pick`表示指令类型，`git`为我们提供了以下几个命令：
- pick：保留该 commit
- reword：保留该 commit，但我需要修改该 commit 的注释
- edit：保留该 commit, 但我要停下来修改该提交(不仅仅修改注释)
- squash：将该 commit 和前一个 commit 合并
- fixup：将该 commit 和前一个 commit 合并，但我不要保留该提交的注释信息
- exec：执行 shell 命令
- drop：我要丢弃该 commit  

我们将`commit`内容编辑如下：  

![rebase](/images/git-rebase/git-rebase_4.png)

然后是注释修改界面：  

![rebase](/images/git-rebase/git-rebase_5.png)

编辑完保存即可完成`commit`的合并了。



# 模拟日常开发 - 将某一段 commit 粘贴到另一个分支上

当我们项目中存在多个分支，有时候我们需要将某一个分支中的一段提交同时应用到其他分支中，就像下图：  

![rebase](/images/git-rebase/git-rebase_6.png)

我们希望将`develop`分支中的`C~E`部分复制到`master`分支中，这时我们就可以通过`rebase`命令来实现。  
在实际模拟中，我们创建了`master`和`develop`两个分支。  

`master`分支：  

![rebase](/images/git-rebase/git-rebase_7.png)

`develop`分支：  

![rebase](/images/git-rebase/git-rebase_8.png)

输入命令：
```
    git rebase [startpoint] [endpoint] --onto [branchName]
```

其中，`[startpoint] [endpoint]`仍然指定了一个前开后闭的编辑区间，`--onto`的意思是要将该指定的提交复制到哪个分支上。  
所以，在找到`C(90bc0045b)`和`E(5de0da9f2)`的`commit id`后，我们输入以下命令：

```
    git rebase 90bc0045b^ 5de0da9f2 --onto master
```
注：因为`[startpoint] [endpoint]`指定的是一个前开后闭的区间，为了让这个区间包含`C`，我们将区间起始点向后退了一步。    

运行完成后查看当前分支的日志：  

![rebase](/images/git-rebase/git-rebase_9.png)

可以看到，`C~E`部分的提交内容已经复制到了`G`的后面了。  
我们看一下当前分支的状态：  

![rebase](/images/git-rebase/git-rebase_10.png)

当前`HEAD`处于游离状态，实际上，此时所有分支的状态应该是这样：  

![rebase](/images/git-rebase/git-rebase_11.png)

所以，`git`只是将`C~E`部分的提交内容复制一份粘贴到了`master`所指向的提交后面，我们需要做的就是将`master`所指向的`commit`设置为当前`HEAD`所指向的`commit`就可以了，即：
```
    git checkout master
    git reset --hard  0c72e64
```

![rebase](/images/git-rebase/git-rebase_12.png)



# 注意

最后需要注意的是，不要通过`rebase`对任何已经提交到公共仓库中的`commit`进行变基修改，否则可能会丢弃了一些别人的所基于的提交。

