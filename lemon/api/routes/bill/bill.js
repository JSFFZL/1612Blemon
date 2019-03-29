var express = require('express');
var router = express.Router();

var Mongo = require('Mongodb-curd');

var db = "1612Blemon";
var coll_bill = "bill";//账单表


//账单后台接口业务逻辑

//查询账单
var findBill = function (req, res, next) {
  let uid = req.body.uid;//用户ID
  let timer = new RegExp(req.body.timer);//用户ID
  // let page = req.body.page; //页数
  // let pageSize = req.body.pageSize; //条数

  if (!uid) {
    res.json({ code: 3, msg: "参数为空" })
  } else {
    Mongo.find(db, coll_bill, { "uid": uid,"timer":timer }, function (result) {
      if (!result) {
        res.json({ code: 0, msg: "查询失败" })
      } else {
        res.json({ code: 1, data: result })
      }
    },{
      sort:{
        "_id":-1
      }
    })
  }

};

// , {
//   skip: (page - 1) * pageSize,
//   limit: pageSize
// // }

//删除账单
var deleteBill = function (req, res, next) {
  var id = req.body.id;
  Mongo.remove(db, coll_bill, { "_id": id }, function (result) {
    if (result.deletedCount == 0) {
      res.json({ code: 0, msg: "删除失败" })
    } else {
      res.json({ code: 1, msg: "删除成功" })
    }
  })
}


//添加账单
var insertBill = function (req, res, next) {
  var obj = req.body;
  obj.money = obj.money * 1;
  console.log(obj);
  Mongo.insert(db, coll_bill, obj, function (result) {
    if (!result) {
      res.json({ code: 0, msg: "添加账单失败" })
    } else {
      res.json({ code: 1, msg: "添加账单成功" })
    }
  })
}


module.exports = {
  findBill,
  deleteBill,
  insertBill
};
