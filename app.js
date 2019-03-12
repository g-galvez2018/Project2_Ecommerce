require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//const flash        = require('connect-flash');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// import passport docs from config folder
const passportSetup =  require('./config/passport/passport-setup');

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



//Register partials
hbs.registerPartials(__dirname + '/views/partials');



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// handle session here:
// app.js
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 180 * 60 * 1000}
}));

// Global Variables
app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated;
  res.locals.session = req.session;
  next();
})

//Flash Messages
//app.use(flash());

// 🎯🎯🎯 MUST come after the session: 🎯🎯🎯
passportSetup(app);



//Routes
const index = require('./routes/index');
const adminRoutes = require('./routes/admin-route');
const shopRoutes = require('./routes/shop-route');
const authroutes = require('./routes/auth-routes.js');


app.use('/', index);
app.use('/admin', checkAdmin(), adminRoutes);
app.use('/shop', shopRoutes);
app.use('/auth', authroutes);


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkAdmin() {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == true) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}


module.exports = app;
