const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	console.log(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

// __dirname is available by default in CommonJS
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.use('/public', express.static(path.join(__dirname + '/public')));

app.get('/json', (req, res) => {
	const jsonData = { message: 'Hello json' };
	jsonData.message =
		process.env.MESSAGE_STYLE === 'uppercase'
			? jsonData.message.toUpperCase()
			: jsonData.message;
	res.json(jsonData);
});

app.get(
	'/now',
	(req, res, next) => {
		req.time = new Date().toString();
		next();
	},
	(req, res) => {
		res.json({ time: req.time });
	}
);

app.get('/:word/echo', (req, res) => {
	res.json({ echo: req.params.word });
});

app.route('/name')
	.get((req, res) => {
		res.json({ name: `${req.query.first} ${req.query.last}` });
	})
	.post((req, res) => {
		res.json({ name: `${req.body.first} ${req.body.last}` });
	});

module.exports = app;
