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


function faceDetect(base64Img){
    var image = base64Img;

    var imageType = "BASE64";
    
    // 调用人脸检测
    client.detect(image, imageType).then(function(result) {
        // console.log(JSON.stringify(result));
        console.log(result);
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
    
    // 如果有可选参数
    var options = {};
    // options["face_field"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,quality,facetype";
    options["face_field"] = "age";
    options["max_face_num"] = "1";
    options["face_type"] = "LIVE";
    
    // 带参数调用人脸检测
    client.detect(image, imageType, options).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });;
}
module.exports = faceDetect;
