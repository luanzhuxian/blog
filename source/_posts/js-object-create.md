---
title: Object.create()：创建对象的新方式
comments: true
abbrlink: f92303d3
date: 2019-08-12 15:44:37
categories: javascript
tags: javascript
---

<blockquote bgcolor=#FF4500>在 Vue 和 Vuex 的源码中，作者都使用了`Object.create(null)`来初始化一个新对象。为什么不用更简洁的`{}`呢？</blockquote>

# Object.create()
```
    Object.create(proto[, propertiesObject])
```
- proto：新创建对象的原型对象。
- propertiesObject：可选。要添加到新创建对象的**可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）**的属性描述符以及相应的属性名称。这些属性对应`Object.defineProperties()`的第二个参数。

# new 一个函数 和 Object.create 都发生了什么
new 一个构造函数时相当于：
1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象  

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

# {} 和 Object.create() 的区别
`{}`相当于 `new Object()`：
```
    let obj = {}
    obj.__proto__ === Object.prototype // true
```
新创建的对象继承了`Object`自身的方法，如`hasOwnProperty、toString`等，在新对象上可以直接使用。  

再看看使用`Object.create()`创建对象：
```
    let obj = Object.create(null)
    obj.__proto__ === Object.prototype  // false
    console.log(obj.__proto__)  // undefined
```
打印出来 obj 是没有`_proto_`属性的。参考上一段，因为在创建过程中 `F.prototype = null` 原型链被切断了。  
如果把上面例子改一改：
```
    let obj = Object.create({})
    obj.__proto__.__proto__ === Object.prototype // true
```
打印出来 obj 是有`_proto_`属性的。  
那么再改一下：
```
    let obj = Object.create(Object.prototype)
    obj.__proto__ === Object.prototype // true
```
则结果和使用`{}`创建对象的结果一样了。所以：
- `{}`或`new Object()`相当于`Object.create(Object.prototype)`。
- `{}`或`new Object()`是将新创建的对象的`_proto_`指向构造函数的原型对象`Object.prototype`；而`Object.create()`是将新创建的对象的`_proto_`指向传入的对象；所以`Object.create()`如果传入的对象本身没有任何属性，比如`null`连`_proto_`也没有，则新创建的对象则是一个没有任何属性的对象。
- `{}`或`new Object()`过程中构造函数会被调用；而`Object.create()`即使传入的对象为构造函数，也不会调用该构造函数。

再回到文章开头的问题：  
**Sure you can create an object that seems empty with {}, but that object still has a `__proto__` and the usual hasOwnProperty and other object methods. So if you aren't subclassing another object, then `Object.create()` would be a new option to create a pure “dictionary” object by passing a null value to the function.**

# Object.create 实现类式继承
```
    function Car (desc) {
        this.desc = desc || 'car'
        this.color = "red"
    }

    Car.prototype = {
        getInfo () {
            return 'A ' + this.color + ' ' + this.desc + '.'
        }
    }

    //instantiate object using the constructor function
    let car =  Object.create(Car.prototype)
    car.color = "blue"
    console.log(car.getInfo())    // 'A blue undefined.'
```
为什么`desc`打印出来是`undefined`？因为传入`Object.create()`的是`Car.prototype`，`car._proto_ === Car.prototype`，只引用`prototype`而不引用`constructor`。  

**So, `Object.create()` is an excellent choice for creating an object without going through its constructor.**   

所以，不像组合继承`Son.prototype = new Father()`那样父类的`constructor`还要被执行一便，使用`Son.prototype = Object.create(Father.prototype)`实现继承不会重复调用父类的构造函数。而子类的实例是可以沿原型链找到父类的，可以共享父类原型上的属性方法。  

下面的例子演示了如何使用`Object.create()`来实现类式继承：
```
    // 父类
    function Shape() {
        this.x = 0
        this.y = 0
    }

    // 父类的方法
    Shape.prototype.move = function(x, y) {
        this.x += x
        this.y += y
        console.info('Shape moved.')
    }

    // 子类
    function Rectangle() {
        Shape.call(this) // call super constructor.
    }

    // 子类续承父类
    Rectangle.prototype = Object.create(Shape.prototype)
    Rectangle.prototype.constructor = Rectangle

    var rect = new Rectangle()

    console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle) // true
    console.log('Is rect an instance of Shape?', rect instanceof Shape) // true
    rect.move(1, 1) // 'Shape moved.'
```
如果你希望能继承到多个对象，则可以使用混入的方式：
```
    function MyClass() {
        SuperClass.call(this)
        OtherSuperClass.call(this)
    }

    // 继承一个类
    MyClass.prototype = Object.create(SuperClass.prototype)
    // 混合其它
    Object.assign(MyClass.prototype, OtherSuperClass.prototype)
    // 重新指定constructor
    MyClass.prototype.constructor = MyClass

    MyClass.prototype.myMethod = function() {
        // do something
    }
```