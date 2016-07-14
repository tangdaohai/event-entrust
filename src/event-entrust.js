/**
 * event-entrust JavaScript Library v1.0.0
 * https://github.com/tangdaohai/event-entrust
 */
(function(){

    let defaults = {
        //事件名称属性, 当触发事件时, 会寻找含有此属性的元素
        tag : "data-event-fn-name",
        //默认的事件绑定范围
        defaultSelector : document,
        //默认 false.绑定事件 捕获 或者 冒泡。 true : 捕获, false : 冒泡
        type : false
    };

    function entrust(){
    }

    entrust.version = "1.0.0";

    /**
     * 设置全局配置
     * @param name
     * @param value
     */
    entrust.config = (name, value) =>  defaults[name] = value;

    /**
     * 绑定事件
     * @param action    事件类型
     * @param fns       事件配置函数
     * @param option    配置选项
     */
    entrust.on = ( action, fns = {}, option = {} ) => {

        let selector = option.selector || defaults.defaultSelector,
            type = option.type || defaults.type,
            tag = option.tag || defaults.tag;

        //指定要绑定的事件
        let bindTarget;

        //获取要绑定的事件的元素
        if( selector instanceof Node){
            //selector 是一个节点元素
            bindTarget = selector;
        }else if(typeof selector === "string"){
            //selector 是一个字符串选择器

            //优先使用 jQuery 的选择器
            if(typeof $ !== "undefined"){
                bindTarget = $(selector)[0];
            }else{
                bindTarget = document.querySelector(selector);
            }

        }else{
            throw new TypeError(`${ selector } : Don't support this type of parameter`);
        }

        if(!bindTarget){
            throw new Error(selector + " Not Found.");
        }

        //按 逗号 空格 冒号拆分
        action = action.split(/,|\s|:/g);

        //迭代 事件类型
        for(let val of action.values()){
            //先移除
            EventUtil.removeEvent(bindTarget, val, _callback);
            //再绑定
            EventUtil.addEvent(bindTarget, val, _callback, type);
        }

        function _callback(event){
            event = EventUtil.getEvent(event);
            //触发事件的目标元素.
            let target = EventUtil.getTarget(event);

            //查找有指定 函数名称 的元素
            let fnElem = EventUtil.findBindFnElem(target, tag, bindTarget);

            if(fnElem){
                let name = fnElem.getAttribute(tag);

                //如果配置 name 是一个 json
                if(/^{.*}$/.test(name)){
                    //获取对应的事件类型的函数名称
                    try{
                        name = JSON.parse(name)[event.type];
                    }catch(e){
                        throw new SyntaxError("Unexpected token " + name + " in JSON");
                    }
                }

                //要执行的函数
                let fn = fns[name];

                /**
                 * 如果是一个函数,就执行它.
                 * event
                 * fnElem
                 */
                typeof fn === "function" && fn(event, fnElem);
            }
        }
    };

    let EventUtil = {
        /**
         * 绑定事件
         * @param element   指定的元素
         * @param action    事件类型
         * @param fn        触发后的函数
         * @param type      捕获或者冒泡
         */
        addEvent (element, action, fn, type){
            if(element.addEventListener){
                element.addEventListener(action, fn, type);
            }else if(element.attachEvent){
                element.attachEvent("on" + action, fn);
            }else {
                throw new Error("bind event failed. Browser version is too low");
            }
        },
        /**
         * 解除事件
         * @param element
         * @param action
         * @param fn
         */
        removeEvent (element, action, fn) {
            if(element.removeEventListener){
                element.removeEventListener(action, fn);
            }else if(element.detachEvent){
                element.detachEvent("on" + action, fn);
            }
        },
        /**
         * 获取 event
         * @param event
         * @returns {*|Event}
         */
        getEvent (event){
            return event || window.event;
        },
        /**
         * 获取 触发事件的目标元素
         * @param event
         * @returns {Node|string|EventTarget|*|Object}
         */
        getTarget (event){
            return event.target || event.srcElement;
        },
        /**
         * 查找含有 defaults.tag 属性的元素
         * 若本身元素没有, 指定到父级元素递归查找.
         * @param element
         * @param tag
         * @param range     代理事件的元素
         * @returns {*}
         */
        findBindFnElem (element, tag, range){

            if(element.getAttribute && element.getAttribute(tag) !== null){
                //有查找到 tag, 返回这个元素.
                return element;
            }

            //查到到达绑定事件的范围上限了， 不再查找了。
            if(element === range){
                return null;
            }

            //继续迭代查找
            return this.findBindFnElem(element.parentNode, tag, range);

        }
    };

    //导出
    if (typeof define === 'function') {
        // RequireJS && SeaJS
        define(function () {
            return entrust;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = entrust;
    } else {
        window.entrust = entrust;
    }
})();
