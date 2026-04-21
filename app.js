require('dotenv').config();
const express = require('express');
const session = require('express-session');
require('./db/database');

//route imports
const authRoutes = require('./Routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();

app.use(express.json());

//session cookie
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretcookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } 
}));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

//routes
app.get('/', (req, res) => {
    res.json({
        message: 'Server running and MongoDB connected',
        routes: {
            register:  'POST /auth/register   { username, password }',
            login:     'POST /auth/login      { username, password }',
            logout:    'POST /auth/logout',
            dashboard: 'GET  /dashboard       (must be logged in)'
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});