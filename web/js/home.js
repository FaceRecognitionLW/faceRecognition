(function(document,window){
    var doc = document;
    function Home(){
        this.init();
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
                console.log(1);
                oOpenAnimation.style.display = "none";
                clearTimeout(timer);
            },2000)
        }
    };
    var home = new Home();
})(document,window);
