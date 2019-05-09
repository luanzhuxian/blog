---
title: JavaScript 遍历
comments: true
categories: javascript
tags: javascript
abbrlink: 6e2a8c6e
date: 2019-05-07 13:25:04
---

# 使用 filter、map 和其它 ES6 新增的高阶遍历函数

## 将数组中的 falsy 值去除
```
  const arrContainsEmptyVal = [3, 4, 5, 2, 3, undefined, null, 0, ""]
  const compact = arr => arr.filter(Boolean)
  compact(arrContainsEmptyVal)
```

## 将数组中的 VIP 用户余额加 10
```
  const users = [
    { username: "Kelly", isVIP: true, balance: 20 },
    { username: "Tom", isVIP: false, balance: 19 },
    { username: "Stephanie", isVIP: true, balance: 30 }
  ]
  users.map(
    user => (user.isVIP ? { ...user, balance: user.balance + 10 } : user)
  );
```

## 判断字符串中是否含有元音字母
```
  const randomStr = "hdjrwqpi"
  const isVowel = char => ["a", "e", "o", "i", "u"].includes(char)
  const containsVowel = str => [...str].some(isVowel)

  containsVowel(randomStr);
```

## 数组去重
```
  const uniq = arr => [...new Set(arr)]
```

# reduce、reduceRight
reduce方法返回值是回调函数最后一次执行返回的累积结果。  
## 不借助原生高阶函数，定义 reduce
```
  const reduce = (f, acc, arr) => {
    if (arr.length === 0) return acc
    const [head, ...tail] = arr
    return reduce(f, f(acc, head), tail)
  }

  reduce((acc, currentValue) => acc + currentValue, 0, [1, 2, 3]) // => 6
```

## 使用 reduce 做到同时有 map 和 filter 的作用
```
  const numbers = [10, 20, 30, 40]
  const doubledOver50 = numbers.reduce((finalList, num) => {
    num = num * 2 // double each number
    if (num > 50) { // filter number > 50
      finalList.push(num)
    }
    return finalList
  }, [])
  doubledOver50 // [60, 80]
```

## 使用 reduce 代替 map
```
  function map(arr, exec) {
      const res = arr.reduce((res, item, index) => {
          const newItem = exec(item, index)
          res.push(newItem)
          return res
      }, [])
      return res
  }

  // 或
  const map = (f, arr) => arr.reduce((acc, val) => (acc.push(f(val)), acc), []);

  [1, 2, 3].map((item) => item * 2) // [2, 4, 6]
  map([1, 2, 3], item => item * 2) // [2, 4, 6]
```

## 使用 reduce 代替 filter
```
  function filter(arr, exec) {
    var res = arr.reduce((res, item, index) => {
        if (exec(item, index)) {
            res.push(item)
        }
        return res
    }, [])
    return res
  }

  // 或
  const filter = (f, arr) =>
    arr.reduce((acc, val) => (f(val) && acc.push(val), acc), []);

  [1, 2, 3].filter((item, index) => index < 2) // [1, 2]
  filter([1, 2, 3], (item, index) => index < 2) // [1, 2]
```

## Transduce
重新定义的 filter 和 map 有共有的逻辑。我们把这部分共有的逻辑叫做 reducer。有了共有的逻辑后，我们可以进一步地抽象，把 reducer 抽离出来，然后传入 filter 和 map：
```
  const filter = f => reducer => (acc, value) => {
    if (f(value)) return reducer(acc, value)
    return acc
  };

  const map = f => reducer => (acc, value) => reducer(acc, f(value))

  const pushReducer = (acc, value) => (acc.push(value), acc)

  const pipe = (...fns) => (...args) => fns.reduce((fx, fy) => fy(fx), ...args)

  bigNum.reduce(
    pipe(
      filter(isEven),
      map(triple)
    )(pushReducer),
    []
  )  
```

## 将多层数组转换成一层数组
```
  const nestedArr = [1, 2, [3, 4, [5, 6]]]
  const flatten = arr =>
    arr.reduce(
      (flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next),
      []
    )
```

## 将下面数组转成对象，key/value 对应里层数组的两个值
```
  const objLikeArr = [["name", "Jim"], ["age", 18], ["single", true]]
  const fromPairs = arr =>
    arr.reduce((res, subArr) => ((res[subArr[0]] = subArr[1]), res), {})

  fromPairs(objLikeArr) // {name: "Jim", age: 18, single: true}
```

## 取出对象中的深层属性
```
  const deepAttr = { a: { b: { c: 15 } } }
  const pluckDeep = path => obj =>
    path.split(".").reduce((val, attr) => val[attr], obj)

  pluckDeep("a.b.c")(deepAttr)  // 15
```

## 将用户中的男性和女性分别放到不同的数组里：
```
const users = [
  { name: "Adam", age: 30, sex: "male" },
  { name: "Helen", age: 27, sex: "female" },
  { name: "Amy", age: 25, sex: "female" },
  { name: "Anthony", age: 23, sex: "male" },
]

const partition = (arr, isValid) =>
  arr.reduce(
    ([pass, fail], elem) =>
      isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
    [[], []],
  )

const isMale = person => person.sex === "male"

const [maleUser, femaleUser] = partition(users, isMale)
```

## 使用 redece 来判断括号是否匹配
这个例子说明 reduce 这个函数功能的强大。给你一串字符串，你想要知道这串字符串的括号是否是匹配。  
常规的做法是使用栈来匹配，但是这里我们使用 reduce 就可以做到，我们只需要一个变量 counter ，这个变量的初始值是 0 , 当遇到`(`的时候，`counter++`当遇到`)`的时候，`counter--`。 如果括号是匹配的，那么这个 counter 最终的值是 0。
```
  //Returns 0 if balanced.
  const isParensBalanced = (str) => {
    return str.split('').reduce((counter, char) => {
      if (counter < 0) { // matched ")" before "("
        return counter
      } else if (char === '(') {
        return ++counter
      } else if (char === ')') {
        return --counter
      } else { // matched some other charreturn counter;
      }
    }, 0) // starting value of the counter
  }
  isParensBalanced('(())') // 0 <-- balanced
  isParensBalanced('(asdfds)') //0 <-- balanced
  isParensBalanced('(()') // 1 <-- not balanced
  isParensBalanced(')(') // -1 <-- not balanced
```

## 计算数组中元素出现的次数(将数组转为对象)
如果你想计算数组中元素出现的次数或者想把数组转为对象，那么你可以使用 reduce 来做到。
```
  const cars = ['BMW','Benz', 'Benz', 'Tesla', 'BMW', 'Toyota']
  const carsObj = cars.reduce((obj, name) => {
    obj[name] = obj[name] ? ++obj[name] : 1
    return obj
  }, {})
  carsObj // { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 }
```


# 用递归代替迭代
## 将两个数组每个元素一一对应相加
注意，第二个数组比第一个多出两个，不要把第二个数组遍历完。
```
  const num1 = [3, 4, 5, 6, 7]
  const num2 = [43, 23, 5, 67, 87, 3, 6]

  const zipWith = f => xs => ys => {
    if (xs.length === 0 || ys.length === 0) return []
    const [xHead, ...xTail] = xs
    const [yHead, ...yTail] = ys
    return [f(xHead)(yHead), ...zipWith(f)(xTail)(yTail)]
  }

  const add = x => y => x + y

  zipWith(add)(num1)(num2)
```

## 将 Stark 家族成员提取出来
注意，目标数据在数组前面，使用 filter 方法遍历整个数组是浪费。
```
  const houses = [
    "Eddard Stark",
    "Catelyn Stark",
    "Rickard Stark",
    "Brandon Stark",
    "Rob Stark",
    "Sansa Stark",
    "Arya Stark",
    "Bran Stark",
    "Rickon Stark",
    "Lyanna Stark",
    "Tywin Lannister",
    "Cersei Lannister",
    "Jaime Lannister",
    "Tyrion Lannister",
    "Joffrey Baratheon"
  ]
  const takeWhile = f => ([head, ...tail]) =>
    f(head) ? (tail.length ? [head, ...takeWhile(f)(tail)] : [head]) : (tail.length ? [...takeWhile(f)(tail)] : [])

  const isStark = name => name.toLowerCase().includes("stark")

  takeWhile(isStark)(houses)
```

## 找出数组中的奇数，然后取出前4个
```
  const numList = [1, 3, 11, 4, 2, 5, 6, 7]
  const takeFirst = (limit, f, arr) => {
    if (limit === 0 || arr.length === 0) return []
    const [head, ...tail] = arr
    return f(head)
      ? [head, ...takeFirst(limit - 1, f, tail)]
      : takeFirst(limit, f, tail)
  }

  const isOdd = n => n % 2 === 1

  takeFirst(4, isOdd, numList)
```

# for…of
## for … of 遍历自定义的 Iterable
```
  const starks = [
    "Eddard Stark",
    "Catelyn Stark",
    "Rickard Stark",
    "Brandon Stark",
    "Rob Stark",
    "Sansa Stark",
    "Arya Stark",
    "Bran Stark",
    "Rickon Stark",
    "Lyanna Stark"
  ]

  function* repeatedArr(arr) {
    let i = 0
    while (true) {
      yield arr[i++ % arr.length]
    }
  }

  const infiniteNameList = repeatedArr(starks)

  const wait = ms =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })

  (async () => {
    for (const name of infiniteNameList) {
      await wait(1000)
      console.log(name)
    }
  })()
```
