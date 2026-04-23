const User = require('../models/User');

//new user account
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <br><a href="/register">Try again</a>');
        }
 
        //check if username is taken
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).send('Username already taken. <br><a href="/register">Try again</a>');
        }
 
        //create user
        const user = new User({ username, password });
        await user.save();
 
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Registration failed: ' + err.message);
    }
};
 
//login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <br><a href="/login">Try again</a>');
        }
 
        //find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password. <br><a href="/login">Try again</a>');
        }
 
        //compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password. <br><a href="/login">Try again</a>');
        }
 
        //store userId
        req.session.userId = user._id;
        req.session.username = user.username;
 
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Login failed: ' + err.message);
    }
};
 
//logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/login');
    });
};