var mysql = require('mysql');
function newCon(){
    var con = mysql.createConnection
    ({
        host: process.env.host,
        user: process.env.user,
        password: process.env.pwd,
        database: process.env.db
    });
    return con; 
}


function escape( param ){
    return mysql.escape( param );
}

module.exports.newCon = newCon;
module.exports.escape = escape;