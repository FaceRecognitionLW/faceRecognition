function faceDelete(client,faceToken){
    var userId = "user1";

    var groupId = "group1";

    var faceToken = "face_token_23123";

    // 调用人脸删除
    client.faceDelete(userId, groupId, faceToken).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}