var Product = require('../models/product');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');

//查全部
router.route('/product').get(function(req, res) {
	Product.find(function(err, product) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(product[0]) {
			res.json({code:"10000",message: 'get product success',data:product});
		}else {
			res.json({code:"10002",message: 'product not found'});
		}
	});
});

//新增
router.route('/product').post(function(req, res) {
	var imgDir = './public/img/product/';
	var form = new multiparty.Form({
		uploadDir: imgDir
	});
	//此处应该是先验证字段成功后再保存图片 但是用form.parse就马上会保存图片 待解决
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		var mainImg;
		/*if(!files.mainImg) {
			res.send("mainImg require");
			return;
		}else {
			mainImg = files.mainImg[0];
		}
		if (err) {
			res.send('parse error: ' + err);
			return;
		} */
		console.log(fields.name);
		var product = new Product({
			name:fields.name,
			title:fields.title,
			measure:fields.measure,
			mainImg:'img/product/'+mainImg.originalFilename,
			type:fields.type,
			salePrice:parseInt(fields.salePrice, 10),
			retailPrice:parseInt(fields.retailPrice, 10),
			sold:parseInt(fields.sold, 10),
			stock:parseInt(fields.stock, 10),
			detailText:fields.detailText
		});
		product.save(function(err) {
			if (err) {
				return showErrMsg(err.errors,res);
			}
			fs.rename(mainImg.path,imgDir+mainImg.originalFilename,function(err) {
				if(err) {console.log(err)}//重命名为原文件名
			});
			res.json({code:"10000",message: 'add product success',data:product});
		});
	});	

});

//更新指定ID
router.route('/product/:id').put(function(req, res) {
	var imgDir = './public/img/product/';
	var form = new multiparty.Form({
		uploadDir: imgDir
	});
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		if(files.mainImg) {
			var mainImg = files.mainImg[0];
			var mainImgName = mainImg.originalFilename;
			fields.mainImg = mainImgName;

			fs.rename(mainImg.path,imgDir+mainImgName,function(err) {
				if(err) {console.log(err)}//重命名为原文件名
			});
		}
		if (err) {
			console.log('parse error: ' + err);
		}
		Product.findOne({_id: req.params.id}, function(err, product) {
			if (err) {
				return res.send(err);
			}
			if(fields.mainImg) {
				fs.unlink(imgDir+product.mainImg);
			}			
			for (prop in fields) {
				product[prop] = fields[prop];
			}
			console.log(fields);
			product.save(function(err) {
				if (err) {
					return res.send(err);
				}
				res.json({code:"10000",message: 'update product success',data:product});
			});
		});	
	});
});

//查指定ID
router.route('/product/:id').get(function(req, res) {
	Product.findOne({
		_id: req.params.id
	}, function(err, product) {
		if (err) {
			return res.send(err);
		}
		res.json({code:"10000",message:'get product success',data:product});
	});
});

//删除指定ID
router.route('/product/:id').delete(function(req, res) {
	Product.remove({
		_id: req.params.id
	}, function(err, product) {
		if (err) {
			return res.send(err);
		}
		res.json({code:"10001",message: 'product delete success'});
	});
});

function showErrMsg(errs,res) {
	var PropertyList='';
	for(i in errs) {
		PropertyList=PropertyList+errs[i].message+'\r';
	}
	res.json({code:"10001", message: PropertyList});
}

module.exports = router;
