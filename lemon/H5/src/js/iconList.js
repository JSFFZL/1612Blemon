require.config({
	paths: {
		"mui": "libs/mui.min"
	}
})
require(["mui"], function(mui) {
	mui.ajax('/api/getIcon', {
		data: {

		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(res) {

			var target = [];
			var num = Math.ceil(res.data.length / 10);
			console.log(num);

			for (var i = 0; i < num; i++) {
				target.push(res.data.splice(0, 10));
			}
			var str = '';
			target.forEach(function(item) {
				str += `<div class="mui-slider-item">
							<ul>`;
				item.map(function(v) {
					return str += `<li><span class="${v.icon}"></span></li>`
				}).join('');
				str += `</ul>
					</div>`
			})

			document.querySelector(".mui-slider-group").innerHTML = str;

		}
	});
})
