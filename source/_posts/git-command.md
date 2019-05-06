---
title: Git 常用命令
comments: true
categories: Git
tags: Git
abbrlink: caff8000
date: 2018-12-09 17:46:34
---

# Git 的工作流程
<blockquote bgcolor=#FF4500>Git 是分布式版本控制系统，每一台客户端都是一个独立的 git 仓库（有 git 工作的全套机制）。  
一个 git 仓库分为三个区域：
  1. 工作区：平时写代码的地方。就是你在电脑里能看到的目录。
  2. 暂存区：代码暂时存储的地方。英文叫 stage 或 index。一般存放在`.git目录`下的 index 文件`.git/index`中，所以我们把暂存区有时也叫作索引 index。
  3. 历史区(本地仓库版本库)：生成版本记录的地方。工作区有一个隐藏目录 .git，这个不算工作区，而是 Git 的版本库。版本库又名仓库，英文名 repository，你可以简单理解成一个目录，这个目录里面的所有文件都可以被 Git 管理起来，每个文件的修改、删除，Git 都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。
</blockquote>
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-flow_1.png)
![avatar](http://pqg06rxde.bkt.clouddn.com/blog/git-flow_2.png)

# 基本配置命令

## 使用 Git 生成 ssh 密钥
```
  ssh-keygen -t rsa -C "email@example.com"
```

## 设置全局用户名和邮箱
安装完成git后，我们应该先把基础信息配置一下：  
```
  git config -l # 查看当前本机的配置清单
  git config --global user.name "name"
  git config --global user.email "email@example.com" # github/coding等平台的账号和邮箱
```

## 初始化仓库
在指定目录中，打开命令行，执行`git init`，相当于以当前目录作为基础，创建了一个本地 git 仓库。
创建完成后，会在项目的根目录中展示`.git`这个隐藏文件：有这个`.git`文件的才叫做 git 仓库（暂存区和历史区都是存在`.git`文件夹）。


## 工作区提交到暂存区
```
  git add <filename>	# 添加指定文件到暂存区
  git add .	          # 添加工作区所有变动到暂存区
  git add -i	        # 交互方式添加文件到暂存区
  git add -u	        # 将工作区中已经变动的文件添加到暂存区，当新增加的文件不会被添加
```

## 暂存区提交到历史区
```
  git commit -m "描述信息"		 # 提交更新
  git commit -am "描述信息"	   # 如果工作目录中仅是已跟踪的文件被修改或被删除，使用此提交命令
```

## 分支的创建、删除、和平、切换、查看
```
  git branch	                   # 查看本地已有的分支
  git branch -a	                 # 查看远程分支
  git branch 新分支名 [分支起点]	# 创建分支，如果没有分支起点的话，则默认在当前分支的最新提交上创建分支
  git checkout 分支名	          # 切换分支
  git checkout -b 新分支名		   # 创建同时切换到新分支
  git checkout -b 本地分支名 origin/远程分支名		   # 将远程git仓库里的指定分支拉取到本地（本地不存在的分支）
  git merge 要被合并的分支名	    # 合并分支
  git rebase 要被合并的分支名	    # 重新设置基线，将你的当前分支重新设置开始点
  git rebase -i  [startpoint]  [endpoint]	    # 合并多个提交为一个提交
  git rebase   [startpoint]   [endpoint]  --onto  [branchName]	    # 将某一段commit粘贴到另一个分支上
  git branch -d 要删除的分支名	   # 删除指定分支（如果分支没有被合并过，该命令会执行失败）
  git branch -D 要删除的分支名	   # 删除指定分支，不管有没有被合并过
  gitk				                   # 用图形界面查看分支提交历史
```
使用例子：
```
  $ git checkout -b [branch]                // 新建一个分支，并切换到该分支
  $ git branch                              // 命令会列出所有分支，当前分支前面会标一个*号。
  $ git add .
  $ git commit -m "提交分支branch"
  $ git checkout master                     // 切换回master分支
  $ git merge [branch]                      // 把branch分支合并到master分支
  $ git branch -d branch                    // 合并完成后删除branch分支
```

合并分支过程中如果发生冲突则需要自己手动解决冲突，然后再提交。有冲突时，Git 会显示哪个文件有冲突，并在冲突的文件中加上特殊的标识符号，解决完冲突后，要手动去掉这些被添加的标识符号。如果冲突比较复杂的话，最好使用其他工具来协助，通过`git merge tool`来启动。冲突一般是在不同的分支上对同一文件的同一位置内容进行了改动，并已提交到仓库中，这样在合并的时候就会发生冲突。

## 标签的添加、删除、查看
```
  git tag		                     # 查看标签
  git tag 标签名	                 # 创建简单的标签
  git tag -a 标签名 -m '附加信息'	# 创建附加信息的标签
  git show 标签名	               # 通过标签查看信息
  git tag -d 标签名	             # 删除标签
```
标签可以在需要的地方，为某个提交对象创建别名，这样以后我们就可以通过标签来查看一些信息，创建分支等。

## 查看工作目录状态
```
  git status
```
在 git 命令执行后，要养成通过`git status`查看 git 状态的习惯，以便及时了解文件变化的情况。通过`git status`可以知道文件的状态（已修改未暂存、已删除、已修改并已暂存等待提交、未跟踪）。

## 查看提交历史
```
  git log
  git log -p	# 显示每次提交文件变化
  git reflog	# 显示提交历史的简介
```
通过`git log`可以查看当前分支的所有提交历史，知道每次提交的 commit 对象的 ID 以及提交时附加的描述信息等。要显示更多的信息，需要使用其支持的选项，如`git log -p`可以将每次提交的文件变化也显示出来。  

## 查看指定的提交对象
```
  git show commit_id	# 查看指定的某次提交内容
  git show --all		# 显示所有的提交历史内容
  git shortlog -s -n	# 显示总的提交次数
```
通过`git log`可以显示整个提交历史，而通过`git show commit-id`则可以查看指定的某次提交内容，当然`git show -all`也可以显示出提交历史，另外还可以格式化显示内容。  
`commit-id`可以是 commit 对象对应的 ID，也可以是 HEAD，分支名，tag 等。

## 查看工作区、暂存区、仓库之间的差异
```
  git diff		        # 比较工作区与暂存区的差异
  git diff HEAD		    # 比较工作区与历史区最近一次的提交间的差异
  git diff --cached	  # 比较暂存区与历史区最近一次提交的差异
  git blame filename	# 可以列出该文件每次被修改的时间和内容。
```

## 版本回退、撤销操作
```
  git reflog	                # 显示提交历史的简介
  git reset --hard            # 重置暂存区与工作区，与上一次 commit 保持一致（暂存区先回滚一次，适用于丢弃已提交的内容）
  git reset --hard HEAD^		  # 回退到上一个版本，即上一次暂存区中记录的内容
  git reset --hard commit_id	# 回退到指定版本，重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
  git checkout .              # 丢弃工作区的所有修改，把最新暂存区的内容回滚到工作区，替换工作区中的内容（适用于丢弃工作区还未提交的内容）
  git checkout -- filename	  # 丢弃工作区的指定修改
  git ls-files -d			        # 列出工作区被删除的文件（文件之前被提交到仓库中）
```
有时候，由于我们的误操作，产生了一些错误，我们发现后希望能够及时纠正这些因为误操作而产生的结果，将工作目录恢复到某个正常状态。
- 丢弃还没有添加到暂存区的，某个文件的修改：`git checkout -- filename`修改的文件会被恢复到上次提交时的状态，修改的内容会丢失。
- 丢弃已添加到暂存区的，某个文件的修改：先通过`$ git reset HEAD file`回到上面的场景，第二步`git checkout -- filename`。  
- 已经提交了不合适的修改到版本库，想要撤销本次提交：`$ git reset --hard`。  

**注意：已经push到远程仓库的 commit 不允许 reset。如果 commit 已经被 push 到远程仓库上了，也就意味着其他开发人员就可能基于这个 commit 形成了新的 commit，这时你去 reset，就会造成其他开发人员的提交历史莫名其妙的丢失，或者其他灾难性的后果。**

## 备份工作区
```
  git stash			            # 将工作区文件保存在Git内部栈中
  git stash list			      # 列出Git内部栈中保存的工作区文件列表
  git stash apply stash_id	# 恢复工作区到指定的内部栈状态
  git stash pop			        # 恢复工作区到上一个内部栈状态
  git stash clear			      # 清空Git内部栈
```
如果正在一个`develop`分支上正在开发新功能，但这时`master`分支(稳定版本)突然发现了 bug，并需要及时修复，而`develop`分支此时的工作还没有完成，且不希望将之前的工作就这样提交到仓库中时，这时就可以用`git stash`来暂时保存这些状态到 Git 内部栈中，并用当前分支上一次的提交内容来恢复工作目录，然后切换到`master`分支进行 bug 修复工作，等修复完毕并提交到仓库上后，再使用`git stash apply [stash@{0}]`或者`git stash pop`将工作目录恢复到之前的状态，继续之前的工作。  

同时也可以多次使用`git stash`将未提交的代码压入到 Git 栈中，但当多次使用`git stash`命令后，Git 栈里将充满了未提交的代码，这时候到底要用哪个版本来恢复工作目录呢？`git stash list`命令可以将当前的 Git 栈信息打印出来，我们只需要将找到对应的版本号，例如使用`git stash apply stash@{1}`就可以用版本号为`stash@{1}`的内容来恢复工作目录。  

当 Git 栈中所有的内容都被恢复后，可以使用`git stash clear`来将栈清空。

<blockquote bgcolor=#FF4500>实用技巧：当手头工作没有完成时，先把工作现场`git stash`一下，然后去修复bug，修复后，再使用`git stash pop`，回到工作现场.</blockquote>

## 将当前工作区目录文件压缩归档
```
  git archive --format=zip -o arch.zip HEAD
  git arch --format zip head>arch.zip
```

## 远程操作
Git 相比其他版本控制软件的一个优点就是大多数的操作都可以在本地进行，而不用管远程的仓库，因为操作是在本地，且操作的数据也是在本地，加上指针等原因，所以执行的速度就会比较快。 在多人协作的项目中，就需要涉及与远程仓库交互的问题，主要是如何从远程仓库抓取最新数据合并到自己的本地分支上，将自己的最新成果分享给其他人或让别人审查等 。

## 远程仓库的克隆、添加、查看
```
  git remote	                              # 显示已关联的远程仓库
  git remote -v 	                          # 显示已关联的远程仓库和地址
  git remote add 远程仓库名 远程仓库地址	     # 在本地关联远程仓库
  git remote rm 远程仓库名		               	# 移除本地关联的远程仓库
  git remote rename 原名 新名		             # 重命名远程仓库
  git clone 远程仓库地址 [克隆到指定的文件夹]	# 克隆远程仓库到本地
  git fetch 远程仓库名		                    # 从远程仓库抓取最新数据到本地但不与本地分支进行合并
  git pull 远程仓库名	本地要合并的分支名	     # 从远程仓库抓取最新数据并自动与本地分支进行合并
  git push 远程仓库名 本地分支名	            # 将本地仓库推送到远程仓库中
  git remote show 远程仓库名	                # 查看远程仓库信息
  git remote show		      	                # 查看所有远程仓库
  git push 远程仓库名 标签名                	# 将标签推送到远程仓库（Git默认不推送标签）
  git rm file_path                          # 删除暂存区和工作区上的文件
  git rm --cached file_path                 # 删除暂存区或分支上的文件, 已提交内容也会被删除，但工作区保留
```

## 协同流程
- Fork 远程项目
- 把 Fork 的项目 clone 到本地
- 执行以下命令，将别人的库添加为远端库
```
  git remote add 远端仓库名 远端的分支
```
- 运行以下命令，拉去合并到本地，在本地编辑内容前必须执行 pull 操作同步别人的远端库（这样避免冲突）
```
  git pull 远端仓库名 远端分支名
```
- 编辑内容
- commit 之后 push 到自己的库
- 登录 Github，在你的首页可以看到一个`pull request`按钮，点击它，填写一些说明信息，提交即可

# 多人协作

## 创建中央仓库
中央仓库可能是在：GitHub，Coding，自己公司的 Git 仓库服务平台，自己公司的服务器等...
1. 基于gitHub创建远程仓库，创建完成后会生成一个远程地址，例如：
```
  https//github.com/username/Repository name.git
```
2. 还需要把项目中一些基础的信息提交到远程仓库上：
- 在自己本地创建一个仓库，把一些基础内容都放在仓库中
- 把新增加的内容提交到本地仓库历史区中
- 让本地仓库和远程仓库保持关联`git remote add 远程仓库名 远程仓库地址`
- 把本地仓库历史区中的信息同步（推送）到远程仓库上`git push`

## 克隆远程仓库
创建完成后远程仓库后，可以直接通过`git clone 仓库地址 [仓库别名]`的方式把远程仓库克隆到本地，相当于在本地创建了一个仓库，也让本地这个仓库和远程仓库保持了连接。团队成员可以创建本地分支在上面开发修改，合并提交等操作:
- 看远程库信息：使用`git remote -v`；  
- 在本地创建和远程分支对应的分支：使用`git checkout -b branch-name origin/branch-name`，本地和远程分支的名称最好一致；  
- 建立本地分支和远程分支的关联：使用`git branch --set-upstream branch-name origin/branch-name`；  
- 从本地推送分支：使用`git push 远程仓库名 分支名`，如果推送失败，先用`git pull`抓取远程的新提交；  
- 从远程抓取分支：使用`git pull`，如果有冲突，要先处理冲突；  
- 合并多个 commit 为一个完整 commit：`git rebase -i`。  

## 避免拉取更新后提交有两条记录：
- 在 pull 之前，先将本地修改存储起来`$ git stash`，
- 暂存了本地修改之后，就可以 pull 了，
- 还原暂存的内容，`$ git stash pop stash@{0}`，
- 有冲突的话解决冲突
- 之后提交  

## 避免拉取更新后提交有两条记录：
在实际开发中，我们应该按照几个基本原则进行分支管理：
- master 分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；
- 干活都在 dev 分支上，到某个时候，比如 1.0 版本发布时，再把 dev 分支合并到 master 上，在 master 分支发布 1.0 版本；
- 团队成员每个人都在 dev 分支上干活，每个人都有自己的分支，时不时地往 dev 分支上合并就可以了。

## Bug分支
每个bug都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除。
```
  //我们在dev分支上，发现master分支上有代号101号bug
  $ git stash                                               // 冷冻现在在dev分支上的工作状态 冻结吧！  
  $ git checkout master                                     // 这个bug发生在master主分支上,我们切回master分支
  $ git checkout -b issue-101                               // 创建代号101的修复bug分支
  修改你的bug
  $ git add .                                               // 提交到暂存区
  $ git commit -m "fix bug 101"                             // 注意填写信息，以免日后查证
  $ git checkout master                                     // 切换回master分支
  $ git merge --no-ff -m "merged bug fix 101" issue-101     // 合并分支，注意不使用fast forward模式
  $ git branch -d issue-101                                 // 删除issue-101分支
  $ git checkout dev                                        // bug 改完了，是时候回到dev继续写bug了
  $ git stash list                                          // 查看刚刚的冻结现场
  $ git stash pop                                           // git stash pop，恢复的同时把stash内容也删了
                                                            // 或者用git stash apply恢复，但是恢复后，stash内容并不删除，你需要用git stash drop来删除
```
