var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var commentReg = [/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9,\-\s().!:*/]{1,50}$/,"comment:1-50"];

var orderSchema = new Schema({
	user:{ type: Schema.Types.ObjectId, ref: 'User'},
	//把订单详情和评价当成订单的子文档
	detail:[{
		product:{ type: Schema.Types.ObjectId, ref: 'Product'},
		//购买数量不应该大于库存待完善
		quantity:{type: Number,required:true, min:0, max:999999}
	}],
	comment:{
		content:{type:String,match:commentReg,default:""},
		state:{type:String,enum:['未审核','通过','屏蔽'],default:'未审核'},
		date:{type:Date,default: Date.now}
	},
	state:{type:String,enum:['未发货','已发货','已收货','已评价','已申请退款','已退款'],default:'未发货'},
	regDate:{type: Date,default: Date.now},
});

module.exports = mongoose.model('Order', orderSchema);