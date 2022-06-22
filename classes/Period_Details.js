class Periods_Details{
    async browse( ext_key, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function ( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err} );
                }
                /*
                `id` int(7) NOT NULL,
                `ext_key` int(7) NOT NULL,
                `exp_number` int(7) NOT NULL,
                `id_exp` int(7) NOT NULL,
                `code` varchar(20) NOT NULL,
                `description` varchar(100) NOT NULL,
                `unit` varchar(20) NOT NULL,
                `amount` decimal(10,2) NOT NULL,
                `id_provider` int(7) DEFAULT NULL,
                `provider` varchar(100) DEFAULT NULL,
                `id_bank` int(11) DEFAULT NULL,
                `check_number` varchar(50) DEFAULT NULL,
                `invoice_number` varchar(20) DEFAULT NULL,
                `invoice_description` varchar(100) DEFAULT NULL,
                `kind` tinyint(4) NOT NULL,
                `id_unit` int(7) NOT NULL,
                */
                let sql = "select * from `period_details` where `ext_key` = " + ext_key;
                con.query( sql, function( err, result ){
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row = '';
                        result.forEach( function( value ) {
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"exp_number":' + value.exp_number
                            +',"id_exp":' + value.id_exp
                            +',"code":"' + value.code
                            +'","description":"' + value.description
                            +'","unit":"' + value.unit
                            +'","amount":"' + value.amount
                            +'","id_provider":' + value.id_provider
                            +',"provider":"' + value.id_provider
                            +'","id_bank":' + value.id_bank
                            +',"check_number":"' + value.check_number
                            +'","invoice_number":"' + value.invoice_number
                            +'","invoice_description":"' + value.invoice_description
                            +'","kind":"' + value.kind
                            +'","id_unit":' + value.id_unit
                            +'},'
                        });
                        row = row.substring(0, row.length - 1);
                        return callback( { status: 200, message: row } );
                    }
                });
            });
        }catch( err ){
            return callback( { status: 500, message: 'Error at Period_Details, Browse Method' });
        }
    }
}

module.exports = Periods_Details;