require.config({
	baseUrl:'',
	paths:{
		text:'vendor/require/text',
		css:'vendor/require/css',
		domReady:'vendor/require/domReady',
		avalon:'vendor/avalon/avalon.shim',
        smartgrid: 'vendor/oniui/smartgrid/avalon.smartgrid',
        draggable: 'vendor/oniui/avalon.draggable',
        dropdown: 'vendor/oniui/dropdown/avalon.dropdown',
        loading: 'vendor/oniui/loading/avalon.loading',
        pager: 'vendor/oniui/pager/avalon.pager',
        scrollbar: 'vendor/oniui/scrollbar/avalon.scrollbar',
        getModel: 'vendor/oniui/avalon.getModel',
        mmRequest: 'vendor/oniui/mmRequest/mmRequest',
        mmPromise: 'vendor/oniui/mmPromise/mmPromise'
	},
	priority:['text','css'],
	shim: {
		avalon: {
			exports:'avalon'
		}
	}
});

require(['avalon',"mmRequest",'domReady!'],function() {
	avalon.templateCache.empty="&nbsp;"
	avalon.define("root", function(vm) {
        vm.userList = "empty",
        vm.orderList = "empty",
        vm.productList = "empty",
        vm.commentList = "empty",
        vm.index = 0,
        vm.btnClick = function (index) {
            vm.index = index;
        }
	});

	require([
        './module/userList/userList',
        './module/productList/productList',
        './module/orderList/orderList',
        './module/commentList/commentList',
     ]);
	avalon.scan()
})