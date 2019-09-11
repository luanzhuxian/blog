---
title: ES6 的应用
comments: true
categories: [javascript, es6]
tags: [javascript, es6]
abbrlink: b8aeaa25
date: 2019-05-07 12:52:11
---

# 对象解构
## 移除不想要的属性
```
  // 移除 _internal 和 tooBig 这两个属性
  let {
    _internal,
    tooBig,
    ...cleanObject
  } = {
    _internal: "secret",
    tooBig: {},
    el1: '1',
    el2: '2',
    el3: '3'
  }

  console.log(cleanObject) // { el1: '1', el2: '2', el3: '3' }
```
```
  let obj = {
    name: 'peter',
    gender: 'male',
    other: {
      age: '28',
      height: '180',
      weight: '160'
    }
  }

  const { other: { age, ...rest2 }, ...rest1 } = obj
  const person = {
    ...rest1,
    ...rest2,
    age: Number(age)
  }

  console.log(rest1)  //  { name: 'peter', gender: 'male' }
  console.log(rest2)  //  { height: '180', weight: '160' }
  console.log(person)  //  { name: 'peter', gender: 'male', height: '180', weight: '160', age: 28 }
```

## 在函数参数中使用嵌套对象解构
在这个例子中 engine 是一个嵌套在 car 里面的对象，如果我们只需要 engine 里面的属性 vin 我们可以这样做。
```
  const car = {
    model: 'bmw 2018',
    engine: {
      v6: true,
      turbo: true,
      vin: 12345
    }
  }

  const modelAndVIN = ({ model, engine: { vin } }) => {
    console.log(`model: ${model} vin: ${vin}`)
  }

  modelAndVIN(car) // model: bmw 2018  vin: 12345
```

## 合并对象
扩展运算符...
```
  let object1 = { a:1, b:2,c:3 }
  let object2 = { b:30, c:40, d:50 }
  let merged = { …object1, …object2 } //spread and re-add into merged
```

## 根据条件添加对象属性
你不再需要根据条件创建两个不同的对象，以使其具有特定属性。扩展操作符将是一个完美的选择
```
  const getUser = (emailIncluded) => {
    return {
      name: 'John',
      surname: 'Doe',
      ...(emailIncluded ? { email : 'john@doe.com' } : null)
    }
  }

  const user = getUser(true)
  console.log(user); // 输出 { name: "John", surname: "Doe", email: "john@doe.com" }

  const userWithoutEmail = getUser(false)
  console.log(userWithoutEmail) // 输出 { name: "John", surname: "Doe" }
```

## 解构原始数据
你曾经有处理过拥有非常多属性的对象吗？我相信你一定有过。可能最常见的情况是我们有一个用户对象，它包含了所有的数据和细节。这里，我们可以调用新的 ES 解构方法来处理这个大麻烦。让我们看看下面的例子。
```
  const rawUser = {
    name: 'John',
    surname: 'Doe',
    email: 'john@doe.com',
    displayName: 'SuperCoolJohn',
    joined: '2016-05-05',
    image: 'path-to-the-image',
    followers: 45
    ...
  }

  let user = {}, userDetails = {};
  ({ name: user.name, surname: user.surname, ...userDetails } = rawUser);

  console.log(user) // 输出 { name: "John", surname: "Doe" }
  console.log(userDetails) // 输出 { email: "john@doe.com", displayName: "SuperCoolJohn", joined: "2016-05-05", image: "path-to-the-image", followers: 45 }
```

## 合并对象数组
```
  // 将对象数组合并成一个对象
  const cities = [
    { name: 'Paris', visited: 'no' },
    { name: 'Lyon', visited: 'no' },
    { name: 'Marseille', visited: 'yes' },
    { name: 'Rome', visited: 'yes' },
    { name: 'Milan', visited: 'no' },
    { name: 'Palermo', visited: 'yes' },
    { name: 'Genoa', visited: 'yes' },
    { name: 'Berlin', visited: 'no' },
    { name: 'Hamburg', visited: 'yes' },
    { name: 'New York', visited: 'yes' }
  ]

  const result = cities.reduce((accumulator, item) => {
    return {
      ...accumulator,
      [item.name]: item.visited
    }
  }, {})

  console.log(result)
  /* 输出
  {
    Berlin: "no"
    Genoa: "yes"
    Hamburg: "yes"
    Lyon: "no"
    Marseille: "yes"
    Milan: "no"
    New York: "yes"
    Palermo: "yes"
    Paris: "no"
    Rome: "yes"
  }
  */
```

## 数组映射
不使用 Array.map
```
  const cities = [
    { name: 'Paris', visited: 'no' },
    { name: 'Lyon', visited: 'no' },
    { name: 'Marseille', visited: 'yes' },
    { name: 'Rome', visited: 'yes' },
    { name: 'Milan', visited: 'no' },
    { name: 'Palermo', visited: 'yes' },
    { name: 'Genoa', visited: 'yes' },
    { name: 'Berlin', visited: 'no' },
    { name: 'Hamburg', visited: 'yes' },
    { name: 'New York', visited: 'yes' }
  ]

  const cityNames = Array.from(cities, ({ name }) => name)
  console.log(cityNames)  // 输出 ["Paris", "Lyon", "Marseille", "Rome", "Milan", "Palermo", "Genoa", "Berlin", "Hamburg", "New York"]
```

# 数组的解构
## 交换2个值
```
  const [post, comments] = Promise.all([
    fetch('/post'),
    fetch('/comments')
  ])
```

## Set 使用 Array 的方法
可以通过 (...) 扩展运算符将 Set 转换成 Array 这样我们就可以在 Set 使用所有 Array 的方法了。
```
  let mySet = newSet([1,2, 3, 4, 5])
  const filtered = [...mySet].filter((x) => x > 3) // [4, 5]
```

# Set
## 使用 set 来对数组去重
```
  let arr = [1, 1, 2, 2, 3, 3]
  let deduped = [...new Set(arr)] // [1, 2, 3]
  let deduped = Array.from(new Set(arr))
```

# Map
## 使用对象初始化 Map 实例
```
  let obj = { a: 1, b: 1, c: 1 }
  map = new Map(Object.entries(obj))
  console.log(map.get('a')) // 1
  console.log(map.get('b'))
  console.log(map.get('c'))
```

# 模板字符串
如果这样做的话：
```
  const string = `First
                  Second`
```
那么它会创建出像下面的字符串：
```
  First
                  Second
```
有一个简单的方法可以修复这个问题，只需要将第一行置为空，然后添加了右边的翻译好后调用一个 trim() 方法，就可以消除第一个字符前的所有空格：
```
  const string = `
  First
  Second`.trim()
```

# 对象方法
## Object.is() 确定两个值是不是同一个
```
  Object.is(a, b)
```

# 扩展运算符
用在字符串上的时候，展开操作符会以字符串中的每一个字符创建一个数组：
```
  const hey = 'hey'
  const arrayized = [...hey] // ['h', 'e', 'y']
```
## 不定参数
在之前的语法规范中，你只能通过`fn.apply(null, arr)`的方式来实现，但是这种方式不是很友好和易读。
```
  const arr = [1, 3, 0, -1, 20, 100]
  Math.max.apply(null, arr) // 100
```
```
  const array = [1, 2, 3, 4, 5]
  function fn() {
    console.log(arguments)
  }
  // 不定参
  fn(1, 2, 3, 4, 5) // Arguments(5) [0: 1, 1: 2, 2: 3, 3: 4, 4: 5]
  // 相当于：
  fn.apply(null, array)
  // 相当于：
  fn.call(null, 1, 2, 3, 4, 5)

```
现在，剩余参数（rest element）在和数组解构（array destructuring）搭配使用来实现。
```
  const array = [1, 2, 3, 4, 5]
  function fn(foo, bar, ...rest) {
    console.log(foo, bar, rest)
    console.log(...arguments)
  }
  fn(...array)  // 1, 2, [3, 4, 5]
  // 相当于：
  fn(1, 2, 3, 4, 5)
```
箭头函数没有 arguments

# Generator
一个解释generator如何工作的例子：
```
  function *calculator(input) {
    var doubleThat = 2 * (yield (input / 2))
    var another = yield (doubleThat)
    return (input * doubleThat * another)
  }
```
我们先初始化它：``
```
  const calc = calculator(10)
```
然后我们在generator中开始进行iterator迭代：
```
  calc.next()

  //
  {
    done: false,
    value: 5
  }
```
具体过程如下：代码运行了函数，并把`input=10`传入到生成器构造函数中，该函数一直运行直到抵达 yield，并返回 yield 输出的内容: `input / 2 = 5`，因此，我们得到的值为5，并告知迭代器还没有 done (函数只是暂停了)。  

在第二个迭代处，我们输入7：
```
  {
    done: false
    value: 14
  }
```
7被作为 doubleThat 的值，注意：你可能会把`input/2`作为输入参数，但这只是第一次迭代的返回值。现在我们忽略它，使用新的输入值7，并将其乘以2。
然后，我们得到第二个 yield 的值，它返回 doubleThat，因此返回值为14。  

之后，也是最后一个迭代器，我们输入100：
```
  calc.next(100)

  //
  {
    done: true
    value: 14000
  }
```
当迭代器完成时(没有更多的 yield 关键字)，我们返回 input doubleThat another，这相当于`10 * 14 * 100`。


# Iterator
[Iterator](https://luanzhuxian.github.io/post/8aa98d9.html)  


# 扩展运算符
## 不使用 Apply 去调用函数
这一点我们叫它`Function.prototype.apply`
```
  function doSomething (x, y, z) {}
  const args = [0, 1, 2]
  // 调用函数，传递参数
  doSomething.apply(null, args)
```
通过扩展运算符我们可以避免使用`apply`
```
  doSomething(...args)
```
使代码更简洁

## 合并数组
```
  // es5
  Array.prototype.push.apply(arr1, arr2)
  arr1.concat(arr2)

  // es6
  arr1.push(...arr2)
  arr1.unshift(...arr2)
  arr = [...arr1, ...arr2]
```

## 复制数组
浅拷贝，只复制指针，相当于`slice`
```
  let arr1 = [1, 2, 3]
  let arr2 = [...arr1]
```

## arguments 或 nodelist 转为数组
```
  // es5
  Array.prototype.slice.call(NodeList)

  // es6
  Array.from(NodeList)
  [...document.querySelectorAll('div')]

  function (...args) {
    // args 等同于 let args = [...arguments]
  }
```

## 使用 Math 函数
```
  let numbers = [9, 4, 7, 1]
  Math.min(...numbers) // 1
```

# Array.from
```
  Array.from(arrayLike[, mapFunction[, thisArg]])
```
- arrayLike：必传参数，想要转换成数组的伪数组对象或可迭代对象。
- mapFunction：可选参数，mapFunction(item，index){...} 是在集合中的每个项目上调用的函数。返回的值将插入到新集合中。
- thisArg：可选参数，执行回调函数 mapFunction 时 this 对象。  

```
  // 将类数组的每一项乘以2
  const someNumbers = { '0': 10, '1': 15, length: 2 }
  Array.from(someNumbers, value => value * 2) // => [20, 30]
```

应用：
1. 将类数组转换成数组
2. 克隆数组（浅拷贝）
  实现深拷贝：
  ```
    function recursiveClone(val) {
        return Array.isArray(val) ? Array.from(val, recursiveClone) : val
    }

    const numbers = [[0, 1, 2], ['one', 'two', 'three']]
    const numbersClone = recursiveClone(numbers)

    numbersClone // => [[0, 1, 2], ['one', 'two', 'three']]
    numbers[0] === numbersClone[0] // => false
```
3. 填充数组
  使用相同的值来初始化数组
  ```
    const length = 3
    const init   = 0

    // ES5
    const result = Array(length).fill(init)

    // ES6
    const result = Array.from({ length }, () => init)

    result // => [0, 0, 0]
  ```
  使用对象填充数组
  ```
    const length = 3
    const resultA = Array.from({ length }, () => ({}))
    const resultB = Array(length).fill({})
    const resultC = Array(length).map(() => init)

    resultA // => [{}, {}, {}]
    resultB // => [{}, {}, {}]
    resultC // => [undefined, undefined, undefined]

    resultA[0] === resultA[1] // => false
    resultB[0] === resultB[1] // => true
  ```
  这是因为 Array(length) 创建了一个有3个空项的数组。Array.from 的 () => ({}) 会返回一个新的对象。fill() 方法创建的 resultB 使用相同的空对象实例进行初始化。不会跳过空项。map() 方法会跳过空项。

4. 生成数字范围
  ```
    // 生成一个数组，从0到 end - 1
    function range(end) {
        return Array.from({ length: end }, (_, index) => index)
    }

    range(4) // => [0, 1, 2, 3]
  ```

5. 数组去重