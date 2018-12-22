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
        // 获取人脸
        getFace: function() {
            console.log('获取人脸');
            var video = doc.getElementById('video'),
                canvas = doc.getElementById('canvas'),
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
            timer = setTimeout(autoPhoto,2000);
            video.addEventListener('canplay',function(e){
                if(!streaming) {
                    streaming = true;
                }
            });
            function autoPhoto(){
                console.log('拍照啦');
                if(streaming) {
                    context.drawImage(video,-45,0,390,150);
                    video.style.display = 'none';
                    faceSrc = canvas.toDataURL('image/png');
                    clearTimeout(timer);
                }
            }
        },
        login: function() {

        },
        regist: function() {

        }
    };
    var login = new Login();
})(window,document);