require.config({
	paths: {
		"mui": "libs/mui.min"
	}
})

require(["mui"], function(mui) {


	
	/* 全局变量 */
	
	//获取当前缓存的用户ID
	let localUid = localStorage.getItem("uid");

	


	// 是否登录
	if (!localUid) {
		document.querySelector(".login").classList.remove("hide"); //显示
		document.querySelector(".home").classList.add("hide"); //隐藏
		// return //终止函数执行
	} else {
		document.querySelector(".home").classList.remove("hide"); //显示
		document.querySelector(".login").classList.add("hide"); //隐藏
		//获取账单
		getBillFun();
	}
	
	function init() {
		login();
		
	
	}


	//用户登录
	function login() {
		console.log("123");
		document.querySelector(".ok").addEventListener('tap', function() {
			let name = document.querySelector(".name").value;
			let pwd = document.querySelector(".pwd").value;

			mui.ajax('/api/getlogin', {
				data: {
					name: name,
					pwd: pwd,
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(res) {
					localStorage.setItem("uid", res.data);
					document.querySelector(".home").classList.remove("hide");
					document.querySelector(".login").classList.add("hide");
					//获取账单
					getBillFun();
				}
			});
		})
	}

	//根据当前登录的用户查询账单
	function getBillFun() {
		// /api/getBill
		localUid = localStorage.getItem("uid");
		mui.ajax('/api/getBill', {
			data: {
				uid: localUid
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(res) {
				console.log(res)
			}
		});
	}
	
	document.querySelector(".exit").onclick = function(){
		localStorage.removeItem("uid");
	}





	mui('#OA_task_1').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', 'Hello MUI', ['确认', '取消'], function(e) {
			if (e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	});


	init()

})
