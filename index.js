const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

const corsOptions = {
	origin: '*',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
	res.end('Hello, This server is Used by Puneet56 to host his apps.');
});

//todos app
app.use('/todos', require('./Todos_App/routes/todos'));

app.listen(process.env.PORT || port, () => {
	console.log(`Listening.....`);
});
