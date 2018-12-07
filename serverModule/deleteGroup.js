function deleteGroup(client,groupId){
    var groupId = groupId;

    // 调用删除用户组
    client.groupDelete(groupId).then(function(result) {
        console.log('删除用户组')
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}
module.exports = deleteGroup;