(function(){
    var oForm = document.getElementsByTagName('form')[0],
        oFaceInput = document.getElementsByName('face')[0],
        oSub = document.getElementsByName('submit')[0];
    oForm.onsubmit = function(e){
        e.preventDefault();
    }
    oSub.onclick = function(){
        if(oFaceInput){
            console.log(oFaceInput.files[0]);
            var img = oFaceInput.files[0];
            imgToBase64(img);
        }
    };
    function imgToBase64(file){
        var reader = new FileReader();
        // 上传图片的最大值2M
        var allowImgFileSize = 2100000;
        var imgUrlBase64;
        if(file){
            // 将文件以Data URL的形式读入页面
            imgUrlBase64 = reader.readAsDataURL(file);
            reader.onload = function(e){
                if(reader.result.length!=0&&allowImgFileSize<reader.result.length){
                    alert('上传失败，请上传不大于2M的图片');
                    return;
                }else {
                    console.log(reader.result);
                    let sendData = reader.result.split(',')[1];
                    // reader.result.substring(reader.result.indexOf(",") + 1);
                    // 执行上传操作
                    sendImgBase64(sendData);
                }
            }
        }
    }
    function sendImg(img){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    let data = xhr.responseText;
                    console.log(data);
                }
            }
        }
        xhr.open('post','/face/detection',true);
        var data = new FormData();
        data.append('faceImg',img);
        xhr.send(data);
    }
    function sendImgBase64(img){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                    let data = xhr.responseText;
                    console.log(data);
                }
            }
        }
        xhr.open('post','/face/detection',true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(img);
    }
})();