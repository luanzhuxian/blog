---
title: CSS 实现水平垂直居中的
comments: true
categories: css
tags: css
abbrlink: d877f8a3
date: 2019-05-09 11:46:06
---

仅居中元素定宽高适用
- absolute + 负margin
- absolute + margin auto
- absolute + calc

居中元素不定宽高
- absolute + transform
- lineheight
- writing-mode
- table
- css-table
- flex
- grid

公共代码：
```
  <div class="wrapper">
    <div class="box size">123</div>
  </div>

  .wrapper {
    width: 300px;
    height: 300px;
  }

  .box {
    background: green;    
  }

  .box.size {
    width: 100px;
    height: 100px;
  }
```
# absolute + 负 margin
绝对定位的百分比是相对于父元素的宽高，通过这个特性可以让子元素的边缘居中，但期望的效果是子元素的中心居中，可以借助外边距的负值，负的外边距可以让元素向相反方向定位，通过指定子元素的外边距为子元素宽度一半的负值，就可以让子元素居中了。
```
  .wrapper {
    position: relative;
  }
  .box {
    position: absolute;;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
  }
```
缺点是居中元素的宽高必须固定。  

# absolute + margin auto
```
  .wrapper {
    position: relative;
  }
  .box {
    position: absolute;;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
```
缺点是居中元素的宽高必须固定。  

# absolute + calc
css3 计算属性，减去宽高的一半。
```
  .wrapper {
    position: relative;
  }
  .box {
    position: absolute;;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
  }
```
缺点是居中元素的宽高必须固定。  

# absolute + transform
css3 transform 的 translate 属性可以设置百分比，其是相对于自身的宽和高。
```
  .wrapper {
    position: relative;
  }
  .box {
    position: absolute;;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
```
居中元素的宽高不用固定。  

# line-height
利用行内元素居中属性也可以做到水平垂直居中。
```
  .wrapper {
    line-height: 300px;
    text-align: center;
  }
  .box {
    display: inline-block;
    vertical-align: middle;
    line-height: initial;
    text-align: left;
  }
```
居中元素的宽高不用固定。

# table
tabel 单元格中的内容天然就是垂直居中的，只要添加一个水平居中属性就好了。
```
  <table>
    <tbody>
      <tr>
        <td class="wrapper">
          <div class="box">123</div>
        </td>
      </tr>
    </tbody>
  </table>

  .wrapper {
    text-align: center;
  }
  .box {
    display: inline-block;
  }
```
居中元素的宽高不用固定，但 wrapper 需要设置宽度。缺点是代码冗余，而且也不是 table 的正确用法。  

# css-table
可以把普通元素，变为 table 元素的现实效果。
```
  <div class="wrapper">
    <div class="box">123</div>
  </div>

  .wrapper {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
  .box {
    display: inline-block;
  }
```
居中元素的宽高不用固定，但 wrapper 需要设置宽度。

# flex
可以把普通元素，变为 table 元素的现实效果。
```
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
```
居中元素的宽高不用固定。

# grid
可以把普通元素，变为 table 元素的现实效果。
```
  .wrapper {
    display: grid;
  }
  .box {
    justify-self: center;
    align-self: center;
  }
```
居中元素的宽高不用固定。兼容性不如flex。  
