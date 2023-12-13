const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const session = require('express-session');
const auth = require('./auth/auth');
const passport = require('passport');

//app.use(session({ secret: 'dont tell anyone', resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());
//auth.init(app);

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  }));
  

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const router = require('./routes/appRoutes');
app.use('/', router);

app.listen(3000, () => {
console.log('Server started on port 3000. Ctrl^c to quit.');
})