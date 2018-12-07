function faceDetect(client,face){
    var image = face;

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
