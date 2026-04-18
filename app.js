const express = require('express');
require('./db/database');

const User = require('./models/User');

const app = express();

app.use(express.json());

// ✅ Test route to create a user
app.get('/test-user', async (req, res) => {
    try {
        const user = await User.create({
            username: "ben_test",
            password: "1234"
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send("✅ Server running and MongoDB connected");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});