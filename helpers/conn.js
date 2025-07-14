import { createConnection, escape as __escape } from 'mysql';
function newCon(){
    var con = createConnection
    ({
        host: process.env.host,
        user: process.env.user,
        password: process.env.pwd,
        database: process.env.db
    });
    return con; 
}


function escape( param ){
    return __escape( param );
}

const _newCon = newCon;
export { _newCon as newCon };
const _escape = escape;
export { _escape as escape };