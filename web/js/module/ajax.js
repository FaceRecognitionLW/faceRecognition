define(function(require,exports,module){
	function ajax(config){
	    var xhr=createXHR();
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState==4){
	            if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
	                var data=xhr.responseText;
	                // 成功
	                config.success&&config.success(data);
	            }else {
	                // 失败
	                config.error&&config.error(xhr.status);
	            }
	        }
	    };
	    // 传送的数据串
	    var sendData;
	    // 存放数据的数组
	    var arr=[];
	    if(config.data!=undefined){
	        for(var key in config.data){
	            arr.push(key+"="+config.data[key]);
	        }
			if(arr.length>1){
				sendData="?"+arr.join("&");
			}else {
				sendData="?"+arr[0];
			}
	    }else {
				sendData = '';
		}

	    if(config.method.toLowerCase()=="get"){
	        xhr.open('get',config.url+sendData,true);
	        // 解决超时问题
	        // xhr.timeout=3000;
	        // xhr.ontimeout = function(){
	        //     alert("超时");
	        // }
	        xhr.send(null);
	    }else if(config.method.toLowerCase()=='post'){
	        xhr.open('post',config.url,true);
	        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			if(sendData.indexOf('?')!=-1){
				sendData = sendData.split('?')[1];
			}
	        xhr.send(sendData);
					// xhr.timeout=4000;
	        // xhr.ontimeout = function(){
	        //     alert("超时");
	        // }
	    }
	    // 拿到ajax的对象
	    function createXHR(){
	        if(typeof XMLHttpRequest!="undefined"){
	            return new XMLHttpRequest();
	        }else if(typeof ActiveXObject!="undefined"){
	            if(typeof arguments.callee.activeXString!="string"){
	                // 兼容到IE7之前的版本
	                var versions=['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
	                for(var i=0,len=versions.length;i<len;i++) {
	                    try{
	                        new ActiveXObject(versions[i]);
	                        arguments.callee.activeXString=versions[i];
	                        break;
	                    }catch(ex){
	                        throw new Error();
	                    }
	                }
	            }
	            // 兼容IE
	            return new ActiveXObject(arguments.callee.activeXString);
	        }else {
	            throw new Error("No XHR object available");
	        }
	    }
	}
	module.exports = ajax;
})
