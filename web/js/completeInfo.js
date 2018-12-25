(function(window,document){
    var doc = document;
    function CompleteInfo() {
        // 上传信息
        this.uploadInfo();
    }
    Object.defineProperty(CompleteInfo.prototype,'constructor',{
        enumerable: false,
        value: CompleteInfo
    });
    CompleteInfo.prototype = {
        uploadInfo: function(){
            var oForm = doc.querySelector('form'),
                oUpHeadBox = doc.getElementById('upHead'),
                oFileInput = doc.querySelector('input[type="file"]'),
                oUpHeadImg = doc.querySelector('#upHead img'),
                oNameInput = doc.getElementsByName('name')[0],
                oSubBtn = doc.getElementById('submit'),
                oInfo = doc.getElementById('info');
            var HEADIMG = "";
            oFileInput.onchange = function() {
                if(this.value) {
                    var file = this.files[0];
                    // 将文件转为base64
                    imgToBase64(file)
                    // 将图片放到框里
                    readFile(file);
                }
            };
            // 将图片放入upheadBox内
            function readFile(file) {   
                var obj = new FileReader(file);
                obj.readAsDataURL(file);
                obj.onload = function(){
                    oUpHeadImg.src = this.result;
                    oUpHeadBox.style.overflow = 'hidden';
                }
            }
            // 点击上传
            oForm.onsubmit = function(e){
                e = e||window.e;
                e.preventDefault();
            };
            function imgToBase64(file){
                var reader = new FileReader();
                // 允许上传的最大值2M
                var allowImgFileSize = 2100000;
                var imgUrlBase64;
                if(file){
                    // 将文件以Data URL的形式读入页面
                    imgUrlBase64 = reader.readAsDataURL(file);
                    reader.onload = function(){
                        if(reader.result.length!=0&&allowImgFileSize<reader.result.length){
                            alert('上传失败，请上传不大于2M的图片');
                            return;
                        }else {
                            HEADIMG = reader.result;
                            console.log(reader.result.split(',')[0]);
                        }
                    }
                }
            }
            // 提交信息
            oSubBtn.onclick = function(){
                if(oNameInput.value!==""){
                    console.log('提交啦');
                    ajax({
                        url: '/user/completeInfo',
                        method: 'post',
                        contentType: 'application/json',
                        data: {
                            headImg: HEADIMG,
                            name: oNameInput.value
                        },
                        success: function(res) {
                            res = JSON.parse(res);
                            console.log(res);
                            if(res.status=='success'){
                                oInfo.style.height = '3rem';
                                window.location.href = 'home.html';
                            }else {
                                oInfo.innerHTML = res.msg;
                                oInfo.style.background = 'none';
                            }
                        },
                        fail: function(err){    
                            console.log('err: '+err);
                        }
                    })
                }
            };
        }
    };
    var completeInfo = new CompleteInfo();
})(window,document);