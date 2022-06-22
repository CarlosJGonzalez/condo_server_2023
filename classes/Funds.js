class Funds{

    async get( id, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } );
                }

                let sql = "select * from funds where   `id` =" + id;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row='';
                        result.forEach( function( value ){
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"code":"' + value.code
                            +'","type":"' + value.type
                            +'","name":"' + value.name
                            +'","status":' + value.status
                            +',"balance":"' + value.balance
                            +'"}';
                        });
                        return callback( { status: 200, message: row } );
                    }
                })
            })
        }catch( err ){
            return callback( { status: 500, message: 'Error at Funds, Get Method' } );
        }
    }









    async browse( id, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } );
                }

                let sql = "select * from funds where `ext_key` = " + id;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row='';
                        result.forEach( function( value) {
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"code":"' + value.code
                            +'","type":"' + value.type
                            +'","name":"' + value.name
                            +'","status":' + value.status
                            +',"balance":"' + value.balance
                            +'"},';
                        });
                        row = row.substring(0, row.length-1);
                        return callback( { status:200, message: row } );
                    }
                });
            });
        }catch( err ){
            return callback( { status: 500, message: 'Error at Funds, Browse Method' } );
        }
    }
}

module.exports = Funds;