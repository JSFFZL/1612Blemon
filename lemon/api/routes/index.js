var express = require('express');
var router = express.Router();
var Mongo = require('Mongodb-curd');

var db = "1612Blemon";
var coll_user = "user";//
var coll_bill = "bill";
var coll_icon = "icon";//


/* GET home page. */

//查询账单
router.post('/api/getBill', function(req, res, next) {
  var uid = req.body.uid;
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
