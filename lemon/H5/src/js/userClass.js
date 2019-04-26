require.config({
	paths: {
		"mui": "libs/mui.min",
		"dtPicker": "libs/mui.picker.min",
		"poppicker": "libs/mui.poppicker"
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

require(["mui", "dtPicker", "poppicker"], function(mui, dtPicker, poppicker) {


	/*全局变量*/
	//获取当前缓存的用户ID
	let localUid = localStorage.getItem("uid");
	//系统当前的时间
	let time = new Date();
	let year = time.getFullYear(); //年
	let month = time.getMonth() + 1; //月
	let day = time.getDate();
	let getTimer = year + "-" + (month < 10 ? "0" + month : month) + "-" + day; //月份小于10补0

	function init() {
		getClass()
		tab()
		nowTimer()
		keyWord()
		addBill();
	}

	/*添加账单业务逻辑
	 */

	function addBill() {

		document.querySelector(".ok").addEventListener("tap", function() {
			let icon = document.querySelector('.elect span').className;
			let style = document.querySelector('.elect dd').innerHTML;
			let income = document.querySelector(".tab-list .active").innerHTML;
			let timer = document.querySelector(".choose-time").innerHTML;
			let money = document.querySelector(".money").innerHTML;
			
			
			console.log(typeof (money * 1) );
			mui.ajax('/api/insertBill', {
				data: {
					uid:localUid,
					icon:icon,
					style:style,
					income:income,
					timer:timer,
					money:money * 1
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(res) {
					mui.alert(res.msg,function () {
						// window.location.href = '../index.html'
					})
				}
			});
		})
	}
	
	

	/*
	金额键盘
	*/

	function keyWord() {
		let money = document.querySelector('.money');
		let btn = document.querySelectorAll(".keywords span");

		mui(".keywords").on("tap", "span", function() {
			if (this.innerHTML == "X") {
				money.innerHTML = money.innerHTML.length == 1 ? "0.00" : money.innerHTML.substr(0, money.innerHTML.length - 1);
			} else if (money.innerHTML == "0.00") {
				money.innerHTML = this.innerHTML
			} else if (money.innerHTML.includes(".") && this.innerHTML == '.') {
				money.innerHTML = money.innerHTML //当前显示=当前显示
			} else if (money.innerHTML.includes(".") && money.innerHTML.split('.')[1].length == 2) {
				money.innerHTML = money.innerHTML //当前显示=当前显示
			} else {
				money.innerHTML += this.innerHTML //赋值拼接
			}

		})



	}

	//收支切换
	function tab() {
		let tabList = document.querySelectorAll(".tab-list .tab-item");

		mui(".tab-list").on("tap", ".tab-item", function() {
			console.log("aa");
			for (let i = 0; i < tabList.length; i++) {
				tabList[i].classList.remove("active");
			}
			this.classList.add("active");
			getClass()
		})


	}

	//获取当前的用户分类
	function getClass() {
		document.querySelector(".innerBox").style.display = "block";//lodding 等待效果
		let style = document.querySelector(".tab-list .active").innerHTML;//获取当前的分类tab值
		mui.ajax('/api/getClass', {
			data: {
				uid: localUid,
				style: style
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(res) {
				document.querySelector(".innerBox").style.display = "none";//lodding 等待效果
				console.log(res)
				render(res.data)

			}
		});
	}

	//渲染的函数
	function render(data) {
		let str = "";
		data.forEach(function(item) {
			str +=
				`<dl>
					<dt>
						<span class="${item.icon}"></span>
					</dt>
					<dd>${item.intro}</dd>
				</dl>`
		})
		document.querySelector(".type-icon").innerHTML = str +
			`<dl>
				<dt>
					<span class="mui-icon mui-icon-plus"></span>
				</dt>
				<dd>自定义</dd>
			</dl>`;
							
		//点击active
		addIcon()				
	}
	/*
		点击高亮
		*/
	function addIcon(){
		let icon = document.querySelectorAll('.type-icon dl');
		mui('.type-icon').on('tap','dl',function(){
			for (var i = 0; i < icon.length; i++) {
				icon[i].classList.remove('elect');
			}
			this.classList.add("elect");
		})   
	}

	//显示当前的系统时间
	function nowTimer() {
		document.querySelector('.choose-time').innerHTML = getTimer;
	}

	init()




})
