---
title: vue-awesome-swiper 切换导航导致轮播停止的问题
comments: true
categories: vue
tags: vue
abbrlink: 6903b776
date: 2020-12-13 12:39:34
---

`vue-awesome-swiper`版本`3.1.3`。且使用了`keep-alive`。    

今天发现页面跳转后再返回，轮播会停止，不自动播放了。看了看文档，鼓捣了配置也还是一样。那么把实例打印出来看看。

```
    // template
    <swiper ref="swiper" :options="swiperOption">

    // script
    console.log(this.$refs.swiper.swiper)
```
发现有个`autoplay`对象，其中`paused: true`，表示被暂停了，等于每次组件被`deactivated`停用时轮播也会被暂停。
```
    autoplay: {
        onTransitionEnd: ƒ onTransitionEnd(e)
        pause: ƒ ()
        paused: true
        run: ƒ ()
        running: true
        start: ƒ ()
        stop: ƒ ()
        timeout: 81
    }
```
那就在`activated`钩子函数中加入如下逻辑试试，每次返回触发钩子会手动恢复自动播放：
```
    activated () {
        if (this.$refs.swiper && this.$refs.swiper.swiper.autoplay.paused) {
            this.swiper.autoplay.run()
        }
    }
```
现在打印可以看到`paused: false`，自动播放恢复了，问题解决了。