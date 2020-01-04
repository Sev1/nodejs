/************使用express框架->依赖中间件************/
// 安装：cnpm install express

// 创建服务：
var server = require("express");//express是对原生进行一层封装
// 引入中间件
var bodyParser = require("body-parser");
var expStatic = require("express-static");

// 请求处理：server.use("请求地址",function(req,res){//处理方法}) -> 可以通用处理post和get
server.get("请求地址",function(req,res){
	//处理方法
	req.query['user']//直接访问携带的参数
})

// post请求可以用中间件bodyParser来处理参数， 然后就可以通过req.body来访问携带的参数
server.use(bodyParser.urlencoded({}));
server.post("请求地址",function(req,res){//处理方法})


// 处理静态文件 -> express-static（中间件），类似原生的fs
server.use(expStatic("./读取路径"))

//链式操作
server.use("/",function(req,res,next){
	console.log("1");
	res.send("123"); //相当于原生的res.write();但是write只能传buffer或者字符串；而send可以传json
	next();//可选，是否执行下一步
})

server.use("/",function(req,res,next){
	console.log("2");
	res.end();//原生中的方法同样可用
})

//监听：
server.listen(8089);