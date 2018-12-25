function faceRegist(client,face,groupId,userId){

    var image = face;

    var imageType = "BASE64";
    
    // var groupId = "group1";
    
    // var userId = "user1";
    
    // 调用人脸注册
    client.addUser(image, imageType, groupId, userId).then(function(result) {
        console.log('百度AI人脸入驻成功');
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log('百度AI人脸入驻失败');
        console.log(err);
    });
    
    // 如果有可选参数
    var options = {};
    options["user_info"] = "user's info";
    options["quality_control"] = "NORMAL";
    options["liveness_control"] = "LOW";
    
    // 带参数调用人脸注册
    // client.addUser(image, imageType, groupId, userId, options).then(function(result) {
    //     console.log('百度AI人脸入驻成功');
    //     console.log(JSON.stringify(result));
    // }).catch(function(err) {
    //     // 如果发生网络错误
    //     console.log('百度AI人脸入驻失败');
    //     console.log(err);
    // });
}
module.exports = faceRegist;