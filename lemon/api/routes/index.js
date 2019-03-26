var express = require('express');
var router = express.Router();
// var Mongo = require('Mongodb-curd');


var userBill = require('./bill/bill');
var userClass = require('./class/class');
var userLogin = require('./login/login');


//用户登录
router.post('/api/getlogin',userLogin.getLogin);

// //查询账单
router.post('/api/getBill',userBill.findBill);


//删除账单
router.post('/api/deleteBill',userBill.deleteBill);


//获取当前的用户分类
router.post('/api/getClass',userClass.getClass);


//添加账单
router.post('/api/insertBill',userBill.insertBill);









module.exports = router;
