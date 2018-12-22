/*
1.注册人脸：
insert into user('userId','groupId') values('2018121901','group1');
2.补全信息
update user set userName="qpq",userImg='/sdc/kdcn.jpg' where userId="2018121901";
3.创建社群（发布进入社群问题）
insert into community(comName,comAllman) values('数媒1502班',21);
// 发布进入社群的问题
insert into com_question(comId,question) values(1,'学号');
4.搜索社群（显示社群名和创建人名字）
select comId,comName,createUserId from community;
5.回答问题进入社群
(1)根据搜索拿到的comId找到question
select questionId,question from com_question where comId=1;
(2)回答每个questionId对应的问题
//回答多个问题
insert into com_answer(questionId,answer,userId) values(1,'201526010328','2018121802'),(2,'skdc','2018121802');
(3)社群管理员同意后进入社群
insert into user_com(userId,comId) values('2018121802',1);
6.社群管理者发布签到（定位等信息）
insert into publish(comId,managerId,signAddr,signRange,latitude,longitude,startTime,endTime) values(1,'2018121803','复临舍401',50,20.22,30.33,'2018-12-18 19:26:53','2018-12-18 22:27:02');

7.社群成员刷脸、定位签到
（1）刷脸验证
（2）签到
nsert into usersignstatus(publishId,userId,signStatus,latitude,longitude,distance) values(1,'2018121802',1,10,100,10);


*/ 