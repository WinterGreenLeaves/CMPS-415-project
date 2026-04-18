const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    accessCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);