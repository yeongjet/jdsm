define(['app','require'],function(app,require) {

	var app;

	function init() {
		app = require('app');
	}

	function restart() {
		for(var i = 0; i < getTab().history.length; i++) {
			getTab().router.back({animatePages: false});
		}
	}

	function back() {
		getTab().router.back();
	}

	function backs() {
		getTab().router.back({animatePages: false});
	}

	function refresh(params) {
		getTab().refreshPage()
	}

	function fore(page) {
		var options = {url:"module/"+page+"/"+page+".html",contextName:page}
		getTab().router.load(options)
	}

	function fores(page) {
		var options = {url:"module/"+page+"/"+page+".html",contextName:page,animatePages: false}
		getTab().router.load(options)
	}

	function foret(page) {
		var options = {template: Template7.templates.orderListTemplate}
		getTab().router.load(options)
	}

	function getTab() {
		var tab;
		if(app.getTabName() == "home")
			tab = app.home;
		if(app.getTabName() == "types")
			tab = app.types;
		if(app.getTabName() == "cart")
			tab = app.cart;
		return tab;
	}

	return {
		init:init,
		fore:fore,
		fores:fores,
		foret:foret,
		back:back,
		backs:backs,
		refresh:refresh,
		restart:restart
	}
})