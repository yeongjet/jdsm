define(['app','bind','proxy','util'],function(app,bind,proxy,util) {
	function init() {
		var state = switchSign("login");
		bind.click('.user-sign',function() {
			util.getFormData('.user-sign-form input',function(data){
				util.checkUserSign(data,
					function signUp(data) {
						proxy.userSignUp(data, function(res) {
							util.checkResCode(res.code,function correct() {
								proxy.setUserInfo(res.user);
								app.f7.alert('注册成功', '提示');
								router.fore('orderSubList')
							},function incorrect() {
								app.f7.alert('信息错误,请重新输入', '提示')
							})
						})
					},function signIn(data) {
						proxy.userSignIn(data, function(res) {
							util.checkResCode(res.code,function correct(){
								proxy.setUserInfo(res.user);
								proxy.updateOrderList(res.user._id);
								app.f7.alert('登陆成功', '信息');
								router.fore("orderSubList");
							},function incorrect() {
								app.f7.alert('信息错误,请重新输入', '信息');
							})
						});
					},function fieldNull() {
						app.f7.alert('请输入完整信息', '信息');
					}
				)
			})
		}
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
		} else {
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