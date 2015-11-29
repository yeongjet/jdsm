define(['util'],function(util) {

	var $ = Dom7;

	/**
	 * @description 
	 * 从服务器获取包含全部商品信息的列表
	 * 会把请求成功后的数据保存在Template7.data.prodList
	 * 
	 * @param @required {function} 请求成功后的回调
	 * @return {object} prodList数组对象 @example Object {prodList: Array[13]}
	 * 
	 * @param @optional {function} 请求失败后的回调
	 * @return {Number} 请求失败后的返回码
	 */
	function updProdList(scb,fcb) {
		$.getJSON('/product', function(obj) {
			if(obj.code==10000) {
				Template7.data.prodList = obj.data
				scb({prodList:Template7.data.prodList});
			}else {
				if(fcb) fcb(obj.code);
			}
		});
	}

	/**
	 * @description 
	 * 从Template7.data获取包含全部商品信息的列表 
	 * 可指定获取的前n条商品信息
	 * @param @optional {Number} 获取前n条商品信息
	 * @param @optional {function} 回调函数
	 * @return {object} prodList数组对象
	 */
	
	function getProdList(n,cb) {
		var pl = Template7.data.prodList;
		if(!pl) return {prodList:pl}
		var arr = util.copys(pl);
		n && cb && cb({prodList:arr.splice(0, n)})
		if(n) {
 			typeof(n) =="function" && n({prodList:arr});
			if(typeof(n)=="number") return {prodList:arr.splice(0, n)};
		}

		{if(cb) cb(obj); return {prodList:arr}};
	}

	/**@description 添加商品到购物车 成功后的数据保存在Template7.data.cartList
	 * @example {cartList:[{product(object),quantity}]}
	 * @param {object} @required @example {productId(string),quantity(number)}
	 * @param {function} @optional 
	 */
	function setProdToCart(prod, cb) {
		var parr = getProdList().prodList;
		var carr = getCartList().cartList;
		if (!carr) carr = [];
		var item = {product: "",quantity: 0};
		for (var p in parr) {
			if (prod.productId == parr[p]._id) {
				item.product = parr[p];
				item.quantity = prod.quantity;
				carr.push(item);
			}
		}
		Template7.data.cartList = carr;
		if (cb) cb();
	}

	/**@description 添加某一商品到订单提交列表 
	 * 成功后的数据保存在Template7.data.orderSubList 结构和cartList相同
	 * 会覆盖上次的数据
	 * @param {object} @required @example {productId(string),quantity(number)}
	 * @param {function} @optional
	 */
	function setProdToOrderSubList(prod, cb) {
		var sarr = [];
		var parr = getProdList().prodList;
		var item = {product: "", quantity: 0};
		for (var p in parr) {
			if (prod.productId == parr[p]._id) {
				item.product = parr[p];
				item.quantity = prod.quantity;
				sarr.push(item);
			}
		}
		Template7.data.orderSubList = sarr;
		if (cb) cb();
	}

	/**@description 添加购物车的商品到订单提交列表 
	 * 成功后的数据保存在Template7.data.orderSubList 结构和cartList相同
	 * 会覆盖上次的数据 
	 * @param {function} @optional cb 
	 */
	function setCartToOrderSubList(cb) {
		Template7.data.orderSubList = getCartList().cartList;
		if (cb) cb();
	}

	/**@description 获取购物车列表
	 * @return {object} 购物车列表 
	 * @example {cartList:[{product(object),quantity}]}
	 */
	function getCartList() {
		return {cartList: Template7.data.cartList};
	}

	/**@description 获取订单提交列表
	 * @return {object} 订单提交列表
	 */
	function getOrderSubList() {
		return {orderSubList: Template7.data.orderSubList};
	}

	/**
	 * @description 添加订单 前提:用户已登录 有订单提交列表
	 * @param {object} @required user 用户对象
	 * @param {object} @required orderSubList 订单提交列表
	 * @param {Function} @optional @return 订单对象
	 */
	function setOrder(tcb,fcb) {
		var user = getUserInfo().userInfo;
		var orderSubList = getOrderSubList();

		if(!user || !orderSubList) fcb(10004);

		var orderSubData = getOrderSubData(user,orderSubList);

		$.post('/order', orderSubData, function(res) {
			res = JSON.parse(res);
			if(res.code == 10000) {
				var orderList = getOrderList().orderList;
				if (!orderList) orderList = [];
				orderList.push(res.data);
				Template7.data.orderList = orderList;
				tcb(res.data);
			}else {
				if (fcb) fcb(res.code);
			}
		});
	}

	/**@description 更新订单状态 
	 * {orderId:"5659770f90de1c30324700f9",state:"已收货"}
	 * data:{orderId(string),state(string)}
	 * @param {string} state '已收货' | '已评价' | '已申请退款'
	 */
	function updOrderState(data,tcb,fcb) {
		$.post('/order/'+data.orderId,{state:data.state},function(res) {
			res = JSON.parse(res);
			if(res.code == 10000) {
				if(tcb) tcb(res.data);
			}else {
				if(fcb) fcb(res.code);
			}
		})
	}

	/**@description 私有函数 获取订单提交数据 
	 * @param  {object} 用户对象
	 * @param  {Object} 订单列表
	 */
	function getOrderSubData(user,orderSubList) {
		var subData = {user:user._id, detail:[]};
		console.log(orderSubList);
		for (var e in orderSubList) {
			console.log(orderSubList[e]);
			//url_query: Object]
			for(var i in orderSubList[e]) {
				console.log(subData);
				var item = {
					product: orderSubList[e][i].product._id,
					quantity: parseInt(orderSubList[e][i].quantity)
				};
				subData.detail.push(item);
				if(i==orderSubList[e].length-1) return JSON.stringify(subData);
			}
		}
	}

	/**
	 * @description 更新订单列表
	 * @param @required {string} 用户id
	 * @param @optional {function} 回调 @return {object} 订单对象列表
	 */
	function updOrderList(userId, cb) {
		console.log(userId)
		$.getJSON('/order/user/' + userId, function(res) {
			console.log(res)
			if (res.code==10000) {
				Template7.data.orderList = res.data;
				
				if (cb) cb(res.data);
			} else {
				if (cb) cb(res.code);
			}
		});
	}

	/**
	 * @description 获取订单列表
	 * @return {object} 订单列表
	 * @example {cartList:[{product(object),quantity}]}
	 */
	function getOrderList() {
		return {orderList: Template7.data.orderList};
	}

	/**
	 * 获取完整的订单信息
	 * @param  {object} orderList 原订单列表 只包含商品的_id
	 * @return {object}           包含商品信息的订单列表
	 */
	function getOrderData(orderList,cb) {
		
		var prod = getProdList().prodList;
		console.log(orderList);
		for(var i in orderList) {
			var detail = orderList[i].detail;
			console.log(detail);
			for(var d in detail) {
				var item = detail[d];
				for(var p in prod) {
					//console.log(item.product);
					if(item.product == prod[p]._id) {
						console.log("match");
						item.product = util.copys(prod[p]);
					}
				}
			}
		}
		if(cb) cb(orderList);
		return orderList;
	}

	/**@description 用户登陆
	 * @param @required {object} data {username:"aaa",password:"sdg"}
	 * @param  {function} 
	 * @return {object} 用户对象
	 */
	function userSignIn(data, tcb, fcb) {
		$.post('/user/login',data,function(res) {
			res = JSON.parse(res);
			if(res.code == 10000) {
				tcb(res.data);
			}else {
				if(fcb) fcb(res.code);
			}
		});
	}

	/**@description 用户注册
	 * @param  {object} data 用户注册的信息
	 * 完整字段 {username:"无锡",realname:"小明",password:"abc",phoneNumber:"123",address:"无锡"}
	 * 必须字段 {username:"无锡",password:"abc",phoneNumber:"123"}
	 * @param {function} @return {object} 用户对象
	 * 额外字段 _id(string) regDate(date)
	 */
	function userSignUp(data, tcb, fcb) {
		$.post('/user', data, function(res) {
			res = JSON.parse(res);
			if(res.code == 10000) {
				tcb(res.data);
			}else {
				if(fcb) fcb(res.code);
			}
		});
	}

	/**@description 添加用户的信息到Template7.data
	 * @param {object} userInfo 用户对象
	 */
	function setUserInfo(userInfo,cb) {
		if(userInfo) Template7.data.userInfo = userInfo;
		if(cb) cb();
		//localStorage.setItem("userInfo",JSON.stringify(user));
	}

	/**@description 获取Template7.data用户的信息
	 * @return {object} userInfo 用户对象
	 */
	function getUserInfo(cb) {
		var userInfo = {userInfo:Template7.data.userInfo};
		if(cb) cb(userInfo);
		return userInfo
	}

	/**@description 获取订单总价格
	 * @return {number} 总价格
	 */
	function getTotalPrice() {
		var orderSubList = getOrderSubList().orderSubList;
		var totalPrice = 0;
		for (var e = 0; e < orderSubList.length; e++) {
			totalPrice += (parseInt(orderSubList[e].quantity) * orderSubList[e].product.retailPrice)
		}
		return totalPrice;
	}

	return {
		userSignIn:userSignIn,
		userSignUp:userSignUp,
		getUserInfo:getUserInfo,
		setUserInfo:setUserInfo,
		updProdList:updProdList,
		getProdList:getProdList,
		setProdToCart:setProdToCart,
		getCartList:getCartList,
		setProdToOrderSubList:setProdToOrderSubList,
		setCartToOrderSubList:setCartToOrderSubList,
		getOrderSubList:getOrderSubList,
		getTotalPrice:getTotalPrice,
		setOrder:setOrder,
		getOrderData:getOrderData,
		updOrderList:updOrderList,
		getOrderList:getOrderList,
		updOrderState:updOrderState
	}
})