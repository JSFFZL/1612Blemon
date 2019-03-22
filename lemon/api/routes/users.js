var express = require('express');
var router = express.Router();
var Mongo = require('Mongodb-curd');

var db = "1612Blemon";
var coll_user = "user";//用户表
/* GET users listing. */
router.post('/api/getBill', function(req, res, next) {
  let uid = req.body.uid;
  Mongo.find(db,coll_user,function(result){
    if(!result){
      res.json({code:0,msg:"查询失败"})
    }else{
      res.json({code:1,data:result})
    }
  })
});

module.exports = router;
