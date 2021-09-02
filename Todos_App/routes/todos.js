const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.use(express.json());

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

router.use(cors(corsOptions));

//databases import
const Datastore = require('nedb');
const db = new Datastore('../db_todos/database.db');
db.loadDatabase();

//clear data files

//Send todos of user
router.post('/gettodos', (req, res) => {
	console.log('App started, all tasks sent');
	db.find({ email: req.body.email }, (error, data) => {
		if (error) {
			console.log(error);
			return;
		}
		res.json(data);
	});
});

//Add tasks to database
router.post('/settodos', (req, res) => {
	console.log('Task added-', req.body.title);
	db.insert(req.body);
	res.end();
});

//Set task as completed using task Id
router.post('/complete', (req, res) => {
	console.log('Task completed-', req.body.title);
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

//deletes task from database using task Id
router.post('/delete', (req, res) => {
	console.log('Task deleted-', req.body.id);
	db.remove({ id: req.body.id }, {}, function (err, numRemoved) {
		console.log(numRemoved);
	});
	res.end();
});

router.use('/', require('./users.js'));

db.persistence.compactDatafile();
module.exports = router;
