const express =  require('express');
const router = express.Router();

const pool = require('../database');

router.get('/admin', (req, res) =>{
    res.render('admin/Index');
})

router.get('/adminUsers', (req, res) =>{
    res.render('admin/Usuarios');
})

router.get('/adminPermisos', (req, res) =>{
    res.render('admin/Permisos');
})
module.exports = router;