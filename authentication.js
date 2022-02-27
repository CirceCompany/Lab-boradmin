const express =  require('express');
const router = express.Router();
const passport = require('passport');

const { isNotLoggedIn, isLoggedIn} = require('../lib/auth');

//Registro Problematico

router.get('/registro', (req,res) =>{
    res.render('authentication/registro')
});

router.post('/registro', passport.authenticate('local.registro',{
    successRedirect: '/login',
    failureRedirect: '/registro',
    failureFlash: true
}));

router.get('/profile', (req, res) =>{
    res.send('Listo')
})

//Login

router.get('/login', (req, res) =>{
    res.render('authentication/login');
});

router.post('/login', (req, res , next)=>{

    passport.authenticate('local.login',{
        successRedirect: '/',
        failureRedirect: '/registro',
        failureFlash: true
    })(req, res, next);
});

//Cerrar Login
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
});


//login admin y Registro admin

router.get('/Admin', (req, res) =>{
    res.render('authentication/adminlogin');
});

module.exports = router;