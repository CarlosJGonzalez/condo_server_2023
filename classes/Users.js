class Users{

    async checkUserAccount( email, pwd, callback ){
        /***********************************************
         * The user was found using email and pwd
         * Checking if there is more than 3 login failures,
         * if so, block the account setting `status` = 3
         */
        var conn = require( '../helpers/conn' );
        var con = conn.newCon();
        email = conn.escape( email );
        pwd = conn.escape( pwd );

        con.connect( function( err ) {
            con.end();
            if( err ) return callback({ status: 500, message: err['slqMessage'] });
        });

        var sql = "select `id`, `failure` from `users` where (`email`="+email+" and `pwd`="+pwd+" and `active` = 0 ))";
        con.query( sql, function( err, result ){
            con.end();
            if( err ){
                return callback ({ status:500, message: err['sqlMessage'] });
            }

            if( result && result.length > 0 ){
                var id, failure;
                result.forEach( function( row ){
                    id = row.id;
                    failure = row.failure;
                });

                if( failure > 2 ){
                    con.query( 'update `users` set `status` = 1 where `id`=' + id );
                    return callback({ status: 401, message: "Your account is blocked because many login intents. Try again in 15 minutes." });
                }

            }
            
            con.query( 'update `users` set `failure` = `failure` + 1 where `email`=' + email );
            con.end();
            
            return callback ({ status: 500, message: 'User Not Found'  });
        });
    }

    async getUserId( email, pwd, callback ){
        var conn = require( '../helpers/conn' );
        var con = conn.newCon();
        email = conn.escape( email );
        pwd = conn.escape( pwd );

        con.connect( function( err ) {
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });
        });

        var sql = "select c.`id` condo_id, c.`condo_name`, c.`logo`, u.`name`, u.`email`, u.`id` user_id, u.`failure` from `condos` c inner join `condo_user` cu on c.`id` = cu.`id_condo` ";
        sql += "inner join `users` u on cu.`id_user` = u.`id` and cu.id_user=(select `id` from `users` where(`email`="+email+" and `pwd`="+pwd+" and `active` = 1));";
        
        con.query( sql, function( err, result ){
            con.end();
            if( err ){
                return callback({ status:500, message: err['sqlMessage'] });
            }

            var user = null;
            var uId = null;
            if( result && result.length > 0){
                result.forEach(function(row) {
                    uId = row.id;
                    user = '{"condo_id":' + row.condo_id+
                        ',"condo_name":"'+row.condo_name+
                        '","user_id":'+row.user_id+
                        ',"email":"'+row.email+
                        '","user_name":"'+row.name+
                    '"}';
                });
                return callback ({ status:200, message:user });
            }
            return callback({ status:404, message: 'User Not Found' });
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