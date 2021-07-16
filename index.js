const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signin', (req, res) => {
	console.info(`/signin username: ${req.body.username} password: ${req.body.password}`);
	res.json({ token: '__token__' });
});

app.post('/signout', (req, res) => {
	console.info(`/signout token: ${req.get('Authorization')}`);
	res.sendStatus(200);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
