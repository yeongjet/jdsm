define(['app','bind','router','proxy','util'],function(app,bind,router,proxy,util) {

	function init() {
		util.setText('.orderSubList .totalPrice',proxy.getTotalPrice());
		bind.click('.confirmPay',function() {
			if(proxy.getUserInfo().userInfo) {
				proxy.setOrder(function(){
					proxy.updOrderList(proxy.getUserInfo().userInfo._id,function(orderList) {
						proxy.getOrderData(orderList,function(data) {
							console.log(data);
							app.f7.alert('下单成功', '消息', function() {
								router.fore('orderList');
							})
						})
					})
				})
			}else {
				router.fore('userSign');
			}
		})
	}
	return {
		init:init
	}
})