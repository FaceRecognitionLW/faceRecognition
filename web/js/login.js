(function(window,document){
    var doc = document;
    function Login(){
        // 获取人脸
        this.getFace();
    }
    Object.defineProperty(Login.prototype,'constructor',{
        enumerable: false,
        value: Login
    })
    Login.prototype = {
        // 人脸识别
        getFace: function() {
            console.log('获取人脸');
            var video = doc.getElementById('video'),
                canvas = doc.getElementById('canvas'),
                oStartBtn = doc.getElementById('clickPhoto'),
                oStipInfo = doc.getElementById('info'),
                oFaceAnimation = doc.getElementById('faceAnimation'),
                context = canvas.getContext('2d'),
                // 是否开始捕获媒体
                streaming = false;
                // 截取的脸部src
                faceSrc = '',
                timer = null;
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            });
            // 定时拍照
            oStartBtn.onclick = function(){
                oFaceAnimation.style.display = 'block';
                video.style.display = 'block';
                timer = setInterval(autoPhoto,1000);
            };
            video.addEventListener('canplay',function(e){
                if(!streaming) {
                    streaming = true;
                }
            });
            // 发送人脸到后台
            function autoPhoto(){
                console.log('拍照啦');
                if(streaming) {
                    context.drawImage(video,-45,0,390,150);
                    faceSrc = canvas.toDataURL('image/png').split(',')[1];
                    Login.prototype.ajaxPost({
                        url: '/user/onlineVivoDetection',
                        data: faceSrc,
                        contentType: 'application/x-www-form-urlencoded',
                        success: function(res){
                            console.log(res);
                            res = JSON.parse(res);
                            if(res.status == 'success'){
                                video.style.display = 'none';
                                oStipInfo.innerHTML = '识别完毕,请点击注册或登录';
                                oStartBtn.innerHTML = '识别成功';
                                oStartBtn.disabled = true;
                                oFaceAnimation.style.display = 'none';                 
                                clearInterval(timer);
                            }else {
                                oStipInfo.innerHTML = res.msg;
                                oStartBtn.innerHTML = '重新识别';
                            }
                        },
                        fail: function(status){
                            console.log('err status: '+status);
                        }
                    })
                }
            }
        },
        // 注册登录
        regist_login: function(){
            oChooseBtn = doc.getElementById('choose');
            oChooseBtn.onclick = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.id) {
                    case 'regist':
                        Login.prototype.ajaxPost({
                            url: '',
                            data: '',
                            contentType: '',
                            success: function(){

                            },
                            fail: function(){
                                
                            }
                        })
                        break;
                    case 'login':
                        break;
                }
            }

        },
        ajaxPost: function(config){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState==4){
                    if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
                        let data = xhr.responseText;
                        config.success&&config.success(data);
                    }else{
                        config.fail&&config.fail(xhr.status);
                    }
                }
            }
            xhr.open('post',config.url,true);
            xhr.setRequestHeader('Content-type',config.contentType);
            xhr.send(config.data);
        }
    };
    var login = new Login();
})(window,document);
/*
ajaxPost使用：
Login.prototype.ajaxPost({
    url: '',
    data: '',
    contentType: '',
    success: function(){},
    fail: function(){}
})
*/ 