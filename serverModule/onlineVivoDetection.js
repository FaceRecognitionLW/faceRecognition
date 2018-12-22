function onlineVivoDetection(client,faceBase64){
    // console.log('')
    console.log('在线活体检测');
    client.faceverify([{
        image: faceBase64,
        image_type: 'BASE64',
        face_field: 'age'
    },{
        image: faceBase64,
        image_type: 'BASE64',
        face_field: 'age'
    }]).then(function (result) {
        console.log('<faceverify>: ' + JSON.stringify(result));
    });
}
module.exports = onlineVivoDetection;