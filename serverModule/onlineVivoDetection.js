function onlineVivoDetection(client,faceBase64,callback){
    // console.log('')
    console.log('在线活体检测');
    client.faceverify([{
        image: faceBase64,
        image_type: 'BASE64',
        face_field: 'quality'
    }]).then(function (result) {
        // console.log('<faceverify>: ' + JSON.stringify(result));
        callback&&callback(result);
    });
}
module.exports = onlineVivoDetection;