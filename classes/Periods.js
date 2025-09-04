class Periods{

    async browse( id, callback ){
        try{
            let conn    = require('../helpers/conn');
            var con     = conn.newCon();
            var id      = con.escape(id);

            con.connect( function( err ) {
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } )
                }

                let sql = "select `id`, `start`,`end`,`amount`,`status`,`previous`,`due`,`collected`,`balance` from `period` where `ext_key`=" + id;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }

                    if( result && result.length > 0 ){
                        var row = '{"result":[';
                        result.forEach( function( value ) {
                            var start = value.start;
                            start = start.getFullYear() + "-" + start.getMonth() + "-" + start.getDate();
                            var end = value.end;
                            end = end.getFullYear() + "-" + end.getMonth() + "-" + end.getDate();

                            row += '{"id":' + value.id
                            +',"start":"'    + start
                            +'","end":"'      + end
                            +'","amount":"'   + value.amount
                            +'","status":'   + value.status
                            +',"previous":"' + value.previous
                            +'","due":"'      + value.due
                            +'","collected":"'+ value.collected
                            +'","balance":"'  + value.balance
                            +'"},';
                        });
                        row = row.substring(0, row.length-1);
                        row += ']}';
                        return callback({ status: 200, message: row });
                    }
                    return callback ({ status: 404, message: 'Not Found' } );
                    
                });
            });
        }catch( err ){
            return callback( {status:500, message: "Error at Periods Class, Browse Method." } );
        }
    }

    async get( id, callback ){
		try{
			let conn = require('../helpers/conn');
			var con = conn.newCon();
			id = conn.escape(id);

			con.connect ( function( err ){
				if (err) {
					con.end();
					return callback( { status: 500, message: err });
				}
				
				let sql = "select `id`, `start`,`end`,`amount`,`status`,`previous`,`due`,`collected`,`balance` from `period` where `id`=" + id;
				con.query( sql, function( err, result){	
					con.end();
					if( err ) {
						const body = err['sqlMessage'];
						return callback({ status: 500, message: body });
					}

                    if( result && result.length > 0 ){
                        var row='';
                        result.forEach(function(value){
                            row = row + '{"id":' + value.id
                            +',"start":"'    + value.start
                            +'","end":"'      + value.end
                            +'","amount":"'   + value.amount
                            +'","status":'   + value.status
                            +',"previuos":"' + value.previous
                            +'","due":"'      + value.due
                            +'","collected":"'+ value.collected
                            +'","balance":"'  + value.balance
                            +'"},';
                        });
                        row = row.substring(0, row.length-1);
                        return callback({ status: 200, message: row });
                    }
                    return callback ({ status: 404, message: 'Not Found' } );					
				});
			});
		}catch( err ){
			return callback( {status: 500, message: 'Error at Period Class, Get Method' });
		}
    }

}
module.exports = Periods;