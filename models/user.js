var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var errString = "Path `{PATH}` ({VALUE}) can only be Character(-/*().!:),Number,Chinese or English character,length ";

var usernameReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9,\-\s().!:*]{2,10}$/,errString+"2-10"];
var realnameReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]{2,10}$/,"2-10 username can only be Number,Chinese or English character"];
var passwdReg = [/^[a-zA-Z0-9]{6,10}$/,"6-10 password"];

//手机号验证待完善
var phoneNumberReg = [/^[0-9]{11}$/,"11 phoneNumber"];
var addressReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9,\-\s().!:*]{3,30}$/,"Path `{PATH}` ({VALUE}) can only be length 3-30"];
var userSchema = new Schema({
	username:{type:String,match:usernameReg,required:true,trim:true},
	realname:{type:String,match:realnameReg,trim:true},
	password:{type:String,match:passwdReg,required:true,trim:true},
	phoneNumber:{type: String, match:phoneNumberReg,required:true},
	address:{type:String,match:addressReg,trim:true},
	regDate:{type: Date,default: Date.now},
});

module.exports = mongoose.model('User', userSchema);