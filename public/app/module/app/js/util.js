define(['proxy','require'],function(proxy,require) {

	var $ = Dom7;

	function checkQtyField(e,tcb,fcb) {
		var val = parseInt($(e).val());
		(val > 0 && val < 9999) ? tcb(val) : fcb(val);
	}

	function checkUserSign(data,icb,ucb,ecb) {
		if(data.username && data.password && data.realname && data.phoneNumber) {
			icb(data);
		}else if(data.username && data.password && !data.realname && !data.phoneNumber){
			ucb(data);
		}else {
			ecb(data);
		}
	}

	function checkResCode(code,tcb,fcb) {
		code = parseInt(code);
		code == 10000 ? tcb() : fcb(code);
	}

	function getFieldData(e,cb) {
		var fields = $(e);
		var s = "{";
		for(var i = 0; i < fields.length; i++) {
			var d = '"'+fields[i].name+'"'+":"+'"'+fields[i].value+'"'+","
			s += d;
		}
		s = s.substring(0,s.length-1);
		s += "}"
		s = JSON.parse(s);
		if(cb) cb(s);
	}

	function copys(obj) {
        var newO = {};  
        if (obj instanceof Array) {  
            newO = [];  
        }  
        for (var key in obj) {  
            var val = obj[key];  
            newO[key] = typeof val === 'object' ? arguments.callee(val) : val;  
        }  
        return newO;  
	}

	function setText(e,str) {
		$(e).text(str);
	}

	function getText(e) {
		return $(e).text();
	}
	
	return {
		checkQtyField:checkQtyField,
		checkUserSign:checkUserSign,
		checkResCode:checkResCode,
		getFieldData:getFieldData,
		setText:setText,
		getText:getText,
		copys:copys
	}
})