function searchUserFaceInfo(client,userId,groupId,callback){
    // 调用获取用户人脸列表
    client.faceGetlist(userId, groupId).then(function(result) {
        console.log('人脸信息查询');
        let faceToken = result.result.face_list[0].face_token;
        console.log("faceToken:"+faceToken);
        callback&&callback(faceToken);
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}

function faceDelete(client){
    var userId = "user1";

    var groupId = "group1";
    // 搜索人脸
    searchUserFaceInfo(client,"user1","group1",function(faceToken){
        // 调用人脸删除
        client.faceDelete(userId, groupId, faceToken).then(function(result) {
            console.log('删除人脸');
            console.log(JSON.stringify(result));
        }).catch(function(err) {
            // 如果发生网络错误
            console.log(err);
        });
    })
}
module.exports = faceDelete;