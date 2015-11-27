var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var errString = "Path `{PATH}` ({VALUE}) can only be Character(-/*().!:),Number,Chinese or English character,length ";

var nameReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9]{2,10}$/,"3-8 username"];
var passwdReg = [/^[a-zA-Z0-9]{6,10}$/,"6-10 password"];

//手机号验证待完善
var phoneNumberReg = [/^[0-9]{11}$/,"11 phoneNumber"];
var addressReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9,\-\s().!:*]{3,30}$/,"Path `{PATH}` ({VALUE}) can only be length 3-30"];
var userSchema = new Schema({
	username:{type:String,match:nameReg,required:true,trim:true},
	realname:{type:String,match:nameReg,required:false,trim:true},
	password:{type:String,match:passwdReg,required:true,trim:true},
	phoneNumber:{type: String, match:phoneNumberReg,required:true},
	address:{type:[String],match:addressReg,required:false,trim:true},
	regDate:{type: Date,default: Date.now},
});

module.exports = mongoose.model('User', userSchema);