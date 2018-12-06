const https = require('https');
const qs = require('querystring');

const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': '7FBjTenAnLTg5kATSpQO2cXj',
    'client_secret': 'kfHxZLR5BtvV67jtwTMjrG2OsnYujDUK'
});

https.get(
    {
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + param,
        agent: false
    },
    function (res) {
        // 在标准输出中查看运行结果
        res.pipe(process.stdout);
    }
);

