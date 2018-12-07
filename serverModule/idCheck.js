// 身份验证
function idCheck(client,faceBase64,idCard,name){
    var image = faceBase64;

    var imageType = "BASE64";

    var idCardNumber = idCard;

    var name = name;

    // 调用身份验证
    client.personVerify(image, imageType, idCardNumber, name).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });

    // 如果有可选参数
    var options = {};
    options["quality_control"] = "NORMAL";
    options["liveness_control"] = "LOW";

    // 带参数调用身份验证
    client.personVerify(image, imageType, idCardNumber, name, options).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });;
}
module.exports = idCheck;