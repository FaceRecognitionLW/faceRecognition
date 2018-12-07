const express = require('express');
const server = express();
const expressStatic = require('express-static');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const multer = require('multer');
const objMulter = multer();
// 人脸交互功能模块
const FACEDETECT = require('./serverModule/detect.js');
const FACESEARCH = require('./serverModule/search.js');
const FACEREGIST = require('./serverModule/regist.js');
const FACEUPDATE = require('./serverModule/update.js');
const FACESEARCHUSERINFO = require('./serverModule/searchUserInfo.js');
const FACESEARCHUSERFACEINFO = require('./serverModule/searchUserFaceInfo.js');
const GETGROUPUSERS = require('./serverModule/getGroupUsers.js');
// 关于client
const AipFaceClient = require("baidu-aip-sdk").face;

// 设置APPID/AK/SK
const APP_ID = "14870513";
const API_KEY = "7FBjTenAnLTg5kATSpQO2cXj";
const SECRET_KEY = "kfHxZLR5BtvV67jtwTMjrG2OsnYujDUK";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);

const HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    // console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});

// 接收任意文件(由于bodyParser无法处理multipart/form-data类型的数据，所以用multer接收)
server.use(objMulter.any());

server.post(bodyParser.urlencoded({extended: true}));
// 用户接口路由
const userRouter = express.Router();
userRouter.post('/login',function(req,res){
    res.end('login');
})
userRouter.post('/regist',function(req,res){
    res.end('end');
})
server.use('/user',userRouter);
// 人脸识别功能接口路由
const faceRoute = express.Router();
faceRoute.post('/detection',function(req,res){
    let base64Img="";
    req.on('data',function(data){
        base64Img+=data;
    })
    req.on('end',function(){
        // 人脸检测
        // FACEDETECT(client,base64Img);
        // 人脸更新
        // FACEUPDATE(client,base64Img);
        // 人脸用户信息查询
        FACESEARCHUSERINFO(client);
        // 人脸信息查询
        FACESEARCHUSERFACEINFO(client,"user1","group1");
        // 获取某个组的所有用户
        GETGROUPUSERS(client,"group1");
        // 人脸注册
        // FACEREGIST(client,base64Img);        
    })
    res.end('detection');
})
server.use("/face",faceRoute);
server.listen(5000);
server.use(expressStatic('./web'));