define(['app','bind','proxy','router','util'],function(app,bind,proxy,router,util) {
	var $ = Dom7;
	function init() {
		render();
		if(!proxy.getUserInfo().userInfo) {
			setTimeout(function() {
				router.fore('userSign');
			},600);
		}
	}

	$(document).on('pageReinit',function(e) {
		e.detail.page.name=="userInfo" && render();
	});

	function render() {
		var homeTemple = Template7.compile($('#userInfoTemplate').html());
		$('#userInfo-content-wrap').html(homeTemple(proxy.getUserInfo().userInfo));
	}
	return {
		init:init
	}
})