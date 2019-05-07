---
title: Vue 杂记
comments: true
categories: vue
tags: vue
abbrlink: 48cd49dd
date: 2019-05-07 12:49:11
---

# vue 监听数组长度变化
```
  var vm = new Vue({
    el: 'body',
    data: {
      list: []
    },
    computed: {
      length () {
        return this.list.length
      }
    },
    watch: {
      list: {
        deep: true,
        handler (newValue, oldValue) {
          console.log(newValue.length)
        }
      }
    }
  })
```

# vue 监听对象变化
```
  var vm = new Vue({
    el: 'body',
    data: {
      items: {}
    },
    computed: {
      isEmpty () {
        return Object.keys(this.items).length === 0
      }
    },
    watch: {
      items: {
        deep: true,
        handler (newValue, oldValue) {
          this.isEmpty = Object.keys(newValue).length === 0
        }
      }
    }
  })
```
