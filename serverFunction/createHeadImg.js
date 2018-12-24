function letterRandom(){
    let str = '';
    let letterList = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    for(let i=0;i<5;i++){
        let item = parseInt(Math.random()*52);
        str+=letterList[item];
    }
    return str;
}
function createUserId(){
    let userId = "";
    let year="",
        month="",
        date="",
        hour="",
        mins="",
        sec="",
        millSec="";
    let time = new Date();
    year = time.getFullYear().toString();
    month = time.getMonth().toString();
    date = time.getDate().toString();
    hour = time.getHours().toString();
    mins = time.getMinutes().toString();
    sec = time.getSeconds().toString();
    millSec = time.getMilliseconds().toString();
    userId += year+month+date+hour+mins+sec+millSec+letterRandom();
    return userId;
}
module.exports = createUserId;
