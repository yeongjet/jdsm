define(function() {
	var $ = Dom7;

	function click(element,handle) {
		$(element).on('click',handle);
	}

	function refresh(page,handle) {
		$(page).on('refresh',handle);
	}
	
	return {
		click:click,
		refresh:refresh
	}
})