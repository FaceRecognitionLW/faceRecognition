(function(window,document){
    setHtmlFontSize();
    window.onresize = function(){
        setHtmlFontSize();
    }
    function setHtmlFontSize(){
        const html = document.documentElement;
        const htmlWidth = html.getBoundingClientRect().width;
        if(htmlWidth<800){
            html.style.fontSize = htmlWidth/20 + 'px';
        }else {
            html.style.fontSize = 50 + 'px';
        }
    }
})(window,document);