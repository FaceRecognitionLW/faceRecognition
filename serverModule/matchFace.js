function matchFace(client,face){
    client.match([{
        image: face,
        image_type: 'BASE64'
    },{
        image: face,
        image_type: 'BASE64'
    }]).then(function (result) {
        console.log('<match>: ' + JSON.stringify(result));
    });
}
module.exports = matchFace;