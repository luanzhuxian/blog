---
title: Vue 杂七杂八记录
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

# 错误处理
renderError
```
  new Vue({
    render (h) {
      throw new Error('oops')
    },
    renderError (h, err) {
      return h('pre', {
        style: { color: 'red' }
      }, err.stack)
    }
  }).$mount('#app')
```
errorCaptured
```
  Vue.component('error-boundary', {
    template: '<div><slot></slot></div>',
    errorCapture: (err, vm, info) => {
      console.log('We have an error')
      return false
    }
  })
```
errorHandler & warnHandler
```
  Vue.config.errHandler = function (err, vm, info) {
    console.log(
      `Error: ${err.toString()}
      info: ${info}`
    )
  }

  Vue.config.warnHandler = function (msg, vm, trace) {
    console.log(
      `Warn: ${msg}
      Trace: ${trace}`
    )
  }
```
window.onerror
```
  window.onerror = function (msg, source, line, column, error) {
    // ...
  }
```

# 减少重复
重复代码：
```
  data () {
    return {
      internalValue: deepClone(this.value)
    }
  },
  watch: {
    value () {
      this.internalValue = deepClone(this.value)
    }
  }
```
使用`computed`减少重复：
```
  computed: {
    internalValue () {
      return this.value || this.value === 0
        ? [].concat(this.value)
        : []
    }
  }
```
重复代码：
```
  created () {
    this.fetchUserList()
  },
  watch: {
    searchText () {
      this.fetchUserList()
    }
  }
```
使用`immediate watcher`减少重复：
```
  watch: {
    searchText: {
      handler: 'fetchUserList',
      immediate: true
    }
  }
```