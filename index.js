const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const Datastore = require('nedb');

const db = new Datastore('./database.db');
db.loadDatabase();
const users = new Datastore('./users.db');
users.loadDatabase();

const app = express();
const port = 3001;
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
	res.end('Hello, This server is Used by Puneet56 to host his apps.');
});

app.post('/todos/gettodos', (req, res) => {
	console.log('App started, all tasks sent');
	db.find({ email: req.body.email }, (error, data) => {
		if (error) {
			console.log(error);
			return;
		}
		res.json(data);
	});
});

app.post('/todos/settodos', (req, res) => {
	console.log('Task added-', req.body.title);
	db.insert(req.body);
	res.end();
});

app.post('/todos/complete', (req, res) => {
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
app.post('/todos/delete', (req, res) => {
	console.log('Task deleted-', req.body.id);
	db.remove({ id: req.body.id }, {}, function (err, numRemoved) {
		console.log(numRemoved);
	});
	res.end();
});

app.post('/todos/login', (req, res) => {
	console.log('login requested');
	users.find({ email: req.body.email }, (error, user) => {
		if (error) {
			console.log('Error happened', error);
			res.json({ status: 'Server error.Try after some time' });
		} else if (user.length >= 1) {
			console.log('user found');
			console.log(user[0]);
			const passwordCheck = bcrypt.compareSync(
				req.body.password,
				user[0].password
			);
			if (passwordCheck) {
				console.log('password ok');
				res.json({
					status: 'Log in Sucessfull',
					username: user[0].username,
					email: user[0].email,
				});
			} else {
				console.log('password not ok');
				res.json({ status: 'Wrong Password' });
			}
		} else {
			console.log('user not found');
			res.json({ status: 'User Does not exist, Please SignUp' });
		}
	});
});

app.post('/todos/signup', async (req, res) => {
	console.log(req.body);
	const password = await bcrypt.hash(req.body.password, 12);

	users.find({ email: req.body.email }, (error, user) => {
		if (error) {
			console.log(error);
			res.error();
		} else if (user.length >= 1) {
			console.log(user);
			res.json({ status: 'Email Already Axists' });
		} else {
			console.log('OK', user);
			const data = {
				username: req.body.username,
				email: req.body.email,
				password: password,
			};
			users.insert(data);
			res.json({
				status: 'Signup Sucessfull',
				username: data.username,
				email: data.email,
			});
		}
	});
});

db.persistence.compactDatafile();
users.persistence.compactDatafile();

app.listen(process.env.PORT || port, () => {
	console.log(`Listening.....`);
});
