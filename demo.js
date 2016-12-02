
//配置函数对象
var fns = {
    //点击
    clickTest :  function(event, fnElem){
        log(event, fnElem);
    },
    //鼠标划入
    mouseoverTest : function(event, fnElem){
        log(event, fnElem);
    }
};

function log(event, fnElem){
    console.log("事件类型 : " + event.type);
    console.log("被点击的元素 : " , event.target);
    console.log("绑定事件函数名称的元素 : " , fnElem);

    document.querySelector(".text input[type='textarae']").value = "事件类型 : " + event.type;
}

entrust.config("tag", "data-event-fn");

entrust.on("click,mouseover", fns, { selector : "#testDiv"});