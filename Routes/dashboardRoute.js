const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController.js');
const isAuthenticated = require('../middleware/auth');
 
router.get('/dashboard', isAuthenticated, dashboardController.getDashboard);

router.get('/statistics', isAuthenticated, dashboardController.getStatistics);
router.get('/topics', isAuthenticated, dashboardController.getAvailableTopics);
router.get('/profile', isAuthenticated, dashboardController.getProfile);

router.post('/createTopic', isAuthenticated, dashboardController.createTopic);
router.post('/postMessage', isAuthenticated, dashboardController.postMessage);
router.post('/unsubscribe', isAuthenticated, dashboardController.unsubscribe);
router.post('/subscribe', isAuthenticated, dashboardController.subscribe);
router.post('/updateColors', isAuthenticated, dashboardController.updateColors);
 
module.exports = router;