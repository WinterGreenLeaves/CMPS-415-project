const User = require('../models/User');
const Topic = require('../models/Topic');
const Message = require('../models/Message');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
 
        const subscribedTopics = [];
 
        for (const topicId of user.subscriptions) {
            const topic = await Topic.findById(topicId);
            if (!topic) continue;
 
            topic.accessCount += 1;
            await topic.save();
 
            const messages = await Message.find({ topic: topicId })
                .sort({ createdAt: -1 })
                .limit(2)
                .populate('author', 'username');
 
            subscribedTopics.push({
                _id: topic._id,
                name: topic.title, 
                messages: messages 
            });
        }
 
        const allTopics = await Topic.find({
            _id: { $nin: user.subscriptions }
        }, 'title');
 
        res.render('dashboard', {
            username: user.username,
            user: user,
            topics: subscribedTopics, 
            availableTopics: allTopics,
            notifications: user.notifications
        });
    } catch (err) {
        res.status(500).send('Failed to load dashboard: ' + err.message);
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const topics = await Topic.find({}).sort({ accessCount: -1 });
        res.render('statistics', { topics: topics });
    } catch (err) {
        res.status(500).send('Failed to load statistics: ' + err.message);
    }
};

exports.createTopic = async (req, res) => {
    try {
        const { topicName } = req.body; 
        const userId = req.session.userId;

        const newTopic = new Topic({
            title: topicName,
            subscribers: [userId], 
            accessCount: 0
        });
        await newTopic.save();

        await User.findByIdAndUpdate(userId, {
            $push: { subscriptions: newTopic._id }
        });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ error: 'Failed to create topic: ' + err.message });
    }
};

exports.postMessage = async (req, res) => {
    try {
        const { topicId, messageText } = req.body;
        const message = new Message({ 
            content: messageText, 
            topic: topicId, 
            author: req.session.userId 
        });
        await message.save();

        const topic = await Topic.findById(topicId).populate('subscribers');
        const notification = `New post in ${topic.title}!`;
        
        for (let user of topic.subscribers) {
            user.notifications.push(notification);
            await user.save();
        }
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ error: 'Failed to post message: ' + err.message });
    }
};

exports.getAvailableTopics = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        
        const availableTopics = await Topic.find({ _id: { $nin: user.subscriptions } });
        
        res.render('availableTopics', { topics: availableTopics });
    } catch (err) {
        res.status(500).send("Error loading available topics.");
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { topicId } = req.body;
        const userId = req.session.userId;

        await User.findByIdAndUpdate(userId, {
            $pull: { subscriptions: topicId }
        });

        await Topic.findByIdAndUpdate(topicId, {
            $pull: { subscribers: userId }
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ error: 'Failed to unsubscribe: ' + err.message });
    }
};

exports.subscribe = async (req, res) => {
    try {
        const { topicId } = req.body;
        const userId = req.session.userId;

        await User.findByIdAndUpdate(userId, {
            $addToSet: { subscriptions: topicId }
        });

        await Topic.findByIdAndUpdate(topicId, {
            $addToSet: { subscribers: userId }
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ error: 'Failed to subscribe: ' + err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        
        res.render('profile', { user: user });
    } catch (err) {
        res.status(500).send("Error loading profile.");
    }
};

exports.updateColors = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { primaryColor, accentColor, backgroundColor, textColor, headerColor } = req.body;
        
        await User.findByIdAndUpdate(userId, {
            'colorPreferences.primaryColor': primaryColor || '#291e91',
            'colorPreferences.accentColor': accentColor || '#efdf88',
            'colorPreferences.backgroundColor': backgroundColor || '#000000',
            'colorPreferences.textColor': textColor || '#9eb4ed',
            'colorPreferences.headerColor': headerColor || '#271274'
        });
        
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ error: 'Failed to update colors: ' + err.message });
    }
};