---
title: ES Module 与 CommonJS
comments: true
categories:
  - javascript
  - es6
tags:
  - javascript
  - es6
abbrlink: 87bd4cc1
date: 2021-09-11 17:19:57
---


# ES6 模块与 CommonJS 模块的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

## CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

### CommonJS
CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件lib.js的例子。

```
    // lib.js
    var counter = 3;
    function incCounter() {
        counter++;
    }
    module.exports = {
        counter: counter,
        incCounter: incCounter,
    };
```
上面代码输出内部变量counter和改写这个变量的内部方法incCounter。然后，在main.js里面加载这个模块。

```
    // main.js
    var mod = require('./lib');

    console.log(mod.counter);  // 3
    mod.incCounter();
    console.log(mod.counter); // 3
```

上面代码说明，lib.js模块加载以后，它的内部变化就影响不到输出的mod.counter了。这是因为mod.counter是一个原始类型的值，输出的是值的拷贝，会被缓存。除非写成一个函数，才能得到内部变动后的值。

```
    // lib.js
    var counter = 3;
    function incCounter() {
        counter++;
    }
    module.exports = {
        get counter() {
            return counter
        },
        incCounter: incCounter,
    };
```
上面代码中，输出的counter属性实际上是一个取值器函数。现在再执行main.js，就可以正确读取内部变量counter的变动了。
```
    $ node main.js
    3
    4
```

若把输出的`counter`改为对象：
```
    // lib.js
    var counter = {
        value: 3
    };
    function incCounter() {
        counter.value++;
    }
    module.exports = {
        counter: counter,
        incCounter: incCounter,
    };
```
```
    // main.js
    var mod = require('./a')
    console.log(mod.counter.value) // 3
    mod.incCounter();
    console.log(mod.counter.value) // 4
```
可以看出值变化了，对于引用类型是动态引用没有缓存的。  

再举一个例子。

```
    // m1.js
    var foo = 'bar'
    setTimeout(() => foo = 'baz', 500)
    module.exports = { foo }

    // m2.js
    var { foo } = require('./m1.js')
    console.log(foo)    // bar
    setTimeout(() => console.log(foo), 500) // bar
```

### ESModule

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。  

还是举上面的例子。

```
    // lib.js
    export let counter = 3;
    export function incCounter() {
      counter++;
    }

    // main.js
    import { counter, incCounter } from './lib';
    console.log(counter); // 3
    incCounter();
    console.log(counter); // 4
```
上面代码说明，ES6 模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化。

```
    // m1.js
    export var foo = 'bar'
    setTimeout(() => foo = 'baz', 500)

    // m2.js
    import { foo } from './m1.js'
    console.log(foo)    // bar
    setTimeout(() => console.log(foo), 500) // baz
```
上面代码表明，ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。  

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
```
    // lib.js
    export let obj = {};

    // main.js
    import { obj } from './lib';

    obj.prop = 123; // OK
    obj = {}; // TypeError
```
上面代码中，main.js从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。  

最后，export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。  
```
    // mod.js
    function C() {
    this.sum = 0;
    this.add = function () {
        this.sum += 1;
    };
    this.show = function () {
        console.log(this.sum);
    };
    }

    export let c = new C();
```
上面的脚本mod.js，输出的是一个C的实例。不同的脚本加载这个模块，得到的都是同一个实例。
```
    // x.js
    import {c} from './mod';
    c.add();

    // y.js
    import {c} from './mod';
    c.show();

    // main.js
    import './x';
    import './y';
```
现在执行main.js，输出的是1。


## CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。





# 循环加载

## CommonJS 模块的加载原理
介绍 ES6 如何处理“循环加载”之前，先介绍目前最流行的 CommonJS 模块格式的加载原理。

CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。

```
    {
        id: '...',
        exports: { ... },
        loaded: true,
        ...
    }
```
上面代码就是 Node 内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。  

以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。  


## CommonJS 模块的循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

```
    // a.js
    console.log('a starting')
    exports.done = false
    const b = require('./b.js')
    console.log('in a, b.done = %j', b.done)
    exports.done = true
    console.log('a done')

    // b.js
    console.log('b starting')
    exports.done = false
    const a = require('./a.js')
    console.log('in b, a.done = %j', a.done)
    exports.done = true
    console.log('b done')

    // c.js
    console.log('main starting')
    const a = require('./a.js')
    const b = require('./b.js')
    console.log('in main, a.done = %j, b.done = %j', a.done, b.done)
```
上面代码之中，a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js。注意，此时a.js代码就停在这里，等待b.js执行完毕，再往下执行。  

上面代码之中，b.js执行到第二行，就会去加载a.js，这时，就发生了“循环加载”。系统会去a.js模块对应对象的exports属性取值，可是因为a.js还没有执行完，从exports属性只能取回已经执行的部分，而不是最后的值。  

a.js已经执行的部分，只有一行。  
```
    exports.done = false;
```

执行main.js，运行结果如下。  
```
    main starting
    a starting
    b starting
    in b, a.done = %j, false
    b done
    in a, b,done = %j, true
    a done
    in main, a.done = %j, b.done = %j, true, true
```

上面的代码证明了两件事。一是，在b.js之中，a.js没有执行完毕，只执行了第一行。二是，main.js执行到第二行时，不会再次执行b.js，而是输出缓存的b.js的执行结果，即它的第四行`exports.done = true;`。  

总之，CommonJS 输入的是被输出值的拷贝，不是引用。  


## ES6 模块的循环加载

ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。  

请看下面这个例子。  
```
    // a.mjs
    import {bar} from './b';
    console.log('a.mjs');
    console.log(bar);
    export let foo = 'foo';

    // b.mjs
    import {foo} from './a';
    console.log('b.mjs');
    console.log(foo);
    export let bar = 'bar';
```
上面代码中，a.mjs加载b.mjs，b.mjs又加载a.mjs，构成循环加载。执行a.mjs，结果如下。
```
    b.mjs
    ReferenceError: foo is not defined
```
首先，执行a.mjs以后，引擎发现它加载了b.mjs，因此会优先执行b.mjs，然后再执行a.mjs。接着，执行b.mjs的时候，已知它从a.mjs输入了foo接口，这时不会去执行a.mjs，而是认为这个接口已经存在了，认为整个a.mjs模块是{}，继续往下执行。执行到第三行console.log(foo)的时候，才发现这个接口根本没定义，因此报错。  

解决这个问题的方法，就是让b.mjs运行的时候，foo已经有定义了。这可以通过将foo写成函数来解决。  
```
    // a.mjs
    import {bar} from './b';
    console.log('a.mjs');
    console.log(bar());
    function foo() { return 'foo' }
    export {foo};

    // b.mjs
    import {foo} from './a';
    console.log('b.mjs');
    console.log(foo());
    function bar() { return 'bar' }
    export {bar};
```
这时再执行a.mjs就可以得到预期结果。
```
    b.mjs
    foo
    a.mjs
    bar
```
这是因为函数具有提升作用，在执行import {bar} from './b'时，函数foo就已经有定义了，所以b.mjs加载的时候不会报错。这也意味着，如果把函数foo改写成函数表达式，也会报错。
```
    // a.mjs
    import {bar} from './b';
    console.log('a.mjs');
    console.log(bar());
    const foo = () => 'foo';
    export {foo};
```


# 参考资料
**[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82) - 阮一峰**  


