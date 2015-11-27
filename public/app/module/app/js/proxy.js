define(['util'],function(util) {
	var $ = Dom7;

	function updProdList(cb) {
	    $.getJSON('/product', function (prodList) {
	        Template7.data.prodList = prodList
			if(cb) cb(prodList);
	    });		
	}

	function getProdList(count) {
		var prodList = util.copys(Template7.data.prodList)
		var prodList = count?prodList.splice(0,count):prodList;
		return {prodList:prodList};
	}

	function setProdToCart(cartProd,cb) {
		var cartList = getCartList().cartList;
		if(!cartList) cartList = [];
	    var prodList = getProdList().prodList;
		var cartItem = {product:"",quantity:0};
        for(var p in prodList) {
            if(cartProd.productId==prodList[p]._id) {
            	cartItem.product = prodList[p];
            	cartItem.quantity = cartProd.quantity;
 				cartList.push(cartItem);
            }

        }
		Template7.data.cartList = cartList;
		if(cb) cb();
	}

	function setProdToOrderSubList(item,cb) {
		var orderSubList = [];
	    var prodList = getProdList().prodList;
		var orderItem = {Prod:"",quantity:0};
        for(var p in prodList) {
            if(item.ProdId==prodList[p]._id) {
            	orderItem.Prod = prodList[p];
            	orderItem.quantity = item.quantity;
 				orderSubList.push(orderItem);
            }
        }
		Template7.data.orderSubList = orderSubList;
		if(cb) cb();
	}

	function setCartToOrderSubList(cb) {
		var orderSubList = getCartList().cartList;
		Template7.data.orderSubList = orderSubList;
		if(cb) cb();
	}

	function getOrderSubList() {
		var orderSubList = Template7.data.orderSubList
		// if(orderSubList) {
		// 	orderSubList = JSON.parse(orderSubList);
		// }
		return {orderSubList:orderSubList};
	}

	function getCartList() {
		var cartList = Template7.data.cartList
		return {cartList:cartList};
	}

	function setOrder(order,cb) {
		var orderList = getOrderList().orderList;
		if(!orderList) orderList = [];
	    $.post('/order',order , function (res) {
	    	res = JSON.parse(res);
	    	orderList.push(res.order);
	    	//localStorage.setItem("orderList",JSON.stringify(orderList));
	    	Template7.data.orderList = orderList;
	    	if(cb) cb(res);
	    });	
	}

	function updOrderList(id,cb) {
	    $.getJSON('/order/'+id, function (order) {
	        Template7.data.orderList = json
			//localStorage.setItem("orderList",JSON.stringify(json));
			if(cb) cb(order);
	    });		
	}

	function getOrderList() {
		var orderList = {};
		orderList.list = Template7.data.orderList;
		return {orderList:orderList};		
	}

	function getTotalPrice() {
		var orderSubList = getOrderSubList().orderSubList;
		var totalPrice = 0;
		for(var e in orderSubList) {
			totalPrice += (parseInt(orderSubList[e].quantity)*orderSubList[e].Prod.retailPrice)
		}
		return totalPrice;
	}

	function userSignIn(data,cb) {
	    $.post('/user/login',{username:data.username,password:data.password},function (res) {
	    	res = JSON.parse(res);
			if(cb) cb(res);
	    });			
	}

	function userSignUp(data,cb) {
	    $.post('/user',data,function (res) {
	    	res = JSON.parse(res);
	    	if(cb) cb(res);
	    });		 	
	}

	function setUserInfo(user) {
		if(user) {
			Template7.data.userInfo = user;
			//localStorage.setItem("userInfo",JSON.stringify(user));
		}	
	}

	function getUserInfo() {
		var userInfo = Template7.data.userInfo;
		if(userInfo) {
			userInfo = JSON.parse(userInfo);
		}
		return userInfo;		
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
		updOrderList:updOrderList,
		getOrderList:getOrderList
	}
})