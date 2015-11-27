//使用expess
var express = require('express');

var path = require('path');
//使用bodyParser,用于解析客户端请求的body中的内容,使用JSON编码处理,url编码处理以及对于文件的上传处理
var bodyParser = require('body-parser');

//使用日志
var logger = require('morgan');

//引入mongoose 方便操作mongodb
var mongoose = require('mongoose');

//引用路由
var product = require('./routes/product');
var user = require('./routes/user');
var order = require('./routes/order');

//创建express应用
var app = express(); 

//连接mongodb
var connectionString = 'mongodb://localhost:27017/jdsm';
mongoose.connect(connectionString);

var http = require("http");
var url = require("url");
var crypto = require("crypto");

function sha1(str){
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

function validateToken(req,res){
  var query = url.parse(req.url,true).query;
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray.sort();
  var original = oriArray.join('');
  var scyptoString = sha1(original);
  if(signature == scyptoString){
    res.end(echostr);
    console.log("Confirm and send echo back");
  }else {
    res.end("false");
    console.log("Failed!");
  }
}

var webSvr = http.createServer(validateToken);
webSvr.listen(8000,function(){
  console.log("Start validate");
});

//使用日志
app.use(logger('dev'));

//使用bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//bodyParser后才添加路由
app.use('/', product, user, order);

//第一次请求返回静态页面,之后通过json交换数据
app.use(express.static(path.join(__dirname, 'public')));

//错误url请求处理
// app.use(function(req, res, next) {
//   res.json({err_code:"404",msg:"bad url request"});
// });

app.post('/wx',function(req,res) {
	validateToken(req,res);
})

module.exports = app;