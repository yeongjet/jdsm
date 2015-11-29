define(["smartgrid","text!./orderList.html","css!./orderList.css"], function(sm,orderList) {
    avalon.templateCache.orderList = orderList;
    var orderList = avalon.define("orderList", function(vm) {
        vm.$skipArray = ["smartgrid"];
        vm.render = function() {
            avalon.ajax({
                url: '/order',
                type: 'get',
                cache: false,
            }).done(function(res) {
                avalon.vmodels.sgOrderList.render(res.data);
            });               
        }
        vm.selectedId = "";
        vm.smartgrid = {
            pageable: true,
            noResult: "暂无数据",
            selectable: {type: "Radio", width: 20},
            dropdownData: [{ 
                name: "无",
                value: "null"
            },{
                name: "发货",
                value: "deliver"
            },{
                name: "确认退货",
                value: "return",
            }],
            dropdown : {
                width: 100,
                listWidth: 100,
                onChange:function(e) {
                    var state;
                    if(e=="deliver") {
                        console.log(e);
                        state = "已发货";
                    }
                    if(e=="return") {
                        console.log(e);
                        state = "已退货";
                    }
                    if(e=="null") {
                        return;
                    }else if(vm.selectedId){
                        //console.log("SD"+vm.selectedId+state);
                        avalon.ajax({
                            url: '/order/'+vm.selectedId,
                            type: 'put',
                            cache: false,
                            data: {
                                state: state
                            }        
                        }).done(function(res) {
                            orderList.render();
                        });      
                    }else {
                        console.log("select a row")
                    }

                },           
            },
            onRowSelect: function(rowData,isSelected,dataIndex)  {
                if(isSelected) {
                    vm.selectedId = rowData._id;
                }
            },
            htmlHelper: {
                //opera列包装成dropdown组件
                dropdown: function(vmId, field, index, cellValue, rowData, disable) {
                    var option = "<option ms-repeat='dropdownData' ms-attr-value='el.value' ms-attr-label='el.name' ms-selected='el.value == " + cellValue + "'></option>"
                    return '<select ms-widget="dropdown" rowindex="' +index+'" field="'+field+'" vmId="'+vmId+'" ' + (disable ? "disabled" : "") + '>' + option + '</select>'
                }                
            },
            pager: {prevText: "<",nextText: ">",perPages: 20,showPages: 5,totalItems: 120,
                onJump: function(event, page) {
                    console.log("event" + JSON.stringify(event) + "page=" + (page !== vm.currentPage));
                }
            },
            columns: [
                {key: "_id",name: "订单ID",width: 200}, 
                {key: "user",name: "用户ID",width: 200,}, 
                {key: "state", name: "订单状态",width: 100}, 
                {key: "opera", name: "操作",width: 100,format: "dropdown"},
                {key: "regDate",name: "下单日期",width: 200,}
            ],
        }
    })
    orderList.render();
    avalon.vmodels.root.orderList = "orderList"
})