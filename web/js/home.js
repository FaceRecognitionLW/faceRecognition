(function(document,window){
    var doc = document;
    function Home(){
        // 初始化界面
        this.init();
        // 计算用户的经纬度
        // this.position();
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
        // 渲染社群管理界面信息
        this.getAdminComInfo();
    }
    Object.defineProperty(Home.prototype,'constructor',{
        enumerable: false,
        value: Home
    });
    Home.prototype = {
        // 初始化
        init: function(){
            var oOpenAnimation = doc.getElementById('stage');
            if(Home.prototype.getCookieModule().get('user')) {
                oOpenAnimation.style.display = 'none';
            }else {
                var timer = setTimeout(function(){  
                    // oOpenAnimation.style.display = "none";
                    // 如果用户没有登录则跳转到登陆界面，否则直接打开主界面
                    window.location.href = 'login.html';
                    clearTimeout(timer);
                },2000)
            }
        },
        // 获取用户的经纬度
        position: function(callback){
            console.log('position');
            navigator.geolocation.getCurrentPosition(function(position){
                console.log('成功');
                console.log('用户十进制纬度: '+position.coords.latitude);
                console.log('用户十进制经度: '+position.coords.longitude);
                var lati = position.coords.latitude;
                var longi = position.coords.longitude;
                callback&&callback(lati,longi);
                // Home.prototype.translateCoordinate(lati,longi);
                // Home.prototype.indoorMap(lati,longi);
            },function(err){
                console.log('Error code :'+err.code);
                console.log('Erroe message: '+err.message)
            })
        },
        // 将GPS经纬度转换为百度……
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
        // 室内地图
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
        // 显示地图
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
            var oSignInfo = {
                comId: '',
                addrInput: doc.querySelector('#publish-sign-quick input[name="addr"]'),
                lantitudeInput: doc.querySelector('#publish-sign-quick input[name="latitude"]'),
                longitudeInput: doc.querySelector('#publish-sign-quick input[name="longitude"]'),
                startTimeInput: doc.querySelector('#publish-sign-quick input[name="startTime"]'),
                endTimeInput: doc.querySelector('#publish-sign-quick input[name="endTime"]'),
                rangeInput: doc.querySelector('#publish-sign-quick input[name="range"]')
            };
            oPublishBox.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className) {
                    // 关闭
                    case 'click-to-location':
                        // 定位
                        Home.prototype.position(function(lati,longi){
                            oSignInfo.lantitudeInput.value = lati;
                            oSignInfo.longitudeInput.value = longi;
                        });
                        break;
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
            var oCreateComBox = doc.getElementById('create-com'),
                oForm = doc.querySelector('#create-com form'),
                oHeadImg = doc.querySelector('#create-com .headPhoto img'),
                oFileIput = doc.querySelector('#create-com input[name="headPhoto"]'),
                oComName = doc.querySelector('#create-com input[name="comName"]'),
                oSetQueBtn = doc.querySelector('#create-com p em'),
                oResetBtn = doc.querySelector('#create-com .reset'),
                oSumitBtn = doc.querySelector('#create-com .submit'),
                oLastLine = doc.querySelector('#create-com p:last-child'),
                // 用来存放上传头像的base64
                HEADIMG = '';
            console.log(oLastLine);
            // 上传头像
            oFileIput.onchange = function(){
                if(this.value){
                    var file = this.files[0];
                    // 将图片放入头像框中
                    readFile(file);
                    // 将头像转为base64格式
                    imgToBase64(file);
                }
            };
            // 将图片放在框内
            function readFile(file){
                var obj = new FileReader(file);
                obj.readAsDataURL(file);
                obj.onload = function(){
                    oHeadImg.src = this.result;
                }
            }
            // 取消表单默认事件，用ajax代替
            oForm.onsubmit = function(e){
                e = e||window.e;
                e.preventDefault();
            };
            
            // 事件委托
            oCreateComBox.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                switch(target.className) {
                    // 添加问题栏目
                    case 'addQue':
                        console.log('add que');
                        var item = doc.createElement('p');
                        item.innerHTML = '<input type="text" name="question"><i class="iconfont icon-guanbi1"></i>';
                        oForm.insertBefore(item,oLastLine);
                        break;
                    // 删除问题栏目
                    case 'iconfont icon-guanbi1':
                        oForm.removeChild(target.parentNode);
                        break;
                    case 'reset':
                        console.log('reset');
                        this.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        // 把几个问题理一下
                        var questionInput = doc.querySelectorAll('#create-com input[name="question"]');
                        var questionList = [];
                        for(var i=0,len=questionInput.length;i<len;i++){
                            questionList.push(questionInput[i].value);
                        }
                        console.log(questionList);
                        ajax({
                            url: 'community/createCom',
                            method: 'post',
                            data: {
                                headImg: HEADIMG,
                                comName: oComName.value,
                                questions: questionList
                            },
                            contentType: 'application/json',
                            success: function(res){
                                res = JSON.parse(res);
                                console.log(res);
                                if(res.status =="success"){
                                    // 创建成功
                                    handleStipInfo(res.msg);
                                    oCreateComBox.style.transform = 'scale(0)';
                                }else {
                                    // 创建失败
                                    handleStipInfo(res.msg);
                                }
                            },
                            fail: function(err){
                                console.log('err: '+err);
                            }
                        })
                        break;
                }
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
            var oSignInfo = {
                comId: '',
                addrInput: doc.querySelector('#pushlish-sign input[name="addr"]'),
                lantitudeInput: doc.querySelector('#pushlish-sign input[name="latitude"]'),
                longitudeInput: doc.querySelector('#pushlish-sign input[name="longitude"]'),
                startTimeInput: doc.querySelector('#pushlish-sign input[name="startTime"]'),
                endTimeInput: doc.querySelector('#pushlish-sign input[name="endTime"]'),
                rangeInput: doc.querySelector('#pushlish-sign input[name="range"]')
            };
            oAdminCom.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                if(target.id=="add-com-btn") {
                    target.style.color = 'rgb(155,202,62)';
                    oCreateCom.style.transform = 'scale(1)';
                }
                switch(target.className) {
                    case 'publish-sign':
                        oSignInfo.comId = target.parentNode.getAttribute('comId');
                        oPublishSign.style.transform = 'scale(1)';
                        break;
                    case 'iconfont icon-shanchutianchong':
                        // 点击删除
                        var reply = confirm('确定删除吗？');
                        if(reply) {
                            // 发送删除请求
                            let delComId = target.parentNode.getAttribute('comId');
                            console.log(delComId);
                            delAdminComInfo(delComId);
                        }
                        break;
                }
            };
            //发布签到信息事件委托    
            oPublishSign.ontouchstart = function(e){
                e = e||window.e;
                var target = e.target||e.srcElement;
                e.stopPropagation();
                switch(target.className) {
                    // 点击定位
                    case 'click-to-location':
                        // 定位
                        Home.prototype.position(function(lati,longi){
                            oSignInfo.lantitudeInput.value = lati;
                            oSignInfo.longitudeInput.value = longi;
                        });
                        break;
                    case 'iconfont icon-guanbi close':
                        oPublishSign.style.transform = 'scale(0)';
                        break;
                    case 'reset':
                        oPublishSign.style.transform = 'scale(0)';
                        break;
                    case 'submit':
                        if(oSignInfo.lantitudeInput.value&&oSignInfo.longitudeInput.value) {
                            Home.prototype.publishSign(oSignInfo);
                        }
                        break;
                }
            };
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
        },
        // 拉取‘社群管理界面’信息请求
        getAdminComInfo: function(){
            ajax({
                url: '/community/getCreatedCom',
                method: 'get',
                contentType: 'application/x-www-form-urlencoded',
                success: function(res){
                    res = JSON.parse(res);
                    console.log(res);
                    Home.prototype.renderAdminComInfo(res.data);
                },
                fail: function(err){
                    console.log('err: '+err);
                }
            })
        },
        // 删除社群的请求
        delAdminComInfo: function(comId){
            ajax({
                url: '/community/delCreatedCom',
                method: 'get',
                data: {
                    comId: comId
                },
                contentType: 'application/x-www-form-urlencoded',
                success: function(res) {
                    console.log(res);
                },
                fail: function(err){
                    console.log('err: '+err);
                }
            })
        },
        // 发布签到信息请求
        publishSign: function(oSignInfo) {
            ajax({
                url: 'community/publishSign',
                method: 'post',
                data: {
                    comId: oSignInfo.comId,
                    addr: oSignInfo.addrInput.value,
                    latitude: oSignInfo.lantitudeInput.value,
                    longitude: oSignInfo.longitudeInput.value,
                    startTime: new Date(oSignInfo.startTimeInput.value).getTime(),
                    endTime: new Date(oSignInfo.endTimeInput.value).getTime(),
                    range: oSignInfo.rangeInput.value
                },
                contentType: 'application/json',
                success: function(res){
                    res = JSON.parse(res);
                    console.log(res);
                    handleStipInfo(res.msg);
                    if(res.status == "success"){
                        doc.getElementById('pushlish-sign').style.transform = 'scale(0)';
                    }
                },
                fail: function(err){
                    console.log('err: '+err);
                }
            })
        },
        // 渲染'社群管理界面'信息
        renderAdminComInfo: function(data){
            var oBox = doc.querySelector('#admin-com ul');
            var frag = doc.createDocumentFragment();
            for(var i=0,len=data.length;i<len;i++){
                var item = doc.createElement('li');
                item.setAttribute('comId',data[i].comId);
                item.innerHTML = '<div class="img"><img src="./'+data[i].comImg+'" alt="img"></div><div class="info"><p>'+data[i].comName+'</p><p><i class="iconfont icon-icon_zhanghao"></i>'+data[i].userName+'</p><p><i class="iconfont icon-qunzutianchong"></i>总人数</p><p><i class="iconfont icon-get"></i><a href=":void(0)">历史签到信息</a></p></div><button class="publish-sign">发布签到</button><i class="iconfont icon-shanchutianchong"></i>';
                frag.appendChild(item);
            }
            oBox.appendChild(frag);
        },
        getCookieModule: function(){
            return COOKIE;
        }
    };
    var home = new Home();
})(document,window);
