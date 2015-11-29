define(['app','bind','router','proxy','util'],function(app,bind,router,proxy,util) {
	function init() {
		var state = switchSign("signIn");
		bind.click('.user-sign',function() {
			util.getFieldData('.user-sign-form input',function(data){
				util.checkUserSign(data,
					function (data) {
						proxy.userSignUp(data, function(user) {
							proxy.setUserInfo(user);
							app.f7.alert('注册成功', '提示');
							router.back()
						},function () {
							app.f7.alert('信息错误,请重新输入', '提示')
						})
					},function (data) {
						proxy.userSignIn(data, function(user) {
							proxy.setUserInfo(user);
							proxy.updOrderList(user._id,function(orderList) {
								proxy.getOrderData(orderList,function(data) {
									console.log(data);
								})
							});
							app.f7.alert('登陆成功', '信息');
							router.back()
						},function () {
							app.f7.alert('信息错误,请重新输入', '信息');
						})
					},function () {
						app.f7.alert('请输入完整信息', '信息');
					}
				)
			})
		})

		bind.click('.loginBtn',function() {
			switchSign('signIn')
		})

		bind.click('.signUpBtn',function() {
			switchSign('signUp')
		})
	}

	function switchSign(state) {
		var $ = Dom7;
		var bgColor, color, dis, tbgColor, tcolor;
		if (state == "signUp") {
			bgColor = "#AB2619";
			color = "#FFFFFF";
			tbgColor = "#FFFFFF";
			tcolor = "#000000";
			dis = "block"
		} 
		else if(state == "signIn"){
			bgColor = "#FFFFFF";
			color = "#000000";
			tbgColor = "#AB2619";
			tcolor = "#FFFFFF";
			dis = "none"
		}
		$('.signUpBtn').css("background-color", bgColor).css("color", color)
		$('.loginBtn').css("background-color", tbgColor).css("color", tcolor)
		$('#realname').parent().parent().parent().css("display", dis);
		$('#phoneNumber').parent().parent().parent().parent().parent().css("display", dis);
		return state;
	}

	return {
		init:init
	}
})