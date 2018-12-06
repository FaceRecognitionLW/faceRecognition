const express = require('express');
const expressStatic = require('express-static');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const multer = require('multer');
const objMulter = multer();

const server = express();
const FACEDETECT = require('./serverModule/detect.js');

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
        // 进行人脸检测
        FACEDETECT(base64Img);
    })
    res.end('detection');
})
server.use("/face",faceRoute);
server.listen(5000);
server.use(expressStatic('./web'));