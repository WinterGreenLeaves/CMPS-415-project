const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    notifications: [{
        type: String
    }],
    colorPreferences: {
        primaryColor: { type: String, default: '#291e91' },
        accentColor: { type: String, default: '#efdf88' },
        backgroundColor: { type: String, default: '#000000' },
        textColor: { type: String, default: '#9eb4ed' },
        headerColor: { type: String, default: '#271274' }
    }
}, { timestamps: true }); 

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);