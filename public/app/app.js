require.config({
	paths: {
		text: "vendor/require/text",
		css: "vendor/require/css",
		priority: ['text', 'css'],
		proxy: "module/app/js/proxy",
		router: "module/app/js/router",
		bind: "module/app/js/bind",
		util: "module/app/js/util",
		app:'app'
	}
});


define('app',['proxy','router','bind'], function(proxy,router,bind) {

	var $ = Dom7;

	var tab = "home";

	var f7 = new Framework7({
		swipePanel: 'left',
		animateNavBackIcon: true,
		precompileTemplates: true,
		template7Pages: true,
	});

	var swiper = f7.swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		speed: 300,
		autoplay: 2500,
		autoplayDisableOnInteraction: false,
		loop: true
	});

	var home = f7.addView('#home',{
		dynamicNavbar: true,
		domCache: true
	});

	var types = f7.addView('#types', {
		dynamicNavbar: true,
		domCache: true
	});

	var cart = f7.addView('#cart', {
		dynamicNavbar: true,
		domCache: true
	});

	$('.searchbar-cancel').css("margin-right", '-54px');

	function renderHomePage(data) {
		var homeTemple = Template7.compile($('#home-template').html());
		$('#home-content-wrap').html(homeTemple(data));
	}

	function renderTypesPage(data) {
		var typesTemple = Template7.compile($('#types-template').html());
		$('#types-content-wrap').html(typesTemple(data));
	}

	function renderCartPage(data) {
		var cartTemple = Template7.compile($('#cart-template').html());
		$('#cart-content-wrap').html(cartTemple(data));	
	}

	function getTabName() {
		return tab;
	}

	function setBindings() {
		bind.click('.homeTab',function() {
			tab = "home";
			console.log(tab)
		})

		bind.click('.typesTab',function() {
			tab = "types";
			console.log(tab)
		})

		bind.click('.cartTab',function() {
			tab = "cart";
			console.log(tab)
			if(proxy.getCartList()) {
				renderCartPage(proxy.getCartList());
				$('.cartNoProd').css('display','none');
				$('.cartList').css('display','block');
			}else {
				$('.cartNoProd').css('display','block');
				$('.cartList').css('display','none');
			}
		})

		bind.click('#cart .orderSub',function() {
			proxy.setCartToOrderSubList();
			router.load("orderSubList")
		});	
		
		bind.refresh('.types .pull-to-refresh-content',function() {
			proxy.updProdList(function(prodList) {
				renderTypesPage(proxy.getProdList());
				f7.pullToRefreshDone();	
			})
		})

		bind.refresh('.orderList .pull-to-refresh-content',function() {
			proxy.updOrderList(function() {
				console.log("updOrderList");
				router.refreshPage();
				app.f7.pullToRefreshDone();	
			})
		})
	}

	function init() {
		renderHomePage(proxy.getProdList(5));
		renderTypesPage(proxy.getProdList());
		renderCartPage(proxy.getCartList());
		setBindings();
	}

	return {
		f7: f7,
		init:init,
		home: home,
		types: types,
		cart: cart,
		getTabName:getTabName
	}
})

require(['app','proxy','router'], function(app,proxy,router) {

	var $ = Dom7;

	

	proxy.updProdList(function(e) {
		app.init();
		router.init();
	})

	$(document).on('pageBeforeInit', function(e) {
		var page = e.detail.page.name;
		console.log(app.getTabName());
		require(['module/'+page+"/"+page],function(page) {
			page.init();
		})
	})
})