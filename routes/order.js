var Order = require('../models/order');
var express = require('express');
var router = express.Router();

//全部订单
router.route('/order').get(function(req, res) {
	Order.find(function(err, order) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(order[0]) {
			res.json({code:10000,message:"get orders success",data:order});
		}else {
			res.json({code:10002,message:"order not found"});
		}
	});
});

//用户id的全部订单
router.route('/order/user/:id').get(function(req, res) {
	Order.find({user:req.params.id},function(err, order) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(order[0]) {
			res.json({code:10000,message:"get order success",data:order});
		}else {
			res.json({code:10002,message:"order not found"});
		}
	});
});


//指定id的某订单
router.route('/order/:id').get(function(req, res) {
	Order.findOne({
		_id: req.params.id
	}, function(err, order) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000,message:"get order success",data:order});
	});
});

//新增 用户_id 商品_id 数量quantity
router.route('/order').post(function(req, res) {
	//问题一:客户端ajax提交的是data对象时, 只能解释一层,JSON.stringify(req.body)的detail是"[object Object]"字符串
	//解决方案:ajax提交data字符串 然后再parse 应该是body.parse的问题
	//问题二:req.body获取的字符串[]被换成了":{"和":""
	//解决方案:replace配合正则替换
	var string = JSON.stringify(req.body);
	string = string.replace(/\\/g, "");
	string = string.substring(2,string.length-1);
	string = string.replace(/":{"/,"[");
	string = string.replace(/":""/,"]");
	var body = JSON.parse(string);
	var order = new Order(body);
	order.save(function(err) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000,message:"add order success",data:order});
	});
});


//更新指定ID的订单状态
router.route('/order/:id').put(function(req, res) {
	if(req.body.state && !req.body.user && !req.body.detail && !req.body.comment) {
		Order.findOne({ _id: req.params.id }, function(err, order) {
		    if (err) {
		      return res.send(err);
		    }
		    for (prop in req.body) {
		      order[prop] = req.body[prop];
		    }
		    order.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000,message:'order state updated!',data:order});
		    });
		});		
	}else {
		res.json({code:"10003",message:'only update order state'});
	}

});

router.route('/order/:id').post(function(req, res) {
	if(req.body.state && !req.body.user && !req.body.detail && !req.body.comment) {
		Order.findOne({ _id: req.params.id }, function(err, order) {
		    if (err) {
		      return res.send(err);
		    }
		    for (prop in req.body) {
		      order[prop] = req.body[prop];
		    }
		    order.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000, message: 'order state updated!',data:order});
		    });
		});		
	}else {
		res.json({code:"10003",message:'only update order state'});
	}

});

//订单评论  并且订单状态为received才能评论 用户只能提交评论 cms只能提交状态
router.route('/order/:id/comment').post(function(req, res) {
	var content = req.body.content;
	var state = req.body.state;
	var date = req.body.date;
	Order.findOne({
		_id: req.params.id
	}, function(err, order) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		//客户端提交评论
		if(content && !state && !date) {
			if(order.state=="received") {
				order.comment.content = content;
				order.comment.date = Date.now();
				save();	
			}else {
				res.json({code:"10004", message: "your order wasn't confirmed"});
			}
		}//CMS更改评论状态
		else if(state && !content && !date){

			order.comment.state = state;
			save();
		}else {
			res.json({code:"10003", message: "permission denied"});
		}
		function save() {
		    order.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000, message: "add order comment success", data:order});
		    });			
		}
	});
});

// //删除指定ID
// router.route('/order/:id').delete(function(req, res) {
// 	Order.remove({
// 		_id: req.params.id
// 	}, function(err, order) {
// 		if (err) {
// 			return showErrMsg(err.errors,res);
// 		}
// 		res.json({
// 			message: 'Successfully deleted'
// 		});
// 	});
// });

function showErrMsg(errs,res) {
	var PropertyList='';
	for(i in errs) {
		PropertyList=PropertyList+errs[i].message+'\r\n';
	}
	res.json({code:10001, message: PropertyList});
}

module.exports = router;