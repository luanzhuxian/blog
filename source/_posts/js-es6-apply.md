---
title: ES6 的应用
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
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

  console.log(result);
  /* 输出
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

  const cityNames = Array.from(cities, ({ name}) => name)
  console.log(cityNames)
  // 输出 ["Paris", "Lyon", "Marseille", "Rome", "Milan", "Palermo", "Genoa", "Berlin", "Hamburg", "New York"]
```

# 数组的解构
## 交换2个值
```
  const [post, comments] = Promise.all([
    fetch('/post'),
    fetch('/comments')
  ])
```

## 使用 Array 的方法
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
