class Fund_Details extends Funds{
    async browse( id, callback ){
        try{
            let conn = require('../helpers/conn');
            var con = new conn.newCon();
            con.connect( function( err ){
                if( err ){
                    con.end();
                    return callback( { status: 500, message: err } );
                }

                let sql = "select * from fund_details where ext_key=" + id;
                con.query( sql, function( err, result ) {
                    con.end();
                    if( err ){
                        const body = err['sqlMessage'];
                        return callback( { status: 500, message: body } );
                    }else{
                        var row='';
                        result.forEach( function ( value ){
                            row = row + '{"id":' + value.id
                            +',"ext_key":' + value.ext_key
                            +',"id_period":' + value.id_period
                            +',"no_check":"' + value.no_check
                            +'","no_receipt":"' + value.no_receipt
                            +'","no_invoice":"' + value.no_invoice
                            +'","id_pay":' + value.id_pay
                            +',"id_collect":' + value.id_collect
                            +',"id_unit":' + value.id_unit
                            +',"detail":"' + value.Fund_Details
                            +'","id_provider":' + value.id_provider
                            +',"provider":"' + value.provider
                            +'","debit":"' + value.debit
                            +'","credit":"' + value.credit
                            +'","balance":"' + value.balance
                            +'","status":' + value.status
                            +',"note":"' + value.note
                            +'","date":"' + value.date
                            +'"},';
                        });
                        row = row.substring(0, row.length-1);
                        return callback( { status: 200, message: row } );
                    }
                });
            });
        }catch( err ){
            return callback( { status: 500, message: 'Error at Fund Details, Browse Method' } );
        }   
    }
}

module.exports = Fund_Details;