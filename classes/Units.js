class Units{

    async put( form, req, callback ){
        try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            
            form.parse( req, function( err, data){
                let values = '(', fields = '(';
                for( var key in data ){
                    fields = fields + '`' +key + '`,';
                    if( key === 'unitSector' || key === 'position' ){
                        values += data[key] + ',';
                    }else{
                        values += conn.escape( data[key] )+ ',';
                    }
                }
        
                let strValues = values.substring( 0, values.length - 1 );
                let strFields = fields.substring( 0, fields.length - 1 );
        
                strFields += ')';
                strValues += ')';
                
                let strSql = 'insert into `units` ' + strFields + ' values ' + strValues;
                con.connect( function ( err ){
                    if( err ) {
                        con.end();
                        return callback({ status: 500, message: err });
                    }

                    con.query( strSql, function( err, result ){
                        con.end();	
                        if( err ) {
                            const body = err['sqlMessage'];
                            return callback({ status: 500, message: body });
                        }
                        return callback({status:200,id:result.insertId});
                    });
                });
            });
        }catch( err ){
            return callback({ status: 500, message: 'Error at Units Class, Put Method' });   
        }
    }

    async browse( extKey, res, callback ){    
        try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            var id = conn.escape( extKey );
    
            con.connect( function( err ){
                if( err ) return callback ({ status: 500, message: err['sqlMessage'] });
                
                var sql = "select * from `units` where `ext_key`="+id;                
                con.query( sql, function (err, result) {
                    con.end();
                    if (err) {
                        return res.status( 500 ).send( err['sqlMessage'] );
                    }
                    var row='{"result":[';
                    result.forEach(function(value){
                        row = row + '{"id":' + value.id 
                        +',"unitNumber":"' + value.unitNumber
                        +'","ownerName":"' + value.ownerName 
                        + '","ownerEmail1":"' + value.ownerEmail1 
                        + '","ownerPhoneNumber1":"' + value.ownerPhoneNumber1
                        +'"},';
                    });
                    row = row.substring(0, row.length-1);
                    row +=']}';                    
                    return callback({ status: 200, message: row });
                });     
            });
        }catch( err ){
            return callback({ status: 500, message: 'Error at Units Class, Browse Method' });         
        }
    }

    async get( id, callback ){    
        var conn = require('../helpers/conn');
        var con = conn.newCon();
        id = conn.escape( id );

        con.connect( function( err ){
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });
            
            var sql = "select * from `units` where `id`="+id;
            con.query( sql, function (err, result) {
                con.end();
                if (err) {
                    return callback({ status: 500, message: err['sqlMessage'] });
                }
                  
                var row = '';
                if (result) {
                    result.forEach(function (value) {
                        row = '{"result": {"id":' +
                        value.id +
                        ',"unitNumber":"' + value.unitNumber +
                        '","ownerName":"' + value.ownerName +
                        '","ownerRif":"' + value.ownerRif +
                        '","ownerEmail1":"' + value.ownerEmail1 +
                        '","ownerEmail2":"' + value.ownerEmail2 +
                        '","ownerAddress":"' + value.ownerAddress +
                        '","ownerContact":"' + value.ownerContact +
                        '","ownerPhoneNumber1":"' + value.ownerPhoneNumber1 +
                        '","ownerPhoneNumber2":"' + value.ownerPhoneNumber2 +
                        '","ownerContactPhoneNumber":"' + value.ownerContactPhoneNumber +
                        '","ownerContactEmail":"' + value.ownerContactEmail +
                        '","receiveEmail":"' + value.receiveEmail +
                        '","alicuota":"' + value.alicuota +
                        '","fixAmount":"' + value.fixAmount +
                        '","unitSector":"' + value.unitSector +
                        '","position":' + value.position +
                        ',"tenantName":"' + value.tenantName +
                        '","tenantRif":"' + value.tenantRif +
                        '","tenantPhoneNumber1":"' + value.tenantPhoneNumber1 +
                        '","tenantPhoneNumber2":"' + value.tenantPhoneNumber2 +
                        '","tenantAddress":"' + value.tenantAddress +
                        '","tenantContact":"' + value.tenantContact +
                        '","tenantContactPhoneNumber":"' + value.tenantContactPhoneNumber +
                        '","tenantContactEmail":"' + value.tenantContactEmail +
                        '","tenantWork":"' + value.tenantWork +
                        '","tenantWorkPhoneNumber":"' + value.tenantWorkPhoneNumber +
                        '"}}';
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
                }else if( key == 'unitSector' || key == 'position' ){
                    row += key + '=' + data[key] + ',';
                }else{
                    row += key + '=\''+data[key] + '\',';
                }
            }
            //removing the last comma
            let strSql = row.substring( 0, row.length - 1);
            strSql += where;
            strSql = "update `units` set " + strSql;
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

	async del( id, res, callback ){
        try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            var id = conn.escape(id);
    
            con.connect(
                function( err ){
                    if( err ){
                        con.end();
                        return callback ({ status:500, message: err['sqlMessage'] });
                    }
                    
                    var sql = "delete from `units` where `id`=" + id;
                    con.query( sql, function( err, results ){
                        con.end();
                        if( err ){
                            return callback({ status:500, message: err['sqlMessage'] });
                        }    
                        return callback({ status:200, message: "Deleted" });                            
                    });			
                }
            );    
        }catch( err ){
            return callback({ status: 500, message: 'Error at Units Class, Del Method' });  
        }
    }
    
}

module.exports=Units;