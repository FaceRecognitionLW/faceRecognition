function createGroup(client,groupId){
    // 调用创建用户组
    client.groupAdd(groupId).then(function(result) {
        console.log('创建用户组');
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });
}
module.exports = createGroup;