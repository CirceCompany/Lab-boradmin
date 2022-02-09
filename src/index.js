const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const mysql = require('mysql');
const socketio =  require('socket.io');
const passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
//Inicializar 
const { database } = require('./keys');

const app =  express();
require('./lib/passport');

//configuraciones 


app.set('port', process.env.PORT || 4000); // configuracion del puerto
app.set('views', path.join(__dirname, 'views')); // configuracion de la carpeta views (ubicacion)
app.engine('.hbs', handlebars({ // tipo de views config
    defaultLayout: 'main', // el archivo
     layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({secret: '{secret}', name: 'session_id', saveUninitialized: true, resave: true,  store: new MySQLStore(database)}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//variables globales
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//rutas 

app.use(require('./routes/routes.js'));
app.use(require('./routes/authentication'));



//public
app.use(express.static(path.join(__dirname, 'public')));
//start server
app.listen(app.get('port'), () =>{
    console.log('server on port', app.get('port'));
})
