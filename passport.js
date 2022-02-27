const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');


//REGISTRO PROBLEMATICO JESCI :(
passport.use('local.registro', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser ={
      username,
      password,
      fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});


//LOGIN SOLO FALTA LO DE ID ADMIN QUE NO SE COMO HACER ESO JESCI YA TIENE EL DE USUARIO NORMAL
passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, usernmae, password, done) =>{
    console.log(req.body)
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [usernmae]);
    if (rows.length > 0){
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password);
      if (validPassword){
        done(null, user, req.flash('succes','Bienvenido' + user.username));
      }else{
        done(null, false, req.flash('message','Contraseña Invalida'));
      }
    }else{
      return done(null, false, req.flash('message','Usuario Invalido'));
    }
}));