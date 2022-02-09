const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'user',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, user, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [user]);
   if (rows.length > 0) {
    const usuario = rows[0];
    
    const validPassword = await helpers.matchPassword(password, usuario.Password)
    
    if (validPassword) {
      done(null, usuario, req.flash('success', 'Welcome ' + usuario.Username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password',
  passReqToCallback: true
}, async (req, Username, Password, done) => {

  const { EmployeeId } = req.body;
  let newUser = {
    EmployeeId,
    Username,
    Password
  };
  newUser.Password = await helpers.encryptPassword(Password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});