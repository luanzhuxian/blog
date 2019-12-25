---
title: ES6 的 Async 函数
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
abbrlink: 60c2c548
date: 2019-12-25 17:36:03
---

# 按顺序完成异步操作

实际开发中，经常遇到一组异步操作，需要按照顺序完成。比如，依次远程读取一组 URL，然后按照读取的顺序输出结果。  

Promise 的写法如下：
```
  function logInOrder(urls) {
    // 远程读取所有URL
    const textPromises = urls.map(url => {
      return fetch(url).then(response => response.text());
    });

    // 按次序输出
    textPromises.reduce((chain, textPromise) => {
      return chain.then(() => textPromise)
        .then(text => console.log(text));
    }, Promise.resolve());
  }
```
上面代码使用`fetch`方法，同时远程读取一组 URL。每个`fetch`操作都返回一个 Promise 对象，放入 textPromises 数组。然后，`reduce`方法依次处理每个 Promise 对象，然后使用`then`，将所有 Promise 对象连起来，因此就可以依次输出结果。  

这种写法不太直观，可读性比较差。下面是 async 函数实现:
```
  async function logInOrder(urls) {
    for (const url of urls) {
      const response = await fetch(url);
      console.log(await response.text());
    }
  }
```
上面代码确实大大简化，问题是所有远程操作都是继发。只有前一个 URL 返回结果，才会去读取下一个 URL，这样做效率很差，非常浪费时间。我们需要的是并发发出远程请求。
```
  async function logInOrder(urls) {
    // 并发读取远程URL
    const textPromises = urls.map(async url => {
      const response = await fetch(url);
      return response.text();
    });

    // 按次序输出
    for (const textPromise of textPromises) {
      console.log(await textPromise);
    }
  }
```
上面代码中，虽然`map`方法的参数是`async函数`，但它是并发执行的，因为只有`async函数`内部是继发执行，外部不受影响。后面的`for...of`循环内部使用了`await`，因此实现了按顺序输出。

**上面一段引用自阮一峰的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async#%E5%AE%9E%E4%BE%8B%EF%BC%9A%E6%8C%89%E9%A1%BA%E5%BA%8F%E5%AE%8C%E6%88%90%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C)**

再举个例子，下面这两段代码有什么区别？
```
  import fs from 'fs-promise'

  async function printFiles () {
    const files = await getFilePaths()

    files.forEach(async (file) => {
      const contents = await fs.readFile(file, 'utf8')
      console.log(contents)
    })
  }

  printFiles()
```
```
  import fs from 'fs-promise'

  async function printFiles () {
    const files = await getFilePaths()

    for (const file of files) {
      const contents = await fs.readFile(file, 'utf8')
      console.log(contents)
    }
  }

  printFiles()
```
第一段每个`forEach`的回调都是一个`async`函数，所以每个回调有自己的阻塞范围，回调内的`await`是相互独立的，不会互相阻塞，所以可以看为是并发的。  
第二段只有一个`async`函数，就是外层的`printFiles`，`for...of`内的所有`await`不是互相独立的，要按次序执行，所以可以看成是继发的。  
所以如果我们希望按顺序读取文件，那么第一段显然是错的，第二段是对的。  

其他实现方法：
```
  async function printFiles () {
    const files = await getFilePaths()

    await Promise.all(files.map(async (file) => {
      const contents = await fs.readFile(file, 'utf8')
      console.log(contents)
    }));
  }
```
仍然是并发的，`forEach`是没有返回值的，而用`map`配合`Promise.all`，可以通过`await`获得返回的 promise 数组。  

下面通过`reduce`实现，是按顺序执行的：
```
  async function printFiles () {
    const files = await getFilePaths()

    await files.reduce(async (promise, file) => {
      await promise
      const contents = await fs.readFile(file, 'utf8')
      console.log(contents)
    }, Promise.resolve())
  }
```
ES2018 的异步遍历器，是按顺序执行的：
```
  async function printFiles () {
    const files = await getFilePaths()

    for await (const file of fs.readFile(file, 'utf8')) {
      console.log(contents)
    }
  }
```
关于理解异步遍历器，看下面的例子：
```
  let timeout = 1000
  const arr = [`h`, `e`, `l`, `l`, `o`, `w`, `o`, `r`, `l`, 'd']

  const test = {
    [Symbol.asyncIterator]: () => {
      return {
        next: () => new Promise(resolve => {
          setTimeout(() => {
            timeout += 1000
            resolve({ done: arr.length === 0, value: arr.shift() })
          }, timeout)
        })
      }
    }
  }

  for await (const item of test) {
    console.log(item)
  }
```

# 并发执行异步操作

如果一组异步操作是无关联相互独立的，比如首屏调用多个不相互依赖的接口，可以使用`Promise.all`：
```
  (async () => {
    try {
      let [ra, rb, rc] = await Promise.all([a, b, c])
    } catch (err) {
      throw err
    }
  })()
```
但如果其中任何一个接口挂掉了，任一 promise 被`reject`，则直接会被`catch`捕获走`catch`内的逻辑，那么其他接口的返回数据就无法获取，这显然不是我们想看到的。  

解决办法就是对每一个 promise 做异常处理：
```
  Promise.all([a, b, c].map(p => p.catch(e => {...})))
    .then(res => {...})
    .catch(err => {...})
```
也就是在第一个`catch`内并不抛出异常，而是返回给下一个`then`，在下一个`then`内判断哪些是正常返回，哪些是异常返回。举个例子：
```
  const a = Promise.resolve(1)
  const b = Promise.reject(2)
  const c = Promise.resolve(3)

  Promise.all([a, b, c].map(p => p.catch(e => {
    console.log(`pe=${e}`)
    return 100
  })))
  .then(res => {
    console.log('then', `res=${res}`);
    for (let i of res) {
      console.log('then', i)
    }
  })
  .catch(err => {
    console.log('catch', `err=${err}`)
  })

  // 打印结果
  pe=2
  then res=1,100,3
  then 1
  then 100
  then 3
```
虽然 b 被`reject`，但并不影响其他`resolve`的返回值