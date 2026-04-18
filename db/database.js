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
            console.error("❌ MONGO_URI is not set in environment variables");
            process.exit(1);
        }

        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("✅ MongoDB connected"))
            .catch(err => {
                console.error("❌ MongoDB connection error:", err);
                process.exit(1);
            });
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;