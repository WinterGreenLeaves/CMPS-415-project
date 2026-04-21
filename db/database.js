const mongoose = require('mongoose');

class Database {
    constructor() {
        if (!Database.instance) {
            this._connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    _connect() {
        // temporarily bypass the database requirement
        if (!process.env.MONGODB_URI) {
            console.log("⚠️ Running in UI Test Mode (No Database Connection)");
            return; // use return instead of process.exit(1)
        }

        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log("✅ MongoDB connected"))
            .catch(err => {
                console.error("❌ MongoDB connection error:", err);
            });
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;