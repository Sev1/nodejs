const http = require('http');//node封装好的api
const fs = require('fs');//文件系统 File System
const querystring = require('querystring');//查询字符串，处理url参数
const urlLib = require('url');//解析url

// 存放数据
var userInfo = {};
//创建一个服务
var server = http.createServer(function(req,res){
	// res.write("我是node服务器返回的内容"); //输出乱码：鎴戞槸node鏈嶅姟鍣ㄨ繑鍥炵殑鍐呭

	// get和post请求
	var str = "";
	req.on("data",function(data){//分段请求数据
		str += data;
	})
	req.on("end",function(){//end表示请求完成
		const obj = urlLib.parse(req.url,true);//true表示将query解析
		const url = obj.pathname;
		const getParam = obj.query; //get请求的参数
		const postParam = querystring.parse(str); //post请求的参数

		// 接口请求
		if(url == '/user'){
			console.log("用户信息:",userInfo)
			switch(getParam.act){
				case "regs":
					if(userInfo[getParam.name]){
						res.write('{"status":false,"msg":"该用户名已存在"}');
					}else{
						userInfo[getParam.name] = getParam.pasd;
						res.write('{"status":true,"msg":"注册成功！"}');
					}
					break;
				case "login":
					if(!userInfo[getParam.name]){
						res.write('{"status":false,"msg":"此户名不存在"}');
					}else if(userInfo[getParam.name] != getParam.pasd){
						res.write('{"status":false,"msg":"用户名或密码不正确"}');
					}else{
						res.write('{"status":true,"msg":"登录成功！"}');
					}
					break;
				default:
					res.write('{"status":false,"msg":"未知请求"}');
			}
			res.end();
		}else{
			// 根据访问地址读取文件
			// www文件夹下存放允许访问的文件
			var file_name = './www' + url;
			fs.readFile(file_name,function(err,data){
				if(err){
					res.write("404");
				}else{
					res.write(data)
				}
				res.end();//注意end()的位置，存在异步问题
			})
		}
		
	})
	// res.end(); //服务结束,没有end浏览器会一直转
})

// 监听服务，端口号
server.listen(8088);
