define(['app','require'],function(app,require) {
	//此处循环依赖了 再次注入require获取app模块 否则会得到undefinded的app
	var app;

	function init() {
		app = require("app");
	}

	function back() {
		getRouter().back();
	}

	function refresh(params) {
		getRouter().refreshPage()
	}
	
	function reload(params) {

	}

	function fore(params) {
		getParam(params);
		var options = {url:"module/"+params.page+"/"+params.page+".html",contextName:params.context}
		console.log(getRouter())
		getRouter().load(options)
	}
	
	function getRouter() {
		var router = {};
		var tab = app.getTabName();
		if(tab == "home")
			router = app.home.router;
		if(tab == "types")
			router = app.types.router;
		if(tab == "cart")
			router = app.cart.router;
		return router;
	}
	function getParam(params) {
		var p = {};
	}

	return {
		init:init,
		back:back,
		reload:reload,
		refresh:refresh,
		fore:fore
	}
})