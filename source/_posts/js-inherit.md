---
title: js 继承
comments: true
categories: javascript
tags: javascript
abbrlink: 623ca2f5
date: 2019-05-07 16:44:16
---
# new 一个函数 和 Object.create 都发生了什么
new 一个构造函数时相当于：
```
  // new Father()

  var obj = {}
  obj._proto_ = Father.prototype
  Father.call(obj)
  return obj
```
Object.create() 创建一个新对象，其中第一个参数是对象的原型。本质上来说是对一个对象进行了浅拷贝：
```
  Object.create = function (obj) {
    var F = function () {}
    F.prototype = obj
    return new F()
  }
```

# 一、原型链继承
```
  function Father() {
    this.name = 'father'
  }

  function Son() {
    this.name = 'son'
  }

  Father.prototype.getName = function () {
    return this.name
  }

  Son.prototype = new Father()

  var son = new Son()
  console.log(son.getName()) // son
```
缺点：
- Son 的所有实例都指向`new Father()`返回的对象，即`son._proto_ === Son.prototype -> Son.prototype._proto_ === Father.prototype`，原型链中引用类型的属性会被所有实例共享的，即所有实例对象使用的是同一份数据，会相互影响。
- 无法向父级构造函数传参。  

```
  function Father() {
   this.arr = [1,2,3]
  }

  function Son() {
  }

  Son.prototype = new Father()

  var son1 = new Son()
  var son2 = new Son()
  son1.arr.push(4)
  console.log(son1.arr)  // [1, 2, 3, 4]
  console.log(son2.arr)  // [1, 2, 3, 4]
```

# 二、构造函数继承
在子级构造函数中调用父级构造函数
```
  function Father() {
      this.arr = [1,2,3]
    }

  function Son() {
    Father.call(this)

    // 上面代码等同于下面这段代码：
    (function() {
      this.arr = [1,2,3]
    }).call(this)
  }

  var son1 = new Son()
  var son2 = new Son()
  son1.arr.push(4)
  console.log(son1.arr)  // [1, 2, 3, 4]
  console.log(son2.arr)  // [1, 2, 3]
```
缺点：`Father.call(this)`为每个实例复制一份私有属性，只能继承私有属性，无法继承父类原型上的属性方法。

# 三、组合继承
原型链 + 构造函数
```
  function Father(name) {
    this.name = name
    this.arr = [1,2,3]
  }

  Father.prototype.getName = function () {
    console.log(this.name)
  }

  function Son(name, age) {
    Father.call(this, name)
    this.age = age
  }

  Son.prototype = new Father()
  Son.prototype.constructor = Son
  Son.prototype.getAge = function () {
    console.log(this.age)
  }

  var son1 = new Son("a", 18)
  son1.getName()        // a
  son1.getAge()         // 18

  var son2 = new Son("b", 20)
  son1.getName()        // b
  son1.getAge()         // 20

  son1.arr.push(4)
  console.log(son1.arr) // [1, 2, 3, 4]
  console.log(son2.arr) // [1, 2, 3]
```
缺点：
父构造函数调用了两次，一次在创建子原型对象，另一次在子构造函数内部，复制两次私有属性。  

# 四、寄生式继承
```
  //增强对象
  function create(obj, prop) {
    var object = Object.create(obj, prop)
    object.getName = function () {
      console.log(this.name)
    }
    return object
  }

  var father = {
    name: "father",
    arr: [1,2,3]
  }

  var son1 = create(father, {
    name: {
      value: "a"
    }
  })

  var son2 = create(father, {
    name: {
      value: "b"
    }
  })

  son1.getName()            // a
  son2.getName()            // b
  son1.arr.push(4)
  console.log(son1.arr)     // [1, 2, 3, 4]
  console.log(son2.arr)     // [1, 2, 3, 4]
```
缺点：
- 引用类型的属性会被所有实例共享。
- 无法继承父类原型上的属性方法。  

# 五、寄生组合式继承
```
  function Father(name) {
    this.name = name
    this.arr = [1,2,3]
  }

  Father.prototype.getName = function () {
    console.log(this.name)
  }

  function Son(name, age) {
    Father.call(this, name)
    this.age = age
  }

  Son.prototype = Object.create(Father.prototype)
  Son.prototype.constructor = Son

  Son.prototype.getAge = function () {
    console.log(this.age)
  }

  var son1 = new Son("a", 18)
  son1.getName()            // a
  son1.getAge()             // 18

  var son2 = new Son("b", 20)
  son2.getName()            // b
  son2.getAge()             // 20

  son1.arr.push(4)          
  console.log(son1.arr)     // [1, 2, 3, 4]
  console.log(son2.arr)     // [1, 2, 3]
```
根据文章开头得知，Object.create 时相当于 new 了一个空函数而不是 new Father()，所以不会重复调用父类的构造函数。而这个空函数又起到了连接创建的新对象和 Father.prototype 的作用，所以最后子类的实例是可以沿原型链找到父类的，可以共享父类原型上的属性方法。
