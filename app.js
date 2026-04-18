const express = require('express');
require('./db/database');

const User = require('./models/User');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("✅ Server running and MongoDB connected");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});