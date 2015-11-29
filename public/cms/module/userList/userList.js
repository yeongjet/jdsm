define(["smartgrid","text!./userList.html","css!./userList.css"], function(sm,userList) {
    avalon.templateCache.userList = userList;
    var userList = avalon.define("userList", function(vm) {
        vm.$skipArray = ["opts"];
        vm.render = function() {
            avalon.ajax({
                url: '/user',
                type: 'get',
                cache: false,
            }).done(function(res) {
                avalon.vmodels.sgUserList.render(res.data);
            });               
        }
        vm.opts = {pageable: true, noResult: "暂无数据",
            selectable: {type: "Radio"},
            pager: {prevText: "<",nextText: ">",perPages: 20,showPages: 5,totalItems: 120,
                onJump: function(event, page) {
                    console.log("event" + JSON.stringify(event) + "page=" + (page !== vm.currentPage));
                }
            },
            //smartgrid:
            //单选按钮列的宽度25px+自定义列总宽度775+额外固定的25=父容器宽度825=不显示水平滚动条
            //然而最后一栏的宽度变成了222 官网的示例也是如此 如果是有意这样设定 能否注明一下
            columns: [
                        {key: "username",name: "用户名",width:150}, 
                        {key : "realname", name : "姓名", width: 150 }, 
                        {key : "phoneNumber",name : "手机号",width: 100,}, 
                        {key : "address",name : "地址",width: 200},
                        {key: "regDate",name: "注册日期",width: 180},
                           
                    ],

         }
     })
    userList.render();
    avalon.vmodels.root.userList = "userList"
})