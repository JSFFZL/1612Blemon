var gulp = require("gulp");

var webserver = require("gulp-webserver");

gulp.task('webserver',function(){
	return gulp.src("./src/")
	.pipe(webserver({
		open:true,//打开默认浏览器开关
		port:8086,//端口号
		// host:"192.168.137.1", //地址
		proxies:[
			//用户登录
			{source:"/api/getlogin",target:"http://localhost:3000/api/getlogin"},
			//获取账单
			{source:"/api/getBill",target:"http://localhost:3000/api/getBill"},
			//获取用户收支分类的小类
			{source:"/api/getClass",target:"http://localhost:3000/api/getClass"},
			//添加账单
			{source:"/api/insertBill",target:"http://localhost:3000/api/insertBill"},
			//删除账单
			{source:"/api/deleteBill",target:"http://localhost:3000/api/deleteBill"},
			//获取所有icon图标
			{source:"/api/getIcon",target:"http://localhost:3000/api/getIcon"},
			
		]
	}))
})

