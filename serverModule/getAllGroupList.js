function getAllGroupList(client){
    // 调用组列表查询
    client.getGrouplist().then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });

    // 如果有可选参数
    var options = {};
    options["start"] = "0";
    options["length"] = "50";

    // 带参数调用组列表查询
    client.getGrouplist(options).then(function(result) {
        console.log(JSON.stringify(result));
    }).catch(function(err) {
        // 如果发生网络错误
        console.log(err);
    });;
}
module.exports = getAllGroupList;