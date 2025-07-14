const jwt = require("jsonwebtoken");
const refreshTokens = [];
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const JWT_KEY = process.env.JWT_KEY;

class Users{

    refreshToken( req, form, callback ){
        
        form.parse( req, function( err, data ){
            for( var key in data ){
                var token = data['token'];
            }

            if( !refreshTokens.includes( token ) ){
                return callback({ status: 403, message: 'Unauthorized. You should do login.' });
            };
        
            jwt.verify( token, JWT_REFRESH_TOKEN, (err, user ) => {
                if( err ){
                    return callback({ status: 403, message: err });
                }
                const userJWT = {
                    id: user.userid,
                    name: user.username,
                    email: user.email,
                    role: 'admin'
                };

                const accessToken = jwt.sign( userJWT, JWT_KEY, { expiresIn: '20m' });
                var resp = '{"refreshtoken":"' + accessToken + '"}';
                return callback ({ "status": 200,  message: resp });
            });
        });
    }

    async checkUserAccount( email, pwd, checkback ){
        /*****************************************************
         * 1 - Check if the email exists => take: id, failure
            * 1.1 - Checking if pwd match: 
            *      Yes: 
            *          if active == 0 return 401
            *          if active == 1 return 200
            *      No:
            *          if failure > 2 => active = 0
            *          else failure++
         * 2 - 
         */
        try{
            var conn = require( '../helpers/conn.js' );
            var con = conn.newCon();
        
            if( !email || !pwd ){
                return checkback({ status: 403, message: "Unauthorized. You should do login again"});
            }

            con.connect( function( err ) {
                if( err ) return checkback({ status: 500, message: err });
            });

            var sql = 'select `id`, `failure` from `users` where (`email`="' + email + '")';
            con.query( sql, function( err, result ){
                if( err ){
                    con.end();
                    return checkback({ status: 500, message: err});
                }

                if( result && result.length > 0 ){
                    var id, failure;
                    result.forEach( function( row ){
                        id = row.id;
                        failure = row.failure;
                    });

                    /**********************************************
                     * The email exists; now check if the pwd match
                     */
                    sql = 'select `id`, `failure`, `active` from `users` where (`email`="'+email+'" and `pwd`="'+pwd+'")';

                    con.query( sql, function( err, result ){
                        if( err ) {
                            con.end();
                            return checkback({ status:500, message: err });
                        }
                    
                        if( result && result.length > 0 ){
                            con.end();
                            var active;
                            result.forEach( function( row ){
                                active = row.active;
                            });

                            if( active == 0 ) return checkback({ status: 401, message: 'Account blocked. Too many login intents. Try again in 15 minutes.' });

                            return checkback({ status: 200, message: 'success' });

                        }else if( parseInt( failure ) > 2 ){
                            sql = 'update `users` set `active` = 0 where `id`=' + id;
                            con.query( sql, function( err, result){
                                con.end();
                                if( err ){
                                    return checkback({ status: 500, message: err['sqlMessage'] });
                                }
                                return checkback({ status: 401, message: "Account blocked. Too many login intents. Try again in 15 minutes." });
                            });

                        }else{                  
                            sql = "update `users` set `failure`=`failure` + 1 where `id`=" + id;
                            con.query( sql, function( err, result ){
                                if( err ) return checkback({ status: 500, message: err['sqlMessage'] });

                                return checkback({ status: 404, message: 'Wrong Email or Password' });
                            });
                        }
                    });

                }else{             
                    return checkback({ status: 401, message: 'Wrong email or password' });
                }
            });
        }catch( error ){
            return checkback({ status: 500, message: error } );
        }

    }

    async getUserId( email, pwd, callback ){
        try{
            var conn = require( '../helpers/conn' );
            var con = conn.newCon();

            con.connect( function( err ) {
                if( err ) return callback({ status: 500, message: err['sqlMessage'] });
            });

            if( !email || !pwd ){
                return callback({ status: 403, message: "Unauthorized. You should do login again"});
            }
            var sql = "select c.`id` condo_id, c.`condo_name`, c.`logo`, u.`name`, u.`email`, u.`id` user_id, u.`failure` from `condos` c inner join `condo_user` cu on c.`id` = cu.`id_condo` ";
            sql += "inner join `users` u on cu.`id_user` = u.`id` and cu.id_user=(select `id` from `users` where(`email`='"+email+"' and `pwd`='"+pwd+"' and `active` = 1));";
            con.query( sql, function( err, result ){
                con.end();
                if( err ){
                    return callback({ status:500, message: err['sqlMessage'] });
                }

                var user = null;
                var uId = null;
                if( result && result.length > 0){
                    const userJWT = {
                        id: result.user_id,
                        name: result.name,
                        email: email,
                        role: 'admin'
                    };
                    const token = jwt.sign( userJWT, process.env.JWT_KEY, { expiresIn: '20m' } );
                    const refreshToken = jwt.sign( userJWT, process.env.JWT_REFRESH_TOKEN );
                    refreshTokens.push( refreshToken );

                    result.forEach(function(row) {
                        uId = row.id;
                        user = '{"condo_id":' + row.condo_id+
                            ',"condo_name":"'+row.condo_name+
                            '","user_id":'+row.user_id+
                            ',"email":"'+row.email+
                            '","user_name":"'+row.name+
                            '","token":"' +token+
                            '","refreshToken":"' +refreshToken+
                        '"}';
                    });
                    return callback({ status:200, message: user });
                }
                return callback({ status: 404, message: 'User Not Found!' });
            });
        }catch( error ){
            return callback({status: 500, message: error })
        }

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