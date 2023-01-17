class CondoEmail{

    async get( id, callback ){    
        var conn = require('../helpers/conn');
        var con = conn.newCon();
        id = conn.escape( id );

        con.connect( function( err ){
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });
            
            var sql = "select `email` from `condos` where `id`="+id;
            con.query( sql, function (err, result) {
                con.end();
                if (err) {
                    return callback({ status: 500, message: err['sqlMessage'] });
                }
                  
                var row = '';
                if (result) {
                    result.forEach(function (value) {
                        row = '{"email":"' + value.email + '"}';
                    });
                }
                return callback({ status: 200, message: row });
            });       
        });
    }

    async patch( req, form, callback ){
        form.parse( req, function( err, data ){
            let row='', where=''; 
            for( var key in data ){
                if( key == 'id' ){
                    where = ' where `id` = ' + data['id'];
                }else if( key === 'qLateFee' || key === 'feeType' 
                    || key === 'qAdminFee' || key === 'admType'){
                    row += key + '=' + data[key] + ',';
                }else{
                    row += key + '=\''+data[key] + '\',';
                }
            }
            //removing the last comma
            let strSql = row.substring( 0, row.length - 1);
            strSql += where;
            strSql = "update `condos` set " + strSql;
            let conn = require('../helpers/conn');
            var con = conn.newCon();
            con.connect( function ( err ) {
                if ( err ) {
                    return callback({ status: 500, message: err['sqlMessage'] });
                }
                con.query ( strSql, function( err, result ){
                    con.end();
                    if( err ) {
                        const body = err['sqlMessage'];
                        return callback({ status: 500, message: body });
                    }
                    return callback({ status: 200, message: result });
                });                
            });
        });
    }
    
}

module.exports=CondoEmail;