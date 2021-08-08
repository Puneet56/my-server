const express = require('express');
// const serverless = require('serverless-http');
const path = require('path');
const cors = require('cors');

const Datastore = require('nedb');

const db = new Datastore('./database.db');
db.loadDatabase();

const app = express();
const port = 3001;
app.use(cors());

app.use(express.json());

app.get('/todos', (req, res) => {
	console.log('got a fetch req');
	db.find({}, (error, data) => {
		if (error) {
			console.log(error);
			return;
		}
		res.json(data);
	});
});

app.post('/todos/complete', (req, res) => {
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
app.post('/todos/delete', (req, res) => {
	console.log('got a request');
	db.remove({ id: req.body.id }, {}, function (err, numRemoved) {
		console.log(numRemoved);
	});
	res.end();
});

db.persistence.compactDatafile();

app.listen(process.env.PORT || port, () => {
	console.log(`Listening.....`);
});
