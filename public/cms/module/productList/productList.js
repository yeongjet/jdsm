define(["smartgrid", "text!./productList.html", "css!./productList.css"], function(sm, productList) {
    avalon.templateCache.productList = productList;
    var productList = avalon.define("productList", function(vm) {
        vm.$skipArray = ["smartgrid"];
        vm.isDisplay = false;
        vm.selectedId = "";
        //grid下面的三个按钮需要到smartgrid.js修改源码和绑定事件
        vm.add = function() {
            vm.isDisplay = !vm.isDisplay;
        }
        vm.detail = function() {
            vm.isDisplay = !vm.isDisplay;
        }
        vm.del = function() {
            avalon.ajax({
                url: '/product/'+vm.selectedId,
                type: 'delete',
                cache: false,
            }).done(function(res) {
                console.log(res);
                avalon.vmodels.sgProductList.render(res);
            });    
        }
        vm.back = function() {
            vm.render();
            vm.isDisplay = !vm.isDisplay;
        }
        vm.render = function() {
            avalon.ajax({
                url: '/product',
                type: 'get',
                cache: false,
            }).done(function(res) {
                avalon.vmodels.sgProductList.render(res.data);
            });               
        }
        vm.smartgrid = {
            pageable: true,
            noResult: "暂无数据",
            selectable: {type: "Radio", width: "25px"},
            pager: {prevText: "<",nextText: ">",perPages: 20,showPages: 5,totalItems: 120,
                onJump: function(event, page) {
                    console.log("event" + JSON.stringify(event) + "page=" + (page !== vm.currentPage));
                }
            },
            onRowSelect: function(rowData, isSelected, dataIndex) {
                console.log("onRowSelect:" + rowData._id + isSelected + dataIndex);
                vm.selectedId = rowData._id;
            },
            columns: [
                {key: "name",name: "名称",width: 90,}, 
                {key: "title",name: "标题",width: 90}, 
                {key: "measure",name: "单位",width: 90},
                {key: "type",name: "种类",width: 90}, 
                {key: "salePrice",name: "原价",width: 90}, 
                {key: "retailPrice",name: "售价",width: 90}, 
                {key: "sold",name: "已售",width: 90}, 
                {key: "stock",name: "库存",width: 90}, 
                {key: "regDate",name: "上架日期",width: 100}
            ]
        }
    });
//商品数据的展示 待完成
    // var productInfo = avalon.define("productInfo",function(vm) {
    //     vm.name = "";
    //     vm.title = "";
    //     vm.salePrice = "";
    //     vm.retailPrice = "";
    //     vm.sold = "";
    //     vm.type = "";
    //     vm.measure = "";
    //     vm.detailText = "";
    // });
    productList.render();
    avalon.vmodels.root.productList = "productList"
})