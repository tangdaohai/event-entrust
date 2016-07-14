event-entrust.js
===============
Gulp + ES6 + babel.

## 如何快速使用

[查看 demo](https://github.com/tangdaohai/event-entrust/tree/master/demo)

#### html

    <div id="testDiv" data-event-fn-name='clickTest'>
        <button>Button</button>
        <input type="text">
    </div>

    <script src="../dest/event-entrust.js"></script>
    <script src="demo.js"></script>

### js

    //配置函数对象
    var fns = {
        //点击
        clickTest :  function(event, fnElem){
            log(event, fnElem);
        }
    };

    function log(event, fnElem){
        console.log("事件类型 : " + event.type);
        console.log("被点击的元素 : " , event.target);
        console.log("绑定事件函数名称的元素 : " , fnElem);

        document.querySelector(".text input[type='textarae']").value = "事件类型 : " + event.type;
    }

    entrust.on("click", fns);

* 在 div#testDiv 元素上绑定了 data-event-fn 自定义属性(data-event-fn = clickTest).<br>
* 然后使用 entrust.on 绑定一个 click 事件。<br>
* 当点击 div#testDiv 中的任何一个元素(包括自身)都会触发 fns 中的对象函数 clickTest

## 事件委托原理

event-entrust.js 使用了事件冒泡与捕获.默认是在 document 绑定的父级事件(可以使用 API 修改这些配置).即作用域为 document<br>
当点击父级元素中的任意元素,都会触发 document 上面绑定的事件.<br>
event-entrust.js 获取到了 事件 后,会从触发事件的元素开始向上查找绑定的 tag(*默认的 tag 为 data-event-fn,也可以使用 API 修改配置*)
当查找到该 tag 后,便会调用 tag 对应的函数.

##### 注意
> 不支持冒泡事件的事件类型,只能在触发元素的本身设置作用域<br>
> 如 : focus，blur，change，submit，reset，select等不会冒泡的事件

## API

*  entrust.config(name, value) 修改全局的默认配置.

    `entrust.config("tag", "data-event-fn-name")`

    可修改的参数 :
    ***
    1.  tag
        * string
        * 默认值 data-event-fn-name
        * 当发生事件时,去查找含有 data-event-fn-name 自定义属性的标签.<br>

            Eg. tag = data-event-fn-name. 当触发事件后,会从触发元素开始向上查找父级元素中含有 data-event-fn-name 的属性元素
    2.  defaultSelector
        * Node , string
        * 默认值 document.
        * Node 可以将选择器选择后的元素作为参数传递, 如 document.body 或者 $("body")[0] 或者 document.querySelector("body")<br>
          string 选择器字符串. 如果你有使用jQuery 则符合 jQuery 选择器的规则即可,如果没有则需要符合 document.querySelector 选择器的规则.

            Eg. defaultSelector = document. 最高作用域为 document, document 里面任意元素都会触发对应的事件.
                defaultSelector = "#test".  最高作用域为 #test 元素(如果选择器筛选出多个元素,只绑定第一个).
    3.  type
        * boolean
        * 默认值 false
        * 设置事件捕获与冒泡的机制.<br>

            true  : 捕获模式<br>
            false : 冒泡模式

*   entrust.on(action, fns, option)  绑定事件.

    `entrust.on("click,mouseover", fns, { selector : "#testDiv"});`

    1.  action
        * string
        * 必须传递
        * 事件类型. 如 click, mousedown 等等.
    2.  fns
        * Object
        * 必须传递
        * 函数配置对象.<br>
            Eg. <br>


        fns = {
              checkName : function(event){
                  console.log(event.type);
              },
              checkPassword : function(event){
                  console.log(event.type);
              }
        }



   3.  option
        * Object
        * 可选
        * 选项配置,与 entrust.config 可配置项一致. 只不过此参数只影响本次调用.优先级大于 entrust.config 的设置.

*   html 代码设置

    1.  绑定一个事件类型<br>

        `data-event-fn='clickTest'`

        当元素触发事件时就会调用 fns\["clickTest"](event);

    2.  绑定多个事件类型

        `data-event-fn='{"click": "clickTest","mouseover":"mouseoverTest"}'`

        必须是一个 JSON 串. <br>
        当元素触发 click 事件时 便会调用  fns\["clickTest"](event).<br>
        当元素触发 mouseover 事件时 便会调用  fns\["mouseoverTest"](event).<br>

*   fns\["clickTest"](event, fnElem) 的参数说明

    1. event JS 传递的 event 对象.
    2. fnElem 绑定 tag 自定义属性的元素.