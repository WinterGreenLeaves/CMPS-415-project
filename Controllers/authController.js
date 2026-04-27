const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <br><a href="/register">Try again</a>');
        }

        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).send('Username already taken. <br><a href="/register">Try again</a>');
        }
 
        const user = new User({ username, password });
        await user.save();
 
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Registration failed: ' + err.message);
    }
};
 
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
 
        if (!username || !password) {
            return res.status(400).send('Username and password are required. <br><a href="/login">Try again</a>');
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password. <br><a href="/login">Try again</a>');
        }
 
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password. <br><a href="/login">Try again</a>');
        }
 
        req.session.userId = user._id;
        req.session.username = user.username;
 
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Login failed: ' + err.message);
    }
};
 
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/login');
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy session:", err);
            return res.status(500).send("Could not log out.");
        }
        res.redirect('/login');
    });
};