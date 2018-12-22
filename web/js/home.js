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
        // 快捷发布签到信息
        this.handlePublishSignQuick();
        // 创建社群
        this.handleCreateCom();
        // section事件委托
        this.handleSectionClick();
        // circleMenu事件委托
        this.handleCircleMenuClick();
        // footer事件委托
        this.handleFooterClick();
        // admin-com事件委托
        this.handleAdminCom();
        // 控制社群详情事件委托
        this.handleComDetail();
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
                // oOpenAnimation.style.display = "none";
                // 如果用户没有登录则跳转到登陆界面，否则直接打开主界面
                window.location.href = 'login.html';
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
        // header事件委托
        handleHeaderClick: function() {
            var oHeader = doc.querySelector('header'),
                oMenu = doc.getElementById('menu'),
                oCircleMenu = doc.getElementById('circle-menu'),
                oSearchInput = doc.querySelector('#search input'),
                oSearchResult = doc.getElementById('search-com');
            oHeader.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.id){
                    // 更改头像信息
                    case 'head-photo':
                        window.location.href = "completeInfo.html";
                        break;
                    case 'add':
                        oMenu.style.transform = "scale(1)";
                        break;
                    default:
                        oMenu.style.transform = "scale(0)";
                        break;
                }
            };
            oSearchInput.onchange = function(){
                oSearchResult.style.transform = 'scale(1)';
            };
        },
        // header部分menu事件委托
        handleMenuClick: function() {
            var oMenu = doc.getElementById('menu')
                // 快捷发布签到信息
                oPublishSignQuick= doc.getElementById('publish-sign-quick'),
                // 创建社群
                oCreateCom = doc.getElementById('create-com'),
                // 签到历史
                oSignInHistory = doc.getElementById('sign-in-history'),
                // 发布历史
                oPublishHistory = doc.getElementById('publish-history'),
                // 管理社群
                oAdminCom = doc.getElementById('admin-com'),
                // 社群详情
                oComDetail = doc.getElementById('com-detail'),
                // 搜索界面
                oSearchCom = doc.getElementById('search-com');
                oHeaderMenuLis = doc.querySelectorAll('#menu li i'),
                oFooterLis = doc.querySelectorAll('footer li');
            console.log(oPublishHistory);
            oMenu.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                if(target.nodeName=='I'){
                    switch(target.className) {
                        // 发布签到
                        case 'iconfont icon-dingwei':
                            oCreateCom.style.transform = 'scale(0)';
                            oSignInHistory.style.transform = 'scale(0)';
                            oPublishHistory.style.transform = 'scale(0)';
                            oAdminCom.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oSearchCom.style.transform = 'scale(0)';
                            // 重点
                            oPublishSignQuick.style.transform = 'scale(1)';
                            this.style.transform = 'scale(0)';
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            // target.classList.add("menuHighLight");
                            break;
                        // 创建社群信息
                        case 'iconfont icon-tianjia':
                            oSignInHistory.style.transform = 'scale(0)';
                            oPublishHistory.style.transform = 'scale(0)';
                            oAdminCom.style.transform = 'scale(0)';
                            oPublishSignQuick.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oSearchCom.style.transform = 'scale(0)';
                            // 重点
                            oCreateCom.style.transform = 'scale(1)';
                            this.style.transform = 'scale(0)';
                            // target.classList.add("menuHighLight");
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            break;
                        // 签到历史
                        case 'iconfont icon-get':
                            oPublishHistory.style.transform = 'scale(0)';
                            oAdminCom.style.transform = 'scale(0)';
                            oPublishSignQuick.style.transform = 'scale(0)';
                            oCreateCom.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oSearchCom.style.transform = 'scale(0)';
                            // 重点
                            oSignInHistory.style.transform = 'scale(1)';
                            this.style.transform = 'scale(0)';
                            // target.classList.add("menuHighLight");
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            checkFooterMenuStyle(doc.querySelector('footer .sign-in-history'),oFooterLis);
                            break;
                        // 发布历史
                        case 'iconfont icon-fabusekuai':
                            oAdminCom.style.transform = 'scale(0)';
                            oPublishSignQuick.style.transform = 'scale(0)';
                            oCreateCom.style.transform = 'scale(0)';
                            oSignInHistory.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oSearchCom.style.transform = 'scale(0)';
                            // 重点
                            oPublishHistory.style.transform = 'scale(1)';
                            this.style.transform = 'scale(0)';
                            // target.classList.add("menuHighLight");
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            checkFooterMenuStyle(doc.querySelector('footer .publish-history'),oFooterLis);
                            break;
                        // 管理社群
                        case 'iconfont icon-zuzhiqunzu':
                            oPublishSignQuick.style.transform = 'scale(0)';
                            oCreateCom.style.transform = 'scale(0)';
                            oSignInHistory.style.transform = 'scale(0)';
                            oPublishHistory.style.transform = 'scale(0)';
                            oComDetail.style.transform = 'scale(0)';
                            oSearchCom.style.transform = 'scale(0)';
                            // 重点
                            oAdminCom.style.transform = 'scale(1)';
                            this.style.transform = 'scale(0)';
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            checkFooterMenuStyle(doc.querySelector('footer .menage'),oFooterLis);
                            break;
                        case 'iconfont icon-guanbi':
                            console.log('关闭');
                            oMenu.style.transform = "scale(0)";
                            checkHeaderMenuStyle(target,oHeaderMenuLis);
                            break;
                    }
                }
            }
            function checkFooterMenuStyle(aim,oLis){
                // var oLis = doc.querySelectorAll('footer li');
                for(var i=0,len=oLis.length;i<len;i++){
                    oLis[i].style.color = 'rgb(246,247,247)';
                }
                aim.style.color = 'rgb(55,54,56)';
            }
            function checkHeaderMenuStyle(aim,oLis){
                for(var i=0,len=oLis.length;i<len;i++){
                    oLis[i].classList.remove("menuHighLight");
                }
                aim.classList.add("menuHighLight");
            }
        },
        // 快捷发布签到部分事件委托
        handlePublishSignQuick: function(){
            var oPublishBox = doc.getElementById('publish-sign-quick'),
                oRangeInput = doc.querySelector('#publish-sign-quick input[type="range"]'),
                oRangeShow = doc.querySelector('#publish-sign-quick .range-show');
            oPublishBox.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className) {
                    // 关闭
                    case 'iconfont icon-guanbi close':
                    case 'reset':
                        this.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        break;
                }
            };
            oRangeInput.onchange = function(){
                oRangeShow.innerHTML = this.value;
            }
        },
        //  创建社群
        handleCreateCom: function(){
            var oCreateComBox = doc.getElementById('create-com');
            oCreateComBox.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className) {
                    case 'reset':
                        this.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        break;
                }
            }
        },
        // 主页section部分事件委托
        handleSectionClick: function(){
            var oSection = doc.querySelector('section'),
                oCircleMenu = doc.getElementById('circle-menu');
            oSection.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                if(target.className == "signIn") {
                    oCircleMenu.style.transform = 'scale(1)';
                }
            }
        },
        // 圆形菜单事件委托
        handleCircleMenuClick: function() {
            var oCircleMenu = doc.getElementById('circle-menu'),
                oComDetail = doc.getElementById('com-detail');
            oCircleMenu.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className){
                    // 关闭
                    case 'iconfont icon-guanbi':
                        oCircleMenu.style.transform = 'scale(0)';
                        target.classList.add('menuHighLight');
                        break;
                    // 签到
                    case 'iconfont icon-ditu-qi':
                        target.classList.add('menuHighLight');
                        break;
                    // 进入社群
                    case 'iconfont icon-fanshe':
                        oComDetail.style.transform = "scale(1)";
                        target.classList.add('menuHighLight');
                        this.style.transform = "scale(0)";
                        break;
                    // 删除
                    case 'iconfont icon-shanchu':
                        target.classList.add('menuHighLight');
                        break;
                }
            };
            oCircleMenu.ontouchend = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                if(target.nodeName=="I"){
                    target.classList.remove('menuHighLight');
                }
            };
        },
        // footer事件委托
        handleFooterClick: function(){
            var oFooter = doc.querySelector('footer'),
                // 签到历史
                oSignInHistory = doc.getElementById('sign-in-history'),
                // 发布历史
                oPublishHistory = doc.getElementById('publish-history'),
                // 管理社群
                oAdminCom = doc.getElementById('admin-com'),
                // 社群详情
                oComDetail = doc.getElementById('com-detail'),
                // 搜索界面
                oSearchCom = doc.getElementById('search-com');
            oFooter.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                switch(target.className) {
                    // 签到
                    case 'iconfont icon-ditu-tuding':
                        checkMenuStyle(target.parentNode);
                        oSignInHistory.style.transform = 'scale(0)';
                        oPublishHistory.style.transform = 'scale(0)';
                        oAdminCom.style.transform = 'scale(0)';
                        oComDetail.style.transform = 'scale(0)';
                        oSearchCom.style.transform = 'scale(0)';
                        break;
                    // 签到历史
                    case 'iconfont icon-get':
                        oPublishHistory.style.transform = 'scale(0)';
                        oAdminCom.style.transform = 'scale(0)';
                        oComDetail.style.transform = 'scale(0)';
                        oSearchCom.style.transform = 'scale(0)';
                        oSignInHistory.style.transform = 'scale(1)';
                        checkMenuStyle(target.parentNode);
                        break;
                    // 发布历史
                    case 'iconfont icon-icon_fabu':
                        oSignInHistory.style.transform = 'scale(0)';
                        oAdminCom.style.transform = 'scale(0)';
                        oComDetail.style.transform = 'scale(0)';
                        oSearchCom.style.transform = 'scale(0)';
                        oPublishHistory.style.transform = 'scale(1)';
                        checkMenuStyle(target.parentNode);
                        break;
                    // 管理社群
                    case 'iconfont icon-zuzhiqunzu':
                        oSignInHistory.style.transform = 'scale(0)';
                        oPublishHistory.style.transform = 'scale(0)';
                        oComDetail.style.transform = 'scale(0)';
                        oSearchCom.style.transform = 'scale(0)';
                        oAdminCom.style.transform = 'scale(1)';
                        checkMenuStyle(target.parentNode);
                        break;
                }
            };
            function checkMenuStyle(aim){
                var oLis = doc.querySelectorAll('footer li');
                for(var i=0,len=oLis.length;i<len;i++){
                    oLis[i].style.color = 'rgb(246,247,247)';
                }
                aim.style.color = 'rgb(55,54,56)';
            }
        },
        // 社群管理事件委托
        handleAdminCom: function(){
            var oAdminCom = doc.getElementById('admin-com'),
                oPublishSign = doc.getElementById('pushlish-sign'),
                oRangeInput = doc.querySelector('#pushlish-sign input[type="range"]'),
                oRangeShow = doc.querySelector('#pushlish-sign .range-show'),
                oCreateCom = doc.getElementById('create-com');
            oAdminCom.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                console.log(target);
                if(target.nodeName=="BUTTON"){  
                    oPublishSign.style.transform = 'scale(1)';
                }
                if(target.id=="add-com-btn") {
                    target.style.color = 'rgb(155,202,62)';
                    oCreateCom.style.transform = 'scale(1)';
                }
            };
           
            oPublishSign.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                e.stopPropagation();
                switch(target.className) {
                    case 'iconfont icon-guanbi close':
                        oPublishSign.style.transform = 'scale(0)';
                        break;
                    case 'reset':
                        oPublishSign.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        break;
                }
            };
            // oAdminCom.ontouchstart = function(e){
            //     e = e||window.e;
            //     var target = e.target||e.srcElement;
            //     if(target.id=="add-com-btn") {
            //         target.style.color = '#fff';
            //     }
            // };
            oRangeInput.onchange = function(){
                oRangeShow.innerHTML = this.value;
            };

        },
        // 社群详情事件委托
        handleComDetail: function(){
            var oComDetailBox = doc.getElementById('com-detail'),
                oAllMemBtn = doc.getElementById('look'),    
                oAllMemCon = doc.querySelector('#com-detail .bottom .members'),
                oPostingEdit = doc.querySelector('#com-detail .posting .content'),
                oReplyBox = doc.getElementById('post-word');
            // oComDetailBox.ontouchstart = function(e){
            //     e = e||window.e;
            //     var target = e.target||e.srcElement;
            //     e.stopPropagation();
            //     oAllMemCon.style.transform = "translateX(0)";
            // }
            oAllMemBtn.open = true;
            oAllMemBtn.ontouchstart = function(){
                console.log(this.open);
                if(this.open){
                    oAllMemCon.style.opacity = '1';
                    this.open = false;
                }else {
                    oAllMemCon.style.opacity = '0';
                    this.open = true;
                }
            };
            oPostingEdit.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className) {
                    case 'reply':
                        oReplyBox.style.transform = 'scale(1)';
                        break;
                    case 'look-reply':
                        break;
                    case 'iconfont icon-shanchutianchong':
                        break;
                }
            };
            oReplyBox.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className){
                    case 'reset':
                        oReplyBox.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        break;
                }
            }
        }
    };
    var home = new Home();
})(document,window);
