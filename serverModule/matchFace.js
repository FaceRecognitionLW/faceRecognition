function matchFace(client,face,beMatchedFace){
    client.match([{
        image: face,
        image_type: 'BASE64'
    },{
        image: new Buffer(fs.readFileSync(beMatchedFace)).toString('base64'),
        image_type: 'BASE64'
    }]).then(function (result) {
        console.log('<match>: ' + JSON.stringify(result));
    });
}
module.exports = matchFace;