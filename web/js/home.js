(function(document,window){
    var doc = document;
    function Home(){
        // 初始化界面
        this.init();
        // 计算用户的经纬度
        this.position();
        // 根据经纬度描绘出地图
        // this.showMap();
        // 头部事件委托
        this.handleHeaderClick();
        // menu事件委托
        this.handleMenuClick();
        // section事件委托
        this.handleSectionClick();
        // circleMenu事件委托
        this.handleCircleMenuClick();
        // footer事件委托
        this.handleFooterClick();
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
            navigator.geolocation.getCurrentPosition(function(position){
                console.log('成功');
                console.log('用户十进制纬度: '+position.coords.latitude);
                console.log('用户十进制经度: '+position.coords.longitude);
                var lati = position.coords.latitude;
                var longi = position.coords.longitude;
                Home.prototype.translateCoordinate(lati,longi);
                // Home.prototype.indoorMap(lati,longi);
            },function(err){
                console.log('Error code :'+err.code);
                console.log('Erroe message: '+err.message)
            })
        },
        translateCoordinate: function(lanti,longi){
            var x = lanti,
                y = longi;
            var ggPoint = new BMap.Point(x,y);
            //地图初始化
            var bm = new BMap.Map("map");
            bm.centerAndZoom(ggPoint, 15);
            // 添加控件
            bm.addControl(new BMap.NavigationControl());
        
            //添加gps marker和label
            var markergg = new BMap.Marker(ggPoint);
            bm.addOverlay(markergg); //添加GPS marker
            var labelgg = new BMap.Label("未转换的GPS坐标（错误）",{offset:new BMap.Size(20,-10)});
            markergg.setLabel(labelgg); //添加GPS label
        
            //坐标转换完之后的回调函数
            translateCallback = function (data){
                if(data.status === 0) {
                var marker = new BMap.Marker(data.points[0]);
                bm.addOverlay(marker);
                var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
                marker.setLabel(label); //添加百度label
                bm.setCenter(data.points[0]);
                }
            }
        
            setTimeout(function(){
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(ggPoint);
                convertor.translate(pointArr, 1, 5, translateCallback)
            },1000);
        },
        indoorMap: function(lati,longi){
            // 百度地图API功能
            var map = new BMap.Map("map"); // 创建Map实例
            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
            var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
            map.addControl(top_left_control);
            map.addControl(top_left_navigation);
            map.centerAndZoom(new BMap.Point(lati,longi), 19);  // 初始化地图,设置中心点坐标和地图级别
            map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            // 创建室内图实例
            var indoorManager = new BMapLib.IndoorManager(map);
        },
        showMap: function(lantitude,longitude){
            // 创建地图实例  
            var map = new BMap.Map("map");
            // 创建点坐标  
            var point = new BMap.Point(lantitude, longitude);
            // 初始化地图，设置中心点坐标和地图级别  
            map.centerAndZoom(point, 15);
        },
        handleHeaderClick: function() {
            var oHeader = doc.querySelector('header'),
                oMenu = doc.getElementById('menu'),
                oCircleMenu = doc.getElementById('circle-menu');
            oHeader.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.id){
                    case 'head-photo':
                        oMenu.style.transform = "scale(1)";
                        break;
                    case 'add':
                        oMenu.style.transform = "scale(1)";
                        break;
                    default:
                        oMenu.style.transform = "scale(0)";
                        break;
                }
            }
        },
        handleMenuClick: function() {
            var oMenu = doc.getElementById('menu');
            oMenu.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                switch(target.className) {
                    case 'iconfont icon-guanbi':
                        console.log('关闭');
                        oMenu.style.transform = "scale(0)";
                        break;
                }
            }
        },
        handleSectionClick: function(){
            var oSection = doc.querySelector('section'),
                oCircleMenu = doc.getElementById('circle-menu');
            oSection.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                switch(target.className){
                    case 'signIn':
                        oCircleMenu.style.transform = 'scale(1)';
                        break;
                }
            }
        },
        handleCircleMenuClick: function() {
            var oCircleMenu = doc.getElementById('circle-menu');
            oCircleMenu.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className){
                    case 'iconfont icon-guanbi':
                        oCircleMenu.style.transform = 'scale(0)';
                        break;
                }
            }
        },
        handleFooterClick: function(){
            var oFooter = doc.querySelector('footer');
            oFooter.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                switch(target.className) {
                    case 'signIn':
                        break;
                }
            }
        }
    };
    var home = new Home();
})(document,window);
