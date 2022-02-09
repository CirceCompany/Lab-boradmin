const express =  require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');

router.get('/', async (req, res) =>{
   
        res.render('authentication/login');
    
})




module.exports = router;