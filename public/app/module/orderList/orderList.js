define(['app','bind','router','proxy','util'],function(app,bind,router,proxy,util) {

	function init() {
		render();

		var user = proxy.getUserInfo().userInfo;

		bind.click('.orderListBack',function() {
			router.back();
		})

		bind.refresh('.orderList .pull-to-refresh-content',function() {
			if(user) {
				proxy.updOrderList(user._id,function(orderList) {
					proxy.getOrderData(orderList,function() {
						router.refresh();
						app.router.reload;
						app.f7.pullToRefreshDone();	
					})
				})
			}else {
				app.f7.pullToRefreshDone();
			}
		})
	}

	function render() {
		var $ = Dom7;
		var orderListTemple = Template7.compile($('#orderListTemplate').html());
		$('#orderList-content-wrap').html(orderListTemple(proxy.getOrderList()));
	}

	return {
		init:init
	}
})