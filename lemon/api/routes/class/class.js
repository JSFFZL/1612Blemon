var express = require('express');
var router = express.Router();

var Mongo = require('Mongodb-curd');
var db = "1612Blemon";
var coll_class = "class";//分类表


//分类后台接口业务逻辑

//查询用户分类
var getClass =  function(req, res, next) {
  var uid = req.body.uid;
  var style = req.body.style;
  Mongo.find(db,coll_class,{"uid":uid,"style":style},function(result){
    if(!result){
      res.json({code:0,msg:"添加分类失败"})
    }else{
      res.json({code:1,data:result})
    }
  })
}


module.exports = {
  getClass
};
