require('shelljs/global')

// const { platform } = require('process')
const platform = require('os').platform()

try {
	hexo.on('deployAfter', function() {	// 当deploy完成后执行备份
		run()
	})
} catch (e) {
	console.log('Error:' + e.toString())
}

function run () {
	if (!which('git')) {
		echo('Sorry, this script requires git')
		exit(1)
	} else {
		echo('====================== Auto Backup Begin ======================')
		echo(`====================== Current platform is ${platform} ======================`)

		if (/^win/.test(platform)) {			
			exec('D:')
			cd('D:\\project\\blog')
		} else {
            // const path = '/Users/666/Desktop/coding/project/blog'
            const path = '/Volumes/Macintosh HD/Users/666/Desktop/coding/project/blog'
			cd(path)    // 此处修改为Hexo根目录路径
		}

		if (exec('git add --all').code !== 0) {
			echo('Error: Git add failed')
			exit(1)
		}

		if (exec('git commit -am "Form auto backup script\'s commit"').code !== 0) {
			echo('Error: Git commit failed')
			exit(1)
		}

		if (exec('git push origin master').code !== 0) {
			echo('Error: Git push failed')
			exit(1)
		}

		echo('====================== Auto Backup Complete ======================')
	}
}
