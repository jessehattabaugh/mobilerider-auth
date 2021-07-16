const express = require('express');
const app = express();
const port = 8080;

const db = require('diskdb');
db.connect('./db', ['users', 'sessions']);

const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signin', (req, res) => {
	console.info(`/signin username: ${req.body.username} password: ${req.body.password}`);
	const user = db.users.findOne({ username: req.body.username });
	if (user.password === req.body.password) {
		const token = uuidv4();
		db.sessions.save({ username: user.username, token: token });
		res.json({ token: token });
	} else {
		res.sendStatus(401);
	}
});

app.post('/signout', (req, res) => {
	console.info(`/signout token: ${req.get('Authorization')}`);
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
