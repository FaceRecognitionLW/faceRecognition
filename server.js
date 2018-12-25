const express = require('express');
const server = express();
const expressStatic = require('express-static');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const fs =require('fs');
const mysql = require('mysql');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const objMulter = multer();
// 连接数据库
const CONN = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kkxxdgmyt67LIUQIONG',
    database: 'facesignin'
});
// 使用cookie
server.use(cookieParser());
/*人脸交互功能模块*/ 
// 创建组
const CREATEGROUP = require('./serverModule/createGroup.js');
// 删除组
const DELETEGROUP = require('./serverModule/deleteGroup.js');
// 人脸检测
const FACEDETECT = require('./serverModule/detect.js');
// 人脸搜索
const FACESEARCH = require('./serverModule/search.js');
// 人脸注册
const FACEREGIST = require('./serverModule/regist.js');
// 人脸更新
const FACEUPDATE = require('./serverModule/update.js');
// 根据人脸查询用户信息
const FACESEARCHUSERINFO = require('./serverModule/searchUserInfo.js');
// 获取用户人脸列表
const FACESEARCHUSERFACEINFO = require('./serverModule/searchUserFaceInfo.js');
// 获取组用户
const GETGROUPUSERS = require('./serverModule/getGroupUsers.js');
// 删除人脸
const DELETEFACE = require('./serverModule/deleteFace.js');
// 复制用户
const COPYUSER = require('./serverModule/copyUser.js');
// 删除用户
const DELETEUSER = require('./serverModule/deleteUser.js');
// 组列表查询
const GETGROUPLIST = require('./serverModule/getAllGroupList.js');
// 身份验证
const IDCHECK = require('./serverModule/idCheck.js');
// onlineVivoDetection活体检测
const ONLINEVIVODETECT = require('./serverModule/onlineVivoDetection.js');
// 人脸比对
const MATCHFACE = require('./serverModule/matchFace.js');

/*功能模块*/ 
// 创建用户id
const CREATEUSERID = require('./serverFunction/createUserId.js');
// 数据库操作模块
const HANDLESQL = require('./serverFunction/handleSql.js');
// 创建用户上传头像文件名
const CREATEHEADIMG = require('./serverFunction/createHeadImg.js');
// 时间格式化
const FORMAT = require('./serverFunction/format.js');

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
// 
server.post(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json({limit: '2100000kb'}));
// 1.用户接口路由
const userRouter = express.Router();
// 活体检测
userRouter.post('/onlineVivoDetection',function(req,res){
    let chunk = '';
    // 响应状体： success/fail
    let resStatus="",
    // 响应信息提示
        resMsg ="";
    req.on('data',function(data){
        chunk+=data;
    });
    req.on('end',function(){
        const faceImg = chunk;
        ONLINEVIVODETECT(client,faceImg,function(faceRes){
            console.log(JSON.stringify(faceRes));
            console.log(faceRes["error_code"]);
            if(faceRes["error_code"]==0){
                let face_liveness = faceRes.result.face_liveness,
                    faceQuality = faceRes.result.face_list[0].quality.occlusion;
                //人脸活体指数
                console.log(face_liveness);
                // 人脸遮挡信息
                console.log(faceQuality);
                // 非活体
                if(face_liveness<1){
                    resStatus = "fail";
                    resMsg = '请将脸部对准摄像头';
                }else {
                    // 活体无遮挡
                    if(faceQuality["left_eye"]>0){
                        resStatus = "fail";
                        resMsg = '请勿遮挡左眼';
                    }
                    if(faceQuality["right_eye"]>0){
                        resStatus = "fail";
                        resMsg = '请勿遮挡右眼';
                    }
                    if(faceQuality["node"]>0){
                        resStatus = "fail";
                        resMsg = '请勿遮挡鼻子';
                    }
                    if(faceQuality["mouth"]>0.6){
                        resStatus = "fail";
                        resMsg = '请勿遮挡嘴巴';
                    }
                    if(faceQuality["left_cheek"]>0.3){
                        resStatus = "fail";
                        resMsg =  '请勿遮挡左脸';
                    }
                    if(faceQuality["right_cheek"]>0.3){
                        resStatus = "fail";
                        resMsg =  '请勿遮挡右脸';
                    }
                    if(faceQuality["chin_contour"]>0.8){
                        resStatus = "fail";
                        resMsg =  '请勿遮挡下巴';
                    }
                    // 活体无遮挡
                    else {
                        resStatus = "success";
                        resMsg =  '人脸检测成功';
                    }
                }
            }else {
                resMsg = '未识别到人脸';
            }
            res.send({
                'status': resStatus,
                'msg': resMsg
            });
            res.end();
        });
    })
    // res.end('活体检测');
    // res.send({
    //     status: 'success',
    //     // res: ''
    // })
});
userRouter.post('/login',function(req,res){
    console.log('login');
    let faceImg = req.body.faceImg;
    // 执行人脸搜索
    FACESEARCH(client,faceImg,{
        success: function(data){
            console.log('人脸搜索成功');
            console.log(data);
            console.log(data.result);
            let userId = data.result.user_list[0].user_id;
            console.log('用户id:'+ userId);
            // 搜索成功， 存在该用户
            if(data.error_code== 0 ){
                // 使用cookie保存用户信息
                res.cookie('user',userId);
                res.send({
                    status: 'success',
                    msg: '登录成功'
                });
            }else {
                // 搜索失败，不存在该用户
                res.send({
                    status: 'fail',
                    msg: data.error_msg
                });
            }
        },
        fail: function(err){    
            console.log('人脸搜索失败');
            console.log(err);
            res.send({
                status: 'fail',
                msg: '没有匹配到人脸，请先注册'
            });
        }
    })
});
userRouter.post('/regist',function(req,res){
    console.log('regist');
    let REQINFO = '';
    let resStatus = '';
    let resMsg = '';
    console.log('req.body');
    // console.log(req.body.tel);
    REQINFO = req.body;
    // 人脸注册
    new Promise((resolve,reject) => {
        // 先判断人脸库中是否存在该人脸
        FACESEARCH(client,REQINFO.faceImg,{
            success: function(data) {
                if(data.error_msg=="SUCCESS"){
                    console.log('该人脸已经注册过'); 
                    res.send({
                        status: 'fail',
                        msg: '您已经注册过，请直接登录'
                    });
                }else {
                    resolve();
                }
            },
            fail: function(err) {
                res.send({
                    status: 'fail',
                    msg: '网络出现问题，请稍候重试'
                });
            }
        })
    })
    .then(data => {
        console.log('没有注册过');
        let groupdId,userId;
        groupId = 'group1';
        userId = CREATEUSERID();
        console.log(userId);
        // 保存userId信息
        let insertFaceSql = 'INSERT INTO user(userId,groupId) values("'+userId+'","'+groupId+'");';
        HANDLESQL(CONN,insertFaceSql,function(data,err){
            if(err){
                console.log('数据库人脸信息入驻失败:'+err.sqlMessage);
            }else {
                console.log('数据库人脸信息入驻成功');
                console.log(data);
            }
        });
        return {
            userId: userId,
            groupId: groupId
        };
    })
    .then(data => {
        // 注册人脸
        FACEREGIST(client,REQINFO.faceImg,data.groupId,data.userId);
        res.cookie('user',data.userId);
    })
    .then(data => {
        res.send({
            status: 'success',
            msg: '注册成功'
        });
    })
    .catch(err => {
        console.log('人脸注册失败'+err);
    });
});
userRouter.post('/completeInfo',function(req,res){  
    // req.body用来获取非文件数据
    let headImg = req.body.headImg.split(',')[1];
    let name = req.body.name;
    let headImgSuffix = req.body.headImg.split(',')[0].split(';')[0].split(':')[1].split('/')[1];
    let dataBuffer = new Buffer(headImg,'base64');
    let fileSuffix = headImgSuffix=="png"?".png":".jpg";
    let USERID = req.cookies["user"];
    console.log(USERID);
    console.log(name);
    new Promise((resolve,reject) => {
        fs.writeFile('./web/images/user/'+CREATEHEADIMG()+fileSuffix,dataBuffer,function(err){
            if(err){
                res.send({
                    status: 'fail',
                    msg: '上传头像出现错误'
                });
            }else {
                console.log('头像存储成功');
                let fileName = "images/user/"+CREATEHEADIMG()+fileSuffix;
                resolve(fileName);
            }
        });
    })
    .then(data => {
        console.log(data);
        let completeInfoSql = 'UPDATE user SET userName="'+name+'",userImg="'+data+'" where userId="'+USERID+'";';
        HANDLESQL(CONN,completeInfoSql,function(data,err){  
            if(err){
                console.log(err.sqlMessage);
                console.log('信息完善失败')
                res.send({
                    status: 'fail',
                    msg: '信息完善失败，请稍候重试'
                });
            }else {
                console.log('信息完善成功');
                res.send({  
                    status: 'success',
                    msg: '信息完善成功'
                });
            }
        })
    })
    .catch(err => {
        res.send({
            status: 'fail',
            msg: '上传信息失败'
        });
    })
});
server.use('/user',userRouter);

// 2.社群接口路由
const comRouter = express.Router();
comRouter.post('/createCom',function(req,res){
    // console.log(req.body);
    let headImg = req.body.headImg.split(',')[1],
        headImgSuffix = req.body.headImg.split(',')[0].split(';')[0].split(':')[1].split('/')[1];
        fileSuffix = headImgSuffix=="png"?".png":".jpg";
        comName = req.body.comName,
        questions = req.body.questions;
        USERID = req.cookies["user"],
        dataBuffer = new Buffer(headImg,'base64');
    console.log(USERID);
    //先把图片放到文件夹中，再同时在community中插入com基本信息，在com_question中插入问题
    new Promise((resolve,reject) => {
        let fileName = 'images/com/'+CREATEHEADIMG()+fileSuffix;
        fs.writeFile('./web/'+fileName,dataBuffer,function(err){
            if(err){
                reject(err.sqlMessage);
            }else {
                console.log('社群头像已放入文件夹');
                resolve(fileName);
            }
        })
    })
    .then(data =>{
        // 插入community表格
        let insertComSql = 'INSERT into community(createUserId,comName,comImg) values("'+USERID+'","'+comName+'","'+data+'");';
        HANDLESQL(CONN,insertComSql,function(data,err){
            if(err){
                console.log('插入community失败');
            }else {
                console.log('插入community成功');
                console.log(data);
                console.log(data.insertId);
                // 将问题插入con_question表格
                let insertItem = '';
                for(var i=0,len=questions.length;i<len;i++){
                    insertItem+='('+data.insertId+','+'"'+questions[i]+'"),';
                }
                insertItem = insertItem.substr(0,insertItem.length-1);
                console.log(insertItem);
                let insertComQue = 'INSERT INTO com_question(comId,question) values'+insertItem;
                HANDLESQL(CONN,insertComQue,function(data,err){
                    if(err){
                        console.log('插入com_question失败');
                        res.send({
                            status: 'fail',
                            msg: '创建社群失败'
                        });
                    }else {
                        console.log('插入com_question成功');
                        res.send({
                            status: 'success',
                            msg: '创建社群成功'
                        });
                    }
                })
            }
        });
    })
    .catch(err => {
        res.send({
            status: 'fail',
            msg: '创建社群失败'
        });
    })
});
comRouter.get('/:id',function(req,res){
    let reqId = req.params.id;
    let USERID = req.cookies["user"];
    console.log(USERID);
    switch(reqId) {
        // 拉取该用户创建的所有社群
        case 'getCreatedCom':
            console.log('getCreatedCom');
            let getCreatedComSql = 'SELECT community.comId,community.comName,community.comAllman,community.comPublishTimes,comCreateTime,comImg,user.userName FROM community,user where createUserId="'+USERID+'" and community.createUserId=user.userId';
            HANDLESQL(CONN,getCreatedComSql,function(data,err){
                if(err){
                    console.log(err.sqlMessage);
                    res.send({
                        status: 'fail',
                        msg: '社群信息拉取失败'
                    });
                }else {
                    console.log('社群信息拉取成功');
                    console.log(data);
                    res.send({
                        status: 'success',
                        data: data
                    });
                }
            });
            break;
        // 删除某个社群
        case 'delCreatedCom':
            
            break;
        // 获取社群信息
        case 'getComs':
            let getComsSql = 'SELECT comId,comName FROM community where createUserId="'+USERID+'";';
            HANDLESQL(CONN,getComsSql,function(data,err){
                if(err){
                    console.log('社群查询失败');
                    res.send({
                        status: 'fail',
                        msg: '社群查询失败'
                    });
                }else {
                    console.log('社群查询成功');
                    res.send({
                        status: 'success',
                        data: data
                    });
                }
            });
            break;
        case 'getComInName':
            console.log('getComInName');
            console.log(req.query);
            let comName = req.query.comName;
            console.log(comName);
            let getComInNameSql = 'SELECT community.*,user.userName FROM community,user where comName like "%'+comName+'%" and community.createUserId=user.userId;';
            HANDLESQL(CONN,getComInNameSql,function(data,err){
                if(err){
                    console.log('查找社群失败');
                    res.send({
                        status: 'fail',
                        msg: '查询失败'
                    });
                }else {
                    console.log(data);
                    for(var i=0,len=data.length;i<len;i++){
                        data[i].comCreateTime=moment(data[i].comCreateTime).format('YYYY-MM-DD HH:mm:ss');
                    }
                    res.send({
                        status: 'success',
                        data: data
                    });
                }
            });
            break;
        // 获取进入社群的问题
        case 'getQueToCom':
            console.log('getQueToCom');
            console.log(req.query);
            let getQueToComSql = 'SELECT questionId,question FROM com_question where comId="'+req.query.comId+'";';
            HANDLESQL(CONN,getQueToComSql,function(data,err){
                if(err){
                    console.log('进群问题查询失败');
                    res.send({
                        status: 'fail',
                        msg: '进群问题查询失败'
                    });
                }else {
                    console.log(data);
                    res.send({
                        status: 'success',
                        data: data
                    });
                }
            })
            break;
    }
    
})
// 发布签到
comRouter.post('/publishSign',function(req,res){
    console.log(req.body);
    let reqInfo = {
        comId: req.body.comId,
        managerId: req.cookies["user"],
        addr: req.body.addr,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        range: req.body.range,
        startTime: moment(req.body.startTime).format("'YYYY-MM-DD HH:mm:ss'"),
        endTime: moment(req.body.endTime).format("'YYYY-MM-DD HH:mm:ss'")
    };
    let insertPublishSignSql = 'INSERT INTO publish(comId,managerId,signAddr,latitude,longitude,signRange,startTime,endTime) values("'+reqInfo.comId+'","'+reqInfo.managerId+'","'+reqInfo.addr+'","'+reqInfo.latitude+'","'+reqInfo.longitude+'","'+reqInfo.range+'","'+reqInfo.startTime+'","'+reqInfo.endTime+'");';
    HANDLESQL(CONN,insertPublishSignSql,function(data,err){
        if(err){
            console.log('插入publish失败');
            res.send({
                status: 'fail',
                msg: '发布签到信息失败'
            });
        }else {
            console.log('插入publish成功');
            res.send({
                status: 'success',
                msg: '发布签到信息成功'
            });
        }
    });
})
// 回答问题申请进入社群
comRouter.post('/reqToIntoCom',function(req,res){
    let USERID = req.cookies["user"];
    console.log(req.body);
    let REQINFO = req.body;
    // 将问题存进数据库com_answer
    let insertValues = '';
    for(let key in REQINFO) {
        insertValues+='('+parseInt(key)+',"'+REQINFO[key]+'","'+USERID+'"),';
    }
    insertValues = insertValues.substr(0,insertValues.length-1);
    let reqToIntoComSql = 'INSERT INTO com_answer(questionId,answer,userId) values'+insertValues;
    console.log(reqToIntoComSql);
    HANDLESQL(CONN,reqToIntoComSql,function(data,err){
        if(err){
            console.log('问题插入失败');
            res.send({
                status: 'fail',
                msg: '申请失败'
            });
        }else {
            console.log('问题插入成功');
            res.send({
                status: 'success',
                msg: '请等待审核'
            });
        }
    })
})
server.use('/community',comRouter);


// 人脸识别功能接口路由
const faceRoute = express.Router();
faceRoute.post('/detection',function(req,res){
    let base64Img="";
    req.on('data',function(data){
        base64Img+=data;
    })
    req.on('end',function(){
        // 活体检测
        ONLINEVIVODETECT(client,base64Img);
        // 人脸检测
        // FACEDETECT(client,base64Img);
        // 人脸注册
        // FACEREGIST(client,base64Img);  
        // 人脸更新
        // FACEUPDATE(client,base64Img);
        // 人脸用户信息查询
        // FACESEARCHUSERINFO(client);
        // 人脸信息查询
        // FACESEARCHUSERFACEINFO(client,"user1","group1");
        // 获取某个组的所有用户
        // GETGROUPUSERS(client,"group1");
        // 创建组
        // CREATEGROUP(client,'group2');
        // 人脸复制到另外一个组
        // COPYUSER(client,"user1","group1","group2");
        // 删除用户
        // DELETEUSER(client,'group2','user1');
        // 删除组
        // DELETEGROUP(client,'group2');
        // 组列表查询
        // GETGROUPLIST(client);
        // 身份验证
        // let idCard = "530324199802230329";
        // let name = '刘琼';
        // IDCHECK(client,base64Img,idCard,name);
        // 删除某个人脸
        // DELETEFACE(client);
    })
    res.end('detection');
})
server.use("/face",faceRoute);
server.listen(5000);
server.use(expressStatic('./web'));