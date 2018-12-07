function searchUserFaceInfo(client,userId,groupId){
    
    var userId = userId;

    var groupId = groupId;

    // 调用获取用户人脸列表
    client.faceGetlist(userId, groupId).then(function(result) {
        // console.log(JSON.stringify(result));
        console.log('人脸信息查询');
        console.log(result.result.face_list);
        // console.log(result.face_list);
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}
module.exports = searchUserFaceInfo;