define(["smartgrid","text!./commentList.html","css!./commentList.css"], function(sm,commentList) {
    avalon.templateCache.commentList = commentList;
    var commentList = avalon.define("commentList", function(vm) {
        vm.render = function() {
            avalon.ajax({
                url: '/order',
                type: 'get',
                cache: false,
            }).done(function(res) {
                for(var i = 0; i < res.data.length; i++) {
                    var content = res[i].comment.content;
                    var comState = res[i].comment.state;
                    res[i].content = content;
                    res[i].comState = comState;
                }
                avalon.vmodels.sgCommentList.render(res);
            });               
        }     
        vm.selectedId = "";  
        vm.$skipArray = ["smartgrid"]
        vm.smartgrid = {
            pageable: true,
            noResult: "暂无数据",
            selectable: {type: "Radio", width: 20},
            dropdownData: [{ 
                name: "无",
                value: "null"
            },{
                name: "通过",
                value: "pass"
            },{
                name: "屏蔽",
                value: "ban",
            }],
            dropdown : {
                width: 100,
                listWidth: 100,
                onChange:function(e) {
                    var state;
                    if(e=="pass") {
                        state = "passed";
                    }
                    if(e=="ban") {
                        state = "baned";
                    }
                    if(e=="null") {
                        return;
                    }else if(vm.selectedId){
                        avalon.ajax({
                            url: '/order/'+vm.selectedId+'/comment',
                            type: 'post',
                            cache: false,
                            data: {
                                state: state
                            }        
                        }).done(function(res) {
                            commentList.render();
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
                {key: "user",name: "用户ID",width: 200}, 
                {key: "_id",name: "订单ID",width: 200,}, 
                {key: "content",name: "内容",width: 100,}, 
                {key: "comState",name: "状态",width: 100,},
                {key: "opera", name: "操作",width: 100,format: "dropdown"},
                {key: "regDate",name: "日期",width: 200,}
            ]
        }
    })
    commentList.render();
    avalon.vmodels.root.commentList = "commentList"
})