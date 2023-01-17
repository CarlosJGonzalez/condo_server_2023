class CondoUser{

    async getJoin( idUser, callback ){
        //try{
            var conn = require('../helpers/conn');
            var con = conn.newCon();
            con.connect( function( err ){
                if( err ) return callback({ status: 500, message: err['sqlMessage'] });
            });

            var sql = "select c.`id`, c.`condo_name`, c.`logo` from `condos` c inner join `condo_user` cu on c.`id` = cu.`id_condo` and cu.id_user="+idUser;
            con.query( sql, function( err, result ){
                con.end();
                if( err ){
                    return callback({ status: 500, message: err['sqlMessage'] });
                }

                var row = '[';//'{"data":[';
                if( result ){
                    result.forEach( function( value ){
                        row = row + '{"id":' + value.id
                        +',"name":"' + value.condo_name
                        +'","logo":"' + value.logo
                        +'"},';
                    });
                    row = row.substring(0, row.length-1);
                    row += ']';
                    //console.log( row );
                    return callback({ row });
                }
            });
        //}catch( err ){
        //    return callback({ status: 500, message: 'Error at CondoUser Class, getJoin method' });
        //}
    }
}

module.exports = CondoUser;