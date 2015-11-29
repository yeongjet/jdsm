define(['app','bind','router','proxy','util'],function(app,bind,router,proxy,util) {

	function init() {

		bind.click('.receipt',function() {
			var data = {orderId:util.getText('.orderId'),state:"已收货"};
			proxy.updOrderState(data,function() {
				app.f7.alert('收货成功', '消息', function() {
					router.back();
				})
			});

		})
	}
	return {
		init:init
	}
})