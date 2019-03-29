var express = require('express');
var router = express.Router();

var Mongo = require('Mongodb-curd');
var db = "1612Blemon";
var user = "user";//分类表


//分类后台接口业务逻辑

//查询用户分类
var getLogin = function (req, res, next) {
  var name = req.body.name;
  var pwd = req.body.pwd;
  
  if (!name && !pwd) {
    res.json({ code: 3, msg: "参数为空！" });
  } else {
    Mongo.find(db, user, { "name": name, "pwd": pwd }, function (result) {
      console.log(result.length)
      if (result.length > 0) {
        res.json({ code: 1, data: result[0]._id }) //返回给前端ID
      } else {
        res.json({ code: 0, msg: "用户名或密码错误！" })
      }
    })
  }

}

module.exports = {
  getLogin
};
