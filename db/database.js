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
        if (!process.env.MONGO_URI) { 
            console.warn("⚠️ Running in UI Test Mode (No Database Connection)");
            this.connection = null;
            return;
        }

        mongoose.connect(process.env.MONGO_URI) 
            .then(() => console.log("✅ MongoDB connected"))
            .catch(err => {
                console.error("❌ MongoDB connection error:", err);
            });
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;