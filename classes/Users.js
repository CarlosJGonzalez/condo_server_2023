class Users{

    async getUserId( email, pwd, callback ){
        var conn = require( '../helpers/conn' );
        var con = conn.newCon();
        email = conn.escape( email );
        pwd = conn.escape( pwd );

        con.connect( function( err ) {
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });
        });

        var sql = "select `id`, `email`, `name` from `users` where(`email`="+email+" and `pwd`="+pwd+" and status <> 0);";
        con.query( sql, function( err, result ){
            con.end();
            if( err ){
                return callback({ status:500, message: err['sqlMessage'] });
            }

            var user = null;
            if( result ){
                result.forEach(function(row) {
                    user = '{"id":' + row.id+',"email":"'+row.email+'","name":"'+row.name+'"}';
                });
                return callback ({ status:200, message:user });
            }
            return callback({ status:404, message: 'Not Found' });
        });
    }

    async getRole( id, callback ){
        var conn = require('../helpers/conn');
        var con = conn.newCon();
        id = conn.escape( id );

        con.connect( function( err ){
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });

            var sql = "select `rol` from `roles` where `id_user`="+id;
            con.query( sql, function( err, result ){
                con.end();
                if( err ){
                    return callback({ status: 500, message: err['sqlMessage'] });
                }

                if( result && result.length > 0 ){
                    result = JSON.parse(result[0].rol);
                    return callback ({ status: 200, message: result });
                }
                return callback({ status:404, message: 'No information was found' });
            });
        });
    }

}
module.exports=Users; 