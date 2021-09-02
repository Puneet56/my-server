const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.use(express.json());
router.use(cors());

const Datastore = require('nedb');
const users = new Datastore('../db_todos/users.db');
users.loadDatabase();

//login
router.post('/login', (req, res) => {
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

//Signup
router.post('/signup', async (req, res) => {
	console.log('signup request');
	console.log(req.body);
	const password = await bcrypt.hash(req.body.password, 12);

	users.find({ email: req.body.email }, (error, user) => {
		if (error) {
			console.log(error);
			res.error();
		} else if (user.length >= 1) {
			console.log(user);
			res.json({ status: 'Email Already Exists' });
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

users.persistence.compactDatafile();

module.exports = router;
