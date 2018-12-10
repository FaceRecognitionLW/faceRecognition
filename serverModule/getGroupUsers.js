function getGroupUsers(client,groupId){
    // 调用获取用户列表
    client.getGroupUsers(groupId).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });

    // 如果有可选参数
    var options = {};
    options["start"] = "0";
    options["length"] = "50";

    // 带参数调用获取用户列表
    client.getGroupUsers(groupId, options).then(function(result) {
        console.log('获取'+groupId+'组的所有用户信息');
        console.log(result);
        // console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });;
}
module.exports = getGroupUsers;