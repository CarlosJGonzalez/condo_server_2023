const express = require('express');
const app = express();
const cors = require("cors");
const CondoEmail = require('./classes/CondoEmail.js');
const jwt = require('jsonwebtoken');

const authenticateJWT = ( req, res, next ) => {
	const authHeader = req.headers.authorization;
	var tokenParts = null;
	if( authHeader ){
		tokenParts = authHeader.split(" ");
	}

	if( tokenParts && tokenParts[0] === "Bearer" && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null ){
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


app.use(cors({ origin: ['https://condo-online.herokuapp.com','http://localhost:8081', '*'] }));
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
				if( result.status != 200 ){
					return res.status( result.status ).send( result.message );
				}
			}, 
			user.getUserId ( email, pwd, function( result ){
				res.status( result.status ).send( result.message );
				next();
			})
		);
	});
});



app.get('/user/role/:id', function( req, res ){
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
app.patch('/condo/:id',  function( req, res){
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


//var port = 80;
const port = process.env.PORT || 5000;
app.listen(port);
console.log('running at '+ port);