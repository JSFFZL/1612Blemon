var express = require('express');
var router = express.Router();

var Mongo = require('Mongodb-curd');

var db = "1612Blemon";
var coll_icon = "icon"; //icon图标


//账单后台接口业务逻辑

//查询账单
var findIcon = function(req, res, next) {

	Mongo.find(db, coll_icon, {}, function(result) {
		if (!result) {
			res.json({
				code: 0,
				msg: "查询失败"
			})
		} else {
			res.json({
				code: 1,
				data: result
			})
		}
	})
}




module.exports = {
	findIcon
};
