---
title: HTML Element Property
comments: true
categories: html
tags: html
abbrlink: 33db1ae8
date: 2019-08-08 10:33:12
---

#### offsetParent：
返回一个元素对象：
- 如果祖先元素中具有定位元素，此属性返回距离它最近的定位元素。
- 如果祖先元素中没有定位元素，那么返回最近的 table、td、th 或者 body 元素。  

#### offsetTop：
- `当前元素顶端`至`父元素顶端`距离，鼠标滚轮不会影响其数值。  
- 不包括 border (当前元素 border 外到父元素 border 内)。   
- 此属性可以获取`元素的上外缘`至`offsetParent`的距离，如果没有 offsetParent，则是至`文档内壁`的距离。  

#### clientTop：
当前元素client区域左上角与整个元素左上角的垂直距离，即上边框的高度。 

#### scrollTop：
`当前元素顶端`到`该元素在视口区域内的顶部`的距离，也就是该元素内部滚动条的下拉距离。 

#### Element.getBoundingClientRect().top：
当前元素距离可视区域顶部的距离。  
**注意：top 和 bottom 都是相对于可视区域顶部的，left 和 right 都是相对于可视区域左边的。**  

#### offsetWidth：
元素的宽度，元素width + padding + 边框，不包括 margin 和滚动条部分。  

#### offsetHeight：
元素的高度，元素 height + padding + 边框，不包括 margin 和滚动条部分。  

#### clientWidth：
元素的宽度，元素 width + padding，不包括边框、margin 和滚动条部分。  

#### clientHeight：
元素的高度，元素 height + padding，不包括边框、margin 和滚动条部分。  

#### scrollWidth：
元素的宽度。它包括由于出现滚动条而导致溢出不可见的部分。一般等于 clientWidth  

#### scrollHeight：
元素的高度。它包括由于出现滚动条而导致溢出不可见的部分。一般等于 clientHeight  

#### window.scrollTo：
```
    window.scrollTo(x-coord, y-coord)

    window.scrollTo(options)
    // options = { top: y-coord, left: x-coord, behavior: smooth(平滑滚动) / instant(瞬间滚动) / auto(默认值，效果等同于instant) }

    // 设置滚动行为改为平滑的滚动
    window.scrollTo({ 
        top: 1000, 
        behavior: "smooth" 
    })
```