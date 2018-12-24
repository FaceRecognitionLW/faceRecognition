var COOKIE = {
    get: function(name) {
    var cookieName = encodeURIComponent(name)+'=',
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null;
    if(cookieStart>-1){
        var cookieEnd = document.cookie.indexOf(';',cookieStart);
        if(cookieEnd==-1){
        cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
    }
    return cookieValue;
    },
    // name:名称，value: 值，expires:域，path: 路径，domain:失效时间，secure:安全标志
    set: function(name,value,expires,path,domain,secure){
        var cookieText = encodeURIComponent(name)+'='+encodeURIComponent(value);
    if(expires instanceof Date ){
        cookieText +='; expires = '+ expires.toGMTString();
    }
    if(path) {
        cookieText +='; path = '+ path;
    }
    if(domain) {
        cookieText +='; domain ='+ domain;
    }
    if(secure) {
        cookieText +='; secure =' + secure;
    }
    return document.cookie = cookieText;
    },
    unset: function(name,path,domain,secure){
    this.set(name,'',new Date(0),path,domain,secure);
    }
};

/*
使用：
（1）设置： cookieUtil.set('name','qpq','sdc/sd/efe','www.baidu.com','2018,10,21',true);
(2)读取： cookieUtil.get('name');
(3)删除: cookieUtil.unset('name');
*/
