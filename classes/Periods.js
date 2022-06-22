class Periods{

    async get( id, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function ( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } );
                }

                let sql = "select * from `period` where `id` =" + id;
                con.query( sql, function( err, result) {
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row = '';
                        result.forEach( function( value ) {
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"start":"' + value.start
                            +'","end":"' + value.end
                            +'","amount":"' + value.amount
                            +'","status":' + value.status
                            +',"previous":"' + value.previous
                            +'","due":"' + value.due
                            +'","collected":"' + value.collected
                            +'","balance":' + value.balance
                            +'"}';
                        });
                        return callback( { status: 200, message: row} );                        
                    }
                });
            })
        }catch( err ){
            return callback( { status: 500, message:'Error at Periods, Get Method'});
        }
    }


    async browse( id, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function ( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err });
                }

                let sql = "select `id`, `ext_key`, `start`, `end`, `amount`, `status`, `previous`, `due`, `collected`, `balance` from `period` where `ext_key`=" + id;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row='';
                        result.forEach( function( value ) {
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"start":"' + value.start
                            +'","end":"' + value.end
                            +'","amount":"' + value.amount
                            +'","status":' + value.status
                            +',"previous":"' + value.previous
                            +'","due":"' + value.due
                            +'","collected":"' + value.collected
                            +'","balance":' + value.balance
                            +'"},';
                        });
                        row = row.substring(0, row.length-1);
                        return callback( { status: 200, message: row} );
                    }
                });
            });
        }catch( err ){
            return callback( { status: 500, message: 'Error at Periods, Browse Method' });
        }
    }
}

module.exports = Periods;