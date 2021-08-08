const express = require('express');
const path = require('path');
const cors = require('cors');

const Datastore = require('nedb');

const db = new Datastore('database.db');
db.loadDatabase();

const app = express();
app.use(cors());
const port = 3001;

app.use(express.json());

app.get('/api', (req, res) => {
	console.log('got a fetch req');
	db.find({}, (error, data) => {
		if (error) {
			console.log(error);
			return;
		}
		res.json(data);
	});
});

app.post('/api', (req, res) => {
	console.log('got a post req');
	db.insert(req.body);
	res.end();
});

app.post('/api/complete', (req, res) => {
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

app.post('/api/delete', (req, res) => {
	console.log('got a request');
	db.remove({ id: req.body.id }, {}, function (err, numRemoved) {
		console.log(numRemoved);
	});
	res.end();
});

db.persistence.compactDatafile();

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
