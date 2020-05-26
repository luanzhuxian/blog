---
title: JavaScript 中的算法
comments: true
categories: javascript
tags: javascript
abbrlink: d13db1cc
date: 2019-05-06 17:37:27
---
# Introduction
要真正掌握算法，就必须了解它们与数据结构的关系。数据结构和算法就像阴阳、水杯和水一样密不可分。没有杯子，水就不能被容纳。没有数据结构，我们就没有对象来应用逻辑。没有水，杯子是空的。没有算法，对象就不能被转换或消费。  

在 JavaScript 中，算法只是一个函数，它将某个确定的数据结构输入转换为某个确定的数据结构输出。函数内部的逻辑决定了怎么转换。首先，输入和输出应该清楚地提前定义。这需要我们充分理解手上的问题，因为对问题的全面分析可以很自然地提出解决方案，而不需要编写任何代码。  

一旦完全理解了问题，就可以开始对解决方案进行思考，需要那些变量？有几种循环？有那些 JavaScript 内置方法可以提供帮助？需要考虑那些边缘情况？复杂或者重复的逻辑会导致代码十分的难以阅读和理解，可以考虑能否提出抽象成多个函数？一个算法通常上需要可扩展的。随着输入 size 的增加，函数将如何执行? 是否应该有某种缓存机制吗? 通常上，需要牺牲内存优化（空间）来换取性能提升（时间）。  

在设计算法的结构和逻辑时，时间复杂度和空间复杂度的优化和权衡是一个重要的步骤。  

一个最优的算法通常上会利用语言里固有的标准对象实现。  
可以说，在计算机科学中最重要的是数组。在 JavaScript 中，没有其他对象比数组拥有更多的实用方法。  

与数组 Array 密切相关的是使用循环遍历它们。在 JavaScript 中，有 5 种最常用的遍历方法，使用最多的是 for 循环，for 循环可以用任何顺序遍历数组的索引。如果无法确定迭代的次数，我们可以使用 while 和 do while 循环，直到满足某个条件。  

对于任何 Object, 我们可以使用 for in 和 for of 循环遍历它的 keys 和 values。为了同时获取 key 和 value 我们可以使用 entries()。  

我们也可以在任何时候使用 break 语句终止循环，或者使用 continue 语句跳出本次循环进入下一次循环。  

所有的递归函数都有相同的模式。它们由创建一个调用自身的递归部分和一个不调用自身的基本部分组成。任何时候一个函数调用它自身都会创建一个新的执行上下文并推入执行栈顶直。这种情况会一直持续到直到满足了基本情况为止。然后执行栈会一个接一个的将栈顶元素推出。因此，对递归的滥用可能导致堆栈溢出的错误。  

# 常见算法题

## 1. 字符串反转
```
  describe("String Reversal", () => {
   it("Should reverse string", () => {
     assert.equal(reverse("Hello World!"), "!dlroW olleH")
   })
  })
```
思考：  
这道题的关键点是我们可以使用数组自带的 reverse 方法。首先我们使用 split 方法将字符串转为数组，然后使用 reverse 反转字符串，最后使用 join 方法转为字符串。
```
  const reverse = string => string.split('').reverse().join('')
```
另外也可以使用数组的 reduce 方法
```
  const _reverse = string => string.split('').reduce((res, char) => char + res)
```

## 2. 回文
回文是一个单词或短语，它的读法是前后一致的。写一个函数来检查。
```
  describe("Palindrome", () => {
    it("Should return true", () => {
      assert.equal(isPalindrome("Cigar? Toss it in a can. It is so tragic"), true)
    })
    it("Should return false", () => {
      assert.equal(isPalindrome("sit ad est love"), false)
    })
  })
```
思考：  
函数只需要简单地判断输入的单词或短语反转之后是否和原输入相同，完全可以参考第一题的解决方案。我们可以使用数组的 every 方法检查第 i 个字符和第 `array.length - i` 个字符是否匹配。但是这个方法会使每个字符检查 2 次，这是没必要的。那么，我们可以使用 reduce 方法。和第 1 题一样，时间复杂度和空间复杂度是相同的。
```
  const isPalindrome = string => {
    const validCharacters = "abcdefghijklmnopqrstuvwxyz".split("")
    const stringCharacters = string // 过滤掉特殊符号
          .toLowerCase()
          .split("")
          .reduce(
            (characters, character) =>
              validCharacters.indexOf(character) > -1
                ? characters.concat(character)
                : characters,
            []
          )
    return stringCharacters.join("") === stringCharacters.reverse().join("") // 转变数据结构
  }
```
简略版
```
function isPalindrome (str) {
    let rev = str.split('').reverse().join('')
    return str === rev
}
```
最长回文：一般方法
```
function longestPalindrome  (string) {
    let len = string.length
    let result = ''
    for (let i = 0; i < len; i++) {
        for (let j = i; j < len; j++) {
            let str = string.substring(i, j)
            if (isPalindrome(str) && str.length > result.length) {
                result = str
            }
        }
    }
    return result
}
```
最长回文：动态规划  
上述一般方法包含很多重复计算，需要改进。我们发现对于`'asdsa'`，如果已知`'sds'`是回文，那么`'asdsa'`也是回文。  
举例来说，我们用`P(i, j)`表示子串`Si~Sj`是否回文，如果是回文则`P(i, j)`为 true，否则为 false。那么上文就等同为`P(i, j) = (P(i + 1, j - 1) && Si === Sj)`。  
那么我们可以得到一个动态规划解法，首先初始化一字母和二字母的回文，再递增找到三字母的回文，以此类推...  
`P(i, j) = true`，`P(i, i + 1) = (Si === Si+1)`
```
function longestPalindrome  (string) {
    let len = string.length
    let i, j, L       // L是i和j之间的间隔数（因为间隔数从小到大渐增，所以大的间隔数总能包含小的间隔数）
    let result = ''
    let matrix = Array(len).fill(0).map(x => Array(len).fill(0))  // 生成 len * len 矩阵

    if (len <= 1){
        return string
    }

    // 初始化只有一个字符是回文的情况
    for (i = 0; i < len; i++) {
        matrix[i][i] = 1
        result = string[i]
    }

    // L从2开始，找出二字回文的情况，依次递增
    // 例如 'abcdcba'.length = L，若首尾的 a 各为 i、j位，则 L = j - i + 1，所以 j = i + L - 1
    for ( L = 2; L <= len; L++) {
        // 从0开始，
        for ( i = 0; i <= len - L; i++) {
            // 根据当前的 i 和 L 得到 j
            j = i + L - 1
            if (L === 2 && string[i] === string[j]) {
                matrix[i][j] = 1
                result = string.slice(i, i + L)
            } else if (string[i] === string[j] && matrix[i + 1][j - 1] === 1) {
                matrix[i][j] = 1
                result = string.slice(i, i + L)
            }
        }
    }
    return result
}
```

## 3. 整数反转
给定一个整数，反转数字的顺序。
```
  describe("Integer Reversal", () => {
    it("Should reverse integer", () => {
      assert.equal(reverse(1234), 4321)
      assert.equal(reverse(-1200), -21)
    })
  })
```
思考：  
把 number 类型使用 toString 方法换成字符串，然后就可以按照字符串反转的步骤来做。反转完成之后，使用 parseInt 方法转回 number 类型，然后使用 Math.sign 加入符号，只需一行代码便可完成。  
```
  const revserInteger = integer => parseInt(
        number.toString()
          .split('')
          .reverse()
          .join('')
        ) * Math.sign(integer)
```

## 4. 出现次数最多的字符
给定一个字符串，返回出现次数最多的字符
```
  describe("Max Character", () => {
    it("Should return max character", () => {
      assert.equal(max("Hello World!"), "l")
    })
  })
```
思考：  
可以创建一个对象，然后遍历字符串，字符串的每个字符作为对象的 key，value 是对应该字符出现的次数。然后我们可以遍历这个对象，找出 value 最大的 key。
```
  const maxCharacter = (str) => {
    const obj = {}
    let max = 0
    let character = ''
    for (let index in str) {
      obj[str[index]] = obj[str[index]] + 1 || 1
    }
    for (let i in obj) {
      if (obj[i] > max) {
        max = obj[i]
        character = i
      }
    }
    return character
  }
```

## 5. 找出 string 中元音字母出现的个数
给定一个单词或者短语，统计出元音字母出现的次数。
```
  describe("Vowels", () => {
    it("Should count vowels", () => {
      assert.equal(vowels("hello world"), 3)
    })
  })
```
思考：  
最简单的解决办法是利用正则表达式提取所有的元音，然后统计。如果不允许使用正则表达式，我们可以简单的迭代每个字符并检查是否属于元音字母，首先应该把输入的参数转为小写。
```
  const vowels = str => {
     const choices = ['a', 'e', 'i', 'o', 'u']
     let count = 0
     for (let character in str) {
       if (choices.includes(str[character])) {
         count ++
       }
     }
     return count
   }

   const vowelsRegs = str => {
     const match = str.match(/[aeiou]/gi)
     return match ? match.length : 0
   }
```

## 6. 数组分隔
给定数组和大小，将数组项拆分为具有给定大小的数组列表。
```
  describe("Array Chunking", () => {
    it("Should implement array chunking", () => {
      assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]])
      assert.deepEqual(chunk([1, 2, 3, 4], 3), [[1, 2, 3], [4]])
      assert.deepEqual(chunk([1, 2, 3, 4], 5), [[1, 2, 3, 4]])
    })
  })
```
思考：  
一个好的解决方案是使用内置的 slice 方法。这样就能生成更干净的代码。可通过 while 循环或 for 循环来实现，它们按给定大小的步骤递增。
```
  const chunk = (array, size) => {
    const chunks = []
    let index = 0
     while (index < array.length) {
       chunks.push(array.slice(index, index + size))
       index += size
     }
     return chunks
  }
```

## 7. words 反转
给定一个短语，按照顺序反转每一个单词。
```
  describe("Reverse Words", () => {
    it("Should reverse words", () => {
      assert.equal(reverseWords("I love JavaScript!"), "I evol !tpircSavaJ")
    })
  })
```
思考：  
可以使用 split 方法创建单个单词数组。然后对于每一个单词，可以复用之前反转 string 的逻辑。
```
  const reverseWords = string => string
                                  .split(' ')
                                  .map(word => word
                                                .split('')
                                                .reverse()
                                                .join('')
                                      ).join(' ')
```

## 8. 首字母大写
给定一个短语，每个首字母变为大写。
```
  describe("Capitalization", () => {
    it("Should capitalize phrase", () => {
      assert.equal(capitalize("hello world"), "Hello World")
    })
  })
```
思考：  
一种简洁的方法是将输入字符串拆分为单词数组。然后，我们可以循环遍历这个数组并将第一个字符大写，然后再将这些单词重新连接在一起。出于不变的相同原因，我们需要在内存中保存一个包含适当大写字母的临时数组。
```
  const capitalize = str => {
    return str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  }
```

## 9. 凯撒密码
给定一个短语，通过在字母表中上下移动一个给定的整数来替换每个字符。如果有必要，这种转换应该回到字母表的开头或结尾。
```
  describe("Caesar Cipher", () => {
    it("Should shift to the right", () => {
      assert.equal(caesarCipher("I love JavaScript!", 100), "E hkra FwrwOynelp!")
    })
    it("Should shift to the left", () => {
      assert.equal(caesarCipher("I love JavaScript!", -100), "M pszi NezeWgvmtx!")
    })
  })
```
思考：  
首先我们需要一个包含所有字母的数组，这意味着我们需要把给定的字符串转为小写，然后遍历整个字符串，给每个字符增加或减少给定的整数位置，最后判断大小写即可。
```
  const caesarCipher = (str, number) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
      const string = str.toLowerCase()
      const remainder = number % 26
      let outPut = ''
      for (let i = 0; i < string.length; i++) {
        const letter = string[i]
        if (!alphabet.includes(letter)) {
          outPut += letter
        } else {
          let index = alphabet.indexOf(letter) + remainder
          if (index > 25) {
            index -= 26
          }
          if (index < 0) {
            index += 26
          }
          outPut += str[i] === str[i].toUpperCase() ? alphabet[index].toUpperCase() : alphabet[index]
        }
      }
    return outPut
  }
```

## 10. 找出从 0 开始到给定整数的所有质数
给定一个短语，通过在字母表中上下移动一个给定的整数来替换每个字符。如果有必要，这种转换应该回到字母表的开头或结尾。
```
  describe("Sieve of Eratosthenes", () => {
    it("Should return all prime numbers", () => {
      assert.deepEqual(primes(10), [2, 3, 5, 7])
    })
  })
```
思考：  
最简单的方法是我们循环从 0 开始到给定整数的每个整数，并创建一个方法检查它是否是质数。
```
  const isPrime = n => {
    if (n > 1 && n <= 3) {
        return true
      } else {
        for(let i = 2; i <= Math.sqrt(n); i++){
          if (n % i == 0) {
            return false
          }
        }
        return true
    }
  }

  const prime = number => {
    const primes = []
    for (let i = 2; i < number; i++) {
      if (isPrime(i)) {
        primes.push(i)
      }
    }
    return primes
  }
```

## 11. 爬楼梯
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？  
爬楼梯其实属于动态规划一类。举例来说：倒着思考，当已经到达三层的时候，是怎样爬上来的？  
`f(3) = f(2) + f(1)`，即从第二阶走一步上来或者从第一阶走两步上来。  
通过递推归纳：`f(n) = f(n-2) + f(n-1)`，从第 n-2 阶台阶走一步上来或者从第 n-1 阶台阶走两步上来。
```
function Fibonacci(n) {
    var a = [0, 1, 2]
    for (var i = 3; i <= n; i++) {
        a[i] = a[i-1] + a[i-2]
    }
    return a[n]
}
```

## 12. 快速排序
方法一：  
1. 在数据集之中，选择一个元素作为基准（pivot）。
2. 所有小于基准的元素，都移到基准的左边；所有大于基准的元素，都移到基准的右边。
3. 对基准左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
```
function quickSort (arr) {

　　if (arr.length <= 1) { 
      return arr 
    }

    const pivotIndex = Math.floor(arr.length / 2)
    const pivot = arr.splice(pivotIndex, 1)[0]
    const left = []
    const right = []

　　for (var i = 0; i < arr.length; i++) {
　　　　if (arr[i] < pivot) {
　　　　　　left.push(arr[i])
　　　　} else {
　　　　　　right.push(arr[i])
　　　　}
　　}

　　return quickSort(left).concat([pivot], quickSort(right))
}
```
方法二：
1. 首先，从数组中选择中间一项作为主元。
2. 创建两个指针，左边一个指向数组第一项，右边一个指向数组最后一项。移动左指针直到找到一个比主元大的元素，接着，移动右指针直到找到一个比主元小的元素，然后交换它们，重复这个过程，直到左指针超过右指针。这个过程将使得比主元小的值都排在主元之前，比主元大的值都排在主元之后。这一部叫做划分操作。
3. 接着，算法对划分后的小数组重复之前的两个步骤，直至数组已完全排序。  

```
function swap (array, index1, index2) {
  [array[index1], array[index2]] = [array[index2], array[index1]]
}

// 划分操作
function partition (array, left, right) {
  const pivot = array[Math.floor((right + left) / 2)]
  let i = left
  let j = right

  // 只要 left 和 right 没有交错，就执行划分 
  while (i < j) {
    while (array[i] < pivot) {  // 找到一个比主元大的元素
      i++
    }
    while (array[j] > pivot) {  // 找到一个比主元小的元素
      j--
    }
    if (i <= j) {
      swap(array, i, j)
      i++
      j--
    }
  }
  return i
}

function quick (array, left, right) {
  let index
  if (array.length > 1) {
    index = partition(array, left, right)

    // 存在较小子数组，对较小子数组快排
    if (left < index - 1) {
      quick(array, left, index - 1)
    }

    // 存在较大子数组，对较大子数组快排
    if (index < right) {
      quick(array, index, right)
    }
  }
}

function quickSort (array) {
  // 第一次快排整个数组
  quick(array, 0, array.length - 1)
}
```

## 13. Camel 和 Pascal 相互转换
糟糕的方法：
```
const isObject = input => Object.prototype.toString.call(input) === '[object Object]'

const isArray = input => Object.prototype.toString.call(input) === '[object Array]'

const convertKey = ({key, type}) => {
    let init = key.charAt(0)
    init = (type === 'up') ? init.toUpperCase() : init.toLowerCase()
    return init + key.substring(1)
}

const processArray = (arr, fn) => arr.reduce((acc, item) => {
    const _item = isObject(item) ? fn(item) : item
    acc.push(_item)
    return acc
}, [])

const convert = (input, type, fn) => {
    if (!isObject(input)) {
        return {}
    }

    const result = {}
    const keys = Object.keys(input)

    for (const key of keys) {
        const newKey = convertKey({ key, type })
        const val = input[key]

        if (isArray(val)) {
            result[newKey] = processArray(val, fn)
        } else if (isObject(val)) {
            result[newKey] = fn(val)
        } else {
            result[newKey] = val
        }
    }

    return result
}

const camelToPascal = (input) => convert(input, 'up', camelToPascal)
const pascalToCamel = (input) => convert(input, 'low', pascalToCamel)

const camelCasedData = {
    age: 18,
    gender: "female",
    experiences: [
        { from: "2009-09", to: "2013-06", exp: "School" },
        { from: "2013-09", to: "2020-02", exp: "Job" },
    ]
};

const pascalCasedData = camelToPascal(camelCasedData)
console.log(pascalCasedData)
const camelCasedData2 = pascalToCamel(pascalCasedData)
console.log(camelCasedData2)
```
用类实现，便于保存状态：
```
const isObject = input => Object.prototype.toString.call(input) === '[object Object]'

class Convertor {
    constructor (keyConvertFn) {
        this.keyConvertFn = keyConvertFn
    }

    convertKey (key) {
        const { keyConvertFn } = this
        const initial = keyConvertFn.call(key.charAt(0))
        return initial + key.substring(1)
    }

    convert (source) {
        if (!isObject(source)) {
            return {}
        }

        const result = {}
    
        for (const key of Object.keys(source)) {
            const newKey = this.convertKey(key)
            const value = source[key]
    
            if (Array.isArray(value)) {
                result[newKey] = value.map(item => isObject(item) ? this.convert(item) : item)
            } else if (isObject(value)) {
                result[newKey] = this.convert(value)
            } else {
                result[newKey] = value
            }
        }

        return result
    }
}

const camelToPascalConvertor = new Convertor(String.prototype.toUpperCase)
const pascalToCamelConvertor = new Convertor(String.prototype.toLowerCase)
const camelToPascal = (source) => camelToPascalConvertor.convert(source)
const pascalToCamel = (source) => pascalToCamelConvertor.convert(source)

const camelCasedData = {
    age: 18,
    gender: "female",
    experiences: [
        { from: "2009-09", to: "2013-06", exp: "School" },
        { from: "2013-09", to: "2020-02", exp: "Job" },
    ]
};

const pascalCasedData = camelToPascal(camelCasedData)
console.log(pascalCasedData)
const camelCasedData2 = pascalToCamel(pascalCasedData)
console.log(camelCasedData2)
```

## 14. 数组转树
```
const locationList = [
    { id: 0, name: "中国" },
    { id: 1, pid: 0, name: "广东省" },
    { id: 2, pid: 1, name: "深圳市" },
    { id: 3, pid: 1, name: "广州市" }
]

function buildLocationTree (locationList) {

    const _findSubLocations = (location) => {
        const { id } = location
        const list = locationList.filter(({pid}) => id === pid)

        return list.length ? 
        {
            ...location,
            subLocations: list.map(item => _findSubLocations(item))
        } :
        location
    }

    const root = locationList.find(item => !item.hasOwnProperty('pid'))
    const result = _findSubLocations(root)

    return result
}

console.log(JSON.stringify(buildLocationTree(locationList)))
```

