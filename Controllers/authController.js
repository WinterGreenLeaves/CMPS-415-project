const User = require('../models/User');

//new user account
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
 
        //check if username is taken
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' });
        }
 
        //create user
        const user = new User({ username, password });
        await user.save();
 
        res.status(201).json({ message: 'Account created', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    }
};
 
//login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
 
        //find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
 
        //compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
 
        //store userId
        req.session.userId = user._id;
        req.session.username = user.username;
 
        res.json({ message: 'Logged in', userId: user._id, username: user.username });
    } catch (err) {
        res.status(500).json({ error: 'Login failed: ' + err.message });
    }
};
 
//logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
};