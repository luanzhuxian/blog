---
title: for-of 遍历对象
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
abbrlink: 8aa98d9
date: 2019-04-29 17:20:20
---

# Iterator 接口
Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即`for…of`循环。当使用`for…of`循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。  

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名`Symbol.iterator`，它是一个表达式，返回 Symbol 对象的 iterator 属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内。  

```
  const obj = {
    [Symbol.iterator] : function () {
      return {
        next: function () {
          return {
            value: 1,
            done: true
          };
        }
      };
    }
  };
```
下面是原生具备 Iterator 接口的数据结构：  
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象  

也就是数组和类数组才有`Symbol.iterator`属性，而 Object 是没有的。  
那么怎么做到使对象可遍历？

# 方法一：部署 Iterator 接口（在 Symbol.iterator 的属性上部署遍历器生成方法）
一个对象如果要具备可被`for…of`循环调用的 Iterator 接口，就必须在`Symbol.iterator`的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。
```
  class RangeIterator {
    constructor(start, stop) {
      this.value = start;
      this.stop = stop;
    }

    [Symbol.iterator]() { return this; }

    next() {
      var value = this.value;
      if (value < this.stop) {
        this.value++;
        return {done: false, value: value};
      }
      return {done: true, value: undefined};
    }
  }

  function range(start, stop) {
    return new RangeIterator(start, stop);
  }

  for (var value of range(0, 3)) {
    console.log(value); // 0, 1, 2
  }
```

# 方法二：使用 Object.keys
```
  for (var key of Object.keys(someObject)) {
   console.log(key + ': ' + someObject[key]);
  }
```

# 方法三：使用 Generator 函数将对象重新包装
```
  function* entries(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  }

  for (let [key, value] of entries(obj)) {
    console.log(key, '->', value);
  }
  // a -> 1
  // b -> 2
  // c -> 3
```

# 方法四：使用 Map 代替对象
