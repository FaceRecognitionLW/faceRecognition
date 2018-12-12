(function(document,window){
    var doc = document;
    function Home(){
        this.init();
        this.position();
    }
    Object.defineProperty(Home.prototype,'constructor',{
        enumerable: false,
        value: Home
    });
    Home.prototype = {
        // 初始化
        init: function(){
            var oOpenAnimation = doc.getElementById('stage');
            var timer = setTimeout(function(){  
                oOpenAnimation.style.display = "none";
                clearTimeout(timer);
            },2000)
        },
        position: function(){
            console.log('position');
            navigator.geolocation.getCurrentPosition(function(Position){
                console.log('成功');
                console.log('用户十进制纬度: '+Position.coords.latitude);
                console.log('用户十进制经度: '+Position.coords.longitude)
            },function(err){
                console.log('Error code :'+err.code);
                console.log('Erroe message: '+err.message)
            })
        }
    };
    var home = new Home();
})(document,window);
