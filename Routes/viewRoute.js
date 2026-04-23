const express = require('express');
const router = express.Router();

//login
router.get('/', (req, res) => {
    res.redirect('/login');
});

//login view
router.get('/login', (req, res) => {
    res.render('login');
});

//register view
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;