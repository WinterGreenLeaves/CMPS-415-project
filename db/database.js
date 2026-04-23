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
        // 1. Check for the key using Bryant's name
        if (!process.env.MONGO_URI) { 
            console.warn("⚠️ Running in UI Test Mode (No Database Connection)");
            this.connection = null;
            return;
        }

        // 2. Actually USE the key with the SAME name
        mongoose.connect(process.env.MONGO_URI) // This was still MONGODB_URI in your snippet
            .then(() => console.log("✅ MongoDB connected"))
            .catch(err => {
                console.error("❌ MongoDB connection error:", err);
            });
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;