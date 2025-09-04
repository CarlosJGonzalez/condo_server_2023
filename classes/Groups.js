class Groups{

    async put( form, req, callback ){
		try{
			let conn = require('../helpers/conn'); 
			var con = conn.newCon();

			form.parse( req, function( err, data ){
				let fields = '(', values = '(';
				for( var key in data ){
					fields +=  '`'+ key + '`,';
					if( key === 'idcondo' ){
						values += data[key] + ',';
					}else{
						values += conn.escape( data[key] ) + ',';
					}
				}
				let strValues = values.substring( 0, values.length - 1 );
				let strFields = fields.substring( 0, fields.length - 1 );
		
				strFields += ')';
				strValues += ')';
				
				let strSql = 'insert into `codes` ' + strFields + ' values ' + strValues;
				con.connect( function ( err ){
					if( err ) {
						con.end();
						return callback ({ status: 500, message: err['sqlMessage'] });
					}
					
					con.query( strSql, function( err, result ){					
						con.end();
						if( err ) {	
							const body = err['sqlMessage'];
							return callback ( { status: 500, message: body } );
						}
						return callback ({ status: 200, id: result.insertId });
					});
				});
			})
		}catch( err ){
			return callback( { status: 500, message: 'Error at Groups Class, Put Method' } );
		}
    }


    async browse( id, callback ){
		try{
			let conn = require('../helpers/conn');
			var con = conn.newCon();		
			var id = con.escape(id);		

			con.connect ( function( err ){				
				if (err){
					con.end();
					return callback ( { status: 500, message: err } )
				}

				let sql = "select `id`, `code`, `description`, `level`, (select count(*) from items where ext_key= codes.id) as `count` from `codes` where `idcondo`=" + id ;
				con.query( sql, function( err, result){		
					con.end();
					if( err ) {
						const body = err['sqlMessage'];
						return callback( { status: 500, message: body });
					}
					
					var row='[';
					result.forEach(function(value){
						row = row + '{"id":' + value.id 
						+',"code":"' + value.code
						+'","description":"' + value.description 
						+'","level":"' + value.level
						+'","count":"' + value.count
						+'"},';
					});
					row = row.substring(0, row.length-1);
					row +=']'
					return callback({ status: 200, message: row });				
				});
			});
		}catch( err ){
			return callback( {status: 500, message: 'Error at Groups Class, Browse Method' });
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
				
				let sql = "select `id`, `code`, `description`, `level` from `codes` where `id`="+id;
				con.query( sql, function( err, result){	
					con.end();
					if( err ) {
						const body = err['sqlMessage'];
						return callback({ status: 500, message: body });
					}else{
						var row='';
						result.forEach(function(value){
							row = row + '{"id":' + value.id 
							+',"code":"' + value.code
							+'","description":"' + value.description 
							+'","level":"' + value.level
							+'"},';
						});
						row = row.substring(0, row.length-1);
						return callback({ status: 200, message: row });
					}
				});
			});
			
		}catch( err ){
			return callback( {status: 500, message: 'Error at Groups Class, Get Method' });
		}
    }



    async patch( req, form, callback ){
		try{
			let conn = require('../helpers/conn');
			var con = conn.newCon();

			form.parse( req, function( err, data ){
				let row = '', where = '';
				for( var key in data ){
					if( key === 'id' ){
						where = ' where `id` = ' + data[key];
					}else{
						row += key + '=' + con.escape( data[key] ) + ',';
					}
				}
				
				let strSql = row.substring( 0, row.length - 1);
				strSql += where;
		
				strSql = "update `codes` set " + strSql;

				con.connect( function( err) {
					if ( err ) {
						con.end();
						return callback ( { status: 500, message: err } )
					}

					con.query( strSql, function( err, result ){
					con.end();
						if ( err ){
							const body = '{"err":'+ err['errno'] + ',"message":"'+err['sqlMessage'] + '"}';
							return callback({ status: 500, message: body });
						}else{
							return callback( { status: 200, message: 'Ok' });
						}
					})
				})	
			});
		}catch( err ){
			return callback( {status: 500, message: 'Error at Groups Class, Patch Method' });
		}
    }


    async del( id, callback ){
		let conn = require('../helpers/conn');
		var con = conn.newCon();

		con.connect(
			function ( err ){
				if( err ){
					const body = err['sqlMessage'];
					con.end();
					return callback( { status: 500, message: body } );
				}else{
					let strSql = "delete from `codes` where `id`="+id;
					con.query( strSql, function ( err, result ){
						con.end();
						if( err ){
							const body = err['sqlMessage'];
							return callback( { status: 500, message: body} );
						}else{
							return callback( { status: 200, message: 'Ok' } );
						}
					});
				}
			}
		)	
    }

}

module.exports = Groups;