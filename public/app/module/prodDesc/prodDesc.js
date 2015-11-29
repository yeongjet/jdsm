define(['app','proxy','bind','router','util'],function(app,proxy,bind,router,util) {
	function init() {
		bind.click('.prodDesc .cartSub', function() {
			util.checkQtyField('.prodDesc .quantity',function(qty) {
				var cartProd = {productId: util.getText('.prodDesc .productId'),quantity: qty};
				proxy.setProdToCart(cartProd, function(qty) {
					app.f7.alert('添加成功', '消息', function() {
						router.back();
					});
				});
			},function() {
				app.f7.alert('请输入正确的数量', '消息')
			})
		})
		bind.click('.prodDesc .orderSub',function() {
			util.checkQtyField('.prodDesc .quantity',function(qty) {
				var cartProd = {productId: util.getText('.prodDesc .productId'),quantity: qty};
				proxy.setProdToOrderSubList(cartProd, function() {
					router.fore('orderSubList');
				})
			},function() {
				app.f7.alert('请输入正确的数量', '消息')
			});
		})
	}
	return {
		init:init
	}
})