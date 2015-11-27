var User = require('../models/user');
var express = require('express');
var router = express.Router();

//查全部
router.route('/user').get(function(req, res) {
	User.find(function(err, user) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(user[0]) {
			res.json(user);
		}else {
			res.send("not found user");
		}
	});
});

//登录 需要用户名 密码 不太符合restful
router.route('/user/login').post(function(req, res) {
	if(req.body.username && req.body.password) {
		User.find({username:req.body.username,password:req.body.password},function(err, user) {
			if (err) {
				return showErrMsg(err.errors,res);
			}
			if(user[0]) {
				return res.json({code:"10000",user:user[0]});

			}else {
				return res.json({code:"10002",message:"not found user reason: wrong username , password or user does't exist"});
			}
		});		
	}else {
		return res.json({code:"10001",message:"please input username and password"});
	}
});

//注册
router.route('/user').post(function(req, res) {
	var user = new User(req.body);
	user.save(function(err) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:"10000" ,message: 'user added',user:user[0]});
	});
});

//更新指定ID
router.route('/user/:id').put(function(req, res) {
	User.findOne({ _id: req.params.id }, function(err, user) {
	    if (err) {
	      return res.send(err);
	    }
	    for (prop in req.body) {
	      user[prop] = req.body[prop];
	    }
	    user.save(function(err) {
			if (err) {
				return showErrMsg(err.errors,res);
			}
			res.json({code:"10000",message: 'user updated' });
	    });
	});
});

//查指定ID
router.route('/user/:id').get(function(req, res) {
	User.findOne({
		_id: req.params.id
	}, function(err, user) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json(user);
	});
});

// //删除指定ID
// router.route('/user/:id').delete(function(req, res) {
// 	User.remove({
// 		_id: req.params.id
// 	}, function(err, user) {
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
	res.send(PropertyList);
}

module.exports = router;