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
    }]
}, { timestamps: true }); 
//hash password before saving
userSchema.pre('save', async function() {
    // If the password hasn't changed, just return (no next needed)
    if (!this.isModified('password')) return;
    
    // Hash it and wait for it to finish
    this.password = await bcrypt.hash(this.password, 10);
});
//check password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);