function searchUserInfo(client){
    var userId = "user1";

    var groupId = "group1";
    
    // 调用用户信息查询
    client.getUser(userId, groupId).then(function(result) {
        // console.log(JSON.stringify(result));
        console.log('人脸用户信息查询');
        console.log(result.result.user_list);
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}
module.exports = searchUserInfo;