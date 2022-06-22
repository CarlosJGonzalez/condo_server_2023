const express = require('express');
const app = express();
const cors = require("cors");
const CondoEmail = require('./classes/CondoEmail.js');
const sgMail = require('@sendgrid/mail');
app.use(cors({origin: '*'}));
require('dotenv').config();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    next();
});

var formidable = require('formidable');
const perpage = 30;


//this one is used to know server status
app.get('/', function (req, res) {
	res.send('Server online');
	//redirect to home page
})

/*******************************************************/
/******************** Funds / (Fondos) -->*************************/
/*******************************************************/

app.get('/fund_details/:idFund', function( req, res ){
	let idFund = req.params.idFund;
	const FundDetails = require('./classes/Fund_Details.js');
	const fundDetail = new FundDetails();
	fundDetail.browse( idFund, function( result ){
		res.status( result.status ).send( result.message );
	});
});


app.get('/fund/:idFund', function( req, res ){
	let idFund = req.params.idFund;
	const Funds = require('./classes/Funds.js');
	const fund = new Funds();
	fund.get( idFund, function( result ){
		res.status( result.status ).send( result.message );
	});
});


app.get('/funds/:idCondo', function( req, res ){
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

app.get('/period/:id', function( req, res ){
	let id = req.params.id;
	const Periods = require('./classes/Periods.js');
	const period = new Periods();
	period.get( id, function( result){
		res.status( result.status ).send( result.message );
	});
});


app.get('/periods/:idCondo', function( req, res ){
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
app.put('/unit', function ( req, res ){
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


app.delete('/unit/:id', function (req , res) {
	const Unit = require('./classes/Units.js');
	const delUnit = new Unit();	
	delUnit.del( req.params.id, res, function( result){
		res.status( result.status ).send( result.message );
	});
})


app.get('/unit/:id', async function ( req, res ){
	let id = req.params.id;
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.get(id, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.get('/units/:idcondo', function ( req, res ){
	let idcondo = req.params.idcondo;
	const Unit = require('./classes/Units.js');
	const unit = new Unit();
	unit.browse( idcondo, res, function( result){
		res.status( result.status ).send( result.message );
	});
});


app.patch('/unit', function( req, res ){
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
app.get('/items/:id', function (req, res ){
	//:id represent the Group Id
	let groupId = req.params.id;
	const Item = require('./classes/Items.js');
	const items = new Item();
	var idcondo = 1; // TO DO
	items.browse(idcondo, groupId, function( result ){
		res.status( result.status ).send(result.message );
	});
});


app.get('/item/:id', function ( req, res ){
	let itemId = req.params.id;
	const Items = require('./classes/Items.js');
	const item = new Items();
	item.get( itemId, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.patch('/item', function( req, res ){
	var form = new formidable.IncomingForm();
	const Items = require('./classes/Items.js');
	const item = new Items();
	item.patch( req, form, function( result ){
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
app.put('/group', function( req, res ){
	var form = new formidable.IncomingForm();
	group.put( form, req, function( result ){	
		if( result.hasOwnProperty( 'id') ){
			res.status( result.status ).send( { id: result.id });
		}else{
			res.status( result.status ).send( result.message );
		}
	});
});

app.get('/groups', function( req, res){
	var idcondo=1;//TO DO 
	group.browse( idcondo, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.get('/group/:id', function( req, res) {
	let id = req.params.id;
	group.get( id, function( result ){
		res.status( result.status ).send( result.message );
	});
});

app.patch('/group', function ( req, res ){
	var form = new formidable.IncomingForm();
	group.patch( req, form, function( result ){
		res.status( result.status ).send( result.message );
	});
})


app.delete('/group/:id', function( req, res ){
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
app.put('/condo', function( req, res ){
	console.log( 'put condo' );
})

// app.get('/condo/browse', function( req, res ){
// 	console.log( 'browsing - listing condos' );
// })

app.get('/condo/:id', function( req, res){
	let id = req.params.id;
	const Condos = require('./classes/Condos.js');	
	const condo = new Condos();	
	condo.get( id, function( result ){
		res.status( result.status ).send( result.message );
	});
})

app.get('/condo/:id/email', function( req, res ){
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
app.patch('/condo/:id', function( req, res){
	//res.send('patching condo info');
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
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		sgMail.send(msg);

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
const port = process.env.port || 5000;
var server = app.listen(port, function () {
   //var hostadd = server.address().address;
   var port = server.address().port;
   //console.log("server.js running http://127.0.0.1:80", hostadd, port)
})