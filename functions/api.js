const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();

const path = require('path');
const cors = require('cors');

const Datastore = require('nedb');

const db = new Datastore('../database.db');
db.loadDatabase();

const app = express();
router.use(cors());
// const port = 3001;

router.use(express.json());

router.get('/todos', (req, res) => {
	console.log('got a fetch req');
	db.find({}, (error, data) => {
		if (error) {
			console.log(error);
			return;
		}
		res.json(data);
	});
});

router.post('/todos', (req, res) => {
	console.log('got a post req');
	db.insert(req.body);
	res.end();
});

router.post('/todos/complete', (req, res) => {
	console.log('got a request');
	db.update(
		{ id: req.body.id },
		{ $set: { completed: true } },
		{},
		function (err, numReplaced) {
			console.log(err);
			console.log(numReplaced);
		}
	);
	res.end();
});
router.post('/todos/delete', (req, res) => {
	console.log('got a request');
	db.remove({ id: req.body.id }, {}, function (err, numRemoved) {
		console.log(numRemoved);
	});
	res.end();
});

db.persistence.compactDatafile();

app.use('/.netlify/functions/api', router);

// app.listen(port, () => {
// 	console.log(`Listening.....`);
// });

module.exports.handler = serverless(app);
