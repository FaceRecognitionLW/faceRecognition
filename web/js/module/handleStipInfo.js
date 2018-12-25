function handleStipInfo(info){
    var oBox = document.getElementById('stipInfoBox');
    oBox.style.transform = 'scale(1)';
    oBox.innerHTML = info;
    var timer = setTimeout(function(){
        oBox.style.transform = 'scale(0)';
    },3000);
}