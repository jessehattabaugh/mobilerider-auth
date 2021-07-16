const express = require('express');
const app = express();
const port = 8080;

const db = require('diskdb');
db.connect('./db', ['users', 'sessions']);

const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signin', (req, res) => {
	const { username, password } = req.body;
	console.info(`/signin username: ${username} password: ${password}`);
	const user = db.users.findOne({ username });
	if (user.password === password) {
		const ongoingSessions = db.sessions.find({ username: user.username, signed_out_at: null });
		if (ongoingSessions.length) {
			res.sendStatus(401);
		} else {
			const token = uuidv4();
			db.sessions.save({ username: user.username, token });
			res.json({ token });
		}
	} else {
		res.sendStatus(401);
	}
});

app.post('/signout', (req, res) => {
	const token = req.get('authorization').split(' ')[1]; // "Bearer [token]"
	console.info(`/signout token: ${token}`);
	db.sessions.update({ token }, { signed_out_at: Date.now() });
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
