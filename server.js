const express = require('express');
const app = express();
const cors = require("cors");
const CondoEmail = require('./classes/CondoEmail.js');
const jwt = require('jsonwebtoken');

const authenticateJWT = ( req, res, next ) => {
	const authHeader = req.headers.authorization;
	var tokenParts = null;
	if( authHeader ){
		tokenParts = authHeader.split(",");
		tokenParts = tokenParts[0].split(" ");
	}
	
	if( tokenParts && tokenParts[0] == "Bearer" && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null ){
		try{
			jwt.verify( tokenParts[1], process.env.JWT_KEY, ( err, user )=> {
				if( err ){
					return res.sendStatus( 401 );
				}

				req.user = user;
				next();
			});

		} catch ( error ){
			res.status( 401 ).json({success: false, message: 'User Not Authenticated'});
			return next( {success: false, message: 'User Not Authenticated'} );
		}
	} else {
		res.sendStatus( 401 );
	}
};


app.use(cors({ origin: ['http://localhost:3000', 'https://spa.parguitog.com', 'https://spa.myrecp.com', '*'] }));
require('dotenv').config();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var formidable = require('formidable');


//this one is used to know server status
app.get('/', function (req, res) {
	res.send('Server online');
})


app.post('/token', (req, res) => {
	var form = new formidable.IncomingForm();
	if( !form ){
		return res.sendStatus( 400 );
	}
	const User = require('./classes/Users.js');
	const refreshToken = new User();
	
	refreshToken.refreshToken(req, form, function( result ){
		res.status( result.status ).send( result.message );
	});
});



/*******************************************************/
/******************** USERS -->*************************/
/*******************************************************/
app.post('/login', async function ( req, res, next ){
	var form = new formidable.IncomingForm();
	if( !form ){
		return res.sendStatus( 400 );
	}

	form.parse( req, function( err, fields ){
		const required = ['email', 'pwd'];
		for( let field in fields ){
			if( required.indexOf( field ) == -1 ){
				res.status(400).send('A required field is missed.');
				return;
			}else if( required.indexOf( field ) > -1 && field == '' ){
				res.status(400).send('A required field is missed.');
				return;
			}
		}
		var email = fields.email;
		var pwd = fields.pwd;

		const Login = require('./classes/Users.js');
		const user = new Login();
	
		user.checkUserAccount( email, pwd, function( result ){
			//console.log( 'result 2:' + result.message );
				if( result.status != 200 ){
					//res.status( result.status ).send( result.message );
					return;
				}
				next();
			}, 
			user.getUserId ( email, pwd, function( result ){
				//console.log('result 1:' + result.message);
				res.status( result.status ).send( result.message );
				next();
			})
		);
	});
});



app.get('/user/role/:id', authenticateJWT,function( req, res ){
	let id = req.params.id;
	const User = require('./classes/Users.js');
	const user = new User();
	user.getRole( id, function( result ){
		res.status( result.status ).send( result.message );
	});
});


/****************************************************************/
/******************** PERIOD DETAILS -->*************************/
/****************************************************************/
/** Get details for the giving Period ***************************/
app.get('/period_detail/:id', authenticateJWT, function( req, res ){
	let id = req.params.id;

	const detailPeriods = require('./classes/Period_Details.js');
	const detail = new detailPeriods();
	detail.get( id, function( result){
		res.status( result.status ).send( result.message );
	});
});



app.get('/period_details/:idPeriod',  authenticateJWT, function( req, res ){
	let idPeriod = req.params.idPeriod;
	const detPeriods = require('./classes/Period_Details.js');
	const detPeriod = new detPeriods();
	detPeriod.browse( idPeriod, function( result ){
		res.status( result.status).send( result.message );
	})
});



/*******************************************************/
/******************** PERIODS -->*************************/
/*******************************************************/
app.get('/periods/:idcondo', authenticateJWT, function( req, res ){
	let idcondo = req.params.idcondo;
	const Period = require('./classes/Periods.js');
	const periods = new Period();
	periods.browse( idcondo, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.get('/period/:id', authenticateJWT, function( req, res ){
	let id = req.params.id;
	const Period = require('./classes/Periods.js');
	const period = new Period();
	period.get( id, function( result ){
		res.status( result.status ).send( result.message );
	});
})

/*******************************************************/
/******************** PERIODS -->*************************/
/*******************************************************/




/*******************************************************/
/******************** Funds / (Fondos) -->*************************/
/*******************************************************/

app.get('/fund_details/:idFund', authenticateJWT, function( req, res ){
	let idFund = req.params.idFund;
	const FundDetails = require('./classes/Fund_Details.js');
	const fundDetail = new FundDetails();
	fundDetail.browse( idFund, function( result ){
		res.status( result.status ).send( result.message );
	});
});


app.get('/fund/:idFund', authenticateJWT, function( req, res ){
	let idFund = req.params.idFund;
	const Funds = require('./classes/Funds.js');
	const fund = new Funds();
	fund.get( idFund, function( result ){
		res.status( result.status ).send( result.message );
	});
});


app.get('/funds/:idCondo', authenticateJWT, function( req, res ){
	let idCondo = req.params.idCondo;
	const Funds = require('./classes/Funds.js');
	const fund = new Funds();
	fund.browse( idCondo, function( result ){
		res.status( result.status ).send( result.message );
	});
})


/*******************************************************/
/******************** PERIOD (Gestiones) -->*************************/
/*******************************************************/

app.get('/period/:id', authenticateJWT, function( req, res ){
	let id = req.params.id;
	const Periods = require('./classes/Periods.js');
	const period = new Periods();
	period.get( id, function( result){
		res.status( result.status ).send( result.message );
	});
});


app.get('/periods/:idCondo', authenticateJWT, function( req, res ){
	let idCondo = req.params.idCondo;
	const Periods = require('./classes/Periods.js');
	const period = new Periods();
	period.browse( idCondo, function( result){
		res.status( result.status ).send( result.message );
	});
});





/*******************************************************/
/*****************<-- PERIOD ***************************/
/*******************************************************/




/*******************************************************/
/******************** UNITS -->*************************/
/*******************************************************/
app.put('/unit', authenticateJWT, function ( req, res ){
	var form = new formidable.IncomingForm();
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.put( form, req, function( result ){
		if( result.hasOwnProperty( 'id') ){	
			res.status( result.status ).send( { id: result.id });
		}else{
			res.status( result.status ).send( result.message );	
		}
	});
});


app.delete('/unit/:id', authenticateJWT, function (req , res) {
	const Unit = require('./classes/Units.js');
	const delUnit = new Unit();	
	delUnit.del( req.params.id, res, function( result){
		res.status( result.status ).send( result.message );
	});
})


app.get('/unit/:id', authenticateJWT, async function ( req, res ){
	let id = req.params.id;
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.get(id, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.get('/units/:idcondo', authenticateJWT, function ( req, res ){
	let idcondo = req.params.idcondo;
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.browse( idcondo, res, function( result){
		res.status( result.status ).send( result.message );
	});
});


app.patch('/unit', authenticateJWT, function( req, res ){
	var form = new formidable.IncomingForm();
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.patch( req, form, function( result ){
		res.status( result.status ).send( result.message );
	});
});
/*********************************************************************/
/**************************<-- UNITS *********************************/
/*********************************************************************/





/*********************************************************************/
/************************** ITEMS --> *********************************/
/*********************************************************************/
app.get('/items/:id', authenticateJWT, function (req, res ){
	//:id represent the Group Id
	let groupId = req.params.id;
	const Item = require('./classes/Items.js');
	const items = new Item();
	var idcondo = 1; // TO DO
	items.browse(idcondo, groupId, function( result ){
		res.status( result.status ).send(result.message );
	});
});


app.get('/item/:id', authenticateJWT, function ( req, res ){
	let itemId = req.params.id;
	const Items = require('./classes/Items.js');
	const item = new Items();
	item.get( itemId, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.patch('/item', authenticateJWT, function( req, res ){
	var form = new formidable.IncomingForm();
	const Items = require('./classes/Items.js');
	const item = new Items();
	item.patch( req, form, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.put('/item', authenticateJWT, function( req, res ){
	var form = new formidable.IncomingForm();	
	const Items = require('./classes/Items.js');
	const item = new Items();
	item.put( form, req, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.delete('/item/:id', authenticateJWT, function( req, res ) {
	let id = req.params.id;
	const Items = require('./classes/Items.js' );
	const item = new Items();
	item.del( id, function( result ){
		res.status( result.status ).send( result.message );
	});
})
/*********************************************************************/
/************************** ITEMS --> *********************************/
/*********************************************************************/






/*********************************************************************/
/************************** GROUPS -->*********************************/
/*********************************************************************/
const Group = require('./classes/Groups.js');
const group = new Group();
app.put('/group', authenticateJWT, function( req, res ){
	var form = new formidable.IncomingForm();
	if( !form ){
		return res.sendStatus( 400 );		
	}

	form.parse( req, function( err, fields ) {
		const required = [
			'code',
			'description',
			'idcondo'
		];
		for( let field in fields ){
			if( required.indexOf( field ) == -1 ){
				res.status( 400 ).send( 'A required field is missed' );
				return;
			}
		}

		group.put( form, req, function( result ){	
			if( result.hasOwnProperty( 'id') ){
				res.status( result.status ).send( { id: result.id });
			}else{
				res.status( result.status ).send( result.message );
			}
		});
	});
});

app.get('/groups', authenticateJWT, function( req, res){
	var idcondo=1;//TO DO 
	group.browse( idcondo, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.get('/group/:id', authenticateJWT, function( req, res) {
	let id = req.params.id;
	group.get( id, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.patch('/group', authenticateJWT, function ( req, res ){
	var form = new formidable.IncomingForm();
	group.patch( req, form, function( result ){
		res.status( result.status ).send( result.message );
	});
})


app.delete('/group/:id', authenticateJWT, function( req, res ){
	let id = req.params.id;
	group.del( id, function( result ){
		res.status( result.status ).send( result.message );
	});
})
/*********************************************************************/
/**************************<-- GROUPS *********************************/
/*********************************************************************/



/*********************************************************************/
/************************** CONDO -->*********************************/
/*********************************************************************/

const Condo = require('./classes/Condos.js');
const condo = new Condo();
app.put('/condo', authenticateJWT, function( req, res ){
	console.log( 'put condo' );
})

// app.get('/condo/browse', function( req, res ){
// 	console.log( 'browsing - listing condos' );
// })

app.get('/condo/:id', authenticateJWT, function( req, res){
	let id = req.params.id;
	const Condos = require('./classes/Condos.js');	
	const condo = new Condos();	
	condo.get( id, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.get('/condo/:id/email', authenticateJWT, function( req, res ){
	let id = req.params.id;
	const condoEmail = new CondoEmail();
	condoEmail.get( id, function( result ){
		res.status( result.status).send( result.message );
	});
})


app.delete('/condo/:id', function( req, res){
	//res.send('deleting condo');
})

/** patching **/
app.patch('/condo/:id', authenticateJWT, function( req, res){
	var form = new formidable.IncomingForm();
	const Condos = require('./classes/Condos.js');	
	const condo = new Condos();
	condo.patch( req, form, function( result ){
		res.status( result.status).send( result.message );
	});
})

app.patch('/condo/:id/email', function( req, res){
	res.send('patching condo email');
})

app.patch('/condo/:id/admin', function( req, res){
	res.send('patching admin fees');
})

app.patch('/condo/:id/late', function( req, res){
	res.send('patching late fees');
})

app.patch('/condo/:id/board', function( req, res){
	res.send('patching condo board');
})
/*********************************************************************/
/**************************<-- CONDO *********************************/
/*********************************************************************/




/*********************************************************************/
/************************** CONTACT -->*******************************/
/*********************************************************************/
app.post('/contact', function (req, res ){
	var form = new formidable.IncomingForm();
	form.parse( req, function (err, data ){
		const msg = {
			from: 'siscond@hotmail.com',
			to: 'tucondominioaldia@gmail.com',
			subject: data['subject'],
			html: 'My name is: ' + data['name'] + '<br>My Email is: ' + data['email'] + '<br>The Message: ' + data['message']
		}
		//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		//sgMail.send(msg);

		if( err ) {
		res.send(err) 
		return err;
		} 
		res.status(200).send('sent');
	})

})
 
/*********************************************************************/
/**************************<-- CONTACT *******************************/
/*********************************************************************/


/*********************************************************************/
/************************** MARKETSTACK -->***************************/
/*********************************************************************/
app.get('/mkstack/eod', authenticateJWT, async function( req, res ){
	//https://api.marketstack.com/v1/tickers?access_key=0f7d3506fa8995f146c02f4e40bd63e4&symbols=AAPL
	//https://api.marketstack.com/v1/exchanges?access_key=0f7d3506fa8995f146c02f4e40bd63e4&symbols=AAPL

	const eodurl = 'https://api.marketstack.com/v1/eod?access_key=0f7d3506fa8995f146c02f4e40bd63e4&symbols=AAPL&limit=20';
	const response = await fetch( eodurl );
	const result = await response.json();
	
	/*const result = [
		{
			"open": 213.9,
			"high": 215.69,
			"low": 213.53,
			"close": 213.76,
			"volume": 45773373,
			"adj_high": 215.69,
			"adj_low": 213.53,
			"adj_close": 213.76,
			"adj_open": 213.9,
			"adj_volume": 46022620,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-24T00:00:00+0000"
		},
		{
			"open": 215.045,
			"high": 215.1,
			"low": 212.41,
			"close": 214.15,
			"volume": 46415026,
			"adj_high": 215.15,
			"adj_low": 212.41,
			"adj_close": 214.15,
			"adj_open": 215,
			"adj_volume": 46989301,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-23T00:00:00+0000"
		},
		{
			"open": 213.14,
			"high": 214.95,
			"low": 212.23,
			"close": 214.4,
			"volume": 46300400,
			"adj_high": 214.95,
			"adj_low": 212.2301,
			"adj_close": 214.4,
			"adj_open": 213.14,
			"adj_volume": 46404072,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-22T00:00:00+0000"
		},
		{
			"open": 212.05,
			"high": 215.78,
			"low": 211.6409,
			"close": 212.48,
			"volume": 51064253,
			"adj_high": 215.78,
			"adj_low": 211.63,
			"adj_close": 212.48,
			"adj_open": 212.1,
			"adj_volume": 51377434,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-21T00:00:00+0000"
		},
		{
			"open": 210.87,
			"high": 211.79,
			"low": 209.7,
			"close": 211.18,
			"volume": 48939500,
			"adj_high": 211.79,
			"adj_low": 209.7045,
			"adj_close": 211.18,
			"adj_open": 210.87,
			"adj_volume": 48974591,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-18T00:00:00+0000"
		},
		{
			"open": 210.625,
			"high": 211.8,
			"low": 209.59,
			"close": 210.02,
			"volume": 47738194,
			"adj_high": 211.8,
			"adj_low": 209.59,
			"adj_close": 210.02,
			"adj_open": 210.57,
			"adj_volume": 48068141,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-17T00:00:00+0000"
		},
		{
			"open": 210.29,
			"high": 212.4,
			"low": 208.64,
			"close": 210.16,
			"volume": 47148580,
			"adj_high": 212.4,
			"adj_low": 208.64,
			"adj_close": 210.16,
			"adj_open": 210.295,
			"adj_volume": 47490532,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-16T00:00:00+0000"
		},
		{
			"open": 209.15,
			"high": 211.89,
			"low": 208.92,
			"close": 209.11,
			"volume": 42071894,
			"adj_high": 211.89,
			"adj_low": 208.92,
			"adj_close": 209.11,
			"adj_open": 209.22,
			"adj_volume": 42296339,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-15T00:00:00+0000"
		},
		{
			"open": 209.909,
			"high": 210.91,
			"low": 207.54,
			"close": 208.62,
			"volume": 37683849,
			"adj_high": 210.91,
			"adj_low": 207.54,
			"adj_close": 208.62,
			"adj_open": 209.925,
			"adj_volume": 38840111,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-14T00:00:00+0000"
		},
		{
			"open": 210.57,
			"high": 212.13,
			"low": 209.86,
			"close": 211.16,
			"volume": 39719300,
			"adj_high": 212.13,
			"adj_low": 209.86,
			"adj_close": 211.16,
			"adj_open": 210.565,
			"adj_volume": 39765812,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-11T00:00:00+0000"
		},
		{
			"open": 210.505,
			"high": 213.48,
			"low": 210.12,
			"close": 212.41,
			"volume": 43770740,
			"adj_high": 213.48,
			"adj_low": 210.03,
			"adj_close": 212.41,
			"adj_open": 210.505,
			"adj_volume": 44443635,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-10T00:00:00+0000"
		},
		{
			"open": 209.53,
			"high": 211.33,
			"low": 207.22,
			"close": 211.14,
			"volume": 48408519,
			"adj_high": 211.33,
			"adj_low": 207.22,
			"adj_close": 211.14,
			"adj_open": 209.53,
			"adj_volume": 48749367,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-09T00:00:00+0000"
		},
		{
			"open": 210.13,
			"high": 211.43,
			"low": 208.45,
			"close": 210.01,
			"volume": 42036884,
			"adj_high": 211.43,
			"adj_low": 208.45,
			"adj_close": 210.01,
			"adj_open": 210.1,
			"adj_volume": 42848928,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-08T00:00:00+0000"
		},
		{
			"open": 212.68,
			"high": 216.23,
			"low": 208.8,
			"close": 209.95,
			"volume": 49905104,
			"adj_high": 216.23,
			"adj_low": 208.8,
			"adj_close": 209.95,
			"adj_open": 212.68,
			"adj_volume": 50228984,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-07T00:00:00+0000"
		},
		{
			"open": 212.145,
			"high": 214.65,
			"low": 211.8101,
			"close": 213.55,
			"volume": 34955836,
			"adj_high": 214.65,
			"adj_low": 211.8101,
			"adj_close": 213.55,
			"adj_open": 212.145,
			"adj_volume": 34955836,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-03T00:00:00+0000"
		},
		{
			"open": 209.08,
			"high": 213.34,
			"low": 208.14,
			"close": 212.44,
			"volume": 67834447,
			"adj_high": 213.34,
			"adj_low": 208.14,
			"adj_close": 212.44,
			"adj_open": 208.91,
			"adj_volume": 67941811,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-02T00:00:00+0000"
		},
		{
			"open": 206.665,
			"high": 210.1865,
			"low": 206.1401,
			"close": 207.82,
			"volume": 77921627,
			"adj_high": 210.1865,
			"adj_low": 206.1401,
			"adj_close": 207.82,
			"adj_open": 206.665,
			"adj_volume": 78788867,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-07-01T00:00:00+0000"
		},
		{
			"open": 202.01,
			"high": 207.39,
			"low": 199.2607,
			"close": 205.17,
			"volume": 90651078,
			"adj_high": 207.39,
			"adj_low": 199.2607,
			"adj_close": 205.17,
			"adj_open": 202.01,
			"adj_volume": 91912816,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-06-30T00:00:00+0000"
		},
		{
			"open": 201.89,
			"high": 203.22,
			"low": 200,
			"close": 201.08,
			"volume": 73114100,
			"adj_high": 203.22,
			"adj_low": 200,
			"adj_close": 201.08,
			"adj_open": 201.89,
			"adj_volume": 73188571,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "XNAS",
			"date": "2025-06-27T00:00:00+0000"
		},
		{
			"open": 201.43,
			"high": 202.615,
			"low": 199.46,
			"close": 201,
			"volume": 50117398,
			"adj_high": 202.64,
			"adj_low": 199.46,
			"adj_close": 201,
			"adj_open": 201.43,
			"adj_volume": 50799121,
			"split_factor": 1,
			"dividend": 0,
			"symbol": "AAPL",
			"exchange": "test",
			"date": "2025-06-26T00:00:00+0000"
		}
	];*/
	res.status( 200 ).send( result.data );//fix result.data
})



//var port = 80;
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Condo server is running at '+ port);