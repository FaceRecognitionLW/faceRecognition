function faceSearch(client,face){
    var image = face;

    var imageType = "BASE64";

    var groupIdList = "3,2";

    // 调用人脸搜索
    client.search(image, imageType, groupIdList).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });

    // 如果有可选参数
    var options = {};
    options["quality_control"] = "NORMAL";
    options["liveness_control"] = "LOW";
    options["user_id"] = "233451";
    options["max_user_num"] = "3";

    // 带参数调用人脸搜索
    client.search(image, imageType, groupIdList, options).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });;
}
module.exports = faceSearch;