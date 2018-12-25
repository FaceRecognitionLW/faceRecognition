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
            // navigator.getUserMedia({
                video: true,
                audio: false
            })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            });
            // 定时拍照
            oStartBtn.onclick = function(){
                oStartBtn.disabled = true;
                oStartBtn.style.backgroundColor = 'rgb(155,202,62)';
                oStartBtn.style.color = '#fff';
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
                                oStipInfo.innerHTML = '识别完毕,请输入手机号，后点击注册或登录';
                                oStartBtn.innerHTML = '识别成功';
                                oFaceAnimation.style.display = 'none';                 
                                clearInterval(timer);
                                Login.prototype.regist_login(faceSrc);
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
        regist_login: function(faceImg){
            var oChooseBtn = doc.getElementById('choose'),
                // oTelInput = doc.querySelector('#tel input'),
                oStipInfo = doc.getElementById('info'),
                oDistingBtn = doc.getElementById('clickPhoto'),
                oStartBtn = doc.getElementById('clickPhoto');
            // var telReg = /(^[0-9]{3,4}\ -[0 -9]{3,8}$)|(^[0 -9]{3,8}$)|(^\([0 -9]{3,4}\)[0 -9]{3,8}$)|(^0{0,1}13[0 -9]{9}$)/;
            oChooseBtn.onclick = function(e){
                // 判断手机号是否不为空，并且合法
                if(oDistingBtn.innerHTML=="识别成功") {
                    e = e||window.e;
                    var target = e.target||e.srcElement;
                    switch(target.id) {
                        case 'regist':
                            Login.prototype.ajaxPost({
                                url: '/user/regist',
                                data: JSON.stringify({
                                    faceImg: faceImg,
                                }),
                                contentType: 'application/json',
                                success: function(res){
                                    console.log(res);
                                    res = JSON.parse(res);
                                    oStipInfo.innerHTML = res.msg;
                                    if(res.status=="success"){
                                        var timer = setTimeout(function(){
                                            clearTimeout(timer);
                                            window.location.href = 'completeInfo.html';
                                        },3000)
                                    }
                                },
                                fail: function(status){
                                    console.log('err:'+status);
                                }
                            });
                            break;
                        case 'login':
                            console.log('login');
                            Login.prototype.ajaxPost({
                                url: '/user/login',
                                data: JSON.stringify({
                                    faceImg: faceImg,
                                }),
                                contentType: 'application/json',
                                success: function(res) {
                                    res = JSON.parse(res);
                                    if(res.status=="success"){
                                        oStipInfo.innerHTML = '登录成功';
                                        window.location.href = 'home.html';
                                    }else {
                                        oStipInfo.innerHTML = '未匹配到人脸，请重试';
                                        oStartBtn.disabled = false;
                                    }
                                },
                                fail: function(status) {
                                    console.log('err:'+status);
                                }
                            });
                            break;
                    }
                }else {
                    oTelInput.style.borderColor = '#f00';
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