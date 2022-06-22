class Items{
    async browse( id, groupId, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = conn.newCon();
            var id = con.escape(id);

            con.connect ( function( err ){
                if (err){
                    con.end();
                    return callback ( { status:500, message: err } );
                }

                let sql = "select `id`, `code`, `description`, `cost`, `budget`, `type`, `unit`, `itemNumber` from `items` where `ext_key` = " + groupId;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status:500, message: body } );
                    }

                    var row='{"result":[';
                    result.forEach( function( value){
                        row += '{"id":' + value.id
                        +',"code":"' + value.code
                        +'","description":"' + value.description
                        +'","cost":"' + value.cost
                        +'","budget":"' + value.budget
                        +'","type":"' + value.type
                        +'","unit":"' + value.unit
                        +'","itemNumber":' + value.itemNumber
                        +'},';
                    });
                    
                    //removing the extra comma
                    if( row.length > 2)
                    {
                        row = row.substring(0, row.length -1);
                    }
                    row +="]}";
                    return callback( { status: 200, message: row });
                });
            });
        }catch( err ){
            return callback( {status: 500, message: 'Error at Items Class, Browse method.'} );
        }
    }

    async put( form, req, callback ){
        try{
            let conn = require( '../helpers/conn' );
            var con = conn.newCon();

            form.parse( req, function( err, data ){
                if( err ){
                    return callback( { status: 500, message: 'Error at Items Class, Put Method (parse)' });
                }

                let fields = '(', values = '(';
                for( var key in data ){
                    fields += '`' + key + '`,';
                    values += conn.escape( data[key] ) + ',';
                }

                let strValues = values.substring( 0, values.length - 1 );
                let strFields = fields.substring( 0, fields.length - 1 );

                strFields += ')';
                strValues += ')';

                let strSql = 'insert into `items` ' + strFields + ' values ' + strValues;
                con.connect( function( err ){
                    if( err ){
                        con.end();
                        return callback ({ status: 500, message: err['sqlMessage'] });
                    }

                    con.query( strSql, function( err, result ){
                        con.end();
                        if( err ){
                            const body = err['sqlMessage'];
                            return callback( { status: 500, message: body } );
                        }
                        return callback( { status: 200, id: result.insertId } );
                    });                
                });
            });
        }catch( err ){
            return callback( { status: 500, message: 'Error at Items Class, Put Method' } );
        }
    }



    async get( id, callback ){
        try{
            let conn = require( '../helpers/conn' );
            var con = conn.newCon();

            con.connect( function( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } );
                }

                let sql = "select `id`, `ext_key`, `code`, `description`, `cost`, `budget`, `type`, `unit`, `itemNumber` from `items` where `id`=" + id;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        if( result.length > 0 ){
                            var row='';
                            result.forEach( function( value ){
                                row = '{"id":' + value.id 
                                + ',"code":"' + value.code
                                + '","description":"' + value.description
                                + '","cost":"' + value.cost
                                + '","budget":"' + value.budget
                                + '","type":"' + value.type
                                + '","unit":"' + value.unit
                                + '","itemNumber":' + value.itemNumber
                                + ',"ext_key":' + value.ext_key
                                + '}'
                            });
                            return callback( { status: 200, message: row } );
                        }else{
                            return callback( { status: 404, message: 'Record Not Found' } );
                        }                        
                    }
                });
            });

        }catch( err ){
            return callback( { status: 500, message: 'Error at Items Class, Get Method' } );
        }
    }    

    async patch( req, form, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = conn.newCon();

            form.parse( req, function( err, data ){
                if( err ){
                    return callback( {status: 500, message: "Error at Items Class, Method Patch/form parse"} );
                }
                
                let row = '', where = '';
                for( var key in data ){
                    if( key === 'id' ){
                        where = ' where `id` = ' + data[key];
                    }else{
                        row += key + '=' + con.escape( data[key] ) + ',';
                    }
                }

                let sqlStr = row.substring( 0, row.length - 1 );
                sqlStr += where;

                sqlStr = "update `items` set " + sqlStr;
                con.connect( function( err ) {
                    if( err ){
                        con.end();
                        return callback ( { status: 500, message: err });
                    }
                    con.query( sqlStr, function( err, result ){
                        con.end();
                        if( err ){
                            const body = '{"err":' + err['errno'] + ',"message":"' + err['sqlMessage'] + '"}';
                            return callback( { status: 500, message: body } );
                        }else{
                            return callback( { status: 200, message: 'Ok' } );
                        }
                    });
                })
            });
        }catch( err) {
            return callback ({ status: 500, message: 'Error at Items Class, Patch Method' });
        }
    }
}

module.exports = Items;