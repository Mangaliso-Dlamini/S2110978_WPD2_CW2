const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/appRoutes');
app.use('/', router);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, () => {
console.log('Server started on port 3000. Ctrl^c to quit.');
})