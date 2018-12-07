function deleteUser(client,groupId,userId){
    var groupId = groupId;

    var userId = userId;

    // 调用删除用户
    client.deleteUser(groupId, userId).then(function(result) {
        console.log('删除用户');
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}
module.exports = deleteUser;