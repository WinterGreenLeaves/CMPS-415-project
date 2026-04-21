require('dotenv').config();
const express = require('express');
const session = require('express-session');
require('./db/database');

//route imports
const authRoutes = require('./Routes/authRoute');
const dashboardRoutes = require('./Routes/dashboardRoute'); 
const viewRoutes = require('./Routes/viewRoute');

const app = express();

//view setup
app.set('view engine', 'ejs');
app.set('views', './Views');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false
}));

//routes
app.use('/', authRoutes); 
app.use('/', dashboardRoutes);
app.use('/', viewRoutes);

//error fallback
app.use((req, res) => {
    res.status(404).send('<html><body><h1>404 - Page Not Found</h1><p><a href="/login">Return to Home</a></p></body></html>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});