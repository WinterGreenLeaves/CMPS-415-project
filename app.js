require('dotenv').config();
const express = require('express');
const session = require('express-session');
require('./db/database');

const authRoutes = require('./Routes/authRoute');
const dashboardRoutes = require('./Routes/dashboardRoute'); 
const viewRoutes = require('./Routes/viewRoute');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './Views');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false
}));

app.use('/auth', authRoutes); 
app.use('/', dashboardRoutes);
app.use('/', viewRoutes);

app.use((req, res) => {
    res.status(404).send('<html><body><h1>404 - Page Not Found</h1><p><a href="/login">Return to Home</a></p></body></html>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});