var gulp = require("gulp");

var webserver = require("gulp-webserver");

gulp.task('webserver',function(){
	return gulp.src("./src/")
	.pipe(webserver({
		open:true,
		port:8086,
		proxies:[
			{source:"/api/getlogin",target:"http://localhost:3000/api/getlogin"},
			{source:"/api/getBill",target:"http://localhost:3000/api/getBill"}
		]
	}))
})

