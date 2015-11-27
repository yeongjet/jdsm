define(['app','bind','proxy','util'],function(app,bind,proxy,util) {

	function init() {
		util.setText('.orderSubList .totalPrice',proxy.getTotalPrice());
		bind.click('.confirmPay',function() {
			var user = proxy.getUserInfo();
			var orderList = proxy.getOrderSubList();
			util.checkUserInfo(function {
				var subData = util.getOrderSubData(user,orderList);
				proxy.setOrder(JSON.stringify(subData), function(){
					app.f7.alert('下单成功', '消息', function() {
						router.fore('orderList');
					})
				})
			},function() {
				router.load('userLogin');
			})
		})
	}

	return {
		init:init
	}
})