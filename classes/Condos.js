class Condos{

    async put( form, req, callback ){
        try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            
            form.parse( req, function( err, data){
                let values = '(', fields = '(';
                for( var key in data ){
                    fields = fields + '`' +key + '`,';
                    if( key === 'qLateFee' || key === 'feeType' || key === 'qAdminFee' || key === 'admType' ){
                        values += data[key] + ',';
                    }else{
                        values += conn.escape( data[key] )+ ',';
                    }
                }
        
                let strValues = values.substring( 0, values.length - 1 );
                let strFields = fields.substring( 0, fields.length - 1 );
        
                strFields += ')';
                strValues += ')';
                
                let strSql = 'insert into `condos` ' + strFields + ' values ' + strValues;
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
            return callback({ status: 500, message: 'Error at Condos Class, Put Method' });   
        }
    }

    async browse( extKey, res, callback ){    
        try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            var id = conn.escape( extKey );
    
            con.connect( function( err ){
                if( err ) return callback ({ status: 500, message: err['sqlMessage'] });
                
                /* TO DO : add realtor column to condos table */
                var sql = "select * from `condos`";// where `id`="+id;                
                con.query( sql, function (err, result) {
                    con.end();
                    if (err) {
                        return res.status( 500 ).send( err['sqlMessage'] );
                    }
                    var row='{"result":[';
                    result.forEach(function(value){
                        row = row + '{"id":' + value.id 
                        +',"condoName":"' + value.condoName
                        +'","address":"' + value.address 
                        + '","admName":"' + value.admName 
                        + '","admPhone":"' + value.admPhone
                        +'"},';
                    });
                    row = row.substring(0, row.length-1);
                    row +=']}';                    
                    return callback({ status: 200, message: row });
                });     
            });
        }catch( err ){
            return callback({ status: 500, message: 'Error at Condo Class, Browse Method' });         
        }
    }

    async get( id, callback ){    
        
        var conn = require('../helpers/conn');
        var con = conn.newCon();
        id = conn.escape( id );
//return callback ( { status:200, message: 'line 87' } );
        con.connect( function( err ){
            if( err ) return callback({ status: 500, message: err['sqlMessage'] });
            
            var sql = "select * from `condos` where `id`="+id;
            con.query( sql, function (err, result) {
                con.end();
                if (err) {
                    return callback({ status: 500, message: err['sqlMessage'] });
                }
                  
                var status = 404;
                var message = 'Not found';
                var row;
                if (result && result.length > 0) {
                    result.forEach(function (value) {
                        row = '{"id":' + value.id +
                        ',"condo_name":"' + value.condo_name +
                        '","nid":"' + value.nid +
                        '","address":"' + value.address +
                        '","msg1":"' + value.msg1 +
                        '","msg2":"' + value.msg2 +
                        '","msg3":"' + value.msg3 +
                        '","admName":"' + value.admName +
                        '","admPhone":"' + value.admPhone +
                        '","asistName":"' + value.asistName +
                        '","asistPhone":"' + value.asistPhone +
                        '","manager":"' + value.manager +
                        '","managerPhone":"' + value.managerPhone +
                        '","logo":"' + value.logo +
                        '","email":"' + value.email +
                        '","qLateFee":"' + value.qLateFee +
                        '","feeType":' + value.feeType +
                        ',"feeAmount":"' + value.feeAmount +
                        '","qAdminFee":"' + value.qAdminFee +
                        '","adminType":"' + value.adminType +
                        '","admAmount":"' + value.admAmount +
                        '"}';
                    });
                    status = 200;
                    message = row;                    
                }
                return callback({ status: status, message: message });
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
                    
                    var sql = "delete from `condos` where `id`=" + id;
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
            return callback({ status: 500, message: 'Error at Condos Class, Del Method' });  
        }
    }
    
}

module.exports=Condos;