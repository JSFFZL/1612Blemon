require.config({
	paths: {
		"mui": "libs/mui.min",
		"dtPicker": "libs/mui.picker.min",
		"poppicker": "libs/mui.poppicker",
		"echar": "libs/echarts.min"
	},
	shim: {
		"dtPicker": {
			deps: ["mui"]
		},
		"poppicker": {
			deps: ["mui"]
		}
	}
})

require(["mui", "dtPicker", "poppicker", "echar"], function(mui, dtPicker, poppicker, echarts) {
	/* 全局变量 */

	//获取当前缓存的用户ID
	let localUid = localStorage.getItem("uid");
	//分页变量
	let page = 1;
	let pageSize = 5;
	//空数组
	let newData = [];
	//时间组件
	let dtPickerTimer;
	//选择器组件
	let popPicker;

	let time = new Date();
	let year = time.getFullYear(); //年
	let month = time.getMonth() + 1; //月
	let getTimer = year + "-" + (month < 10 ? "0" + month : month); //月份小于10补0
	//当前的年或者月
	let curYm = '';

	let getYear = document.querySelector('.timer').innerHTML;
	let expense = 0; //花费总金额
	let getIncome = 0; //收入总金额
	let dataNum = [];

	/*dataNum= [{
			value: 335,
			name: '旅游'
		},
		{
			value: 310,
			name: '邮件营销'
		},
		{
			value: 234,
			name: '联盟广告'
		},
		{
			value: 135,
			name: '视频广告'
		},
		{
			value: 1548,
			name: '搜索引擎'
		}
	]*/



	// 判断用户是否为登录状态（验证本地localStorage是否存在）
	if (!localUid) {
		/*方式一：(跳转页面)
		window.location.href = "../html/login.html";
		*/
		/*
		方式二：元素显示隐藏
		*/
		document.querySelector(".login").classList.remove("hide"); //显示
		document.querySelector(".home").classList.add("hide"); //隐藏
		//执行登录方法
		login();
		// return //终止函数执行
	} else {
		document.querySelector(".home").classList.remove("hide"); //显示
		document.querySelector(".login").classList.add("hide"); //隐藏
		/*
		如果本地有用户ID,则通过ID去查找账单
		*/
		//获取账单方法
		getBillFun();
	}

	/*
	方法初始化
	*/
	function init() {

		windowTimer();
		dtPickerFun();
		yearFun();
		addBill();
		tab(); //图表切换
		echar();

		//初始化日期组件
		dtPickerTimer = new mui.DtPicker({
			type: "month" //视图：年-月
		});
		//初始化选择组件
		popPicker = new mui.PopPicker();
		//给选择组件赋值（年月）
		popPicker.setData([{
				value: 'year',
				text: '年'
			},
			{
				value: 'month',
				text: '月'
			}
		]);

	}


	/*选择查询的时间*/
	function dtPickerFun() {
		document.querySelector('.timer').addEventListener('tap', function() {
			console.log(this);
			let _this = this;
			dtPickerTimer.show(function(selectItems) {
				console.log(this);

				//取到当前点击的年/月值
				console.log(selectItems.y); //{text: "2016",value: 2016} 
				console.log(selectItems.m); //{text: "05",value: "05"} 

				if (curYm == "year") {
					_this.innerHTML = selectItems.y.value; //赋值年
					getBillFun(_this.innerHTML);
				} else {
					_this.innerHTML = selectItems.y.value + "-" + selectItems.m.value; //赋值年+月
					getBillFun(_this.innerHTML);
				}
			})
		})

	}

	/*选择当前的年月*/
	function yearFun() {
		document.querySelector(".yearTimer").addEventListener('tap', function() {

			//dom 元素
			let pickerY = document.querySelector("[data-id='picker-y']");
			let pickerM = document.querySelector("[data-id='picker-m']"); //title-m
			//dom 标题
			let titleY = document.querySelector("[data-id='title-y']");
			let titlerM = document.querySelector("[data-id='title-m']");

			let _this = this;
			popPicker.show(function(e) {
				// console.log(e[0].value);
				_this.innerHTML = e[0].text;

				//判断年月，显示不同的视图
				if (e[0].value == 'year') {
					//月的视图
					pickerM.style.display = "none";
					titlerM.style.display = "none";

					pickerY.style.width = "100%";
					titleY.style.width = "100%";

					//选择年，赋值给时间当前的年份
					document.querySelector('.timer').innerHTML = year;

					curYm = "year";

					getBillFun(getYear);
				} else {
					pickerM.style.display = "inline-block"; //inline-block
					titlerM.style.display = "inline-block"; //inline-block
					// titlerY.style.display = "inline-block"; //inline-block

					//年的视图
					titleY.style.width = "50%";
					pickerY.style.width = "50%";
					//月的视图
					pickerM.style.width = "50%";
					titlerM.style.width = "50%";

					windowTimer();
					curYm = "month"
				}

			})
		})
	}

	/*获取系统当前时间*/
	function windowTimer() {
		document.querySelector(".timer").innerHTML = year + "-" + (month < 10 ? "0" + month : month); //月份小于10补0
	}

	//用户登录业务
	function login() {
		document.querySelector(".ok").addEventListener('tap', function() {
			let name = document.querySelector(".name").value;
			let pwd = document.querySelector(".pwd").value;

			if (name && pwd) {
				mui.ajax('/api/getlogin', {
					data: {
						name: name,
						pwd: pwd
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: function(res) {
						if (res.code == 0) {
							mui.alert(res.msg, function(e) {}, 'div')
						} else {
							localStorage.setItem("uid", res.data);
							document.querySelector(".home").classList.remove("hide");
							document.querySelector(".login").classList.add("hide");
							//获取账单
							getBillFun();
						}

					}
				});
			} else {
				mui.alert('用户名或密码不能空！', function() {})
			}
		})
	}

	//根据当前登录的用户查询账单
	function getBillFun(timer) {
		// /api/getBill
		document.querySelector(".innerBox").style.display = "block"; //lodding 等待效果
		localUid = localStorage.getItem("uid");
		setTimeout(function() {
			mui.ajax('/api/getBill', {
				data: {
					uid: localUid,
					timer:"2019-03"
					// timer: timer || getTimer
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(res) {
					document.querySelector(".innerBox").style.display = "none" //lodding 等待效果
					render(res.data);

					// console.log(res.data);
					var objNum = {}
					var arr = [];
					// dataNum
					
// 					res.data.forEach((item)=>{
// 						// console.log(item);
// 						// console.log(objNum[item]); //
// 						if(objNum[item.style]){ // item 上有style
// 							objNum[item.style].money += item.money; //
// 						}else{
// 							//没有属性style,创建一个style
// 							objNum[item.style] = item;
// 						}
// 					})
// 					// console.log(Object.values(objNum));
// 					console.log(objNum);
// 					
// 					for (let okey in objNum) {
// 						console.log(okey);
// 						dataNum.push(okey(objNum))
// 					}
// 							
// 					console.log(dataNum);
// 					echar(); //图表

				}
			});
		}, 1000)

	}

	//渲染的函数

	function render(data) {
		// console.log(data.length === 0);
		if (data.length === 0) {
			document.querySelector(".no-bill").style.display = "block";
			return
		} else {
			document.querySelector(".no-bill").style.display = "none";
		}

		let str = "";
		data.forEach(function(item) {
			if (item.income == "支出") {
				expense += item.money
			} else {
				getIncome += item.money
			}

			str +=
				`<li class="mui-table-view-cell li">
					<div class="mui-slider-right mui-disabled">
						<a class="mui-btn mui-btn-red">删除</a>
					</div>
					<div class="mui-slider-handle bill-item">
						<dl>
							<dt>
								<span class="${item.icon}"><!-- 图标 --></span>
							</dt>
							<dd>
								<p>${item.style}</p>
								<p>${item.timer}</p>
							</dd>
						</dl>
						<span class="${item.income == '收入' ? 'green' : 'red' }">${item.money}</span>
					</div>
				</li>`
		})
		document.querySelector(".list").innerHTML = str;
		document.querySelector(".money").innerHTML = expense;
		document.querySelector(".income").innerHTML = getIncome;
	}


	//用户退出
	document.querySelector('.exit').onclick = function() {
		localStorage.removeItem('uid');
		// location.href='index.html'
		// location.reload();
		window.history.go(0)
		/*
		window.location.reload()，
		window.history.go(0)
		这三个刷新当前页面的方法是最快速的。
		*/
	}

	//跳转到添加账单页面
	function addBill() {
		document.querySelector('.tils').addEventListener('tap', function() {
			window.location.href = '../html/userClass.html';
		})
	}


	//删除账单
	function delBill() {}

	mui('#OA_task_1').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', 'Hello MUI', ['确认', '取消'], function(e) {
			if (e.index == 0) {
				//确认删除
				li.parentNode.removeChild(li);
				location.reload();

			} else {
				//取消删除
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	});


	//账单图表切换
	function tab() {

		var lis = document.querySelectorAll(".tab ul li");
		mui('.tab').on("tap", "li", function() {
			for (var i = 0; i < lis.length; i++) {
				lis[i].classList.remove('active');
				this.classList.add('active');
				if (this.innerHTML == "账单") {
					document.querySelector(".box").style.display = "block";
					document.querySelector(".each").style.display = "none";
				} else {
					document.querySelector(".box").style.display = "none";
					document.querySelector(".each").style.display = "block";
				}
			}
		})

	}

	function echar() {

		var myChart = echarts.init(document.querySelector("#eachBox"));

		// 指定图表的配置项和数据
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: dataNum
			}]
		};


		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	init()
	
	
	mui.ajax('',{
		data:{
			
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			
		}
	});
	


})




