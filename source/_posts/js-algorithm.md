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
