var express = require('express');
var router = express.Router();
var Mongo = require('Mongodb-curd');

var db = "1612Blemon";
var coll_user = "user";//用户表
var coll_bill = "bill";//账单表
var coll_class = "class";//账单表
var coll_icon = "icon";//图标表






//查询账单
router.post('/api/getBill', function(req, res, next) {
  let uid = req.body.uid;
  Mongo.find(db,coll_bill,{"uid":uid},function(result){
    if(!result){
      res.json({code:0,msg:"查询失败"})
    }else{
      res.json({code:1,data:result})
    }
  })
});


//删除账单
router.post('/api/deleteBill', function(req, res, next) {
  var id = req.body.id;
  Mongo.remove(db,coll_bill,{"_id":id},function(result){
    if(!result){
      res.json({code:0,msg:"删除失败"})
    }else{
      res.json({code:1,msg:"删除成功"})
    }
  })
});

//获取当前的用户类别
router.post('/api/getClass', function(req, res, next) {
  var uid = req.body.uid;
  var style = req.body.style;
  Mongo.find(db,coll_class,{"uid":uid,"style":style},function(result){
    if(!result){
      res.json({code:0,msg:"添加账单失败"})
    }else{
      res.json({code:1,data:result})
    }
  })
});


//添加账单
router.post('/api/insertBill', function(req, res, next) {
  var obj = req.body;
  Mongo.insert(db,coll_bill,obj,function(result){
    if(!result){
      res.json({code:0,msg:"添加账单失败"})
    }else{
      res.json({code:1,msg:"添加账单成功"})
    }
  })
});









module.exports = router;
