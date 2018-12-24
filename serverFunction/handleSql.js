module.exports = (conn,sql,callback) =>{
    conn.query(sql,function(err,data){
        if(err){
            console.log(err.sqlMessage);
        }else {
            callback&&callback(data);
        }
    })
}